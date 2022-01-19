// To run: yarn validate
import { MultiCall } from 'eth-multicall';
import { addressBook } from 'moofi-addressbook';
import Web3 from 'web3';

import { isEmpty } from '../src/features/helpers/utils.js';
import { isValidChecksumAddress, maybeChecksumAddress } from './utils.js';
import { emeraldPools } from '../src/features/configure/vault/emerald_pools.js';
import { vaultABI, strategyABI } from '../src/features/configure/abi.js';
import { getMulticallAddress } from '../src/utils/web3Helpers.js';

const chainPools = {
  emerald: emeraldPools,
};

const chainRpcs = {
  emerald: process.env.MOVR_RPC || 'https://emerald.oasis.dev',
};

const overrides = {};

const validatePools = async () => {
  const addressFields = ['tokenAddress', 'earnedTokenAddress', 'earnContractAddress'];

  const allowedEarnSameToken = new Set(['venus-wbnb']);

  // Outputs alphabetical list of platforms per chain (useful to make sure they are consistently named)
  const outputPlatformSummary = process.argv.includes('--platform-summary');

  let exitCode = 0;

  let updates = {};

  for (let [chain, pools] of Object.entries(chainPools)) {
    console.log(`Validating ${pools.length} pools in ${chain}...`);

    const uniquePoolId = new Set();
    const uniqueEarnedToken = new Set();
    const uniqueEarnedTokenAddress = new Set();
    const uniqueTokenName = new Set();
    const uniqueOracleId = new Set();
    const platformCounts = {};
    let activePools = 0;

    // Populate some extra data.
    const web3 = new Web3(chainRpcs[chain]);
    pools = await populateStrategyAddrs(chain, pools, web3);
    pools = await populateKeepers(chain, pools, web3);
    pools = await populateMofiFeeRecipients(chain, pools, web3);
    pools = await populateOwners(chain, pools, web3);

    pools = override(pools);
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      // Errors, should not proceed with build
      if (uniquePoolId.has(pool.id)) {
        console.error(`Error: ${pool.id} : Pool id duplicated: ${pool.id}`);
        exitCode = 1;
      }

      if (uniqueTokenName.has(pool.token)) {
        console.error(`Error: ${pool.id} : Pool token name duplicated: ${pool.token}`);
        exitCode = 1;
      }

      if (uniqueEarnedToken.has(pool.earnedToken) && !allowedEarnSameToken.has(pool.id)) {
        console.error(`Error: ${pool.id} : Pool earnedToken duplicated: ${pool.earnedToken}`);
        exitCode = 1;
      }

      if (
        uniqueEarnedTokenAddress.has(pool.earnedTokenAddress) &&
        !allowedEarnSameToken.has(pool.id)
      ) {
        console.error(
          `Error: ${pool.id} : Pool earnedTokenAddress duplicated: ${pool.earnedTokenAddress}`
        );
        exitCode = 1;
      }

      if (pool.earnedTokenAddress !== pool.earnContractAddress) {
        console.error(
          `Error: ${pool.id} : Pool earnedTokenAddress not same as earnContractAddress: ${pool.earnedTokenAddress} != ${pool.earnContractAddress}`
        );
        exitCode = 1;
      }

      if (!pool.tokenDescription) {
        console.error(
          `Error: ${pool.id} : Pool tokenDescription missing - required for UI: vault card`
        );
        exitCode = 1;
      }

      if (!pool.platform) {
        console.error(
          `Error: ${pool.id} : Pool platform missing - required for UI: filter (Use 'Other' if necessary)`
        );
        exitCode = 1;
      } else {
        platformCounts[pool.platform] = platformCounts.hasOwnProperty(pool.platform)
          ? platformCounts[pool.platform] + 1
          : 1;
      }

      for (
        let addressFieldIndex = 0;
        addressFieldIndex < addressFields.length;
        addressFieldIndex++
      ) {
        const field = addressFields[addressFieldIndex];
        if (pool.hasOwnProperty(field) && !isValidChecksumAddress(pool[field])) {
          const maybeValid = maybeChecksumAddress(pool[field]);
          console.error(
            `Error: ${pool.id} : ${field} requires checksum - ${
              maybeValid ? `\n\t${field}: '${maybeValid}',` : 'it is invalid'
            }`
          );
          exitCode = 1;
        }
      }

      if (pool.status === 'active') {
        activePools++;
      }

      uniquePoolId.add(pool.id);
      uniqueEarnedToken.add(pool.earnedToken);
      uniqueEarnedTokenAddress.add(pool.earnedTokenAddress);
      uniqueOracleId.add(pool.oracleId);
      uniqueTokenName.add(pool.token);

      const { keeper, vaultOwner, mofiFeeRecipient } = addressBook[chain].platforms.mofi;

      updates = isKeeperCorrect(pool, chain, keeper, updates);
      // updates = isStratOwnerCorrect(pool, chain, strategyOwner, updates);
      updates = isVaultOwnerCorrect(pool, chain, vaultOwner, updates);
      updates = isMofiFeeRecipientCorrect(pool, chain, mofiFeeRecipient, updates);
    }
    if (!isEmpty(updates)) {
      exitCode = 1;
    }

    if (outputPlatformSummary) {
      console.log(
        `Platforms: \n${Object.entries(platformCounts)
          .sort(([platformA], [platformB]) =>
            platformA.localeCompare(platformB, 'en', { sensitivity: 'base' })
          )
          .map(([platform, count]) => `\t${platform} (${count})`)
          .join('\n')}`
      );
    }

    console.log(`Active pools: ${activePools}/${pools.length}\n`);
  }

  // Helpful data structures to correct addresses.
  console.log('Required updates.', JSON.stringify(updates));

  return exitCode;
};

// Validation helpers. These only log for now, could throw error if desired.
const isKeeperCorrect = (pool, chain, chainKeeper, updates) => {
  if (pool.keeper !== undefined && pool.keeper !== chainKeeper) {
    console.log(`Pool ${pool.id} should update keeper. From: ${pool.keeper} To: ${chainKeeper}`);

    if (!('keeper' in updates)) updates['keeper'] = {};
    if (!(chain in updates.keeper)) updates.keeper[chain] = {};

    if (pool.keeper in updates.keeper[chain]) {
      updates.keeper[chain][pool.keeper].push(pool.strategy);
    } else {
      updates.keeper[chain][pool.keeper] = [pool.strategy];
    }
  }

  return updates;
};

const isStratOwnerCorrect = (pool, chain, owner, updates) => {
  if (pool.stratOwner !== undefined && pool.keeper !== undefined && pool.stratOwner !== owner) {
    console.log(`Pool ${pool.id} should update strat owner. From: ${pool.stratOwner} To: ${owner}`);

    if (!('stratOwner' in updates)) updates['stratOwner'] = {};
    if (!(chain in updates.stratOwner)) updates.stratOwner[chain] = {};

    if (pool.stratOwner in updates.stratOwner[chain]) {
      updates.stratOwner[chain][pool.stratOwner].push(pool.strategy);
    } else {
      updates.stratOwner[chain][pool.stratOwner] = [pool.strategy];
    }
  }

  return updates;
};

const isVaultOwnerCorrect = (pool, chain, owner, updates) => {
  if (pool.vaultOwner !== undefined && pool.vaultOwner !== owner) {
    console.log(`Pool ${pool.id} should update vault owner. From: ${pool.vaultOwner} To: ${owner}`);

    if (!('vaultOwner' in updates)) updates['vaultOwner'] = {};
    if (!(chain in updates.vaultOwner)) updates.vaultOwner[chain] = {};

    if (pool.vaultOwner in updates.vaultOwner[chain]) {
      updates.vaultOwner[chain][pool.vaultOwner].push(pool.earnContractAddress);
    } else {
      updates.vaultOwner[chain][pool.vaultOwner] = [pool.earnContractAddress];
    }
  }

  return updates;
};

const isMofiFeeRecipientCorrect = (pool, chain, recipient, updates) => {
  if (
    pool.status === 'active' &&
    pool.mofiFeeRecipient !== undefined &&
    pool.mofiFeeRecipient !== recipient
  ) {
    console.log(
      `Pool ${pool.id} should update mofi fee recipient. From: ${pool.mofiFeeRecipient} To: ${recipient}`
    );

    // TODO enable after updating Harmony mofiFeeRecipient
    if (chain === 'one') return updates;

    if (!('mofiFeeRecipient' in updates)) updates['mofiFeeRecipient'] = {};
    if (!(chain in updates.mofiFeeRecipient)) updates.mofiFeeRecipient[chain] = {};

    if (pool.stratOwner in updates.mofiFeeRecipient[chain]) {
      updates.mofiFeeRecipient[chain][pool.stratOwner].push(pool.strategy);
    } else {
      updates.mofiFeeRecipient[chain][pool.stratOwner] = [pool.strategy];
    }
  }

  return updates;
};

// Helpers to populate required addresses.

const populateStrategyAddrs = async (chain, pools, web3) => {
  const multicall = new MultiCall(web3, getMulticallAddress(chain));

  const calls = pools.map(pool => {
    const vaultContract = new web3.eth.Contract(vaultABI, pool.earnContractAddress);
    return {
      strategy: vaultContract.methods.strategy(),
    };
  });

  const [results] = await multicall.all([calls]);

  return pools.map((pool, i) => {
    return { ...pool, strategy: results[i].strategy };
  });
};

const populateKeepers = async (chain, pools, web3) => {
  const multicall = new MultiCall(web3, getMulticallAddress(chain));

  const calls = pools.map(pool => {
    const stratContract = new web3.eth.Contract(strategyABI, pool.strategy);
    return {
      keeper: stratContract.methods.keeper(),
    };
  });

  const [results] = await multicall.all([calls]);

  return pools.map((pool, i) => {
    return { ...pool, keeper: results[i].keeper };
  });
};

const populateMofiFeeRecipients = async (chain, pools, web3) => {
  const multicall = new MultiCall(web3, getMulticallAddress(chain));

  const calls = pools.map(pool => {
    const stratContract = new web3.eth.Contract(strategyABI, pool.strategy);
    return {
      mofiFeeRecipient: stratContract.methods.mofiFeeRecipient(),
    };
  });

  const [results] = await multicall.all([calls]);

  return pools.map((pool, i) => {
    return { ...pool, mofiFeeRecipient: results[i].mofiFeeRecipient };
  });
};

const populateOwners = async (chain, pools, web3) => {
  const multicall = new MultiCall(web3, getMulticallAddress(chain));

  const vaultCalls = pools.map(pool => {
    const vaultContract = new web3.eth.Contract(vaultABI, pool.earnContractAddress);
    return {
      owner: vaultContract.methods.owner(),
    };
  });

  const stratCalls = pools.map(pool => {
    const stratContract = new web3.eth.Contract(strategyABI, pool.strategy);
    return {
      owner: stratContract.methods.owner(),
    };
  });

  const [vaultResults] = await multicall.all([vaultCalls]);
  const [stratResults] = await multicall.all([stratCalls]);

  return pools.map((pool, i) => {
    return { ...pool, vaultOwner: vaultResults[i].owner, stratOwner: stratResults[i].owner };
  });
};

const override = pools => {
  Object.keys(overrides).forEach(id => {
    const pool = pools.find(p => p.id === id);
    if (pool) {
      const override = overrides[id];
      Object.keys(override).forEach(key => {
        pool[key] = override[key];
      });
    }
  });
  return pools;
};

(async function () {
  const exitCode = await validatePools();
  process.exit(exitCode);
})();
