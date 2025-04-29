import { useEffect, useState } from "react";
import { opponentAccountInfoProps } from "../types/opponentAccountInfoProps";


const OpponentAccountInfo = (props: opponentAccountInfoProps) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  useEffect(() => {
    if ("name" in props) {
      setIsVerified(true)
    } else {
      setIsVerified(false)
    }
  }, [props])

  if ("name" in props) {
    return (
      <div>
        <p>{props.name}</p>
        <p>{props.address}</p>
      </div>
    )
  }

  return (
    <div>
      {props.address}
    </div>
  )
}

export default OpponentAccountInfo;