import { createConnector } from '@wagmi/core';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts'
import type { Chain, WalletClient } from 'viem';
import axios from 'axios';


export function PrivateKeyConnector({
    chains,
}: {
    chains: Chain[]
}) {
    let walletClient: WalletClient | null = null
    let currentChain: Chain | null = null

    return createConnector<WalletClient>((config) => ({
        id: 'privateKey',
        name: 'Private Key',
        type: 'privateKey',

        async connect() {
            // Get Accesstoken from storage
            const accessToken = localStorage.getItem("accesstoken")

            // Get privatekey from server/db
            let rawPrivateKey = ""
            try {
                await axios.post("http://localhost:5173/privatekey", { accesstoken: accessToken })
                    .then(response => {
                        if (response.status == 200) {
                            rawPrivateKey = response.data
                        }
                        else {
                            localStorage.removeItem("accesstoken")
                            throw new Error('Access token is invalid')

                        }
                    })
            }
            catch (error) {
                window.location.href = "http://localhost:5173/auth/vipps"; 
            }
            if (!rawPrivateKey) {
                localStorage.removeItem("accesstoken")
                throw new Error('Private key is required')
            }

            const formattedPrivateKey = rawPrivateKey.startsWith('0x')
                ? rawPrivateKey
                : `0x${rawPrivateKey}`

            //Sepolia chain, not mainnet
            const chain = chains[1]
            currentChain = chain

            let rpcUrl: string
            if (typeof chain.rpcUrls === 'string') {
                rpcUrl = chain.rpcUrls
            } else if ('default' in chain.rpcUrls) {
                rpcUrl = chain.rpcUrls.default.http[0]
            } else {
                throw new Error('No valid RPC URL found for chain')
            }

            //Convert the private key to an account.
            const account = privateKeyToAccount(formattedPrivateKey as `0x${string}`)
            if (!account) throw new Error('Failed to create account from private key')

            //Create the wallet client.
            walletClient = createWalletClient({
                chain,
                transport: http(rpcUrl),
                account,
            })

            config.emitter.emit('message', { type: 'connecting' })

            return {
                //Cast the address to the expected literal type.
                accounts: [account.address as `0x${string}`],
                chainId: chain.id,
            }
        },

        async disconnect() {
            walletClient = null
            currentChain = null
            config.emitter.emit('disconnect')
        },

        async getAccounts() {
            if (!walletClient) throw new Error('Not connected')
            const account = walletClient.account
            if (!account) throw new Error('Wallet client does not have an account')
            return [account.address as `0x${string}`]
        },

        async getChainId() {
            if (!currentChain) throw new Error('Not connected')
            return currentChain.id
        },

        async getProvider() {
            if (!walletClient) throw new Error('Not connected')
            return walletClient
        },

        async isAuthorized() {
            return !!walletClient && !!walletClient.account
        },

        onAccountsChanged(accounts: string[]) {
            const formattedAccounts = accounts.map(
                (acc) => acc as `0x${string}`
            );
            config.emitter.emit('change', { accounts: formattedAccounts })
        },

        onChainChanged(chain: string | number) {
            config.emitter.emit('change', { chainId: Number(chain) })
        },

        onDisconnect() {
            config.emitter.emit('disconnect')
        },
    }))
}