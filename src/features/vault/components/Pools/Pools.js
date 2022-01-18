import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchBalances, useFetchVaultsData, useFetchApys } from '../../redux/hooks';
import VisiblePools from '../VisiblePools/VisiblePools';
import styles from './styles';

const FETCH_INTERVAL_MS = 15 * 1000;

const useStyles = makeStyles(styles);

export default function Pools() {
  const { web3, address } = useConnectWallet();
  const { pools, fetchVaultsData, fetchVaultsDataPending, fetchVaultsDataDone } =
    useFetchVaultsData();
  const { tokens, fetchBalances, fetchBalancesPending, fetchBalancesDone } = useFetchBalances();
  const { apys, fetchApys, fetchApysDone } = useFetchApys();
  const classes = useStyles();

  useEffect(() => {
    fetchApys();
    const id = setInterval(fetchApys, FETCH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchApys]);

  useEffect(() => {
    const fetch = () => {
      if (address && web3 && !fetchBalancesPending) {
        fetchBalances({ address, web3, tokens });
      }
      if (!fetchVaultsDataPending) {
        fetchVaultsData({ web3, pools });
      }
    };
    fetch();

    const id = setInterval(fetch, FETCH_INTERVAL_MS);
    return () => clearInterval(id);

    // Adding tokens and pools to this dep list, causes an endless loop, DDoSing the api
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, web3, fetchBalances, fetchVaultsData]);

  return (
    <div className={classes.container}>
      <VisiblePools
        pools={pools}
        apys={apys}
        tokens={tokens}
        fetchBalancesDone={fetchBalancesDone}
        fetchApysDone={fetchApysDone}
        fetchVaultsDataDone={fetchVaultsDataDone}
      />
    </div>
  );
}
