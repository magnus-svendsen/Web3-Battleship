import axios from "axios";
import { serverCheckVerifyURL } from "./serverURL";

export const verifyAddressAndInitProps = async (
  address: string, 
  isOpponent: boolean,
  setOpponentInfoProps: (props: any) => void,
  setPlayerInfoProps: (props: any) => void
) => {
  try {
    await axios
      .get(serverCheckVerifyURL, { params: { address } })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.verified) {
            if (isOpponent) {
              setOpponentInfoProps({ address: address, name: response.data.name, isOpponent: true })
            }
            else {
              setPlayerInfoProps({ address: address, name: response.data.name, isOpponent: false })
            }
          }
        }
      });
  } catch (error: any) {
    if (error.response?.status === 404) {
      if (isOpponent) {
        setOpponentInfoProps({ address: address, isOpponent: true })
      }
      else {
        setPlayerInfoProps({ address: address, isOpponent: false })
      }
    } else {
      console.error("Server Error")
    }
  }
} 