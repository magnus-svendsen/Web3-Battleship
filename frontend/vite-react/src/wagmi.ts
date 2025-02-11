import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { PrivateKeyConnector } from "../utils/privateKeyConnector"

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    PrivateKeyConnector({
      chains: [mainnet, sepolia],
    }),
  ],
  ssr: true,
  transports: {
    [mainnet.id]: http("https://eth-sepolia.g.alchemy.com/v2/TP8LLuBZxjwI3RlpoTNsdImOlO_iLdNo"),
    [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/TP8LLuBZxjwI3RlpoTNsdImOlO_iLdNo"),
  },
})



declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
