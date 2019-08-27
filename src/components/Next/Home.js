import React from 'react';
import { PropTypes } from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';

import { Grid, withStyles } from '@material-ui/core';

import A from '../A';
import Card from './Card';
import Section from '../Section';

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingBottom: '6.25rem'
  },
  link: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 'auto'
    }
  },
  cardMargin: {
    marginTop: '2rem',
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
      marginLeft: '1.5rem' // .75 of lg
    },
    [theme.breakpoints.up('lg')]: {
      marginLeft: '2rem'
    }
  }
});

function HomeWhereToNext({ classes }) {
  return (
    <Section title="Where to next" variant="h3">
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        <Card href="//eepurl.com/dynuAX" component={A}>
          Stay up-to-date with <br /> new data and analysis
        </Card>

        <Card
          component={RouterLink}
          href="/services"
          classes={{ root: classes.cardMargin }}
        >
          Looking for other <br /> services?
        </Card>

        <Card
          component={RouterLink}
          href="/contact"
          classes={{ root: classes.cardMargin }}
        >
          Talk to us
        </Card>
      </Grid>
    </Section>
  );
}

HomeWhereToNext.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(HomeWhereToNext);
