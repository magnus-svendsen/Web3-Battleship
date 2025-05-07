interface verifiedOpponentOrUserAccountInfoProps {
  address: string;
  name: string;
  isOpponent: boolean;
}

interface unverifiedOpponentOrUserAccountInfoProps {
  address: string;
  isOpponent: boolean;

}

export type opponentOrUserAccountInfoProps = verifiedOpponentOrUserAccountInfoProps | unverifiedOpponentOrUserAccountInfoProps