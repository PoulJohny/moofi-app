import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PowerIcon from '@material-ui/icons/Power';
import Hidden from '@material-ui/core/Hidden';
import { renderIcon } from '@download/blockies';
import Avatar from '@material-ui/core/Avatar';
import Button from 'components/CustomButtons/Button.js';
import { useConnectWallet, useDisconnectWallet } from '../../features/home/redux/hooks';
import { createWeb3Modal } from '../../features/web3';
import styles from './styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);

export default function AddressButton() {
  const classes = useStyles();
  const { t } = useTranslation();
  const { disconnectWallet } = useDisconnectWallet();
  const [shortAddress, setShortAddress] = React.useState('');
  const [dataUrl, setDataUrl] = React.useState(null);
  const [web3Modal, setModal] = React.useState(null);
  const { connectWallet, web3, address, connected } = useConnectWallet();
  const canvasRef = React.useRef(null);

  const connectWalletCallback = React.useCallback(() => {
    connectWallet(web3Modal);
  }, [web3Modal, connectWallet]);

  const disconnectWalletCallback = React.useCallback(() => {
    disconnectWallet(web3, web3Modal);
  }, [web3, web3Modal, disconnectWallet]);

  React.useEffect(() => {
    setModal(createWeb3Modal(t));
  }, [setModal, t]);

  React.useEffect(() => {
    if (web3Modal && (web3Modal.cachedProvider || window.ethereum)) {
      connectWallet(web3Modal);
    }
  }, [web3Modal, connectWallet]);

  React.useEffect(() => {
    if (!connected) {
      return;
    }

    const canvas = canvasRef.current;
    renderIcon({ seed: address.toLowerCase() }, canvas);
    const updatedDataUrl = canvas.toDataURL();
    if (updatedDataUrl !== dataUrl) {
      setDataUrl(updatedDataUrl);
    }
    if (address.length < 11) {
      setShortAddress(address);
    } else {
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [dataUrl, address, connected]);

  return (
    <>
      <Button
        disableElevation
        className={classes.walletDisplay}
        onClick={connected ? disconnectWalletCallback : connectWalletCallback}
      >
        {connected ? (
          <>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <Avatar
              alt="address"
              src={dataUrl}
              style={{
                width: '24px',
                height: '24px',
                marginRight: '4px',
              }}
            />
            <Hidden xsDown>{shortAddress}</Hidden>
          </>
        ) : (
          <>
            <PowerIcon />
            <Hidden xsDown>{t('Wallet-Connect')}</Hidden>
          </>
        )}
      </Button>
    </>
  );
}
