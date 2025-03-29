import { Text} from '@mantine/core';
import axios from 'axios';
import { serverUserinfoURL } from '../utils/serverURL';
import { useEffect, useMemo, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import PersonIcon from '@mui/icons-material/Person';
import AccountInfoModal from './AccountInfoModal';
import { formatEther } from 'viem';

function AccountInfoHandle() {
  const [userInfo, setUserInfo] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const account = useAccount();

  const { data, isError, isLoading } = useBalance({
    address: account.address,
  });


  const combinedData = useMemo(() => {
    if (userInfo && data) {
      return {
        ...userInfo,
        balance: data.value ? parseFloat(formatEther(data.value)).toFixed(4) : "0.0000",
        symbol: data.symbol,
      };
    }
    return null;
  }, [userInfo, data]);

  const handleOnClick = () => {
    setIsModalOpen(true)
  }
  
  const getUserInfo = async () => {
    const accessToken = localStorage.getItem("accesstoken");
    
    try {
      await axios
        .post(serverUserinfoURL, { accesstoken: accessToken })
        .then((response) => {
          if (response.status === 200) {
            setUserInfo(response.data);
          } else {
            throw new Error("Access token is invalid");
          }
        });
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getUserInfo()
  },[])

  return (
    <div>
      {userInfo ? (
        <div   className="inline-flex items-center border border-gray-300 rounded-full px-4 py-1.5 pr-4 mr-4 cursor-pointer transition-colors duration-200 hover:border-gray-400"
        onClick={handleOnClick}
        >
          {account.isConnected ? (
            isLoading ? (
              <Text>Loading balance...</Text>
            ) : isError ? (
              <Text>Error fetching balance.</Text>
            ) : (
              <><PersonIcon/>
              <Text>
                Balance: {data!.value ? parseFloat(formatEther(data!.value)).toFixed(4) : "0.0000"} {data?.symbol}
              </Text>
              </>
            )
          ) : (
            <Text>Please connect your wallet to view balance.</Text>
          )}
        </div>
      ) : (
        <Text>Loading user info...</Text>
      )}
       {isModalOpen && userInfo && (
        <AccountInfoModal
          data={combinedData}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

export default AccountInfoHandle;