// ============================================================================
// SOUR Handshake — Anchor Test Suite
// ============================================================================
//
// Tests the full lifecycle:
//   1. Initialize config
//   2. Create handshake (escrow $SOUR)
//   3. Accept handshake
//   4. Deliver work
//   5. Approve → Pinch fee applied (burn + keepers + commons)
//   6. Cancel (before acceptance)
//   7. Dispute + Resolve
// ============================================================================

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SourHandshake } from "../target/types/sour_handshake";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAccount,
} from "@solana/spl-token";
import { assert } from "chai";

describe("sour-handshake", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SourHandshake as Program<SourHandshake>;

  // Keypairs
  const authority = provider.wallet as anchor.Wallet;
  const worker = anchor.web3.Keypair.generate();

  // Token accounts (set in before())
  let sourMint: anchor.web3.PublicKey;
  let creatorTokenAccount: anchor.web3.PublicKey;
  let workerTokenAccount: anchor.web3.PublicKey;
  let keepersPool: anchor.web3.PublicKey;
  let commonsTreasury: anchor.web3.PublicKey;

  // PDAs
  let configPda: anchor.web3.PublicKey;
  let configBump: number;

  // Test constants
  const ESCROW_AMOUNT = 1_000_000_000; // 1B smallest units (= 1 $SOUR with 9 decimals)
  const PINCH_BPS = 200;        // 2%
  const BURN_SHARE = 5000;      // 50% of fee
  const KEEPERS_SHARE = 3000;   // 30% of fee
  const COMMONS_SHARE = 2000;   // 20% of fee

  before(async () => {
    // Transfer SOL to worker for tx fees (from authority wallet)
    const transferTx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: authority.publicKey,
        toPubkey: worker.publicKey,
        lamports: 2 * anchor.web3.LAMPORTS_PER_SOL,
      })
    );
    await provider.sendAndConfirm(transferTx);

    // Create $SOUR mint
    sourMint = await createMint(
      provider.connection,
      (authority as any).payer,
      authority.publicKey,
      null, // no freeze authority
      9     // 9 decimals
    );

    // Create token accounts (with explicit keypairs to avoid ATA program)
    const creatorTokenKp = anchor.web3.Keypair.generate();
    creatorTokenAccount = await createAccount(
      provider.connection,
      (authority as any).payer,
      sourMint,
      authority.publicKey,
      creatorTokenKp
    );

    const workerTokenKp = anchor.web3.Keypair.generate();
    workerTokenAccount = await createAccount(
      provider.connection,
      (authority as any).payer,
      sourMint,
      worker.publicKey,
      workerTokenKp
    );

    const keepersPoolKp = anchor.web3.Keypair.generate();
    keepersPool = await createAccount(
      provider.connection,
      (authority as any).payer,
      sourMint,
      authority.publicKey, // authority manages keepers pool
      keepersPoolKp
    );

    const commonsTreasuryKp = anchor.web3.Keypair.generate();
    commonsTreasury = await createAccount(
      provider.connection,
      (authority as any).payer,
      sourMint,
      authority.publicKey, // authority manages commons
      commonsTreasuryKp
    );

    // Mint $SOUR to creator
    await mintTo(
      provider.connection,
      (authority as any).payer,
      sourMint,
      creatorTokenAccount,
      authority.publicKey,
      10_000_000_000 // 10 $SOUR
    );

    // Derive config PDA
    [configPda, configBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );
  });

  // =========================================================================
  // Test 1: Initialize Config
  // =========================================================================
  it("initializes protocol config", async () => {
    await program.methods
      .initializeConfig(PINCH_BPS, BURN_SHARE, KEEPERS_SHARE, COMMONS_SHARE)
      .accounts({
        config: configPda,
        sourMint,
        keepersPool,
        commonsTreasury,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const config = await program.account.protocolConfig.fetch(configPda);
    assert.equal(config.pinchBps, PINCH_BPS);
    assert.equal(config.burnShareBps, BURN_SHARE);
    assert.equal(config.keepersShareBps, KEEPERS_SHARE);
    assert.equal(config.commonsShareBps, COMMONS_SHARE);
    assert.equal(config.handshakeCount.toNumber(), 0);
    assert.equal(config.totalBurned.toNumber(), 0);
    console.log("    ✓ Config initialized with 2% Pinch (50/30/20 split)");
  });

  // =========================================================================
  // Test 2: Create Handshake (escrow tokens)
  // =========================================================================
  it("creates a handshake and escrows $SOUR", async () => {
    const handshakeId = new anchor.BN(0);
    const idBytes = handshakeId.toArrayLike(Buffer, "le", 8);

    const [handshakePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("handshake"), idBytes],
      program.programId
    );

    const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), idBytes],
      program.programId
    );

    const [vaultAuthPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault_auth"), idBytes],
      program.programId
    );

    const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days

    await program.methods
      .createHandshake("Design a logo for SOUR", new anchor.BN(ESCROW_AMOUNT), new anchor.BN(deadline))
      .accounts({
        config: configPda,
        handshake: handshakePda,
        vault: vaultPda,
        vaultAuthority: vaultAuthPda,
        creatorTokenAccount,
        worker: worker.publicKey,
        sourMint,
        creator: authority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const handshake = await program.account.handshake.fetch(handshakePda);
    assert.equal(handshake.id.toNumber(), 0);
    assert.equal(handshake.amount.toNumber(), ESCROW_AMOUNT);
    assert.equal(handshake.description, "Design a logo for SOUR");
    assert.deepEqual(handshake.status, { created: {} });

    // Verify vault has tokens
    const vaultAccount = await getAccount(provider.connection, vaultPda);
    assert.equal(Number(vaultAccount.amount), ESCROW_AMOUNT);

    console.log(`    ✓ Handshake #0 created: ${ESCROW_AMOUNT} $SOUR escrowed`);
  });

  // =========================================================================
  // Test 3: Accept Handshake
  // =========================================================================
  it("worker accepts the handshake", async () => {
    const handshakeId = new anchor.BN(0);
    const idBytes = handshakeId.toArrayLike(Buffer, "le", 8);

    const [handshakePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("handshake"), idBytes],
      program.programId
    );

    await program.methods
      .acceptHandshake()
      .accounts({
        handshake: handshakePda,
        worker: worker.publicKey,
      })
      .signers([worker])
      .rpc();

    const handshake = await program.account.handshake.fetch(handshakePda);
    assert.deepEqual(handshake.status, { accepted: {} });
    assert.ok(handshake.acceptedAt.toNumber() > 0);

    console.log("    ✓ Worker accepted");
  });

  // =========================================================================
  // Test 4: Deliver Work
  // =========================================================================
  it("worker marks work as delivered", async () => {
    const handshakeId = new anchor.BN(0);
    const idBytes = handshakeId.toArrayLike(Buffer, "le", 8);

    const [handshakePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("handshake"), idBytes],
      program.programId
    );

    await program.methods
      .deliver()
      .accounts({
        handshake: handshakePda,
        worker: worker.publicKey,
      })
      .signers([worker])
      .rpc();

    const handshake = await program.account.handshake.fetch(handshakePda);
    assert.deepEqual(handshake.status, { delivered: {} });
    assert.ok(handshake.deliveredAt.toNumber() > 0);

    console.log("    ✓ Work delivered");
  });

  // =========================================================================
  // Test 5: Approve — Pinch fee applied
  // =========================================================================
  it("creator approves — Pinch fee burned/distributed", async () => {
    const handshakeId = new anchor.BN(0);
    const idBytes = handshakeId.toArrayLike(Buffer, "le", 8);

    const [handshakePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("handshake"), idBytes],
      program.programId
    );

    const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), idBytes],
      program.programId
    );

    const [vaultAuthPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault_auth"), idBytes],
      program.programId
    );

    // Get balances before
    const workerBefore = await getAccount(provider.connection, workerTokenAccount);
    const keepersBefore = await getAccount(provider.connection, keepersPool);
    const commonsBefore = await getAccount(provider.connection, commonsTreasury);

    await program.methods
      .approve()
      .accounts({
        config: configPda,
        handshake: handshakePda,
        vault: vaultPda,
        vaultAuthority: vaultAuthPda,
        workerTokenAccount,
        keepersPool,
        commonsTreasury,
        sourMint,
        creator: authority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // Verify fee splits
    const pinchTotal = Math.floor(ESCROW_AMOUNT * PINCH_BPS / 10_000);   // 2% = 20,000,000
    const burnAmount = Math.floor(pinchTotal * BURN_SHARE / 10_000);      // 50% = 10,000,000
    const keepersAmount = Math.floor(pinchTotal * KEEPERS_SHARE / 10_000); // 30% = 6,000,000
    const commonsAmount = pinchTotal - burnAmount - keepersAmount;         // 20% = 4,000,000
    const workerAmount = ESCROW_AMOUNT - pinchTotal;                       // 98% = 980,000,000

    const workerAfter = await getAccount(provider.connection, workerTokenAccount);
    const keepersAfter = await getAccount(provider.connection, keepersPool);
    const commonsAfter = await getAccount(provider.connection, commonsTreasury);

    assert.equal(
      Number(workerAfter.amount) - Number(workerBefore.amount),
      workerAmount,
      "Worker should receive 98%"
    );
    assert.equal(
      Number(keepersAfter.amount) - Number(keepersBefore.amount),
      keepersAmount,
      "Keepers should receive 30% of Pinch"
    );
    assert.equal(
      Number(commonsAfter.amount) - Number(commonsBefore.amount),
      commonsAmount,
      "Commons should receive 20% of Pinch"
    );

    // Verify vault is empty
    const vaultAfter = await getAccount(provider.connection, vaultPda);
    assert.equal(Number(vaultAfter.amount), 0, "Vault should be empty");

    // Verify config stats
    const config = await program.account.protocolConfig.fetch(configPda);
    assert.equal(config.totalCompleted.toNumber(), 1);
    assert.equal(config.totalBurned.toNumber(), burnAmount);
    assert.equal(config.totalToKeepers.toNumber(), keepersAmount);
    assert.equal(config.totalToCommons.toNumber(), commonsAmount);

    console.log(`    ✓ Approved! Worker: ${workerAmount}, Burned: ${burnAmount}, Keepers: ${keepersAmount}, Commons: ${commonsAmount}`);
  });

  // =========================================================================
  // Test 6: Cancel before acceptance
  // =========================================================================
  it("creator can cancel before acceptance (full refund)", async () => {
    // Create handshake #1
    const config = await program.account.protocolConfig.fetch(configPda);
    const handshakeId = config.handshakeCount; // should be 1
    const idBytes = handshakeId.toArrayLike(Buffer, "le", 8);

    const [handshakePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("handshake"), idBytes],
      program.programId
    );
    const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), idBytes],
      program.programId
    );
    const [vaultAuthPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault_auth"), idBytes],
      program.programId
    );

    const deadline = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60;
    const cancelAmount = 500_000_000; // 0.5 $SOUR

    // Create
    await program.methods
      .createHandshake("Test cancel", new anchor.BN(cancelAmount), new anchor.BN(deadline))
      .accounts({
        config: configPda,
        handshake: handshakePda,
        vault: vaultPda,
        vaultAuthority: vaultAuthPda,
        creatorTokenAccount,
        worker: worker.publicKey,
        sourMint,
        creator: authority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const creatorBefore = await getAccount(provider.connection, creatorTokenAccount);

    // Cancel
    await program.methods
      .cancel()
      .accounts({
        config: configPda,
        handshake: handshakePda,
        vault: vaultPda,
        vaultAuthority: vaultAuthPda,
        creatorTokenAccount,
        creator: authority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const creatorAfter = await getAccount(provider.connection, creatorTokenAccount);
    assert.equal(
      Number(creatorAfter.amount) - Number(creatorBefore.amount),
      cancelAmount,
      "Creator should get full refund"
    );

    const handshake = await program.account.handshake.fetch(handshakePda);
    assert.deepEqual(handshake.status, { cancelled: {} });

    console.log("    ✓ Cancelled with full refund");
  });

  // =========================================================================
  // Test 7: Dispute + Resolve (refund to creator)
  // =========================================================================
  it("dispute resolves with refund to creator", async () => {
    const config = await program.account.protocolConfig.fetch(configPda);
    const handshakeId = config.handshakeCount;
    const idBytes = handshakeId.toArrayLike(Buffer, "le", 8);

    const [handshakePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("handshake"), idBytes],
      program.programId
    );
    const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), idBytes],
      program.programId
    );
    const [vaultAuthPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault_auth"), idBytes],
      program.programId
    );

    const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    const disputeAmount = 250_000_000;

    // Create
    await program.methods
      .createHandshake("Dispute test", new anchor.BN(disputeAmount), new anchor.BN(deadline))
      .accounts({
        config: configPda,
        handshake: handshakePda,
        vault: vaultPda,
        vaultAuthority: vaultAuthPda,
        creatorTokenAccount,
        worker: worker.publicKey,
        sourMint,
        creator: authority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    // Accept
    await program.methods
      .acceptHandshake()
      .accounts({ handshake: handshakePda, worker: worker.publicKey })
      .signers([worker])
      .rpc();

    // Dispute (by worker)
    await program.methods
      .dispute()
      .accounts({
        config: configPda,
        handshake: handshakePda,
        signer: worker.publicKey,
      })
      .signers([worker])
      .rpc();

    let handshake = await program.account.handshake.fetch(handshakePda);
    assert.deepEqual(handshake.status, { disputed: {} });

    // Resolve: ruling = 0 (refund creator)
    const creatorBefore = await getAccount(provider.connection, creatorTokenAccount);

    await program.methods
      .resolveDispute(0)
      .accounts({
        config: configPda,
        handshake: handshakePda,
        vault: vaultPda,
        vaultAuthority: vaultAuthPda,
        creatorTokenAccount,
        workerTokenAccount,
        keepersPool,
        commonsTreasury,
        sourMint,
        authority: authority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const creatorAfter = await getAccount(provider.connection, creatorTokenAccount);
    assert.equal(
      Number(creatorAfter.amount) - Number(creatorBefore.amount),
      disputeAmount,
      "Creator gets full refund on dispute ruling 0"
    );

    handshake = await program.account.handshake.fetch(handshakePda);
    assert.deepEqual(handshake.status, { resolved: {} });

    console.log("    ✓ Dispute resolved: creator refunded");
  });

  // =========================================================================
  // Test 8: Validation — cannot self-handshake
  // =========================================================================
  it("rejects self-handshake (creator = worker)", async () => {
    const config = await program.account.protocolConfig.fetch(configPda);
    const handshakeId = config.handshakeCount;
    const idBytes = handshakeId.toArrayLike(Buffer, "le", 8);

    const [handshakePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("handshake"), idBytes],
      program.programId
    );
    const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), idBytes],
      program.programId
    );
    const [vaultAuthPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault_auth"), idBytes],
      program.programId
    );

    const deadline = Math.floor(Date.now() / 1000) + 86400;

    try {
      await program.methods
        .createHandshake("Self deal", new anchor.BN(100), new anchor.BN(deadline))
        .accounts({
          config: configPda,
          handshake: handshakePda,
          vault: vaultPda,
          vaultAuthority: vaultAuthPda,
          creatorTokenAccount,
          worker: authority.publicKey, // same as creator!
          sourMint,
          creator: authority.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();
      assert.fail("Should have thrown SelfHandshake error");
    } catch (err: any) {
      assert.include(err.toString(), "SelfHandshake");
      console.log("    ✓ Self-handshake correctly rejected");
    }
  });

  // =========================================================================
  // Test 9: Validation — zero amount rejected
  // =========================================================================
  it("rejects zero escrow amount", async () => {
    const config = await program.account.protocolConfig.fetch(configPda);
    const handshakeId = config.handshakeCount;
    const idBytes = handshakeId.toArrayLike(Buffer, "le", 8);

    const [handshakePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("handshake"), idBytes],
      program.programId
    );
    const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), idBytes],
      program.programId
    );
    const [vaultAuthPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault_auth"), idBytes],
      program.programId
    );

    const deadline = Math.floor(Date.now() / 1000) + 86400;

    try {
      await program.methods
        .createHandshake("Zero amount", new anchor.BN(0), new anchor.BN(deadline))
        .accounts({
          config: configPda,
          handshake: handshakePda,
          vault: vaultPda,
          vaultAuthority: vaultAuthPda,
          creatorTokenAccount,
          worker: worker.publicKey,
          sourMint,
          creator: authority.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();
      assert.fail("Should have thrown ZeroAmount error");
    } catch (err: any) {
      assert.include(err.toString(), "ZeroAmount");
      console.log("    ✓ Zero amount correctly rejected");
    }
  });
});
