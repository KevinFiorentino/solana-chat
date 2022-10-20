import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaChat } from '../target/types/solana_chat';
import { TextEncoder } from 'util';
import { expect } from "chai";

const { PublicKey, SystemProgram, Keypair, Connection, clusterApiUrl } = anchor.web3;

describe('solana-chat', () => {

  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaChat as Program<SolanaChat>;

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  it('Create message', async () => {

    const text = 'Test';
    
    const msg = anchor.web3.Keypair.generate();

    /*
    const date = new Date();
    const [pda] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('create_message'),
        provider.wallet.publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(text),
        anchor.utils.bytes.utf8.encode(Math.floor(date.getTime() / 1000).toString())
      ],
      program.programId
    );
    */
    
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


  it('Create message 2', async () => {

    const text = 'Test';
    
    const msg = anchor.web3.Keypair.generate();

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

    const msgAccount = await program.account.message.fetch(msg.publicKey);

    // console.log(msgAccount.timestamp.toString())

    expect(msgAccount.owner.toBase58()).equal(provider.wallet.publicKey.toBase58());
    expect(msgAccount.text).equal('Test');
  });


  it('Create message from different user', async () => {

    const text = 'Test from different user';

    const otherUser = anchor.web3.Keypair.generate();

    const airdropSignature = await program.provider.connection.requestAirdrop(
      otherUser.publicKey,
      1000000000
    );
    
    const latestBlockHash = await program.provider.connection.getLatestBlockhash();
    
    await program.provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });

    
    const msg = anchor.web3.Keypair.generate();

    const txId = await program.methods
      .createMessage(text)
      .accounts({
        message: msg.publicKey,
        user: otherUser.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([otherUser, msg])
      .rpc();

    expect(txId).to.be.a('string');

    const msgAccount = await program.account.message.fetch(msg.publicKey);

    expect(msgAccount.owner.toBase58()).equal(otherUser.publicKey);
    expect(msgAccount.text).equal('Test from different user');
  });

  
  it('Get all messages (3)', async () => {
    const messages = await program.account.message.all();
    expect(messages.length).equal(3);
  });

  
  it("Finds messages by owner (2)", async () => {
    const msgByOwner = await program.account.message.all([
      {
        memcmp: {
          bytes: provider.wallet.publicKey.toBase58(),
          offset: 8,
        },
      },
    ]);
    expect(msgByOwner.length).equal(2);
  });

});
