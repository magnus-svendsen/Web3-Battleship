function NewUserInformation() {
  return (
    <div className="flex justify-center mb-10">
      <div className="max-w-5xl px-8 py-10">        
        <h2 className="text-2xl font-bold mb-4">
        ⛓️What is Web3?⛓️
        </h2>
        <p className="text-lg mb-8 ml-8 leading-relaxed">
        Web3 represents a new vision for the internet, emphasizing decentralization and user empowerment.
        Unlike traditional Web2, where data is controlled by centralized corporations, Web3 uses blockchain-based networks of independent nodes to validate and store transactions.
        This ensures transparency, security, and gives users greater control over their data, identity, and online interactions.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">
        🔐Login using Vipps vs Metamask🔐 
        </h2>
        <p className="text-lg mb-6 ml-8 leading-relaxed">
        In Web3, users interact through wallets that manage identity and access using cryptographic keys - not by storing assets. Each account has a public key for transactions and a private key that proves ownership.
        If the private key is lost, access to the account is gone permanently. To make onboarding easier, we offer Vipps Login as a familiar alternative to wallets like MetaMask, helping newcomers get started while still supporting full control for experienced users.
        </p>
        
        
        <h2 className="text-2xl font-bold mb-4">
        🪙What are transactions?🪙
        </h2>
        <p className="text-lg mb-6 ml-8 leading-relaxed">
        In Web3, transactions are actions like sending assets or interacting with apps, and they require approval with your private key. Each transaction includes a gas fee, paid to the network for processing. 
        Some transactions involve smart contracts — self-executing programs on the blockchain. In this game, you'll interact with a smart contract to run the game logic.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">
        💸🔥 Does this mean I will be using money to play the game?💸🔥
        </h2>
        <p className="text-lg mb-8 ml-8 leading-relaxed">
          <span className="font-bold">No!</span> Using Vipps or MetaMask won’t cost you anything.
          This game runs on Sepolia, an Ethereum test network where the ETH is fake and has no real value. It’s a safe space to explore blockchain features without spending real money - so you can play freely, risk-free.          
        </p>
        
        <h2 className="text-2xl font-bold mb-4">
        ✨Our goal...✨
        </h2>
        <p className="text-lg ml-8 leading-relaxed">
        We’re exploring how new users interact with a Web3 application and what barriers might hinder adoption. To make onboarding easier, we’ve integrated Vipps Login as a familiar alternative to wallets like MetaMask, 
        helping users get started without needing to understand complex blockchain concepts.
        </p>
      </div>
    </div>
  );
}

export default NewUserInformation;