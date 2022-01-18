const styles = theme => ({
  walletDisplay: {
    fontSize: 13,
    fontWeight: 'bold',
    backgroundColor: theme.palette.background.secondary,
    '&:hover': {
      backgroundColor: theme.palette.background.border,
    },
  },
});

export default styles;
