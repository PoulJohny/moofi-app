import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles';

const useStyles = makeStyles(styles);

const PlatformInfo = ({ pool }) => {
  const { t } = useTranslation();

  const classes = useStyles();

  return (
    <Grid container item xs={6} md={12}>
      <Grid item xs={12}>
        <Box display="flex" alignItems="center" marginBottom={1}>
          <Typography variant="h6" color="primary">
            {t('Pool-Platform')}
          </Typography>
          <Box marginLeft={1}>
            <Tooltip
              title={
                <Typography
                  variant="body2"
                  dangerouslySetInnerHTML={{
                    __html: t(pool.additionalInfoText || 'Pool-DefaultInfoText'),
                  }}
                />
              }
              placement="right"
              interactive
              arrow
            >
              <HelpOutlineIcon color="primary" />
            </Tooltip>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} className={classes.content}>
        <Link href={pool.platformUrl} className={classes.link} target="_blank">
          <Typography variant="body2" color="primary">
            {pool.tokenDescription}
          </Typography>
          <OpenInNewIcon fontSize="small" className={classes.linkIcon} />
        </Link>
      </Grid>
      {pool.assets.length > 1 ? (
        <Grid item xs={12} className={classes.content}>
          <Link href={pool.addLiquidityUrl} className={classes.link} target="_blank">
            <Typography variant="body2" color="primary">
              {t('Pool-AddLP', { lpName: pool.name })}
            </Typography>
            <OpenInNewIcon fontSize="small" className={classes.linkIcon} />
          </Link>
        </Grid>
      ) : (
        pool.assets.length === 1 && (
          <Grid item xs={12} className={classes.content}>
            <Link href={pool.buyTokenUrl} className={classes.link} target="_blank">
              <Typography variant="body2" color="primary">
                {t('Pool-BuyToken', { tokenName: pool.name })}
              </Typography>
              <OpenInNewIcon fontSize="small" className={classes.linkIcon} />
            </Link>
          </Grid>
        )
      )}
    </Grid>
  );
};

export default PlatformInfo;
