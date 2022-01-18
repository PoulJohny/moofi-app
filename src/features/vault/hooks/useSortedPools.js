import { useState, useEffect } from 'react';
import useFilterStorage from '../../home/hooks/useFiltersStorage';

const DEFAULT = 'tvl';
const KEY = 'sortedPools';

const useSortedPools = (pools, apys, tokens) => {
  const { getStorage, setStorage } = useFilterStorage();
  const data = getStorage(KEY);

  const [order, setOrder] = useState(data && data !== 'default' ? data : DEFAULT);

  useEffect(() => {
    setStorage(KEY, order);
  }, [setStorage, order]);

  let sortedPools = pools;
  switch (order) {
    case 'apy':
      sortedPools = handleApy(pools, apys, true);
      break;
    case '-apy':
      sortedPools = handleApy(pools, apys, false);
      break;
    case 'tvl':
      sortedPools = handleTvl(pools, true);
      break;
    case '-tvl':
      sortedPools = handleTvl(pools, false);
      break;
    case 'name':
      sortedPools = handleNames(pools, true);
      break;
    case '-name':
      sortedPools = handleNames(pools, false);
      break;
    default:
      break;
  }

  sortedPools = showDecommissionedFirst(sortedPools, tokens);

  return { sortedPools, order, setOrder };
};

const handleApy = (pools, apys, asc) => {
  const newPools = [...pools];
  return newPools.sort((a, b) => {
    if (apys[a.id] === apys[b.id]) {
      return 0;
    } else if (apys[a.id] === undefined) {
      return asc ? 1 : -1;
    } else if (apys[b.id] === undefined) {
      return asc ? -1 : 1;
    }

    if (asc) {
      return apys[b.id].totalApy - apys[a.id].totalApy;
    } else {
      return apys[a.id].totalApy - apys[b.id].totalApy;
    }
  });
};

const handleTvl = (pools, asc) => {
  const newPools = [...pools];
  return newPools.sort((a, b) => {
    const aPrice = a.oraclePrice;
    const bPrice = b.oraclePrice;
    if (asc) {
      return b.tvl * bPrice - a.tvl * aPrice;
    } else {
      return a.tvl * aPrice - b.tvl * bPrice;
    }
  });
};

const handleNames = (pools, asc) => {
  const newPools = [...pools];
  return newPools.sort((a, b) => {
    const res = ('' + a.name).localeCompare(b.name);
    return asc ? res : -res;
  });
};

function showDecommissionedFirst(pools, tokens) {
  for (let i = 0; i < pools.length; i++) {
    // if ( EOL or REFUND ) AND (Deposited Balance > 0)
    if (
      (pools[i].status === 'eol' || pools[i].status === 'refund') &&
      tokens[pools[i].earnedToken] &&
      tokens[pools[i].earnedToken].tokenBalance > 0
    ) {
      // Remove Vault from pools, insert it at the top.
      pools.splice(0, 0, pools.splice(i, 1)[0]);
    }
  }
  return pools;
}

export default useSortedPools;
