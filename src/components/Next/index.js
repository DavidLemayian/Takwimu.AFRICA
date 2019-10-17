import React from 'react';
import { PropTypes } from 'prop-types';
import NextLink from 'next/link';

import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/styles/makeStyles';

import A from '@codeforafrica/hurumap-ui/dist/A';
import Analysis from './Analysis';
import Section from '../Section';
import Card from './Card';

const useStyles = makeStyles(theme => ({
  sectionRoot: {},
  root: {
    flexGrow: 1,
    paddingBottom: '6.25rem'
  },
  link: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 'auto'
    }
  }
}));

export { Analysis };

function WhereToNext({ variant, whereToNext: { title, whereLink }, ...props }) {
  const classes = useStyles(props);
  return (
    <Section title={title} variant="h3" classes={{ root: classes.sectionRoot }}>
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classes.root}
      >
        {whereLink &&
          whereLink.length > 0 &&
          whereLink.map(where => (
            <>
              {where.link.startsWith('/') ? (
                <NextLink href={where.link}>
                  <Card component="a" variant={variant}>
                    {where.title}
                  </Card>
                </NextLink>
              ) : (
                <Card href={where.link} variant={variant} component={A}>
                  {where.title}
                </Card>
              )}
            </>
          ))}
      </Grid>
    </Section>
  );
}

WhereToNext.propTypes = {
  variant: PropTypes.string,
  whereToNext: PropTypes.shape({
    title: PropTypes.string,
    whereLink: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        link: PropTypes.string
      })
    )
  }).isRequired
};

WhereToNext.defaultProps = {
  variant: ''
};

export default WhereToNext;
