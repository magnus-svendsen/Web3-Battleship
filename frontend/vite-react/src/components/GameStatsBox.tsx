import { Text } from "@mantine/core";
import { useGameContext } from "../contexts/GameContext";

const GameStatsBox = () => {
  const { timesHit, timesMiss, enemyTimesHit, enemyTimesMiss } = useGameContext();


  return (
    <div className="border grid grid-cols-2 gap-2">
      <span>
        <Text>My stats</Text>
        <Text>Hits: {timesHit}</Text>
        <Text>Misses: {timesMiss}</Text>
      </span>
      <span>
        <Text>Enemy stats</Text>
        <Text>Hits: {enemyTimesHit}</Text>
        <Text>Misses: {enemyTimesMiss}</Text>
      </span>
    </div>
  );
};

export default GameStatsBox;
