/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { PropTypes } from 'prop-types';

import classNames from 'classnames';

import { ButtonBase, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ breakpoints, theme }) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    height: '14.875rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    // Ensure padding in case of long text
    paddingRight: '1rem',
    paddingLeft: '1rem',

    // Inheritable by `A` component
    textDecoration: 'none'
  },
  cardDual: {
    width: '100%',
    [breakpoints.up('md')]: {
      width: '21.09375rem' // .75 of lg
    },
    [breakpoints.up('lg')]: {
      width: '28.125rem'
    }
  },
  cardTriple: {
    width: '100%',
    [breakpoints.up('md')]: {
      width: '18.375rem' // .75 of lg
    },
    [breakpoints.up('lg')]: {
      width: '24.5rem'
    }
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    marginTop: '5.25rem',
    marginBottom: '5.25rem'
  }
}));

function Card({ children, variant, ...props }) {
  const classes = useStyles();
  const variantClass =
    variant === 'triple' ? classes.cardTriple : classes.cardDual;
  return (
    <ButtonBase
      className={classNames(classes.root, variantClass)}
      color="primary"
      {...props}
    >
      <Typography
        variant="subtitle1"
        className={classes.title}
        underline="none"
      >
        {children}
      </Typography>
    </ButtonBase>
  );
}

Card.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  component: PropTypes.elementType,
  href: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['dual', 'triple'])
};

Card.defaultProps = {
  children: '',
  component: 'button',
  href: null,
  onClick: null,
  variant: 'triple'
};
export default Card;
