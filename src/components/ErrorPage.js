import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import ContentSection from './ContentSection';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: '4.1875rem',
    marginBottom: '4.375rem',
    display: 'flex',
    justifyContent: 'center'
  },
  section: {
    margin: 0,
    padding: '2.3125rem 0 1rem',
    borderTop: `4px solid ${theme.palette.primary.main}`
  }
});

function ErrorPage({ children, classes, ...props }) {
  return (
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    <div className={classes.root} {...props}>
      <ContentSection classes={{ root: classes.section }}>
        {children}
      </ContentSection>
    </div>
  );
}

ErrorPage.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(ErrorPage);
