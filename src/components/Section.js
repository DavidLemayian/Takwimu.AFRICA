/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/styles';

import Layout from './Layout';
import { RichTypography } from './core';

const useStyles = makeStyles(({ breakpoints }) => ({
  root: {
    margin: '0 auto'
  },
  title: {
    margin: '1.375rem 0',
    [breakpoints.up('md')]: {
      width: '51.125rem'
    }
  }
}));

function Section({ children, title, variant, ...props }) {
  const classes = useStyles();
  return (
    <Layout classes={{ root: classes.root }} {...props}>
      {title && (
        <RichTypography variant={variant} className={classes.title}>
          {title}
        </RichTypography>
      )}
      {children}
    </Layout>
  );
}

Section.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  title: PropTypes.string,
  variant: PropTypes.string
};

Section.defaultProps = {
  title: null,
  variant: 'h2'
};

export default Section;
