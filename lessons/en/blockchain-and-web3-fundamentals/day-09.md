---
title: "Day 9: Setting Up a Professional Development Environment (Foundry & Hardhat)"
description: "Escape Remix IDE to set up a professional development environment. Learn why Foundry has become the gold standard in 2026, how to install it, understand its project structure, and master the forge, anvil, and cast command-line tools."
---

# Day 9: Setting Up a Professional Development Environment (Foundry & Hardhat)

Welcome to Day 9! Over the last 8 days, we have been writing and running code through **Remix IDE** in the browser. Remix is fantastic for quickly testing short snippets of code, but for real-world production-grade Web3 projects (which consist of dozens of interconnected contracts, hundreds of complex unit tests, and automated deployment pipelines), you absolutely must use a professional local development environment on your computer.

Today, we will get familiar with the two leading tools in the world today: **Hardhat** and **Foundry**, and set up a complete Foundry project from scratch.

---

## 1. Battle for the Throne: Hardhat vs Foundry

Previously, **Hardhat** (written in Node.js, with tests written in JavaScript/TypeScript) was the undisputed king. However, in recent years and especially in 2026, **Foundry** (written in Rust, with tests written directly in Solidity) has risen to become the gold standard recommended by professional development and security audit teams.

### Core Feature Comparison:

| Feature | Hardhat | Foundry (Recommended) |
| :--- | :--- | :--- |
| **Testing Language** | JavaScript / TypeScript | **Solidity** (No need to learn JS/TS just for testing) |
| **Compilation Speed** | Slow (Node.js engine) | **Extremely Fast** (Rust compilation engine) |
| **Test Execution Speed** | Moderate | **Lightning Fast** (Multi-threaded parallel execution) |
| **Local Node / Wallet Emulator** | Hardhat Network | Anvil (Ultra-lightweight Local Node) |
| **Bundled Tools** | Hardhat CLI | `forge` (build/test), `cast` (CLI interaction), `anvil` (local node) |
| **Fuzz Testing** | Requires external library integration | **Extremely powerful out-of-the-box support** |

> 💡 **Why did Foundry win?**
> Writing unit tests in the same language (Solidity) prevents developers from losing focus by switching context between JS/TS and Solidity. Furthermore, Foundry runs directly on an EVM emulated in Rust, making its execution speed 10x to 100x faster than Hardhat.

---

## 2. Detailed Foundry Installation Guide

Learn how to install Foundry on your computer (compatible with Linux, macOS, and Windows WSL2):

### Step 1: Download the Foundryup Installer
Open your Terminal and run the following command to download the `foundryup` version manager tool:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

### Step 2: Install Foundry Tools
Once the above command finishes, restart your Terminal or reload your environment variables (e.g., `source ~/.zshrc` or `source ~/.bashrc`), and then run:

```bash
foundryup
```

This command will automatically download and install the 4 core tools:
1.  **`forge`**: The tool for project management, compilation, running tests, and deploying Smart Contracts.
2.  **`anvil`**: A local Ethereum Blockchain emulator (Local Node) equivalent to Hardhat Network or Ganache.
3.  **`cast`**: A powerful CLI tool that allows you to query data directly from the Blockchain or send transactions right from the Terminal without writing any code.
4.  **`chisel`**: A fast, interactive Solidity REPL in the Terminal for testing syntax on the fly.

Verify that the installation was successful by running:
```bash
forge --version
```

---

## 3. Initializing and Analyzing a Foundry Project Structure

Now, create a folder for your first Web3 project and initialize the Foundry structure:

```bash
mkdir sensei-foundry-dapp
cd sensei-foundry-dapp
forge init --no-git
```
*(We use `--no-git` because your current Sensei Hub project is already inside a larger Git repository).*

### Analyzing the Generated Project Structure:

```text
sensei-foundry-dapp/
├── lib/               # Directory containing third-party libraries (like OpenZeppelin) as git submodules
├── src/               # THE MAIN SMART CONTRACTS (.sol)
│   └── Counter.sol
├── test/              # THE UNIT TEST FILES (.sol)
│   └── Counter.t.sol
├── script/            # THE DEPLOYMENT SCRIPT FILES (.sol)
│   └── Counter.s.sol
└── foundry.toml       # The project configuration file (compiler version, optimizer, rpc keys, etc.)
```

---

## 4. Mastering the Workflow with Forge CLI

### 4.1. Compiling the Project (Compiling)
To compile all the Solidity files in the `src/` directory, run:

```bash
forge build
```
Foundry compiles extremely fast. The compilation output files (ABI and Bytecode) will be saved in the `out/` directory.

### 4.2. Running Default Tests (Testing)
Foundry automatically generates a template test file `Counter.t.sol` for you. Run the following command to execute the tests:

```bash
forge test
```
You will see the Terminal display green text indicating that all unit tests have successfully passed!

---

## 5. Mastering Anvil Emulator & Cast CLI Tool

Let me show you how to run a local Ethereum Blockchain right on your computer and interact with it like a real hacker.

### 5.1. Starting a Local Ethereum Network with Anvil
Open a new Terminal window (keep the old one running) and type:

```bash
anvil
```

Anvil will immediately start a local Blockchain network running at `http://127.0.0.1:8545`. 
*   It automatically generates **10 emulator wallet accounts**, each pre-funded with **10,000 virtual ETH**, complete with their respective Private Keys so you can test freely.
*   *Note:* Keep this Anvil terminal window running while you work.

### 5.2. Querying the Blockchain with Cast CLI
Go back to your original Terminal window and use the `cast` tool to interact with the local Anvil network you just spun up:

*   **Get the balance of Anvil's 1st Account:**
    ```bash
    cast balance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --rpc-url http://127.0.0.1:8545
    ```
    *Returned result:* `10000000000000000000000` (in Wei, equivalent to 10,000 ETH).

*   **Convert Wei to Ether:**
    ```bash
    cast to-dec 10000000000000000000000
    ```

*   **Send 10 ETH from Account 1 to Local Account 2:**
    ```bash
    cast send 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --value 10ether --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://127.0.0.1:8545
    ```
    You will see Anvil record a new transaction with its Transaction Hash, Block Number, and detailed gas fees displayed right on the Terminal!

---

## Day 9 Summary

Today, you made a major leap from an amateur developer to a professional:
1.  Understood why **Foundry** is the ultimate choice in 2026 compared to Hardhat.
2.  Successfully installed the Foundry toolkit (`forge`, `anvil`, `cast`).
3.  Initialized a project, analyzed its standard folder structure, and compiled it locally.
4.  Ran the local **Anvil** blockchain network and successfully transferred funds using the **Cast CLI** command line.

**Practical Exercises:**
1.  Follow the guide in Section 2 to successfully install Foundry on your machine.
2.  Initialize a new project named `sensei-foundry-dapp` using `forge init`.
3.  Run `forge build` and `forge test` to ensure that everything is working perfectly.
4.  Start `anvil`, locate Anvil's 3rd wallet address, use `cast balance` to check its initial balance, and use `cast send` to transfer 50 ETH from wallet 1 to wallet 3.

Tomorrow, we will start writing our first automated unit tests using **Forge Test** and explore Foundry's powerful cheatcodes to simulate hacking environments. See you then!
