# 🛳️ Web3 Battleship with Vipps SSO
A Web3-enabled Battleship game that explores how Single Sign-On (SSO) using Vipps can lower the entry barrier for new users in the decentralized ecosystem. Built as part of a master thesis on user onboarding and trusted identity in Web3.

---

## 📚 Table of Contents

- [🎮 Game Details](#-game-details)
- [🔐 Web3 Onboarding with Vipps SSO](#-web3-onboarding-with-vipps-sso)
- [📲 How to Setup Vipps Test User](#-how-to-setup-vipps-test-user)
- [📘 Web3 and Game Overview](#-web3-and-game-overview)
- [🧑‍💻 Developer Guide and Technical Overview](#-developer-guide-and-technical-overview)
- [🖼️ Screenshots](#️-screenshots)

---

## 🎮 Game Details
- Our Battleship game includes both **singleplayer** and **multiplayer** modes — challenge a bot or compete against a friend.

- Both game modes are powered by **smart contracts** — one for singleplayer and one for multiplayer — ensuring transparent and decentralized gameplay.

- The singleplayer mode is a great way to explore Web3 features at your own pace.

- All actions in the game (like placing ships or making moves) trigger blockchain transactions, giving users hands-on experience with decentralized apps.

- When logging in with **Vipps**, the game automatically uses the **Sepolia testnet**, so you can interact with the blockchain without spending real money.

- If you use **MetaMask**, you're free to connect to any Ethereum-compatible network — including Sepolia or even mainnet (though mainnet isn't required or recommended for this game).

## 🔐 Web3 Onboarding with Vipps SSO
To reduce onboarding friction, this project integrates **Vipps SSO** to allow users to sign in using a familiar Web2 login method — no wallet setup or private key management required. Here's how it works:

1. The user logs in using Vipps through an OAuth 2.0 authentication flow.

2. We retrieve the user's unique sub identifier from Vipps, which acts as their identity reference.

3. We check if this user already has a private key stored in our database.

4. If not, we generate a new **Ethereum-compatible private key**, store it in our MongoDB database, and return it to the frontend.

This private key enables users to sign blockchain transactions without requiring them to manually interact with a wallet. While simplified, this architecture functions similarly to a lightweight **Wallet-as-a-Service (WaaS)** solution, helping onboard users into Web3 without requiring them to manage keys or install tools like MetaMask.

## 📲 How to Setup Vipps Test User
Follow this [guide](https://developer.vippsmobilepay.com/docs/knowledge-base/test-environment/#app-installation), and use this test user:

- NIN: 52035644113

- Phone: +47 93636402

## 📘 Web3 and Game Overview

### ⛓️ What is Web3?
- **Web3** is a *new way of thinking* about the internet — focused on **decentralization** and **user control**.
- Unlike **Web2**, where large companies store your data, Web3 uses **blockchain networks** run by independent nodes.
- This gives you greater **transparency**, **privacy**, and **ownership** of your identity and data.

### 🔐 Login using Vipps vs MetaMask
- **MetaMask** is a popular Web3 wallet where **you manage your own private key**.
- If you lose your private key, you lose access — permanently.
- To make things easier, we offer **Vipps Login** — a method many users already know and trust.
- It’s perfect for beginners: **no wallet setup, no seed phrases, just play!**

### 🪙 What are Transactions?
- In Web3, actions like **placing ships** or **attacking** are blockchain **transactions**.
- Each transaction requires a small fee called **"gas"**, used to securely process actions on the network.
- Some actions interact with **smart contracts** — self-executing programs that guarantee fairness and transparency.

### 💸 Do I Need Real Money?
- **No real money is needed!**
- The game runs on the **Sepolia testnet**, using **fake ETH** for testing and experimentation.
- You can explore blockchain features **completely free** — *no cost, no risk.*

### ✨ Our Goal
- We want to make Web3 **accessible and intuitive** — especially for newcomers.
- By using **familiar login options like Vipps**, we reduce friction and make it easier to get started.
- You’ll experience the **core benefits of Web3** without needing deep technical knowledge.

## 🧑‍💻 Developer Guide and Technical Overview
### 📦 How to Run the Project
#### 🚀 Frontend
1. `cd frontend/vite-react`

2. `npm install`

3. `npm run dev`

#### 🛠 Backend
1. `cd backend`

2. `npm install`

3. `npm run dev`

### 🧱 Tech Stack

#### 🖥 Frontend
- **React with Vite** – Fast and modern frontend tooling  
- **TypeScript** – Type-safe JavaScript  
- **Wagmi** – React hooks for Web3 integration
- **Tailwind CSS** – Utility-first CSS framework for styling
- **Mantine** - UI component library used for layout, modals, and form elements

#### 🛠 Backend
- **Node.js + Express** – REST API for user and session handling  
- **Vipps SSO** – Integration with Vipps' API for user authentication  
- **MongoDB** – Database for storing user/session data (if used)

#### ⛓ Blockchain
- **Solidity** – Smart contract language for the Battleship game logic  
- **Sepolia Testnet** – Ethereum test network used for development with no real ETH required  


### 🗂️ Code Structure
```sh
├── frontend/vite-react/                 # Vite + React frontend app
│   ├── src/                             # Source code for the frontend
│   │   ├── components/                  # Reusable React components
│   │   ├── pages/                       # Page views (e.g., Home, Game)
│   │   ├── hooks/                       # Custom React hooks
│   │   ├── contexts/                    # React Contexts for global state
│   │   ├── utils/                       # Utility functions and constants
│   │   ├── types/                       # TypeScript type definitions
│   │   ├── App.tsx                      # Main React app component
│   │   ├── main.tsx                     # Entry point for the React app
│   │   └── wagmi.ts                     # Wagmi config for blockchain interactions
│
├── backend/                             # Node.js / Express backend
│   ├── routes/                          # API route definitions (e.g., auth, game)
│   ├── controllers/                     # Logic for handling API requests
│   ├── models/                          # Database models (optional)
│   ├── config/                          # Config files (e.g., DB connection, env vars)
│   └── server.js                        # Main entry point for the backend server
│
└── battleship-contract/                 # Smart contracts
    └── contracts/                       # Solidity contract files
        ├── Contract.sol                 # Multiplayer Battleship contract
        └── SinglePlayerBattleship.sol   # Singleplayer Battleship contract
```

## 🖼️ Screenshots


