import { Box, Text } from "@mantine/core";
import { useGameContext } from "../contexts/GameContext";
import { useEffect, useState } from "react";

const GameStatsBox = () => {
  const { timesHit, timesMiss, enemyTimesHit, enemyTimesMiss, turnNumber } = useGameContext();
  const [accuracy, setAccuracy] = useState<string>("");
  const [enemyAccuracy, setEnemyAccuracy] = useState<string>("");

  useEffect(() => {
    const hitrate = timesHit/(timesMiss+timesHit)
    if(timesHit == 0 && timesMiss == 0) {
      setAccuracy("No shots yet!")
    }
    else {
      setAccuracy((hitrate*100)+"%")
    }
  },[timesHit, timesMiss])

  useEffect(() => {
    const hitrate = timesHit/(timesMiss+timesHit)
    if(enemyTimesHit == 0 && enemyTimesMiss == 0) {
      setEnemyAccuracy("No shots yet!")
    }
    else {
      setEnemyAccuracy((hitrate*100)+"%")
    }
  },[enemyTimesHit, enemyTimesMiss])

  return (
    <Box className="border grid grid-cols-1 gap-1 mr-12 rounded-md p-4 shadow-md border-color-teal-1000" >
      <Text fw={700} inline className="text-center">Turn no. {turnNumber}</Text>
      <span>
        <Text fw={500} className="text-center" c="teal.5">My stats</Text>
        <Text>Hits: {timesHit}</Text>
        <Text>Misses: {timesMiss}</Text>
        <Text>Accuracy: {accuracy}</Text>
      </span>
      <span>
        <Text className="text-center" c="red.5">Enemy stats</Text>
        <Text>Hits: {enemyTimesHit}</Text>
        <Text>Misses: {enemyTimesMiss}</Text>
        <Text>Accuracy: {enemyAccuracy}</Text>

      </span>
    </Box>
  );
};

export default GameStatsBox;
