import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

const FeesInfo = ({ pool }) => {
  const { t } = useTranslation();
  return (
    <Grid container item xs={6} md={12}>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary" style={{ marginBottom: 4 }}>
          {t('Pool-Fees')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" color="primary">
          {t('Pool-PlatformFee', { platformFee: pool.platformFee })}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" color={pool.depositFee > 0 ? 'error' : 'primary'}>
          {t('Pool-DepositFee', { depositFee: pool.depositFee })}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" color="primary">
          {t('Pool-WithdrawalFee', { withdrawalFee: pool.withdrawalFee })}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="caption" color="primary">
          {t('Pool-FeeCaption')}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default FeesInfo;
