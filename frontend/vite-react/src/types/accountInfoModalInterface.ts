export interface AccountInfoModalProps {
  data: {
    name: string;
    phone_number: string;
    balance: number;
    symbol: string;
  };
  onClose: () => void;
}