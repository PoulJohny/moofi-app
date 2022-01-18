import React from 'react';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import SortableItem from '../SortableItem/SortableItem';

const useStyles = makeStyles(styles);

export default function SortableMenu(props) {
  const { order, setOrder } = props;

  const classes = useStyles();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box display="flex" alignItems="center" justifyContent={'flex-end'} height="100%">
      <Typography className={classes.text} variant="h6" color="primary" onClick={handleClick}>
        {t('Header-OrderBy')}
      </Typography>
      <KeyboardArrowDownIcon color="primary" />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <SortableItem
            className={classes.item}
            title={t('Header-APY')}
            value="apy"
            variant="body1"
            allItemClickable
            order={order}
            setOrder={setOrder}
          />
        </MenuItem>
        <MenuItem>
          <SortableItem
            className={classes.item}
            title={t('Header-TVL')}
            value="tvl"
            variant="body1"
            allItemClickable
            order={order}
            setOrder={setOrder}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
}
