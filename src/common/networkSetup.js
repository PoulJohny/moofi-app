export const networkSettings = {
  42262: {
    chainId: '0xA516',
    chainName: 'Oasis Emerald',
    nativeCurrency: {
      name: 'Oasis',
      symbol: 'ROSE',
      decimals: 18,
    },
    rpcUrls: ['https://emerald.oasis.dev'],
    blockExplorerUrls: ['https://explorer.emerald.oasis.dev/'],
  },
};

export const networkSetup = chainId => {
  return new Promise((resolve, reject) => {
    const provider = window.ethereum;
    if (provider) {
      if (networkSettings.hasOwnProperty(chainId)) {
        provider
          .request({
            method: 'wallet_addEthereumChain',
            params: [networkSettings[chainId]],
          })
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`No network settings configured for chainId: '${chainId}'`));
      }
    } else {
      reject(new Error(`window.ethereum is '${typeof provider}'`));
    }
  });
};

export const getRpcUrl = () => {
  const settings = networkSettings[window.REACT_APP_NETWORK_ID];
  return settings.rpcUrls[~~(settings.rpcUrls.length * Math.random())];
};
