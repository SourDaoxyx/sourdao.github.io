/**
 * Initialize SOUR Handshake Protocol Config on Devnet
 *
 * 1. Creates a test SOUR SPL token mint
 * 2. Creates 3 token accounts (keepers_pool, commons_treasury, buyback_treasury)
 * 3. Calls initialize_config with pinch_bps=200, shares 50/30/20
 */

import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as fs from "fs";
import * as crypto from "crypto";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PROGRAM_ID = new PublicKey(
  "HUAq4NFymfn4hNvs7RMNCC5uFEoRctkWDWCA9G7prxeF"
);

// ---------------------------------------------------------------------------
// Load deployer keypair from Solana CLI default
// ---------------------------------------------------------------------------
function loadKeypair(path: string): Keypair {
  const raw = JSON.parse(fs.readFileSync(path, "utf-8"));
  return Keypair.fromSecretKey(Uint8Array.from(raw));
}

// ---------------------------------------------------------------------------
// IDL discriminator
// ---------------------------------------------------------------------------
function ixDiscriminator(name: string): Buffer {
  const hash = crypto
    .createHash("sha256")
    .update(`global:${name}`)
    .digest();
  return hash.subarray(0, 8);
}

// ---------------------------------------------------------------------------
// PDA
// ---------------------------------------------------------------------------
function getConfigPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    PROGRAM_ID
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Load authority keypair
  const keypairPath =
    process.env.SOLANA_KEYPAIR ||
    `${process.env.USERPROFILE}\\.config\\solana\\id.json`;
  console.log("Loading keypair from:", keypairPath);
  const authority = loadKeypair(keypairPath);
  console.log("Authority:", authority.publicKey.toBase58());

  const balance = await connection.getBalance(authority.publicKey);
  console.log("Balance:", balance / 1e9, "SOL");

  // Step 1: Reuse existing test SOUR mint or create new one
  console.log("\n--- Step 1: Test SOUR mint ---");
  const existingMint = "FfYBzvoPfG2TVUPD13SwbWedAgwBZk6UAqVkKriHhx1v";
  let sourMint: PublicKey;
  try {
    sourMint = new PublicKey(existingMint);
    const mintInfo = await connection.getAccountInfo(sourMint);
    if (mintInfo) {
      console.log("Reusing existing Test SOUR Mint:", sourMint.toBase58());
    } else {
      throw new Error("Mint not found");
    }
  } catch {
    console.log("Creating new test SOUR mint...");
    sourMint = await createMint(
      connection,
      authority,
      authority.publicKey,
      authority.publicKey,
      6
    );
    console.log("Test SOUR Mint:", sourMint.toBase58());
  }

  // Step 2: Create 3 token accounts for fee distribution
  console.log("\n--- Step 2: Creating fee token accounts ---");

  const keepersPool = await getOrCreateAssociatedTokenAccount(
    connection,
    authority,
    sourMint,
    authority.publicKey
  );
  console.log("Keepers Pool ATA:", keepersPool.address.toBase58());

  // For commons and buyback, we create separate keypairs as "owners"
  // so they get distinct ATAs
  const commonsOwner = Keypair.generate();
  const buybackOwner = Keypair.generate();

  const commonsTreasury = await getOrCreateAssociatedTokenAccount(
    connection,
    authority,
    sourMint,
    commonsOwner.publicKey
  );
  console.log("Commons Treasury ATA:", commonsTreasury.address.toBase58());

  const buybackTreasury = await getOrCreateAssociatedTokenAccount(
    connection,
    authority,
    sourMint,
    buybackOwner.publicKey
  );
  console.log("Buyback Treasury ATA:", buybackTreasury.address.toBase58());

  // Step 3: Call initialize_config
  console.log("\n--- Step 3: Calling initialize_config ---");

  const [configPda] = getConfigPda();
  console.log("Config PDA:", configPda.toBase58());

  // Build instruction data:
  // 8 bytes discriminator + 4 x u16 (2 bytes each) = 16 bytes total
  // Use exact discriminator from IDL
  const disc = Buffer.from([208, 127, 21, 1, 194, 190, 196, 70]);
  const data = Buffer.alloc(16);
  disc.copy(data, 0);
  data.writeUInt16LE(200, 8);    // pinch_bps = 2%
  data.writeUInt16LE(5000, 10);  // burn_share_bps = 50%
  data.writeUInt16LE(3000, 12);  // keepers_share_bps = 30%
  data.writeUInt16LE(2000, 14);  // commons_share_bps = 20%

  // Account order per IDL: config, sour_mint, keepers_pool, commons_treasury, authority, system_program
  const ix = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: configPda, isSigner: false, isWritable: true },
      { pubkey: sourMint, isSigner: false, isWritable: false },
      { pubkey: keepersPool.address, isSigner: false, isWritable: false },
      { pubkey: commonsTreasury.address, isSigner: false, isWritable: false },
      { pubkey: authority.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });

  const tx = new Transaction();
  tx.feePayer = authority.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
  tx.add(ix);
  tx.sign(authority);
  const sig = await sendAndConfirmTransaction(connection, tx, [authority], {
    commitment: "confirmed",
  });

  console.log("\n=== SUCCESS ===");
  console.log("Config initialized!");
  console.log("Signature:", sig);
  console.log("Explorer:", `https://explorer.solana.com/tx/${sig}?cluster=devnet`);

  // Save addresses for reference
  const addresses = {
    programId: PROGRAM_ID.toBase58(),
    configPda: configPda.toBase58(),
    sourMintDevnet: sourMint.toBase58(),
    keepersPool: keepersPool.address.toBase58(),
    commonsTreasury: commonsTreasury.address.toBase58(),
    buybackTreasury: buybackTreasury.address.toBase58(),
    authority: authority.publicKey.toBase58(),
    pinchBps: 200,
    treasuryShareBps: 5000,
    keepersShareBps: 3000,
    commonsShareBps: 2000,
  };
  fs.writeFileSync(
    "scripts/devnet-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\nAddresses saved to scripts/devnet-addresses.json");
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});
