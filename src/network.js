/* eslint-disable import/first */
export const allNetworks = [
  {
    name: 'EMERALD',
    asset: 'EMERALD',
    id: 42262,
    hash: '/emerald',
  },
];

const network = allNetworks.find(n => window.location.hash.startsWith('#' + n.hash));

if (!network) {
  window.location.hash = allNetworks[0].hash;
  window.location.reload();
} else {
  window.REACT_APP_NETWORK_ID = network.id;
}

export default network;
