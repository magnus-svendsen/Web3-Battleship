import { Modal, Switch, Text } from "@mantine/core";
import { useGameContext } from "../contexts/GameContext";

interface AccountInfoModalProps {
  data: {
    name: string;
    phone_number: string;
  };

  onClose: () => void;
}
function AccountInfoModal({ data, onClose }: AccountInfoModalProps) {
  const { autoConfirmTransactions, setAutoConfirmTransactions } = useGameContext();

  return (
    <div>
      <Modal opened={true} onClose={onClose} title="Account Information" centered>
        <Text>
          Name: {data.name}
        </Text>
        <Text>
          Phonenumber: {data.phone_number}
        </Text>
        <Text>
          Account address: 
        </Text>
        <Text>
          Balance: 
        </Text>
        <Switch
          checked={autoConfirmTransactions}
          onChange={(event) => setAutoConfirmTransactions(event.currentTarget.checked)}
          label="Autoconfirm transactions"
        />
      </Modal>
    </div>
  )
}
export default AccountInfoModal;