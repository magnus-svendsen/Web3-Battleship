import React from 'react';
import { Group, Tooltip, Text, CopyButton, ActionIcon } from '@mantine/core';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface TruncatedCopyTextProps {
  inputString: string;
  startChars?: number;
  endChars?: number;
}

const TruncatedCopyText: React.FC<TruncatedCopyTextProps> = ({
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
          <Tooltip label={inputString} withArrow>
            <Text onClick={copy}>
              {truncatedString}
            </Text>
          </Tooltip>

          <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
            <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}> 
              <ContentCopyIcon style={{ fontSize: 16 }} />
            </ActionIcon>
          </Tooltip>
        </Group>
      )}
    </CopyButton>
  );
};

export default TruncatedCopyText;
