/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';

const styles = () => ({});

function A({ children, href, variant, underline, ...props }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      underline={underline}
      variant={variant}
      {...props}
    >
      {children}
    </Link>
  );
}
A.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  href: PropTypes.string.isRequired,
  underline: PropTypes.oneOf(['none', 'hover', 'always']),
  variant: PropTypes.string
};

A.defaultProps = {
  children: null,
  underline: 'always',
  variant: 'inherit'
};

export default withStyles(styles)(A);
