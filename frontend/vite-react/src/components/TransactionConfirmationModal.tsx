import { useEffect, useState } from "react"
import { Button, Group, Modal, Text } from "@mantine/core"
import { useAccount } from "wagmi";
import { ExtendedEmitter, ExtendedConnectorEventMap } from "../types/connectorEventTypes";

const TransactionConfirmationModal = () => {
  const [opened, setOpened] = useState<boolean>(false)
  const [transactionData, setTransactionData] = useState<any>(null);
  const [resolveFn, setResolveFn] = useState<((confirmed: boolean) => void) | null>(null)

  const {connector} = useAccount();

  useEffect(() => {
    console.log("Connector changed!")
    if (!connector){
      console.log("NO CONNECTOR");
      return;
    }

    if (connector.id !== "privateKey") {
      console.log("PrivateKey connector not in use. Skipping approval");
      return;
    }

    if (!connector.emitter) {
      console.warn("Connector emitter not available.");
      return;
    }
    const emitter = connector.emitter as unknown as ExtendedEmitter;

    const handleConfirmTransaction = (
      data: ExtendedConnectorEventMap["confirmTransaction"]
    ) => {
      setTransactionData(data.transaction);
      setResolveFn(() => data.resolve);
      setOpened(true);
    };

    emitter.on("confirmTransaction", handleConfirmTransaction);
    return () => {
      emitter.off("confirmTransaction", handleConfirmTransaction);
    };
  }, [connector])


  const handleConfirm = () => {
    if (resolveFn) {
      resolveFn(true);
    }
    setOpened(false);
    setTransactionData(null);
    setResolveFn(null);
  };

  const handleCancel = () => {
    if (resolveFn) {
      resolveFn(false);
    }
    setOpened(false);
    setTransactionData(null);
    setResolveFn(null);
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