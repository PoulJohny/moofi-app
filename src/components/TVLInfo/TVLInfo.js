import { makeStyles } from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
import { usePoolsTvl, useUserTvl } from 'features/vault/hooks/usePoolsTvl';
import { useFetchBalances, useFetchVaultsData } from 'features/vault/redux/hooks';
import React from 'react';
import styles from './styles';
import { formatGlobalTvl } from '../../features/helpers/format';
import TVLLoader from './TVLLoader';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);

export default function TVLInfo() {
  const classes = useStyles();
  const { t } = useTranslation();

  const { pools, fetchVaultsDataDone } = useFetchVaultsData();
  const { tokens, fetchBalancesDone } = useFetchBalances();

  const { poolsTvl } = usePoolsTvl(pools);
  const { userTvl } = useUserTvl(pools, tokens);

  return (
    <div className={classes.container}>
      <Hidden xsDown>
        <span className={classes.title}>TVL</span>
      </Hidden>
      {fetchVaultsDataDone && poolsTvl > 0 ? (
        <span className={classes.value}>{formatGlobalTvl(poolsTvl)}</span>
      ) : (
        <TVLLoader className={classes.titleLoader} />
      )}

      <Hidden smUp>{'|'}</Hidden>

      <Hidden xsDown>
        <span className={classes.title}>
          <Hidden smDown>{t('Vault-Deposited')}</Hidden>
          <Hidden mdUp>{t('Vault-Deposited-Small')}</Hidden>{' '}
        </span>
      </Hidden>
      {fetchVaultsDataDone && fetchBalancesDone ? (
        <span className={classes.value}>{formatGlobalTvl(userTvl)}</span>
      ) : (
        <TVLLoader className={classes.titleLoader} />
      )}
    </div>
  );
}
