import React, { useState, useEffect, useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import { useSnackbar } from 'notistack';
import CustomOutlinedInput from 'components/CustomOutlinedInput/CustomOutlinedInput';
import CustomSlider from 'components/CustomSlider/CustomSlider';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchBalances, useFetchDeposit, useFetchApproval } from 'features/vault/redux/hooks';
import { convertAmountToRawNumber } from 'features/helpers/bignumber';
import DepositWarningDialog from '../DepositWarningDialog/DepositWarningDialog';
import Button from 'components/CustomButtons/Button.js';
import styles from './styles';

const useStyles = makeStyles(styles);

const DepositSection = ({ pool }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { web3, address } = useConnectWallet();
  const { enqueueSnackbar } = useSnackbar();
  const { fetchApproval, fetchApprovalPending } = useFetchApproval();
  const { fetchDeposit, fetchDepositBnb, fetchDepositPending } = useFetchDeposit();
  const { tokens, tokenBalance, fetchBalances } = useFetchBalances();
  const [showDepositFeeWarningDialog, setShowDepositFeeWarningDialog] = React.useState(null);

  const { eligibleTokens } = useMemo(() => {
    return {
      eligibleTokens: [
        {
          name: pool.name,
          symbol: pool.token,
          address: pool.tokenAddress,
          decimals: pool.tokenDecimals,
          logoURI: pool.logo,
        },
      ],
    };
  }, [pool.tokenAddress, pool.name, pool.token, pool.tokenDecimals, pool.logo]);

  const [depositSettings, setDepositSettings] = useState({
    tokenIndex: 0,
    isZap: false,
    token: eligibleTokens[0],
    amount: new BigNumber(0),
    slider: 0,
    input: '0.0',
    vaultAddress: pool.earnContractAddress,
    depositAddress: pool.earnContractAddress,
    isNeedApproval: new BigNumber(
      tokens[eligibleTokens[0].symbol].allowance[pool.earnContractAddress]
    ).isZero(),
    slippageTolerance: 0.01,
    swapAmountOut: pool.zapEstimate?.swapAmountOut,
  });

  const depositTokenAllowance =
    tokens[depositSettings.token.symbol].allowance[depositSettings.depositAddress];
  useEffect(() => {
    const allowance = new BigNumber(depositTokenAllowance);
    setDepositSettings(prevState => ({
      ...prevState,
      isNeedApproval: allowance.isZero() || prevState.amount.isGreaterThan(allowance),
    }));
  }, [depositTokenAllowance]);

  const handleSliderChange = (_, sliderInt) => {
    setDepositSettings(prevState => ({
      ...prevState,
      slider: sliderInt,
    }));
  };

  const handleSliderChangeCommitted = (_, sliderInt) => {
    const total = tokenBalance(depositSettings.token.symbol);
    let amount = new BigNumber(0);
    if (sliderInt > 0 && sliderInt < 100) {
      amount = total.times(sliderInt).div(100).decimalPlaces(8);
    }
    if (sliderInt === 100) {
      amount = total;
    }
    const allowance = new BigNumber(
      tokens[depositSettings.token.symbol].allowance[depositSettings.depositAddress]
    );

    setDepositSettings(prevState => ({
      ...prevState,
      amount: amount,
      slider: sliderInt,
      input: amount.toFormat(),
      isNeedApproval: allowance.isZero(),
    }));
  };

  const handleMax = _ => {
    handleSliderChangeCommitted(_, 100);
  };

  const handleInputAmountChange = event => {
    const input = event.target.value.replace(/[,]+/, '').replace(/[^0-9.]+/, '');
    let amount = new BigNumber(input);
    const total = tokenBalance(depositSettings.token.symbol);
    if (amount.isNaN()) amount = new BigNumber(0);

    amount = amount.decimalPlaces(depositSettings.token.decimals);
    if (amount.isGreaterThan(total)) amount = total;

    const sliderInt = total.isZero() ? 0 : amount.times(100).dividedToIntegerBy(total).toNumber();
    const allowance = new BigNumber(
      tokens[depositSettings.token.symbol].allowance[depositSettings.depositAddress]
    );

    setDepositSettings(prevState => ({
      ...prevState,
      amount: amount,
      slider: sliderInt,
      input: amount.isEqualTo(input) ? input : amount.toFormat(),
      isNeedApproval: allowance.isZero(),
    }));
  };

  const handleApproval = () => {
    fetchApproval({
      address,
      web3,
      tokenAddress: depositSettings.token.address,
      contractAddress: depositSettings.depositAddress,
      tokenSymbol: depositSettings.token.symbol,
    })
      .then(() => enqueueSnackbar(t('Vault-ApprovalSuccess'), { variant: 'success' }))
      .catch(error => enqueueSnackbar(t('Vault-ApprovalError', { error }), { variant: 'error' }));
  };

  const handleDepositAll = () => {
    const newDepositSettings = {
      ...depositSettings,
      amount: tokenBalance(depositSettings.token.symbol),
      slider: 100,
      input: tokenBalance(depositSettings.token.symbol).toFormat(),
    };
    setDepositSettings(newDepositSettings);
    const depositValue = {
      ...newDepositSettings,
      isAll: true,
    };
    if (pool.depositFee > 0) {
      setShowDepositFeeWarningDialog(depositValue);
    } else {
      depositAssets(depositValue);
    }
  };

  const handleDepositAmount = () => {
    if (pool.depositFee > 0) {
      setShowDepositFeeWarningDialog(depositSettings);
    } else {
      depositAssets(depositSettings);
    }
  };

  const depositAssets = deposit => {
    if (pool.depositsPaused) {
      console.error('Deposits paused!');
      return;
    }

    // Vault deposit
    const depositArgs = {
      address,
      web3,
      isAll: !!deposit.isAll,
      amount: convertAmountToRawNumber(deposit.amount, deposit.token.decimals),
      contractAddress: deposit.vaultAddress,
    };
    if (pool.tokenAddress) {
      fetchDeposit(depositArgs)
        .then(() => {
          enqueueSnackbar(t('Vault-DepositSuccess'), { variant: 'success' });
          fetchBalances({ address, web3, tokens });
        })
        .catch(error => enqueueSnackbar(t('Vault-DepositError', { error }), { variant: 'error' }));
    } else {
      fetchDepositBnb(depositArgs)
        .then(() => {
          enqueueSnackbar(t('Vault-DepositSuccess'), { variant: 'success' });
          fetchBalances({ address, web3, tokens });
        })
        .catch(error => enqueueSnackbar(t('Vault-DepositError', { error }), { variant: 'error' }));
    }
  };

  const getVaultState = (status, paused) => {
    let display = false;
    let cont = null;

    if (status === 'eol') {
      display = true;
      cont = (
        <div className={classes.showDetailButtonCon}>
          <div className={classes.showRetiredMsg}>{t('Vault-DepositsRetiredMsg')}</div>
        </div>
      );
    } else {
      if (paused) {
        display = true;
        cont = (
          <div className={classes.showDetailButtonCon}>
            <div className={classes.showPausedMsg}>{t('Vault-DepositsPausedMsg')}</div>
          </div>
        );
      }
    }

    return { display: display, content: cont };
  };

  const handleDialogCancel = () => setShowDepositFeeWarningDialog(null);
  const handleDialogConfirm = () => {
    if (showDepositFeeWarningDialog) {
      setShowDepositFeeWarningDialog(null);
      depositAssets(showDepositFeeWarningDialog);
    }
  };

  const vaultState = getVaultState(pool.status, pool.depositsPaused);

  return (
    <Grid item xs={12} md={5} className={classes.sliderDetailContainer}>
      <div className={classes.content}>
        <div className={classes.showDetailLeft}>
          {t('Vault-Balance')}:{' '}
          <a onClick={handleMax} className={classes.balanceMax}>
            {tokenBalance(depositSettings.token.symbol)
              .decimalPlaces(8, BigNumber.ROUND_DOWN)
              .toFormat()}{' '}
            {depositSettings.token.name}
          </a>
        </div>
        <FormControl fullWidth variant="outlined" className={classes.numericInput}>
          <CustomOutlinedInput
            value={depositSettings.input}
            onChange={handleInputAmountChange}
            fullWidth
          />
        </FormControl>
        <CustomSlider
          aria-labelledby="continuous-slider"
          value={depositSettings.slider}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderChangeCommitted}
        />
        {vaultState.display === true ? (
          vaultState.content
        ) : (
          <div>
            {depositSettings.isNeedApproval ? (
              <div className={classes.showDetailButtonCon}>
                <Button
                  className={`${classes.showDetailButton} ${classes.showDetailButtonContained}`}
                  onClick={handleApproval}
                  disabled={
                    pool.depositsPaused || fetchApprovalPending[depositSettings.token.symbol]
                  }
                >
                  {fetchApprovalPending[depositSettings.token.symbol]
                    ? `${t('Vault-Approving')}`
                    : `${t('Vault-ApproveButton')}`}
                </Button>
              </div>
            ) : (
              <div className={classes.showDetailButtonCon}>
                <Button
                  className={`${classes.showDetailButton} ${classes.showDetailButtonOutlined}`}
                  color="primary"
                  disabled={
                    pool.depositsPaused ||
                    fetchDepositPending[pool.earnContractAddress] ||
                    depositSettings.amount.isZero() ||
                    tokenBalance(depositSettings.token.symbol).isZero()
                  }
                  onClick={handleDepositAmount}
                >
                  {t('Vault-DepositButton')}
                </Button>
                {Boolean(pool.tokenAddress) && Boolean(!depositSettings.isZap) && (
                  <Button
                    className={`${classes.showDetailButton} ${classes.showDetailButtonContained}`}
                    disabled={
                      pool.depositsPaused ||
                      fetchDepositPending[pool.earnContractAddress] ||
                      tokenBalance(depositSettings.token.symbol).isZero()
                    }
                    onClick={handleDepositAll}
                  >
                    {t('Vault-DepositButtonAll')}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <DepositWarningDialog
        open={!!showDepositFeeWarningDialog}
        depositFee={pool.depositFee}
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />
    </Grid>
  );
};

export default DepositSection;
