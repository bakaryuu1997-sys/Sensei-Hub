---
title: "Day 17: Web3 Indexing & Querying (The Graph & Subgraph)"
description: "Overcoming blockchain querying limitations. Learn how to use The Graph Protocol to index event data and design high-speed GraphQL Subgraph queries."
---

# Day 17: Web3 Indexing & Querying (The Graph & Subgraph)

Welcome to Day 17! Yesterday, we learned how to read and write data directly to Smart Contracts. This works perfectly when we only need to read the current balance of a specific wallet. 

But imagine you are building a professional DeFi Dashboard application (like Zapper or DeBank) and you want to display:
*   *The history of all deposit transactions of Alice over the past 3 months.*
*   *The list of top 10 users depositing the most money into the bank system, sorted in descending order.*
*   *How the total deposit amount of the entire system increases or decreases day by day.*

If you try to use traditional RPC Nodes to scan through block by block on the Blockchain to search for this data, your application will **hang indefinitely** or run extremely slowly because Blockchain is an **Append-only** database (only supports appending data sequentially) and completely **does not support complex search filters (like WHERE, JOIN, ORDER BY)** of SQL.

To solve this tough problem, the entire Web3 industry uses **The Graph Protocol** - the world's most advanced decentralized data indexing and querying solution.

---

## 1. What is The Graph Protocol?

**The Graph** is a decentralized protocol used to index and query data from Blockchain networks like Ethereum, Arbitrum, Polygon... It operates similarly to how Google indexes information from web pages to allow users to search at lightning speed.

Instead of calling the Blockchain directly, your Frontend application will send a very lightweight and fast query to a **Subgraph** of The Graph using the **GraphQL** query language to retrieve exactly the desired data in less than a few milliseconds.

---

## 2. Data Flow Architecture of The Graph

The diagram below describes exactly how data moves from a Smart Contract to the user's DApp screen:

```text
[Smart Contract] ---> (Emits Event) ---> [Blockchain Network]
                                               |
                                               v (Listens for events)
[GraphQL Query] <--- [The Graph Node (Database)] <--- [Mappings (AssemblyScript)]
```

1.  **Smart Contract** executes a transaction and emits an **Event** (for example: `emit Deposit(user, amount)`).
2.  **The Graph Node** continuously scans new blocks, detects this Event, and downloads the event data.
3.  **Mappings (AssemblyScript Code):** The source code written by you will receive this event data, process/calculate it, and store the data in the Graph Node's database.
4.  **Frontend** sends a lightweight **GraphQL** query to the Graph Node to fetch pre-sorted data to display on the UI.

---

## 3. Three Core Components of a Subgraph

To build a Subgraph to index data for your project, you need to define 3 main configuration files:

### 3.1. Structure Configuration File `subgraph.yaml`
Defines the data source (Smart Contract address, Chain name), which events to listen to, and which function in the mapping file will process those events.

```yaml
dataSources:
  - kind: ethereum/contract
    name: SenseiBank
    network: mainnet
    source:
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
      abi: SenseiBank
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - DepositRecord
      abis:
        - name: SenseiBank
          file: ./abis/SenseiBank.json
      eventHandlers:
        # Listen for the Deposit event and call the handleDeposit function in the mapping file
        - event: Deposit(indexed address,uint256)
          handler: handleDeposit
      file: ./src/mapping.ts
```

### 3.2. Define the Storage Entity `schema.graphql`
Uses GraphQL syntax to design the database table structure that will be stored and queried by the Frontend.

```graphql
# Define the data table storing deposit history
type DepositRecord @entity {
  id: ID! # Primary key (usually the Transaction Hash)
  user: Bytes! # Wallet address of the sender
  amount: BigInt! # Deposited amount
  timestamp: BigInt! # Time the transaction occurred
  blockNumber: BigInt! # Block number containing the transaction
}
```

### 3.3. Program the Mapping Logic `mapping.ts`
Written in **AssemblyScript** (a variant of TypeScript compiled into WebAssembly - WASM bytecode to run at high speed). This function is responsible for transforming raw data from Blockchain Events into storage entities in the database.

```typescript
import { Deposit as DepositEvent } from "../generated/SenseiBank/SenseiBank"
import { DepositRecord } from "../generated/schema"

export function handleDeposit(event: DepositEvent): void {
  // Create a new record with the ID being the transaction Hash
  let record = new DepositRecord(event.transaction.hash.toHex())
  
  // Map parameters from the Event into the entity
  record.user = event.params.user
  record.amount = event.params.amount
  record.timestamp = event.block.timestamp
  record.blockNumber = event.block.number

  // Save the record to The Graph Node's database
  record.save()
}
```

---

## 4. Frontend High-Speed GraphQL Querying

After the Subgraph is deployed and fully synchronized, your Frontend DApp only needs to send an extremely simple GraphQL query to retrieve the list of transaction history:

```graphql
# GraphQL query syntax: Get the top 5 largest deposit transactions sorted in descending order
query {
  depositRecords(
    first: 5, 
    orderBy: amount, 
    orderDirection: desc
  ) {
    id
    user
    amount
    timestamp
  }
}
```

### High-Speed JSON Results Returned to Frontend:
```json
{
  "data": {
    "depositRecords": [
      {
        "id": "0x53a0...",
        "user": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "amount": "100000000000000000000",
        "timestamp": "1779264000"
      }
    ]
  }
}
```

---

## Summary of Day 17

Today you have unlocked the ultimate key to handling big data in the Web3 world:
1.  Understand the **tough limitations** of traditional Blockchain RPC Nodes in querying and filtering historical data.
2.  Grasp the operating principle of **The Graph Protocol** in indexing decentralized information.
3.  Know how to design the 3 core components of a **Subgraph** (`subgraph.yaml`, `schema.graphql`, `mapping.ts`).
4.  Get familiar with the **GraphQL** query language to retrieve organized data quickly while saving resources.

**Practical Exercises:**
1. Study carefully the structure of the `subgraph.yaml` and `schema.graphql` files provided in this lesson.
2. Draw a mind map describing the data flow from when a user interacts with a Smart Contract until the data is displayed on The Graph's Dashboard application.
3. Explore sample Subgraphs of major projects like Uniswap on The Graph's official website (The Graph Explorer) to see how wonderfully they manage millions of swap transaction records every day!

Tomorrow, we will enter the **Final Section: Mastering Web3 Security & Smart Contract Audit (Day 18 - Day 20)**. You will learn how to scan for vulnerabilities and protect projects from classic hacking attacks. See you tomorrow!
