import { http, createConfig, webSocket } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { PrivateKeyConnector } from "./utils/privateKeyConnector"
import { sepoliaRPC, mainnetRPC, sepoliaWsRPC} from "./utils/rpcURL"

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
    [sepolia.id]: webSocket(sepoliaWsRPC),
  },
})



declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
