import React, { memo } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { getSingleAssetSrc } from '../../../../helpers/getSingleAssetSrc';

import styles from './styles';

const useStyles = makeStyles(styles);

const PoolTitle = ({ name, logo, poolId, description, assets, platformUrl, tags }) => {
  const classes = useStyles();

  let avatar;
  if (logo) {
    avatar = (
      <Avatar
        alt={logo}
        variant="square"
        className={classes.icon}
        imgProps={{ style: { objectFit: 'contain' } }}
        src={require(`images/${logo}`)}
      />
    );
  } else if (assets.length === 1) {
    avatar = (
      <Avatar
        alt={assets[0]}
        variant="square"
        className={classes.icon}
        imgProps={{ style: { objectFit: 'contain' } }}
        src={getSingleAssetSrc(assets[0]).default}
      />
    );
  } else {
    avatar = (
      <AvatarGroup className={`${classes.icon} MuiAvatar-root MuiAvatar-square`} spacing="small">
        <Avatar
          alt={assets[0]}
          variant="square"
          imgProps={{ style: { objectFit: 'contain' } }}
          src={getSingleAssetSrc(assets[0]).default}
        />
        <Avatar
          alt={assets[1]}
          variant="square"
          imgProps={{ style: { objectFit: 'contain' } }}
          src={getSingleAssetSrc(assets[1]).default}
        />
      </AvatarGroup>
    );
  }

  return (
    <Grid className={classes.container} container wrap="nowrap" alignItems="center">
      {avatar}
      <div className={classes.texts}>
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <Grid item>
            <Typography variant="h6" color="primary">
              {name}
            </Typography>
          </Grid>
          {tags?.map(t => (
            <Grid item>
              <Chip label={t} color="secondary" variant="outlined" size="small" />
            </Grid>
          ))}
        </Grid>
        <Link href={platformUrl} className={classes.link} target="_blank">
          <Typography variant="body2" color="primary">
            {description}
          </Typography>
          <OpenInNewIcon fontSize="small" className={classes.linkIcon} />
        </Link>
      </div>
    </Grid>
  );
};

export default memo(PoolTitle);
