import type React from 'react';
import { Group, Tooltip, Text, CopyButton, ActionIcon } from '@mantine/core';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface TruncatedAddressWithCopyProps {
  inputString: string;
  startChars?: number;
  endChars?: number;
}

const TruncatedAddressWithCopy: React.FC<TruncatedAddressWithCopyProps> = ({
  inputString,
  startChars = 6,
  endChars = 5,
}) => {
  //Truncated version of the string
  var truncatedString = ""
  if (inputString.length > startChars + endChars) {
    truncatedString = inputString.slice(0,startChars) + "..." + inputString.slice(-endChars)
  }
  else {
    truncatedString = inputString
  }
  

  return (
    <CopyButton value={inputString} timeout={2000}>
      {({ copied, copy }) => (
        //Show full address on hover
        <Group>
          <Tooltip w={540} label="This is address to your account. You can think of it as a bank account number for your digital assets. It's a unique public identifier." multiline>
            <Text size='lg' onClick={copy}>
              {truncatedString}
            </Text>
          </Tooltip>

          <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
            <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}> 
              <ContentCopyIcon style={{ fontSize: 18 }} />
            </ActionIcon>
          </Tooltip>
        </Group>
      )}
    </CopyButton>
  );
};

export default TruncatedAddressWithCopy;
