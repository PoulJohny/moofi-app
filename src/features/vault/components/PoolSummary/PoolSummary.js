import React, { useCallback, useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { makeStyles } from '@material-ui/core/styles';
import { formatTvl } from 'features/helpers/format';
import { byDecimals } from 'features/helpers/bignumber';
import styles from './styles';
import PoolPaused from './PoolPaused/PoolPaused';
import PoolTitle from './PoolTitle/PoolTitle';
import LabeledStat from './LabeledStat/LabeledStat';
import ApyStats from './ApyStats/ApyStats';
import { getRetireReason } from './RetireReason/RetireReason';
import clsx from 'clsx';
import { formatDecimals } from 'features/helpers/utils';
import SmallPoolValues from './SmallPoolValues/SmallPoolValues';

const useStyles = makeStyles(styles);

const PoolSummary = ({
  className,
  pool,
  toggleCard,
  balanceSingle,
  sharesBalance,
  apy,
  fetchBalancesDone,
  fetchApysDone,
  fetchVaultsDataDone,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const vaultStateTitle = useMemo(() => {
    let state =
      pool.status === 'eol'
        ? t(getRetireReason(pool.retireReason))
        : pool.depositsPaused
        ? t('Vault-DepositsPausedTitle')
        : null;

    if (pool.experimental) {
      state = t('Vault-Experimental');
    }

    return state === null ? (
      ''
    ) : (
      <PoolPaused message={t(state)} isBoosted={false} isExperimental={!!pool.experimental} />
    );
  }, [pool, t]);

  const balanceUsd =
    balanceSingle > 0 && fetchVaultsDataDone ? formatTvl(balanceSingle, pool.oraclePrice) : '';
  const deposited = byDecimals(
    sharesBalance.multipliedBy(new BigNumber(pool.pricePerFullShare)),
    pool.tokenDecimals
  );
  const depositedUsd =
    deposited > 0 && fetchVaultsDataDone ? formatTvl(deposited, pool.oraclePrice) : '';

  const onSummaryClick = useCallback(
    e => {
      if (!e.target || !e.target.classList.contains('tooltip-toggle')) {
        toggleCard();
      }
    },
    [toggleCard]
  );

  return (
    <Grid
      container
      className={clsx(
        classes.details,
        {
          [classes.detailsRetired]: pool.status === 'eol',
          [classes.detailsPaused]: pool.depositsPaused,
        },
        className
      )}
      onClick={onSummaryClick}
      style={{ paddingTop: '20px' }}
    >
      {vaultStateTitle}
      <Grid item xs={6} md={4} className={`${classes.item} ${classes.itemTitle}`}>
        <PoolTitle
          name={pool.name}
          logo={pool.logo}
          poolId={pool.id}
          description={t('Vault-Description', { vault: pool.tokenDescription })}
          addLiquidityUrl={pool.addLiquidityUrl}
          removeLiquidityUrl={pool.removeLiquidityUrl}
          buyTokenUrl={pool.buyTokenUrl}
          assets={pool.assets}
          platformUrl={pool.platformUrl}
          tags={pool.tags}
        />
      </Grid>
      <Hidden smDown>
        <Grid item md={2} className={`${classes.item} ${classes.itemBalances}`}>
          <LabeledStat
            value={formatDecimals(balanceSingle)}
            subvalue={balanceUsd}
            isLoading={!fetchBalancesDone}
            className={classes.itemInner}
          />
        </Grid>
        <Grid item md={2} className={`${classes.item} ${classes.itemBalances}`}>
          <LabeledStat
            value={formatDecimals(deposited)}
            subvalue={depositedUsd}
            isLoading={!fetchBalancesDone}
            className={classes.itemInner}
          />
        </Grid>
        <ApyStats
          apy={apy}
          isLoading={!fetchApysDone}
          itemClasses={`${classes.item} ${classes.itemStats}`}
          itemInnerClasses={classes.itemInner}
        />
        <Grid item md={2} className={`${classes.item} ${classes.itemStats}`}>
          <LabeledStat
            value={formatTvl(pool.tvl, pool.oraclePrice)}
            isLoading={!fetchVaultsDataDone}
            className={classes.itemInner}
          />
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <Grid item xs={6}>
          <SmallPoolValues
            pool={pool}
            apy={apy}
            balanceSingle={balanceSingle}
            balanceUsd={balanceUsd}
            deposited={deposited}
            depositedUsd={depositedUsd}
            fetchBalancesDone={fetchBalancesDone}
            fetchVaultsDataDone={fetchVaultsDataDone}
            fetchApysDone={fetchApysDone}
          />
        </Grid>
      </Hidden>
    </Grid>
  );
};

export default PoolSummary;
