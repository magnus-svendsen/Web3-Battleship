import { useEffect, useState } from "react";
import type { PlayerCardProps } from "../types/playerCardProps";
import TruncatedAddressWithCopy from "./TruncatedAddressWithCopy";
import VippsCheck from "../utils/images/Vipps_Checkmark.svg"

const PlayerCard = (props: PlayerCardProps) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const tooltip = props.isOpponent
    ? props.isAI 
      ? "This is a fictional address for your AI opponent: 0x0000000000000000000000000000000000000000"
      : `This is your opponent's address! The full address is: ${props.address}`
    : `This is your address! The full address is: ${props.address}`;

  useEffect(() => {
    if ("name" in props) {
      setIsVerified(true)
    } else {
      setIsVerified(false)
    }
  }, [props])

  if (isVerified) {
    return (
      <div className="bg-[#112B4E] rounded-2xl p-2 max-w-md w-full mx-0 min-h-32">
        {props.isOpponent ?
          <p className="text-[rgb(220,60,60)] font-semibold text-lg text-center">
            Opponent
          </p> :
          <p className="text-[rgb(0,200,100)] font-semibold text-lg text-center">
            You
          </p>}
        <p className="text-gray-400 text-xs mt-1 text-center">
          {props.isAI ? "AI User" : "Verified Vipps User"}
        </p>
        <p className="text-md mt-1 text-center italic">
          {props.isAI ? (
            "Anonymous"
          ) : (
            <>
              <img src={VippsCheck} alt="Verified Vipps Checkmark" className="inline-block w-5 h-5 ml-1 mr-2 mb-1 align-middle" />
              {props.name}
            </>
          )}
        </p>

        <div className="mt-1 w-full flex justify-center">
          <div className="text-white font-medium text-sm break-all text-center ml-8">
            <TruncatedAddressWithCopy
              inputString={props.address}
              startChars={6}
              endChars={6}
              tooltipString={tooltip}
              tooltipWidth={340}
              playerCard={true}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#112B4E] rounded-2xl p-2 max-w-md w-full mx-0 min-h-32 flex-col justify-center">
      {props.isOpponent ?
        <p className="text-[rgb(220,60,60)] font-semibold text-lg text-center">
          Opponent
        </p> :
        <p className="text-[rgb(0,200,100)] font-semibold text-lg text-center justify-center">
          You
        </p>}      
        <p className="text-gray-400 text-xs mt-1 text-center">
          {props.isAI ? "AI User" : "External MetaMask User"}
        </p>

        <p className="text-md mt-1 text-center italic text-gray-300">
          Anonymous
        </p>

      <div className="mt-1 w-full flex justify-center">
        <div className="text-white font-medium text-sm break-all text-center ml-8">
          <TruncatedAddressWithCopy
            inputString={props.address}
            startChars={6}
            endChars={6}
            tooltipString={tooltip}
            tooltipWidth={340}
            playerCard={true}
          />
        </div>
      </div>
    </div>
  )
}

export default PlayerCard;