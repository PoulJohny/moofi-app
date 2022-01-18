import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Fade, Tooltip } from '@material-ui/core';
import LabeledStat from '../LabeledStat/LabeledStat';
import styles from './styles';

const useStyles = makeStyles(styles);

const LabeledStatWithTooltip = React.memo(({ tooltip, ...passthrough }) => {
  const classes = useStyles();

  return tooltip ? (
    <Tooltip
      arrow
      TransitionComponent={Fade}
      title={tooltip}
      placement="bottom"
      enterTouchDelay={0}
      leaveTouchDelay={3000}
      classes={{ tooltip: classes.tooltip }}
    >
      <LabeledStat {...passthrough} />
    </Tooltip>
  ) : (
    <LabeledStat {...passthrough} />
  );
});

export default LabeledStatWithTooltip;
