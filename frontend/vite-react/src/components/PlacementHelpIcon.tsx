import { Tooltip } from "@mantine/core";
import HelpIcon from '@mui/icons-material/Help';

const PlacementHelpIcon: React.FC = () => {
  return (
    <Tooltip
      label="Double-click or press 'R' to rotate your ship."
      withArrow
      position="top"
      color="blue"
    >
      <HelpIcon/>
    </Tooltip>
  );
};

export default PlacementHelpIcon;
