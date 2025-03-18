import { useEffect, useState } from "react"
import { Button, Group, Modal, Text } from "@mantine/core"
import { useAccount } from "wagmi";
import { ExtendedEmitter, ExtendedConnectorEventMap } from "../types/connectorEventTypes";
import { useGameContext } from "../contexts/GameContext";

const TransactionConfirmationModal = () => {
  const [opened, setOpened] = useState<boolean>(false)
  const [transactionData, setTransactionData] = useState<any>(null)
  const [resolveFn, setResolveFn] = useState<((confirmed: boolean) => void) | null>(null)
  const { autoConfirmTransactions, transactionCancelCount, setTransactionCancelCount} = useGameContext();

  const { connector } = useAccount();

  useEffect(() => {
    // If no connector available, return
    if (!connector) {
      return;
    }

    // If connector is not using the custom connector, for example injected. Return.
    if (connector.id !== "privateKey") {
      return;
    }

    // If no emitter available to connector, return.
    if (!connector.emitter) {
      console.warn("Connector emitter not available.");
      return;
    }

    // Cast emitter to extended emitter, to be able to listen to our custom event.
    const emitter = connector.emitter as unknown as ExtendedEmitter;

    const handleConfirmTransaction = (
      data: ExtendedConnectorEventMap["confirmTransaction"]
    ) => {
      if (autoConfirmTransactions) {
        data.resolve(true);
        console.log("Auto-confirming transaction..")
      } else {
        setTransactionData(data.transaction);
        setResolveFn(() => data.resolve);
        setOpened(true);
      }
    };

    emitter.on("confirmTransaction", handleConfirmTransaction); // Add listener
    return () => {
      emitter.off("confirmTransaction", handleConfirmTransaction); // Remove listener
    };
  }, [connector, autoConfirmTransactions])

  // On transaction confirmed
  const handleConfirm = () => {
    if (resolveFn) {
      resolveFn(true);
    }
    setOpened(false);
    setTransactionData(null);
    setResolveFn(null);
  };

  // On transaction cancelled
  const handleCancel = () => {
    if (resolveFn) {
      resolveFn(false);
    }
    setOpened(false);
    setTransactionData(null);
    setResolveFn(null);
    setTransactionCancelCount(transactionCancelCount+1)
  };

  const safeStringify = (value: any) =>
    JSON.stringify(value, (_key, val) =>
      typeof val === "bigint" ? val.toString() : val,
      2);

  return (
    <Modal opened={opened} onClose={handleCancel} title="Confirm Transaction" centered>
      {transactionData ? (
        <>
          <Text mb="md">
            Please confirm the following transaction:
          </Text>
          <pre
            style={{
              maxHeight: 300,
              overflow: "auto",
              background: "#f5f5f5",
              padding: 10,
            }}
          >
            {safeStringify(transactionData)}
          </pre>
          <Group mt="md">
            <Button variant="outline" color="red" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </Group>
        </>
      ) : (
        <Text>No transaction data available.</Text>
      )}
    </Modal>
  )
}

export default TransactionConfirmationModal;