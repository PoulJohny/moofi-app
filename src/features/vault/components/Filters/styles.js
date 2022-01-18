const styles = theme => ({
  container: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    width: '100%',
    paddingBottom: 8,
  },
  checkboxesContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      top: 0,
      right: 0,
    },
  },
});

export default styles;
