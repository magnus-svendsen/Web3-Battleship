import { Box, Text } from "@mantine/core";
import { useGameContext } from "../contexts/GameContext";
import { useEffect, useState } from "react";

const GameStatsBox = () => {
  const { timesHit, setTimesHit, timesMiss, setTimesMiss, enemyTimesHit, setEnemyTimesHit, enemyTimesMiss, setEnemyTimesMiss, turnNumber, setTurnNumber } = useGameContext();
  const [accuracy, setAccuracy] = useState<string | null>(localStorage.getItem("accuracy"));
  const [enemyAccuracy, setEnemyAccuracy] = useState<string | null>(localStorage.getItem("enemyAccuracy"));

  useEffect(() => {
    if(timesHit === 0 && timesMiss === 0) {
      setAccuracy("No shots yet!")
      localStorage.setItem("accuracy", JSON.stringify("No shots yet!"))
    }
    else {
      const hitrate = (((timesHit/(timesMiss+timesHit))*100).toFixed(1) + "%")
      setAccuracy(hitrate)
      localStorage.setItem("accuracy", hitrate)
    }
  },[timesHit, timesMiss])

  useEffect(() => {
    if(enemyTimesHit === 0 && enemyTimesMiss === 0) {
      setEnemyAccuracy("No shots yet!")
      localStorage.setItem("enemyAccuracy", JSON.stringify("No shots yet!"))
    }
    else {
      const enemyHitrate = (((enemyTimesHit/(enemyTimesMiss+enemyTimesHit))*100).toFixed(1) + "%")
      setEnemyAccuracy(enemyHitrate)
      localStorage.setItem("enemyAccuracy", enemyHitrate)
    }
  },[enemyTimesHit, enemyTimesMiss])

  useEffect(() => {
    const savedTimesHit = localStorage.getItem("timesHit");
    if (savedTimesHit) {
      setTimesHit(JSON.parse(savedTimesHit));
    }
    const savedTimesMiss = localStorage.getItem("timesMiss");
    if (savedTimesMiss) {
      setTimesMiss(JSON.parse(savedTimesMiss));
    }
    const savedAccuracy = localStorage.getItem("accuracy");
    if (savedAccuracy) {
      setAccuracy(JSON.parse(savedAccuracy));
    }
    const savedEnemyTimesHit = localStorage.getItem("enemyTimesHit");
    if (savedEnemyTimesHit) {
      setEnemyTimesHit(JSON.parse(savedEnemyTimesHit));
    }
    const savedEnemyTimesMiss = localStorage.getItem("enemyTimesMiss");
    if (savedEnemyTimesMiss) {
      setEnemyTimesMiss(JSON.parse(savedEnemyTimesMiss));
    }
    const savedEnemyAccuracy = localStorage.getItem("enemyAccuracy");
    if (savedEnemyAccuracy) {
      setEnemyAccuracy(JSON.parse(savedEnemyAccuracy));
    }
    const savedTurnNumber = localStorage.getItem("turnNumber");
    if (savedTurnNumber) {
      setTurnNumber(JSON.parse(savedTurnNumber));
    }
  }, []);

  return (
    <Box className="border grid grid-cols-1 gap-1 mr-12 rounded-md p-4 shadow-md border-color-teal-1000" >
      <Text fw={700} inline className="text-center">Turn no. {turnNumber}</Text>
      <span>
        <Text fw={500} className="text-center" c="rgb(0,200,100)">My stats</Text>
        <Text>Hits: {timesHit}</Text>
        <Text>Misses: {timesMiss}</Text>
        <Text>Accuracy: {accuracy}</Text>
      </span>
      <span>
        <Text className="text-center" c="rgb(220,60,60)">Enemy stats</Text>
        <Text>Hits: {enemyTimesHit}</Text>
        <Text>Misses: {enemyTimesMiss}</Text>
        <Text>Accuracy: {enemyAccuracy}</Text>

      </span>
    </Box>
  );
};

export default GameStatsBox;
