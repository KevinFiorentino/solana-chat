import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaChat } from '../target/types/solana_chat';
import { TextEncoder } from 'util';
import { expect } from "chai";
import * as assert from 'assert';

const { PublicKey, SystemProgram } = anchor.web3;

const stringToBytes = (input: string): Uint8Array => {
  return new TextEncoder().encode(input);
};

describe('solana-chat', () => {

  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaChat as Program<SolanaChat>;
  const wallet = anchor.Wallet.local();

  it('Create message', async () => {

    const text = 'Test';

    const [pda] = await PublicKey.findProgramAddress(
      [
        stringToBytes('create_message'),
        wallet.publicKey.toBytes(),
        stringToBytes(text),
      ],
      program.programId
    );

    let txId = await program.methods
      .createMessage(text)
      .accounts({
        message: pda,
        user: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    expect(txId).to.be.a('string');
  });

  
  it('Get all messages', async () => {
    const messages = await program.account.message.all();
    assert.equal(1, messages.length);
  });

  it("Finds messages by owner", async () => {
    const msgByOwner = await program.account.message.all([
      {
        memcmp: {
          bytes: wallet.publicKey.toBase58(),
          offset: 8,
        },
      },
    ]);
    assert.equal(1, msgByOwner.length);
  });

});
