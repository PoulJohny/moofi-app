import { indexBy } from './utils';

import { emeraldPools, emeraldStakePools, nativeCoins } from '../configure';
import { allNetworks } from '../../network';

export const appNetworkId = window.REACT_APP_NETWORK_ID;

const networkTxUrls = {
  42262: hash => `https://explorer.emerald.oasis.dev/tx/${hash}`,
};

const networkFriendlyName = {
  42262: 'Oasis Emerald',
};

const networkBuyUrls = {
  42262: '',
};

export const getNetworkCoin = () => {
  return nativeCoins.find(coin => coin.chainId === appNetworkId);
};

export const getNetworkPools = () => {
  switch (window.REACT_APP_NETWORK_ID) {
    case 42262:
      return emeraldPools;
    default:
      return [];
  }
};

export const getNetworkVaults = (networkId = appNetworkId) => {
  switch (networkId) {
    case 42262:
      return indexBy(emeraldPools, 'id');
    default:
      return {};
  }
};

export const getNetworkLaunchpools = (networkId = appNetworkId) => {
  switch (networkId) {
    case 42262:
      return indexBy(emeraldStakePools, 'id');
    default:
      return {};
  }
};

export const getNetworkStables = () => {
  switch (window.REACT_APP_NETWORK_ID) {
    case 42262:
      return ['USDC', 'USDC.m', 'BUSD', 'USDT', 'USDT.m', 'DAI', 'miMatic'];
    default:
      return [];
  }
};

export const getNetworkMulticall = () => {
  switch (window.REACT_APP_NETWORK_ID) {
    case 42262:
      return '0xD42C1C7e6beaF2b4689d647dc1ED213e862597D4';
    default:
      return '0xD42C1C7e6beaF2b4689d647dc1ED213e862597D4';
  }
};

export const getNetworkConnectors = t => {
  switch (window.REACT_APP_NETWORK_ID) {
    case 42262:
      return {
        network: 'emerald',
        cacheProvider: true,
        providerOptions: {
          injected: {
            display: {
              name: 'Injected',
              description: t('Home-BrowserWallet'),
            },
          },
        },
      };
    default:
      return {};
  }
};

export const getNetworkTxUrl = networkTxUrls[window.REACT_APP_NETWORK_ID];
export const getNetworkFriendlyName = (networkId = window.REACT_APP_NETWORK_ID) =>
  networkFriendlyName[networkId];
export const getNetworkBuyUrl = (networkId = window.REACT_APP_NETWORK_ID) =>
  networkBuyUrls[networkId];
export const getNetworkAppUrl = (networkId = window.REACT_APP_NETWORK_ID) =>
  window.location.protocol +
  '//' +
  window.location.host +
  window.location.pathname +
  '#' +
  allNetworks.find(n => n.id === networkId)?.hash;

export const launchpools = getNetworkLaunchpools();
export const vaults = getNetworkVaults();
