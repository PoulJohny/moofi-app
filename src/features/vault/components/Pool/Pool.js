import React, { memo, useCallback, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import BigNumber from 'bignumber.js';

import { byDecimals } from 'features/helpers/bignumber';
import PoolSummary from '../PoolSummary/PoolSummary';
import styles from './styles';
import PoolActions from '../PoolActions/PoolActions';
import { Collapse } from '@material-ui/core';

const useStyles = makeStyles(styles);

const Pool = ({
  pool,
  index,
  tokens,
  apy,
  fetchBalancesDone,
  fetchApysDone,
  fetchVaultsDataDone,
}) => {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);
  const toggleCard = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const balanceSingle = byDecimals(tokens[pool.token].tokenBalance, pool.tokenDecimals);
  const sharesBalance = new BigNumber(tokens[pool.earnedToken].tokenBalance);

  return (
    <div key={index} className={classes.container}>
      <Divider />
      <PoolSummary
        className={isOpen ? classes.contentOpened : ''}
        pool={pool}
        balanceSingle={balanceSingle}
        toggleCard={toggleCard}
        sharesBalance={sharesBalance}
        apy={apy}
        fetchBalancesDone={fetchBalancesDone}
        fetchApysDone={fetchApysDone}
        fetchVaultsDataDone={fetchVaultsDataDone}
      />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <PoolActions pool={pool} balanceSingle={balanceSingle} sharesBalance={sharesBalance} />
      </Collapse>
    </div>
  );
};

export default memo(Pool);
