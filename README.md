# Solana Program

### Test

- Set `Anchor.toml` -> `cluster = "localnet"`
- `anchor test`

### Fund wallet

- `solana config set --url devnet`
- `solana airdrop 2` x2
- `solana balance`

### Deploy program

- `anchor build`
- `solana address -k target/deploy/xxxxx-keypair.json`
- Replace Program ID in `lib.rs` and `Anchor.toml`
- `anchor build` (again)
- `anchor deploy`
