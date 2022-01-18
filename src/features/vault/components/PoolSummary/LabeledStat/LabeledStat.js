import React, { forwardRef, memo } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ValueLoader from '../../../../common/components/ValueLoader/ValueLoader';
import styles from './styles';

const useStyles = makeStyles(styles);

const LabeledStat = forwardRef(({ value, isLoading = false, subvalue, ...passthrough }, ref) => {
  const classes = useStyles();

  return (
    <div {...passthrough} ref={ref}>
      <Typography className={classes.stat} variant="body2" gutterBottom>
        {subvalue && !isLoading ? <span className={classes.substat}>{subvalue}</span> : ''}
        {isLoading ? <ValueLoader /> : <span>{value}</span>}
      </Typography>
    </div>
  );
});

export default memo(LabeledStat);
