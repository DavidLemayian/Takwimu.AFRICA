/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import ContentSection from './ContentSection';
import Page from './Page';

const useStyles = makeStyles(theme => ({
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
}));

function ErrorPage({ children, ...props }) {
  const classes = useStyles();
  return (
    <Page {...props}>
      <div className={classes.root} {...props}>
        <ContentSection classes={{ root: classes.section }}>
          {children}
        </ContentSection>
      </div>
    </Page>
  );
}

ErrorPage.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default ErrorPage;
