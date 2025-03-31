import { useEffect, useState } from "react";

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

function NewUserInformation() {
  const { height } = useWindowSize();

  let availableHeight = height - 380;
  if (availableHeight <= 200) {
    availableHeight = 200;
  }

  return (
    <div className="flex justify-center mb-10">
      <div className="max-w-5xl px-8 py-10">        
        <h2 className="text-2xl font-bold mb-4">
          What is Web3?
        </h2>
        <p className="text-lg mb-8 ml-8 leading-relaxed">
          Web3 is a purposed new paradigm for the World Wide Web. It differs heavily from the tradiotional Web in regards to Decentralization and User Empowerment.
          Instead of large corporations controlling data through centralized server, Web3 utilizes distributed, decentralized networks powered by blockchain technology.
          These networks consist of independent nodes working collaboratively to validate transactions. These transactions, along with other data, are stored on the blockchain, ensuring transparency and security.
          Web3 empowers users by giving them greater control over their data, digital identities, and online interactions, promoting a more open and user-centric internet.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">
          Login using Vipps vs Metamask
        </h2>
        <p className="text-lg mb-6 ml-8 leading-relaxed">
          In Web3, users interact with the blockchain through wallets, which manage their digital identity and assets by storing keys, not assets themselves.
          Each user has an account with a public key (used to create an address for transactions) and a private key (which proves ownership and control). Losing the private key means losing access to the account forever.
        </p>
        <p className="text-lg mb-8 ml-8 leading-relaxed">
          For newcomers, we offer Vipps Login as a simple, familiar alternative to Web3 wallets like MetaMask. This makes getting started with Web3 easier while allowing experienced users to use traditional wallets for full control.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">
          What are transactions?
        </h2>
        <p className="text-lg mb-6 ml-8 leading-relaxed">
          In Web3, transactions are actions like sending assets or using apps on the blockchain. They require approval with a private key and come with a fee (or "gas fee") paid to the network for processing.
        </p>
        <p className="text-lg mb-8 ml-8 leading-relaxed">
          Some transactions interact with smart contracts, which are like digital agreements that automatically execute actions when certain conditions are met. In this game, you will interract with a smart contract to execute game logic.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">
          Does this mean I will be using money to play the game?
        </h2>
        <p className="text-lg mb-8 ml-8 leading-relaxed">
          <span className="font-bold">No!</span> Using either Vipps or Metamask will not cost you any money. This application is built on an Ethereum test network called Sepolia.
          <br /><br />
          The Sepolia test network is a blockchain used specifically for testing purposes. It works just like the real Ethereum network, but the ETH used here is fake and has no real-world value. It's a safe environment where developers and users can interact with blockchain applications without spending actual money. So, you can play the game freely without worrying about losing money.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">
          Our goal...
        </h2>
        <p className="text-lg ml-8 leading-relaxed">
          We want to investigate how new users interract with a Web3 Application, figuring out potential roadblocks for widespread adoptation for the technology.
          To make Web3 more accessible, we have integrated Vipps Login as an alternative to traditional Web3 wallets like MetaMask. This integration aims to simplify the onboarding process for newcomers, providing a familiar and user-friendly way to interact with the application without dealing with complicated blockchain concepts.
        </p>
      </div>
    </div>
  );
}

export default NewUserInformation;