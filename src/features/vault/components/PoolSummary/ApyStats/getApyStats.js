import { formatApy } from 'features/helpers/format';

const yearlyToDaily = apy => {
  const g = Math.pow(10, Math.log10(apy + 1) / 365) - 1;

  if (isNaN(g)) {
    return 0;
  }

  return g;
};

export const getApyStats = apy => {
  const values = {};
  let needsApyTooltip = false;
  let needsDailyTooltip = false;

  values.totalApy = apy.totalApy;

  if ('vaultApr' in apy && apy.vaultApr) {
    needsApyTooltip = true;
    values.vaultApr = apy.vaultApr;
    values.vaultDaily = apy.vaultApr / 365;
  }

  if ('tradingApr' in apy && apy.tradingApr) {
    needsApyTooltip = true;
    needsDailyTooltip = true;
    values.tradingApr = apy.tradingApr;
    values.tradingDaily = apy.tradingApr / 365;
  }

  if ('vaultAprDaily' in values || 'tradingAprDaily' in values) {
    values.totalDaily = (values.vaultDaily || 0) + (values.tradingDaily || 0);
  } else {
    values.totalDaily = yearlyToDaily(values.totalApy);
  }

  const formatted = Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      const formattedValue = key.toLowerCase().includes('daily')
        ? formatApy(value, 4)
        : formatApy(value);
      return [key, formattedValue];
    })
  );

  return { values, formatted, needsApyTooltip, needsDailyTooltip };
};

export default getApyStats;
