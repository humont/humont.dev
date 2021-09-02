---
title: 'Local development for solana'
date: '2021-08-31'
category: ['Blockchain', 'Dev']
---

# Local development for solana

Time to jump into some blockchain development, but my god... the fees. Good thing there are alternatives to deploying programmes and smart contracts straight to the main networks!

What follows is my path to understanding how to develop and test solana programmes locally.

## Dependencies

We'll need:

1. [Rust](https://doc.rust-lang.org/stable/book/ch01-01-installation.html)
2. [Solana Tool Suite](https://docs.solana.com/cli/install-solana-cli-tools)

## Localnet

Create a local solana keypair (the basis for a wallet):

```shell
solana-keygen new
```

Then un the following command to launch network:

```shell
solana-test-validator
```

Double check that your local solana configuration is set to using this test net as the RPC endpoint, `solana config get` should show `http://localhost:8899` as the `RPC URL`. If it doesn't, run `solana config set --url http://locahost:8899`. Then check that all is working by calling the chain and checking your balance: `solana balance` which should output a number greater than zero.

I happen to have some funky stuff happening on my computer meaning that `localhost` doesn't resolve to `127.0.0.1:8900`. So if you get an error messag

If you happen to have been running the test-validator prevoiusly on a different network, then it may not have registered your keypair, in which case you need to re-initialise the network with `solana-test-validator -r`

## Deploying to local net with the command line

This part is easy:

```shell
solana deploy {{PROGRAM_PATH}}
```

which should output a `programId` which you can now use in your own clients!
