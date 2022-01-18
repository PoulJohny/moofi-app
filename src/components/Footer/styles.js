const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    height: 44,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: theme.palette.text.primary,
    fontWeight: 900,
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
  },
  link: {
    margin: '0.5rem 0',
    fontWeight: 400,
    fontSize: '1.2rem',
    color: theme.palette.text.primary,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  linkIcon: {
    marginRight: '0.5rem',
    minWidth: '24px',
  },
  textLink: {
    fontSize: '1.2rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
});

export default styles;
