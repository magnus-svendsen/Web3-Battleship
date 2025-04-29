interface verifiedOpponentAccountInfoProps {
  address: string;
  name: string
}

interface unverifiedOpponentAccountInfoProps {
  address: string;
}

export type opponentAccountInfoProps = verifiedOpponentAccountInfoProps | unverifiedOpponentAccountInfoProps