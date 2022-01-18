import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles';
import FeesInfo from './FeesInfo/FeesInfo';
import PlatformInfo from './PlatformInfo/PlatformInfo';

const useStyles = makeStyles(styles);

const PoolInfo = ({ pool }) => {
  const classes = useStyles();
  return (
    <Grid container item xs={12} md={2} alignContent="center" className={classes.container}>
      <PlatformInfo pool={pool} />
      <FeesInfo pool={pool} />
    </Grid>
  );
};

export default PoolInfo;
