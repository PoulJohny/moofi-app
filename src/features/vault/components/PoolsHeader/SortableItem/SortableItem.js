import React from 'react';
import Box from '@material-ui/core/Box';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';
import styles from './styles';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(styles);

export default function SortableItem(props) {
  const { className, justifyContent, title, value, order, variant, allItemClickable, setOrder } =
    props;

  const classes = useStyles();

  const cleanOrderValue = order && order.charAt(0) === '-' ? order.slice(1) : order;
  const isDescending = order && order.charAt(0) === '-';
  const isBeingOrdered = cleanOrderValue === value;

  const handleClick = () => {
    if (isBeingOrdered) {
      setOrder(`${isDescending ? '' : '-'}${value}`);
    } else {
      setOrder(value);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent={justifyContent || 'center'}
      onClick={allItemClickable ? handleClick : undefined}
    >
      <Typography className={className} variant={variant || 'h6'} color="primary">
        {title}
      </Typography>
      {value && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          className={classes.icons}
          onClick={allItemClickable ? undefined : handleClick}
        >
          <Box>
            <ArrowDropUpIcon
              fontSize="small"
              color={isBeingOrdered && !isDescending ? 'primary' : 'disabled'}
            />
          </Box>
          <Box marginTop={-2}>
            <ArrowDropDownIcon
              fontSize="small"
              color={isBeingOrdered && isDescending ? 'primary' : 'disabled'}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
