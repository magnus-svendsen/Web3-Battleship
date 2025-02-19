import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { PrivateKeyConnector } from "../utils/privateKeyConnector"
import { sepoliaRPC, mainnetRPC} from "./utils/rpcURL"

//const mainnetRpc = "https://eth-mainnet.g.alchemy.com/v2/TP8LLuBZxjwI3RlpoTNsdImOlO_iLdNo"
//const sepoliaRpc = "https://eth-sepolia.g.alchemy.com/v2/TP8LLuBZxjwI3RlpoTNsdImOlO_iLdNo"


export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    PrivateKeyConnector({
      chains: [mainnet, sepolia],
      rpcUrl: sepoliaRPC,
    }),
  ],
  ssr: true,
  transports: {
    [mainnet.id]: http(mainnetRPC),
    [sepolia.id]: http(sepoliaRPC),
  },
})



declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
