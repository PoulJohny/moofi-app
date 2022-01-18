import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import BigNumber from 'bignumber.js';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import FormControl from '@material-ui/core/FormControl';

import Button from 'components/CustomButtons/Button.js';
import CustomOutlinedInput from 'components/CustomOutlinedInput/CustomOutlinedInput';
import CustomSlider from 'components/CustomSlider/CustomSlider';
import RefundButtons from '../RefundButtons/RefundButtons';
import { byDecimals, convertAmountToRawNumber } from 'features/helpers/bignumber';
import { useFetchWithdraw, useFetchBalances, useFetchApproval } from 'features/vault/redux/hooks';
import { useConnectWallet } from 'features/home/redux/hooks';
import styles from './styles';

const useStyles = makeStyles(styles);

const WithdrawSection = ({ pool, index, sharesBalance }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { web3, address } = useConnectWallet();
  const { enqueueSnackbar } = useSnackbar();
  const { fetchApproval, fetchApprovalPending } = useFetchApproval();
  const { fetchWithdraw, fetchWithdrawBnb, fetchWithdrawPending } = useFetchWithdraw();
  const { tokens, fetchBalances } = useFetchBalances();

  const sharesDecimals = pool.tokenDecimals;
  const sharesByDecimals = byDecimals(sharesBalance, sharesDecimals);
  const underliyngBalance = sharesByDecimals
    .multipliedBy(pool.pricePerFullShare)
    .decimalPlaces(pool.tokenDecimals, BigNumber.ROUND_DOWN);

  const [withdrawSettings, setWithdrawSettings] = useState({
    isZap: false,
    isSwap: false,
    swapInput: undefined,
    swapOutput: undefined,
    outputIndex: 0,
    amount: new BigNumber(0),
    slider: 0,
    input: '0.0',
    vaultAddress: pool.earnContractAddress,
    withdrawAddress: pool.earnContractAddress,
    isNeedApproval: false,
    slippageTolerance: 0.01,
    swapAmountOut: pool.zapWithdrawEstimate?.swapAmountOut,
  });

  const handleSliderChange = (_, sliderInt) => {
    setWithdrawSettings(prevState => ({
      ...prevState,
      slider: sliderInt,
    }));
  };

  const handleSliderChangeCommitted = (_, sliderInt) => {
    let amount = new BigNumber(0);
    let input = new BigNumber(0);
    if (sliderInt > 0 && sliderInt < 99) {
      amount = underliyngBalance
        .times(sliderInt)
        .div(100)
        .decimalPlaces(pool.tokenDecimals, BigNumber.ROUND_DOWN);
      input = amount.decimalPlaces(8, BigNumber.ROUND_DOWN).toFormat();
    }
    if (sliderInt >= 99) {
      amount = underliyngBalance;
      sliderInt = 100;
      input = amount.toFormat();
    }

    setWithdrawSettings(prevState => ({
      ...prevState,
      amount: amount,
      slider: sliderInt,
      input: input,
    }));
  };

  const handleMax = _ => {
    handleSliderChangeCommitted(_, 100);
  };

  const handleInputAmountChange = event => {
    const input = event.target.value.replace(/[,]+/, '').replace(/[^0-9.]+/, '');
    let amount = new BigNumber(input);

    if (amount.isNaN()) amount = new BigNumber(0);
    if (amount.isGreaterThan(underliyngBalance)) amount = underliyngBalance;

    const sliderInt = underliyngBalance.isZero()
      ? 0
      : amount.times(100).dividedToIntegerBy(underliyngBalance).toNumber();

    setWithdrawSettings(prevState => ({
      ...prevState,
      amount: amount,
      slider: sliderInt,
      input: amount.isEqualTo(input) ? input : amount.toFormat(),
    }));
  };

  const tokenAllowance = tokens[pool.earnedToken].allowance[withdrawSettings.withdrawAddress];
  useEffect(() => {
    setWithdrawSettings(prevState => ({
      ...prevState,
      isNeedApproval: false,
    }));
  }, [tokenAllowance]);

  const handleApproval = () => {
    fetchApproval({
      address,
      web3,
      tokenAddress: pool.earnedTokenAddress,
      contractAddress: pool.zap.zapAddress,
      tokenSymbol: pool.earnedToken,
    })
      .then(() => enqueueSnackbar(t('Vault-ApprovalSuccess'), { variant: 'success' }))
      .catch(error => enqueueSnackbar(t('Vault-ApprovalError', { error }), { variant: 'error' }));
  };

  const handleWithdraw = () => {
    const sharesAmount = withdrawSettings.amount
      .dividedBy(pool.pricePerFullShare)
      .decimalPlaces(sharesDecimals, BigNumber.ROUND_UP);
    if (sharesAmount.times(100).dividedBy(sharesByDecimals).isGreaterThan(99)) {
      return handleWithdrawAll();
    }
    withdraw(convertAmountToRawNumber(sharesAmount, sharesDecimals));
  };

  const handleWithdrawAll = () => {
    const isAll = true;
    setWithdrawSettings(prevState => ({
      ...prevState,
      amount: underliyngBalance,
      input: underliyngBalance.toFormat(),
      slider: 100,
    }));
    withdraw(convertAmountToRawNumber(sharesByDecimals, sharesDecimals), isAll);
  };

  const withdraw = (sharesAmount, isAll = false) => {
    const vaultWithdrawArgs = {
      address,
      web3,
      isAll,
      amount: sharesAmount,
      contractAddress: pool.earnContractAddress,
      index,
    };
    if (pool.tokenAddress) {
      fetchWithdraw(vaultWithdrawArgs)
        .then(() => {
          enqueueSnackbar(t('Vault-WithdrawSuccess'), { variant: 'success' });
          fetchBalances({ address, web3, tokens });
        })
        .catch(error => enqueueSnackbar(t('Vault-WithdrawError', { error }), { variant: 'error' }));
    } else {
      fetchWithdrawBnb(vaultWithdrawArgs)
        .then(() => {
          enqueueSnackbar(t('Vault-WithdrawSuccess'), { variant: 'success' });
          fetchBalances({ address, web3, tokens });
        })
        .catch(error => enqueueSnackbar(t('Vault-WithdrawError', { error }), { variant: 'error' }));
    }
  };

  return (
    <Grid item xs={12} md={5} className={classes.sliderDetailContainer}>
      <div className={classes.content}>
        <div className={classes.showDetailLeft}>
          {t('Vault-Deposited')}:{' '}
          <a onClick={handleMax} className={classes.balanceMax}>
            {byDecimals(
              sharesBalance.multipliedBy(new BigNumber(pool.pricePerFullShare)),
              pool.tokenDecimals
            ).toFormat(8)}{' '}
            {pool.name}
          </a>
        </div>
        <FormControl fullWidth variant="outlined">
          <CustomOutlinedInput
            fullWidth
            value={withdrawSettings.input}
            onChange={handleInputAmountChange}
          />
        </FormControl>
        <CustomSlider
          aria-labelledby="continuous-slider"
          value={withdrawSettings.slider}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderChangeCommitted}
        />
        <div className={classes.showDetailButtonCon}>
          {pool.refund === true ? (
            <RefundButtons
              tokenAddress={pool.earnedTokenAddress}
              refundAddress={pool.refundContractAddress}
              index={index}
            />
          ) : (
            <>
              {withdrawSettings.isNeedApproval ? (
                <div className={classes.showDetailButtonCon}>
                  <Button
                    className={`${classes.showDetailButton} ${classes.showDetailButtonContained}`}
                    onClick={handleApproval}
                    disabled={fetchApprovalPending[pool.earnedToken]}
                  >
                    {fetchApprovalPending[pool.earnedToken]
                      ? `${t('Vault-Approving')}`
                      : `${t('Vault-ApproveButton')}`}
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    className={`${classes.showDetailButton} ${classes.showDetailButtonOutlined}`}
                    type="button"
                    color="primary"
                    disabled={withdrawSettings.amount.isZero()}
                    onClick={handleWithdraw}
                  >
                    {fetchWithdrawPending[index]
                      ? `${t('Vault-Withdrawing')}`
                      : `${t('Vault-WithdrawButton')}`}
                  </Button>
                  {!withdrawSettings.isSwap && (
                    <Button
                      className={`${classes.showDetailButton} ${classes.showDetailButtonOutlined}`}
                      type="button"
                      color="primary"
                      disabled={sharesBalance.isZero()}
                      onClick={handleWithdrawAll}
                    >
                      {fetchWithdrawPending[index]
                        ? `${t('Vault-Withdrawing')}`
                        : `${t('Vault-WithdrawButtonAll')}`}
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Grid>
  );
};

export default WithdrawSection;
