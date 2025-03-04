import { createConnector } from "@wagmi/core";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Chain, WalletClient, createPublicClient } from "viem";
import axios from "axios";
import { serverAuthURL, serverPrivatekeyURL } from "./serverURL";

export function PrivateKeyConnector({
  chains,
  rpcUrl,
}: {
  chains: Chain[];
  rpcUrl: string;
}) {
  let walletClient: WalletClient | null = null;
  let currentChain: Chain | null = null;
  //const {errorMessage, setErrorMessage } = useGameContext();
  return createConnector<WalletClient>((config) => ({
    id: "privateKey",
    name: "Private Key",
    type: "privateKey",

    async connect() {
      //Init chain and RPC values
      //Sepolia chain, not mainnet
      const chain = chains[1];
      currentChain = chain;

      //Get Accesstoken from storage
      const accessToken = localStorage.getItem("accesstoken");
      const publicClient = createPublicClient({
        chain: chains[1],
        transport: http(rpcUrl),
      });

      //Get privatekey from server/db
      let rawPrivateKey = "";
      try {
        await axios
          .post(serverPrivatekeyURL, { accesstoken: accessToken })
          .then((response) => {
            if (response.status === 200) {
              rawPrivateKey = response.data;
              console.log(rawPrivateKey);
            } else {
              localStorage.removeItem("accesstoken");
              //setErrorMessage("Access token is invalid");
              throw new Error("Access token is invalid");
            }
          });
      } catch (error) {
        window.location.href = serverAuthURL;
      }
      if (!rawPrivateKey) {
        localStorage.removeItem("accesstoken");
        throw new Error("Private key is required");
      }

      const formattedPrivateKey = rawPrivateKey.startsWith("0x")
        ? rawPrivateKey
        : `0x${rawPrivateKey}`;

      //Convert the private key to an account.
      const account = privateKeyToAccount(formattedPrivateKey as `0x${string}`);
      if (!account)
        console.log("Error no account found")

      //Create the wallet client.
      walletClient = createWalletClient({
        chain,
        transport: http(rpcUrl),
        account,
      });

      config.emitter.emit("message", { type: "connecting" });
      const originalRequest = walletClient.request.bind(walletClient);
      walletClient.request = async (args) => {
        if (
          args.method === "eth_sendTransaction" ||
          args.method === "wallet_sendTransaction"
        ) {
          let [transaction] = args.params as [any];
          try {
            //Ensure from field is applied
            if (!transaction.from) {
              transaction = { ...transaction, from: account.address };
            }
            transaction = { ...transaction, chainId: chain.id };
            //Check if gas price is missing, then add if missing
            if (!transaction.gasPrice && !transaction.maxGasPrice) {
              let gasPrice = await publicClient.getGasPrice();
              gasPrice = gasPrice * (15n / 10n); //Bump gas price by 50%
              transaction = { ...transaction, gasPrice };
            }

            if (!transaction.gas && !transaction.gasLimit) {
              transaction = {
                ...transaction,
                from: account.address,
                chainId: chain.id,
              };
              const estimatedGas = await publicClient.estimateGas(transaction);
              const gasLimit = (estimatedGas * 200n) / 100n;
              transaction = {
                ...transaction,
                gas: gasLimit,
                gasLimit: gasLimit,
              };
            }

            //Fetches currenct transaction count/Nonce
            const currentNonce = await publicClient.getTransactionCount({
              address: account.address,
            });
            transaction = { ...transaction, nonce: currentNonce };

            //Sign the transaction
            const signedTx = await walletClient?.signTransaction(transaction);
            if (!signedTx) {
              throw new Error("Signed transaction is null");
            }

            //Send the signed transaction
            const txHash = await publicClient.request({
              method: "eth_sendRawTransaction",
              params: [signedTx],
            });
            config.emitter.emit("message", {
              type: "transaction",
              data: txHash,
            });
            console.log(txHash)
            return txHash;
          } catch (error) {
            console.log("Error while intercepting transaction: ", error);
          }
        }
        return originalRequest(args as any);
      };
      return {
        accounts: [account.address as `0x${string}`],
        chainId: chain.id,
      };
    },

    async disconnect() {
      walletClient = null;
      currentChain = null;
      config.emitter.emit("disconnect");
    },

    async getAccounts() {
      if (!walletClient) throw new Error("Not connected");
      const account = walletClient.account;
      if (!account) throw new Error("Wallet client does not have an account");
      return [account.address as `0x${string}`];
    },

    async getChainId() {
      if (!currentChain) throw new Error("Not connected");
      return currentChain.id;
    },

    async getProvider() {
      if (!walletClient) throw new Error("Not connected");
      return walletClient;
    },

    async isAuthorized() {
      return !!walletClient && !!walletClient.account;
    },

    onAccountsChanged(accounts: string[]) {
      const formattedAccounts = accounts.map((acc) => acc as `0x${string}`);
      config.emitter.emit("change", { accounts: formattedAccounts });
    },

    onChainChanged(chain: string | number) {
      config.emitter.emit("change", { chainId: Number(chain) });
    },

    onDisconnect() {
      config.emitter.emit("disconnect");
    },
  }));
}
