import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import clsx from 'clsx';
import styles from './styles';

const useStyles = makeStyles(styles);

const FilterSelect = ({ className, label, items, value, onChange }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.container, className)}>
      <Typography variant="caption" color="primary">
        {label}
      </Typography>
      <Grid container spacing={1}>
        {items.map(i => (
          <Grid item>
            <Chip
              key={i.value}
              label={i.name}
              clickable
              size="small"
              color={value === i.value ? 'primary' : 'default'}
              onClick={() => onChange(i.value)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FilterSelect;
