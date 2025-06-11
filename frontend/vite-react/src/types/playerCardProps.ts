interface VerifiedPlayerCardProps {
  address: string;
  name: string;
  isOpponent: boolean;
  isAI?: boolean;
}

interface UnverifiedPlayerCardProps {
  address: string;
  isOpponent: boolean;
  isAI?: boolean;
}

export type PlayerCardProps = VerifiedPlayerCardProps | UnverifiedPlayerCardProps