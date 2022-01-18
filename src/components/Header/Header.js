import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import styles from './styles';
import TVLInfo from 'components/TVLInfo/TVLInfo';
import { Divider, Typography } from '@material-ui/core';
import AddressButton from '../AddressButton/AddressButton';
import MoonfiImage from '../../images/moonfi.svg';

const useStyles = makeStyles(styles);

const Header = ({ links, isNightMode, setNightMode }) => {
  const classes = useStyles();

  return (
    <>
      <AppBar className={`${classes.appBar} ${classes.dark}`} position="relative">
        <Toolbar className={classes.container} variant="dense">
          <img src={MoonfiImage} height={44} alt="Moonfi" />
          <Typography variant="body2" color="textSecondary" className={classes.beta}>
            Beta
          </Typography>
          <Box flex={1} />
          <TVLInfo />
          <AddressButton />
        </Toolbar>
      </AppBar>
      <Divider />
    </>
  );
};

export default Header;
