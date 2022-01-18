import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import SortableItem from './SortableItem/SortableItem';
import SortableMenu from './SortableMenu/SortableMenu';

const useStyles = makeStyles(styles);

export default function PoolsHeader(props) {
  const { className, order, setOrder } = props;

  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Grid container className={className}>
      <Grid item xs={6} md={4}>
        <SortableItem
          className={classes.text}
          title={t('Header-Vaults')}
          justifyContent="flex-start"
          value="name"
          order={order}
          setOrder={setOrder}
        />
      </Grid>
      <Hidden smDown>
        <Grid item md={2}>
          <SortableItem className={classes.text} title={t('Header-Balance')} />
        </Grid>
        <Grid item md={2}>
          <SortableItem className={classes.text} title={t('Header-Deposited')} />
        </Grid>
        <Grid item md={1}>
          <SortableItem
            className={classes.text}
            title={t('Header-APY')}
            value="apy"
            order={order}
            setOrder={setOrder}
          />
        </Grid>
        <Grid item md={1}>
          <SortableItem className={classes.text} title={t('Header-Daily')} />
        </Grid>
        <Grid item md={2}>
          <SortableItem
            className={classes.text}
            title={t('Header-TVL')}
            value="tvl"
            order={order}
            setOrder={setOrder}
          />
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <Grid item xs={6}>
          <SortableMenu order={order} setOrder={setOrder} />
        </Grid>
      </Hidden>
    </Grid>
  );
}
