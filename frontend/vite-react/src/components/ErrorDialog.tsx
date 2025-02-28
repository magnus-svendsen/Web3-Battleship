import { Dialog, Text } from "@mantine/core";
import { useContext, useEffect, useRef, useState } from "react";
import { useGameContext } from "../contexts/GameContext";


const ErrorDialog = () => {
  const {errorMessage, setErrorMessage} = useGameContext();
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);
  const TIMEOUT_LENGTH = 10000

  useEffect(() => {
    if (errorMessage) {
      setDisplayDialog(true);
    }

    timeoutRef.current = window.setTimeout(() => {
      setDisplayDialog(false)
      timeoutRef.current = null;
      setErrorMessage("")
    }, TIMEOUT_LENGTH); 
  },[errorMessage]);

  

  return (
    <Dialog opened={displayDialog} onClose={close} size="lg" radius="md" withBorder>
      <Text size="sm" mb="xs" fw={500}>
        {errorMessage}
      </Text>
    </Dialog>
  )
};
export default ErrorDialog