const styles = theme => ({
  details: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.background.secondary,
    },
  },
  detailsPaused: {
    background: theme.palette.background.paused,
  },
  detailsRetired: {
    background: theme.palette.background.retired,
  },
  mobilePadding: {
    paddingTop: '20px',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 0,
    },
  },
  item: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInner: {
    textAlign: 'center',
  },
});

export default styles;
