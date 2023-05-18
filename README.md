# Solana Program

- [See front-end](https://github.com/KevinFiorentino/angular-solana-chat)

### Fund wallet

- `solana config set --url devnet`
- `solana airdrop 2` x2
- `solana balance`

### Deploy program

- `anchor build`
- `solana address -k target/deploy/solana_chat-keypair.json`
- Replace Program ID in `lib.rs` and `Anchor.toml`
- `anchor build` (again)
- `anchor deploy`

### Test

- `anchor test --provider.cluster localnet`

### Upgrade program

- https://stackoverflow.com/questions/68819053/how-to-upgrade-a-program-id-on-anchor
- `anchor upgrade target/deploy/solana_chat.so --provider.cluster devnet --program-id AH5pQMYm4HzbMfw6CTbWS1rVFHgGpKKz53qQPH7a7pZ3`
