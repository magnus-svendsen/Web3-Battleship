import { Text, useSafeMantineTheme } from "@mantine/core";
import { useGameContext } from "../contexts/GameContext";
import { useEffect, useState } from "react";

const GameStatsBox = () => {
  const { timesHit, timesMiss, enemyTimesHit, enemyTimesMiss } = useGameContext();
  const [accuracy, setAccuracy] = useState<string>("");
  const [enemyAccuracy, setEnemyAccuracy] = useState<string>("");

  useEffect(() => {
    const hitrate = timesHit/(timesMiss+timesHit)
    if(Object.is(NaN, hitrate)) {
      setAccuracy("No shots yet!")
    }
    setAccuracy((hitrate*100)+"%")
  },[timesHit, timesMiss])

  useEffect(() => {
    const hitrate = timesHit/(timesMiss+timesHit)
    if(Object.is(NaN, hitrate)) {
      setEnemyAccuracy("No shots yet!")
    }
    setEnemyAccuracy((hitrate*100)+"%")
  },[enemyTimesHit, enemyTimesMiss])

  return (
    <div className="border grid grid-cols-2 gap-2">
      <span>
        <Text>My stats</Text>
        <Text>Hits: {timesHit}</Text>
        <Text>Misses: {timesMiss}</Text>
        <Text>Accuracy: {accuracy}</Text>
      </span>
      <span>
        <Text>Enemy stats</Text>
        <Text>Hits: {enemyTimesHit}</Text>
        <Text>Misses: {enemyTimesMiss}</Text>
        <Text>Accuracy: {enemyAccuracy}</Text>

      </span>
    </div>
  );
};

export default GameStatsBox;
