import { primaryColor } from 'assets/jss/material-kit-pro-react.js';

const styles = theme => ({
  sliderDetailContainer: {
    padding: '24px 30px',
    [theme.breakpoints.down('md')]: {
      padding: '12px 12px',
    },
  },
  content: {
    padding: '16px 24px',
    [theme.breakpoints.down('md')]: {
      padding: '8px 16px',
    },
    border: `1px solid ${theme.palette.background.secondary}`,
    borderRadius: 8,
  },
  showDetailLeft: {
    float: 'left',
    marginBottom: '10px',
    fontSize: '1rem',
    lineHeight: '20px',
    color: theme.palette.text.secondary,
    fontWeight: '500',
  },
  showDetailButtonCon: {
    display: 'flex',
    justifyContent: 'space-around',
    '& + &': {
      marginLeft: '5px',
    },
  },
  showDetailButton: {
    marginTop: 12,
    fontSize: '14px',
    fontWeight: 'bold',
    borderRadius: '5px',
    width: '160px',
  },
  showDetailButtonOutlined: {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.primary.main}`,
    color: primaryColor[0],
    '&:hover': {
      '& .MuiButton-label': {
        color: 'white',
      },
    },
    '& .MuiTouchRipple-root span': {
      backgroundColor: primaryColor[0],
    },
  },
  showDetailButtonContained: {
    backgroundColor: primaryColor[0],
    '& .MuiButton-label': {
      color: 'white',
    },
  },
  numericInput: {
    color: primaryColor[0],
  },
  balanceMax: {
    cursor: 'pointer',
    color: theme.palette.text.secondary,
    borderBottom: '1px dashed',
  },
});

export default styles;
