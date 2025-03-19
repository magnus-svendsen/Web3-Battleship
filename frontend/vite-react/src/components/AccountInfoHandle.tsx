import {Button, Text} from '@mantine/core';
import axios from 'axios';
import { serverUserinfoURL } from '../utils/serverURL';
import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

function AccountInfoHandle() {
  const [userInfo, setUserInfo] = useState<any>();
  
  const account = useAccount();

  const { data, isError, isLoading } = useBalance({
    address: account.address,
    watch: true, // optional: updates balance on new blocks
  });


  const devlog = () => {
    console.log(userInfo)
    console.log(account)
    console.log(data)

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

  useEffect(() => {
    console.log(data)
  },[data])


  return (
    <div>
      <Button onClick={devlog}>temp</Button>
      {userInfo ? (
        <div>
          <Text>Name: {userInfo.name}</Text>
          {account.isConnected ? (
            isLoading ? (
              <Text>Loading balance...</Text>
            ) : isError ? (
              <Text>Error fetching balance.</Text>
            ) : (
              <Text>Balance: {parseFloat(data!.formatted).toFixed(4)} {data?.symbol}</Text>
            )
          ) : (
            <Text>Please connect your wallet to view balance.</Text>
          )}
        </div>
      ) : (
        <Text>Loading user info...</Text>
      )}
    </div>
  )
}

export default AccountInfoHandle;