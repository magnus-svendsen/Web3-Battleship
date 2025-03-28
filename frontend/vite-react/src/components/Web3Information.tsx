import { Box, Text } from "@mantine/core";


function Web3Information() {


    return (
        <Box  className="border w-2/3 rounded-lg" >
            <p className="text-center text-2xl font-bold">
                Welcome to Web3 Battleship!
            </p>
            <p className="m-4 font-semibold">
                What is Web3? 
            </p>
            <p className="m-4 pl-4">
                Web3 is a purposed new paradigm for the World Wide Web. It differs heavily from the tradiotional Web in regards to Decentralization and User Empowerment. 
                Instead of large corporations controlling data through centralized server, Web3 utilizes distributed, decentralized networks powered by blockchain technology. 
                These networks consist of independent nodes working collaboratively to validate transactions. These transactions, along with other data, are stored on the blockchain, ensuring transparency and security. 
                Web3 empowers users by giving them greater control over their data, digital identities, and online interactions, promoting a more open and user-centric internet.
            </p>
            <p className="m-4 font-semibold">
                Login using Vipps vs Metamask
            </p>
            <p className="m-4 pl-4">
            In Web3, users interact with the blockchain through wallets, which manage their digital identity and assets by storing keys, not assets themselves. 
            Each user has an account with a public key (used to create an address for transactions) and a private key (which proves ownership and control). Losing the private key means losing access to the account forever.
            </p>
            <p className="m-4 pl-4">
            For newcomers, we offer Vipps Login as a simple, familiar alternative to Web3 wallets like MetaMask. This makes getting started with Web3 easier while allowing experienced users to use traditional wallets for full control.
            </p>
            <p className="m-4 font-semibold">
                What are transactions?
            </p>
            <p className="m-4 pl-4">
            In Web3, transactions are actions like sending assets or using apps on the blockchain. They require approval with a private key and come with a fee (or “gas fee”) paid to the network for processing.
            </p>
            <p className="m-4 pl-4">
            Some transactions interact with smart contracts, which are like digital agreements that automatically execute actions when certain conditions are met. In this game, you will interract with a smart contract to execute game logic.
            </p>
            <p className="m-4 font-semibold">
                Does this mean I will be using money to play the game?
            </p>
            <p className="m-4 pl-4">
            <b>No!</b> Using either Vipps or Metamask will not cost you any money. This application is built on an Ethereum test network called Sepolia.

            The Sepolia test network is a blockchain used specifically for testing purposes. It works just like the real Ethereum network, but the ETH used here is fake and has no real-world value. It’s a safe environment where developers and users can interact with blockchain applications without spending actual money. So, you can play the game freely without worrying about losing money.            </p>
            <p className="m-4 font-semibold">
                Our goal...
            </p>
            <p className="m-4 pl-4">
                We want to investigate how new users interract with a Web3 Application, figuring out potential roadblocks for widespread adoptation for the technology.
                To make Web3 more accessible, we have integrated Vipps Login as an alternative to traditional Web3 wallets like MetaMask. This integration aims to simplify the onboarding process for newcomers, providing a familiar and user-friendly way to interact with the application without dealing with complicated blockchain concepts.
            </p>
        </Box>
    )
}

export default Web3Information;