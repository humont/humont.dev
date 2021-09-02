---
title: 'Solana Programming Model Overview'
date: '2021-09-01'
category: ['Blockchain', 'Dev']
---

# Solana's Programming Model

Here's my sumarising of how the Solana blockchain works. Mainly so I can refer back to it and understand it in my own words! It mostly follows the breakdown provided in their own [documentation](https://docs.solana.com/developing/programming-model/overview), but with more pretty drawings, and a little additional context drawn in from other readings.

## Overview

Solana's system architecture (or at least, the part of it that is of interest in understanding how to develop for it) can be broken down into validators and clusters (these function as a sort of "server"). A cluster is simply a set of validators. There can be many clusters each using the Solana program, but unless they share a genesis block (the first block in the chain), they are considered different chains and do not interact. A transaction (more on this later) sent to the wrong cluster will be ignored.

![Solana Cluster Validator Diagram](/images/2021-09/cluster-validator.png)

Clients send transactions to a validator, and those transactions end up in the cluster's _data plane_ (created by the validator that is currently acting as leader) where they are batched and sent to validator nodes to validate into a block.

## The Transaction

The transaction sent by the client can contain _instructions_. The Solana run time (itself a program), processes the instructions in the given order and atomically. An instruction contains three key parts: 1) the program id that should be executed; 2) the accounts that are affected by this program; 3) a data byte array - used to tell the program what functions to call and with what arguments - kind of like an RPC.

![Solana Cluster Validator Diagram](/images/2021-09/transaction-instructions.png)

## The Account

Accounts store state. The Solana documentation compares accounts to files in an operating system - they can hold arbitrary data and maintain the state of it after a program has finished executing. Accounts also have metadata that indicates the access control for the account.

**It's important to note that accounts pay rent in order to remain alive in a cluster**. When validators scan an account, they collect rent, but if the accounts balance is 0 lamports, then the account is purged. The way around this is to deposit a sufficient amount of Lamports into the account to mark it [rent-exempt](https://docs.solana.com/developing/programming-model/accounts#rent-exemption)

Each account has an address that can be used to look it up.

Of particular interest, is that an account can be marked as "executable" - making it a program (ooooh things are starting to make sense now). An interesting property of executable accounts is that their data is immutable - so they _cannot_ store state!

### Account ownership

This bit is important a "regular" account (one that can be accessed by a wallet) is created and owned by the built-in `System` program. These are refered to as a `system account`. The metadata of this account is used to denote the "owner" in the traditional sense of the word, but technically, the programmatic owner is the `System` program.

> this is a bit of a mind bender... so accounts don't _actually_ belong to you, but to the blockchain? Can the `System` program do things to these accounts - clearly, yes - as it can _take_ rent, without requiring a signature... better hope that code is written well!

An executable account (a program) can also create accounts and own them (ok, so accounts are always owned by programs, i.e. executable accounts). A program might create an account during it's execution, which leads to an interesting possibility where ([quoting from documentation](https://docs.solana.com/developing/programming-model/runtime#capability-of-programs)) : _"the entire set of accounts owned by a given program can be regarded as a key-value store where a key is the account address and value is program-specific arbitrary binary data. A program author can decide how to manage the program's whole state as possibly many accounts."_

### Program Capabilities

This section is best just copied and pasted [from their docs](https://docs.solana.com/developing/programming-model/runtime#policy) again - here are things that accounts can do:

> - Only the owner of the account may change owner.
>   - And only if the account is writable.
>   - And only if the account is not executable
>   - And only if the data is zero-initialized or empty.
> - An account not assigned to the program cannot have its balance decrease.
> - The balance of read-only and executable accounts may not change.
> - Only the system program can change the size of the data and only if the system program owns the account.
> - Only the owner may change account data.
>   - And if the account is writable.
>   - And if the account is not executable.
> - Executable is one-way (false->true) and only the account owner may set it.
> - No one modification to the rent_epoch associated with this account.

Additionaly, a program has a budget - to prevent it from abusing the blockchain's resources.

### Cross Program Invocations

Intuitively, programs can call other programs (but watch your budget). Note that there is no concurrency in this model - if a program calls another, it pauses until the latter has finished running. The call depth for cross program invocations is 64.

There are some fancy things that can be done here - specifcally, with the concept of [Program Derived Addresses (PDA)](https://docs.solana.com/developing/programming-model/calling-between-programs#program-derived-addresses). A program may programmatically generate a signature for an as of yet non-existant account (remember - programs can own accounts), it can also transfer ownership of this account to another program (by modifying the ownership metadata of the account). Since programs cannot keep state, they cannot handle escrow functionality on their own - but by creating and transfering account ownerships, they can.

A PDA can only be controlled by programs, not by modifiable addresses (or external users) - this makes escrow safe as an escrow account can only be controlled by the creator (or later transferred to) program.
