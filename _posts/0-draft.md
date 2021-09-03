---
title: 'draft'
date: '000'
category: ['Blockchain', 'Dev']
draft: true
---

# A simple escrow program

## why?

Because it's non trivial, and demonstrates all the base functionalities from which to build more complex programs.

## structure

```
|- inc/
|- src/
    |- entrypoint.rs
    |- error.rs
    |- instruction.rs
    |- lib.rs
    |- processor.rs
    |- state.rs
|- .gitignore
|- Cargo.toml
|- Xargo.toml
```

or

```shell
## Create all files
mkdir PROJECT_NAME && cd PROJECT_NAME && touch Xargo.toml .gitignore && mkdir inc src && cd src && touch entrypoint.rs error.rs instruction.rs lib.rs processor.rs state.rs
```

```shell
cargo init
```

```shell
## This next one is dependent on having ran `cargo install cargo-edit`
cargo add solana-program thiserror
```

`solana-program` is the rust crate for solana
`thiserror` provdies a macro for the standard library's `std::error::Error` trait - makes it easier to implement errors.

## Program flow

`entrypoint` is called which forwards the arguments to the `processor.rs`. The processor passes the `instruction_data` to `instructions.rs` for decoding, and then invokes the called functions. State may be saved by passing account id's to the `state.rs`.
