import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaChat } from '../target/types/solana_chat';
import { expect } from "chai";

const { PublicKey, SystemProgram, Keypair, Connection, clusterApiUrl } = anchor.web3;

describe('solana-chat', () => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaChat as Program<SolanaChat>;

  const msg = anchor.web3.Keypair.generate();

  const text = 'Message I';
  const textUpdate = 'Message I - Updated';

  it('Create message', async () => {    
    const txId = await program.methods
      .createMessage(text)
      .accounts({
        message: msg.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([msg])
      .rpc();
    expect(txId).to.be.a('string');
  });


  it('Get message', async () => {
    const messages = await program.account.message.all();
    expect(1).equal(messages.length);
    expect(text === messages[0].account.text);
  });


  it('Update message', async () => {
    const txId = await program.methods
      .updateMessage(textUpdate)
      .accounts({
        message: msg.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    expect(txId).to.be.a('string');
  });


  it('Get message updated', async () => {
    const messages = await program.account.message.all();
    expect(1).equal(messages.length);
    expect(textUpdate === messages[0].account.text);
  });


  it('Delete message', async () => {
    const txId = await program.methods
      .deleteMessage()
      .accounts({
        message: msg.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();
    expect(txId).to.be.a('string');
  });


  it('Get zero messages', async () => {
    const messages = await program.account.message.all();
    expect(0).equal(messages.length);
  });

});
