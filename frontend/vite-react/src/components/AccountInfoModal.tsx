import { Button, Group, Modal, SimpleGrid, Text, Tooltip } from "@mantine/core";
import { useAccount, useDisconnect } from "wagmi";
import {
  Person as PersonIcon,
  HelpOutline as HelpOutlineIcon,
  Phone as PhoneIcon,
  VpnKey as VpnKeyIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { AccountInfoModalProps } from "../types/accountInfoModalInterface";
import TruncatedCopyText from "./TruncatedCopyText";

function AccountInfoModal({ data, onClose }: AccountInfoModalProps) {
  const account = useAccount()
  const { disconnect } = useDisconnect();


  return (
    <div>
      <Modal opened={true} onClose={onClose} title="Account Information" centered size="auto" >
        <SimpleGrid cols={2} spacing={4}>
          <div>
            <Group gap={0}>
              <PersonIcon fontSize="small" />
              <Tooltip label="This is the display name associated with your account.">
                <HelpOutlineIcon
                  className="
                    top-0
                    right-0
                    -translate-x-1.9
                    -translate-y-1
                    text-gray-500
                    cursor-pointer
                  "
                  sx={{ fontSize: "16px" }}   // Manually set size using sx since mui seems to override the size styling
                />
              </Tooltip>
              <Text>Name:</Text>
            </Group>
          </div>
          <div>
            <Text>{data.name}</Text>
          </div>
          <div>
            <Group gap={0}>
              <PhoneIcon fontSize="small" />
              <Tooltip label="This is the phonenumber associated with your account.">
                <HelpOutlineIcon
                  className="
                    top-0
                    right-0
                    -translate-x-1.9
                    -translate-y-1
                    text-gray-500
                    cursor-pointer
                  "
                  sx={{ fontSize: "16px" }}   // Manually set size using sx since mui seems to override the size styling
                />
              </Tooltip>
              <Text>Phone:</Text>
            </Group>
          </div>
          <div>
            <Text>
              {data.phone_number}
            </Text>
          </div>
          <div>
            <Group gap={0}>
              <VpnKeyIcon fontSize="small" />
              <Tooltip w={540} label="This is address to your account. You can think of it as a bank account number for your digital assets. It's a unique public identifier." multiline >
                <HelpOutlineIcon
                  className="
                    top-0
                    right-0
                    -translate-x-1.9
                    -translate-y-1
                    text-gray-500
                    cursor-pointer
                  "
                  sx={{ fontSize: "16px" }}   // Manually set size using sx since mui seems to override the size styling
                />
              </Tooltip>
              <Text>Address:</Text>
            </Group>
          </div>
          <div>
            <Text
              style={{
                maxWidth: 200,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {account.address && <TruncatedCopyText inputString={account.address} />}
            </Text>
          </div>
          <div>
            <Group gap={0}>
              <AccountBalanceIcon fontSize="small" />
              <Tooltip multiline w={540} label="This is the amount of Ethereum you have. Don't worry, this does not contain any real world value as its test tokens. This is used to conduct transactions. Furthermore, assets and currencies in this account is not directly linked to your Vipps account. You are never using 'real' money. ">
                <HelpOutlineIcon
                  className="
                    top-0
                    right-0
                    -translate-x-1.9
                    -translate-y-1
                    text-gray-500
                    cursor-pointer
                  "
                  sx={{ fontSize: "16px" }}   // Manually set size using sx since mui seems to override the size styling
                />
              </Tooltip>
              <Text>Balance:</Text>
            </Group>
          </div>
          <div>
            <Text>{data.balance + " Sepolia"+data.symbol}</Text>
          </div>
        </SimpleGrid>
        <div className="pt-10">
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
      </Modal>
    </div>
  )
}
export default AccountInfoModal;