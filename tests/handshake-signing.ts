import { assert } from "chai";
import {
  buildCreateMessage,
  computeMilestoneHash,
  normalizeAmount,
  serializeMilestonesForHash,
} from "../lib/handshake-signing";

describe("handshake-signing canonical payload helpers", () => {
  it("normalizes decimal amounts deterministically", () => {
    assert.equal(normalizeAmount("100.000000"), "100");
    assert.equal(normalizeAmount("0.250000"), "0.25");
    assert.equal(normalizeAmount(1.5), "1.5");
  });

  it("serializes milestones by index for hashing", () => {
    const serialized = serializeMilestonesForHash([
      { index: 1, title: " Final delivery ", amount: "75.000000" },
      { index: 0, title: "Draft", amount: "25" },
    ]);

    assert.equal(serialized, "1|Draft|25\n2|Final delivery|75");
  });

  it("creates deterministic milestone hashes", async () => {
    const a = await computeMilestoneHash([
      { index: 0, title: "Draft", amount: "25" },
      { index: 1, title: "Final delivery", amount: "75" },
    ]);

    const b = await computeMilestoneHash([
      { index: 1, title: "Final delivery", amount: "75.000000" },
      { index: 0, title: "Draft", amount: "25.000000" },
    ]);

    assert.equal(a, b);
    assert.match(a, /^[a-f0-9]{64}$/);
  });

  it("builds canonical create payload v1", async () => {
    const payload = await buildCreateMessage({
      handshakeId: "11111111-2222-3333-4444-555555555555",
      creator: "CreatorWallet1111111111111111111111111111111",
      counterparty: "CounterpartyWallet111111111111111111111111",
      title: " Logo Design ",
      description: " First draft and final delivery ",
      totalAmount: "100.000000",
      deadline: "2026-03-20T00:00:00.000Z",
      milestones: [
        { index: 0, title: "Draft", amount: "25" },
        { index: 1, title: "Final delivery", amount: "75" },
      ],
      timestamp: "2026-03-10T12:00:00.000Z",
    });

    assert.include(payload, "SOUR Handshake");
    assert.include(payload, "Version: 1");
    assert.include(payload, "Action: CREATE");
    assert.include(payload, "Env: beta");
    assert.include(payload, "Title: Logo Design");
    assert.include(payload, "Description: First draft and final delivery");
    assert.include(payload, "Total Amount: 100");
    assert.include(payload, "Timestamp: 2026-03-10T12:00:00.000Z");
    assert.match(payload, /Milestone Hash: [a-f0-9]{64}/);
  });
});
