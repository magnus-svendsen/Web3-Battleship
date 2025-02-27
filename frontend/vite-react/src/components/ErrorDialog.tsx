import { Dialog, Text } from "@mantine/core";
import { useState } from "react";


const ErrorDialog = () => {
  const [errorMessage, setErrorMessage] = useState("")


  return (
    <Dialog opened={true} onClose={close} size="lg" radius="md" withBorder>
      <Text size="sm" mb="xs" fw={500}>
        test
      </Text>
    </Dialog>
  )
};
export default ErrorDialog