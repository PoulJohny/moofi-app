const styles = theme => ({
  container: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  texts: {
    marginLeft: '14px',
  },
  url: {
    color: theme.palette.text.primary,
    fontWeight: 600,
    '&:hover,&:focus': {
      color: theme.palette.text.secondary,
    },
  },
  icon: {
    color: theme.palette.text.primary,
    marginLeft: '4px',
    marginTop: 4,
    'flex-shrink': 0,
    width: '60px',
    height: '40px',
    '& .MuiAvatarGroup-avatar': {
      border: 'none',
      width: '65%',
      height: '65%',
      '&:first-child': {
        position: 'absolute',
        left: 0,
      },
      '&:last-child': {
        position: 'absolute',
        right: 0,
      },
    },
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  linkIcon: {
    marginLeft: 6,
  },
});

export default styles;
