import { Button, Group, Modal, Tooltip } from "@mantine/core";
import { useAccount, useDisconnect } from "wagmi";
import { Phone as PhoneIcon } from "@mui/icons-material";
import type { AccountInfoModalProps } from "../types/accountInfoModalInterface";
import TruncatedAddressWithCopy from "./TruncatedAddressWithCopy";

function AccountInfoModal({ data, onClose }: AccountInfoModalProps) {
  const account = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Modal opened={true} onClose={onClose} size="md" radius={"md"}>
      <div className="flex items-center flex-col gap-3">
        {/* Name: Spans both columns; tooltip on the name */}
        <div className="">
          <Tooltip label="This is the display name associated with your account.">
            <p className="text-2xl">{data.name}</p>
          </Tooltip>
        </div>

        {/* Phone: Spans both columns; only icon and number, wrapped in tooltip */}
        <div>
          <Tooltip label="This is the phone number associated with your account.">
            <Group gap={0}>
              <PhoneIcon fontSize="medium" />
              <p className="ml-1 text-lg">{data.phone_number}</p>
            </Group>
          </Tooltip>
        </div>
        <div>
          {account.address && (
            <TruncatedAddressWithCopy inputString={account.address} />
          )}
        </div>

        {/* Balance: Spans both columns and in bold */}
        <div className="font-bold text-3xl">
          <Tooltip
            multiline
            w={540}
            label="This is the amount of Ethereum you have. Don't worry, this does not contain any real world value as its test tokens. This is used to conduct transactions. Furthermore, assets and currencies in this account is not directly linked to your Vipps account. You are never using 'real' money. "
          >
            <p>{data.balance + " Sepolia" + data.symbol}</p>
          </Tooltip>
        </div>

        <div className="pt-10 flex flex-row justify-center items-center">
          <Button
            variant="filled"
            color="red"
            size="sm"
            radius="sm"
            className="mr-2 content-center"
            type="button"
            onClick={() => disconnect()}
          >
            Disconnect
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AccountInfoModal;
