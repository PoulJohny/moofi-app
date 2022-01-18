import React, { memo } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import styles from './styles';
import getApyStats from './getApyStats';
import { useTranslation } from 'react-i18next';
import LabeledStatWithTooltip from '../LabeledStatWithTooltip/LabeledStatWithTooltip';

const useStyles = makeStyles(styles);

const BreakdownTooltip = memo(({ rows }) => {
  const classes = useStyles();

  return (
    <table>
      <tbody>
        {rows.map(row => (
          <tr key={row.label}>
            <th className={classes.label}>{row.label}</th>
            <td className={classes.value}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

const YearlyBreakdownTooltip = memo(({ rates }) => {
  const rows = [];
  const { t } = useTranslation();

  if ('vaultApr' in rates) {
    rows.push({
      label: t('Vault-Breakdown-VaultApr'),
      value: rates.vaultApr,
    });
  }

  if ('tradingApr' in rates) {
    rows.push({
      label: t('Vault-Breakdown-TradingApr'),
      value: rates.tradingApr,
    });
  }

  if ('boostApr' in rates) {
    rows.push({
      label: t('Vault-Breakdown-BoostApr'),
      value: rates.boostApr,
    });
  }

  return <BreakdownTooltip rows={rows} />;
});

const DailyBreakdownTooltip = memo(({ rates }) => {
  const rows = [];
  const { t } = useTranslation();

  if ('vaultDaily' in rates) {
    rows.push({
      label: t('Vault-Breakdown-VaultDaily'),
      value: rates.vaultDaily,
    });
  }

  if ('tradingDaily' in rates) {
    rows.push({
      label: t('Vault-Breakdown-TradingDaily'),
      value: rates.tradingDaily,
    });
  }

  if ('boostDaily' in rates) {
    rows.push({
      label: t('Vault-Breakdown-BoostDaily'),
      value: rates.boostDaily,
    });
  }

  return <BreakdownTooltip rows={rows} />;
});

const ApyStats = ({ apy, isLoading = false, itemClasses, itemInnerClasses }) => {
  const { formatted, needsApyTooltip, needsDailyTooltip } = getApyStats(apy);

  const showApyTooltip = !isLoading && needsApyTooltip;
  const showDailyTooltip = !isLoading && needsDailyTooltip;

  return (
    <>
      <Grid item md={1} className={itemClasses}>
        <LabeledStatWithTooltip
          value={
            <Box display="flex" alignItems="center">
              {formatted.totalApy}
              &nbsp;
              {showApyTooltip && <InfoIcon color="primary" fontSize="small" />}
            </Box>
          }
          tooltip={showApyTooltip ? <YearlyBreakdownTooltip rates={formatted} /> : null}
          boosted={''}
          isLoading={isLoading}
          className={`tooltip-toggle ${itemInnerClasses}`}
        />
      </Grid>
      <Grid item md={1} className={itemClasses}>
        <LabeledStatWithTooltip
          value={
            <Box display="flex" alignItems="center">
              {formatted.totalDaily}
              &nbsp;
              {showDailyTooltip && <InfoIcon color="primary" fontSize="small" />}
            </Box>
          }
          tooltip={showDailyTooltip ? <DailyBreakdownTooltip rates={formatted} /> : null}
          boosted={''}
          isLoading={isLoading}
          className={`tooltip-toggle ${itemInnerClasses}`}
        />
      </Grid>
    </>
  );
};

export default memo(ApyStats);
