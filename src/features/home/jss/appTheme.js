import { createTheme } from '@material-ui/core/styles';

const createThemeMode = isNightMode =>
  createTheme({
    palette: {
      type: isNightMode ? 'dark' : 'light',
      background: {
        default: isNightMode ? '#111017' : '#fbf9f6',
        paper: isNightMode ? '#4C4C5E' : '#fff',
        primary: isNightMode ? '#49495E' : '#FBF6F0',
        secondary: isNightMode ? '#2D2C3B' : '#F8F2EC',
        extra: isNightMode ? '#181721' : '#FBF6F0',
        dark: isNightMode ? '#222130' : '#999',
        paused: isNightMode ? '#25244D' : '#FCE57E',
        retired: isNightMode ? '#d32f2f' : '#e57373',
        hover: isNightMode ? '#1D1C29' : '#EFE6DC',
        border: isNightMode ? '#1D1C29' : '#DED9D5',
        overlay: isNightMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)',
      },
      primary: {
        main: isNightMode ? '#fff' : '#000',
      },
      secondary: {
        main: isNightMode ? '#fff' : '#F8F2EC',
      },
      text: {
        primary: isNightMode ? '#fff' : '#000',
        secondary: isNightMode ? '#B0B0DD' : '#00000066',
      },
    },
    overrides: {
      MuiButton: {
        label: {
          color: isNightMode ? '#fff' : '#000',
        },
      },
      // for dropdown menu items
      MuiButtonBase: {
        root: {
          color: isNightMode ? '#fff' : '#000',
        },
      },
      MuiCheckbox: {
        colorPrimary: {
          color: isNightMode ? '#fff' : '#000',
        },
        colorSecondary: {
          color: isNightMode ? '#fff' : '#000',
        },
      },
    },
  });

export default createThemeMode;
