import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaChat } from "../target/types/solana_chat";

describe("solana-chat", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaChat as Program<SolanaChat>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
