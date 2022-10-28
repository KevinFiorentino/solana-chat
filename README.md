# Solana Program

### Solana CLI

- `solana config get`
- `solana config set --url https://api.devnet.solana.com`
- `solana airdrop 1`
- `solana balance`


### Anchor CLI

https://docs.solana.com/cli/deploy-a-program

- `anchor build`
- `anchor deploy` or `solana program deploy target/deploy/solana_chat.so`
- Reemplazar el `<PROGRAM-ID>` en el contrato y en `Anchor.toml`
- `anchor build`
- `anchor deploy` or `solana program deploy --program-id target/deploy/solana_chat-keypair.json target/deploy/solana_chat.so`


### Unit Test

- `anchor test`
