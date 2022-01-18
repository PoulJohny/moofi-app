import { container } from 'assets/jss/material-kit-pro-react.js';

const appStyle = theme => ({
  '@global': {
    'html,body': {
      backgroundColor: theme.palette.background.default,
    },
  },
  page: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    ...container,
    zIndex: 1,
    flex: 1,
  },
  children: {
    minHeight: '77vh',
  },
});

export default appStyle;
