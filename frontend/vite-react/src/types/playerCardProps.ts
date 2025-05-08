interface VerifiedPlayerCardProps {
  address: string;
  name: string;
  isOpponent: boolean;
}

interface UnverifiedPlayerCardProps {
  address: string;
  isOpponent: boolean;
}

export type PlayerCardProps = VerifiedPlayerCardProps | UnverifiedPlayerCardProps