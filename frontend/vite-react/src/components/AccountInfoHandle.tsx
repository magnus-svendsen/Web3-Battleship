import {Button, Text} from '@mantine/core';
import axios from 'axios';
import { serverUserinfoURL } from '../utils/serverURL';

function AccountInfoHandle() {
  const getUserInfo = async () => {
    const accessToken = localStorage.getItem("accesstoken");
    
    let data = "";
    try {
      await axios
        .post(serverUserinfoURL, { accesstoken: accessToken })
        .then((response) => {
          if (response.status === 200) {
            data = response.data;
          } else {
            throw new Error("Access token is invalid");
          }
        });
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div>
      <Button onClick={getUserInfo}>Temporary text</Button>
    </div>
  )
}

export default AccountInfoHandle;