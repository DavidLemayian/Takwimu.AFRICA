import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  withStyles,
  ButtonBase,
  Button,
  Grid,
  Input,
  Popper,
  Paper,
  MenuList,
  MenuItem
} from '@material-ui/core';

import classNames from 'classnames';
import Layout from '../Layout';

import searchIcon from '../../assets/images/icon-search.svg';
import downArrow from '../../assets/images/down-arrow-green.svg';

const flagSrc = require.context('../../assets/images/flags', false, /\.svg$/);

const styles = theme => ({
  root: {
    width: '100%',
    height: '30rem',
    padding: '1.438rem',
    backgroundColor: 'rgba(255, 255, 255, 0.63)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      width: '23.375rem',
      border: 'solid 0.063rem rgba(0, 0, 0, 0.19)',
      borderRadius: '0 0 1.063rem 1.063rem',
      pointerEvents: 'all',
      zIndex: '1'
    }
  },
  layout: {
    position: 'relative',
    height: '34rem',
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      pointerEvents: 'none'
    }
  },
  label: {
    fontSize: '0.938rem',
    fontWeight: '600'
  },
  verticalLine: {
    width: '0.25rem',
    height: '12.125rem',
    marginLeft: '1.063rem',
    marginRight: '2.188rem',
    backgroundColor: theme.palette.primary.main
  },
  countryName: {
    marginLeft: '1.125rem',
    textAlign: 'start',
    fontSize: '1.75rem',
    width: '11.9rem',
    fontFamily: theme.typography.fontHeading
  },
  chooserButton: {
    marginTop: '0.938rem',
    marginBottom: '1.375rem'
  },
  changeCountryLabel: {
    color: '#848484'
  },
  detailLabel: {
    color: '#231f20',
    lineHeight: 'normal'
  },
  detail: {
    fontSize: '2rem',
    lineHeight: 'normal',
    fontWeight: '600',
    color: '#231f20'
  },
  datasetName: {
    fontSize: '0.938rem',
    textDecoration: 'underline',
    marginRight: '0.625rem',
    marginLeft: '0.25rem'
  },
  searchBar: {
    position: 'relative',
    width: '100%'
  },
  searchBarInput: {
    padding: '0.625rem',
    borderRadius: '0.25rem',
    border: 'solid 0.063rem rgba(151, 151, 151, 0.3)'
  },
  searchBarIcon: {
    position: 'absolute',
    right: '1rem',
    top: '1rem'
  },
  popperIndex: {
    zIndex: 2
  }
});

function CountrySelectorComponent({ classes, country, context }) {
  return (
    <div>
      <Typography
        variant="caption"
        className={classNames([classes.label, classes.changeCountryLabel])}
      >
        Change Country
      </Typography>

      <ButtonBase
        disableRipple
        disableTouchRipple
        style={{ outline: 'none' }}
        className={classes.chooserButton}
        onClick={window.toggleDrawer(context)}
      >
        <img alt="" height="37" src={flagSrc(`./${country.slug}.svg`)} />
        <Typography variant="subtitle2" className={classes.countryName}>
          {country.short_name}
        </Typography>
        <img alt="" src={downArrow} />
      </ButtonBase>
    </div>
  );
}

CountrySelectorComponent.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  context: PropTypes.string.isRequired,
  country: PropTypes.shape({
    slug: PropTypes.string,
    short_name: PropTypes.string
  }).isRequired
};

const CountrySelector = withStyles(styles)(CountrySelectorComponent);

export { CountrySelector };

class ProfileDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      showSearchResults: false
    };

    this.showSearchResults = this.showSearchResults.bind(this);
    this.hideSearchResults = this.hideSearchResults.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  showSearchResults() {
    this.setState({
      showSearchResults: true
    });
  }

  hideSearchResults() {
    this.setState({
      showSearchResults: false
    });
  }

  handleSearch(e) {
    const { searchTerm } = this.state;
    const newSearchTerm = e && e.target ? e.target.value : searchTerm;
    this.setState({ searchTerm: newSearchTerm }, () => {
      if (newSearchTerm.length) {
        this.showSearchResults();
      } else {
        this.hideSearchResults();
      }
    });
  }

  render() {
    const { showSearchResults } = this.state;
    const {
      classes,
      takwimu: { countries },
      profile: {
        comparable = false,
        demographics = {},
        geography = { this: {} }
      }
    } = this.props;

    let population;
    if (demographics.total_population && demographics.total_population.values) {
      population = demographics.total_population.values.this.toFixed(0);
    }
    let populationDensity;
    if (
      demographics.population_density &&
      demographics.population_density.values
    ) {
      populationDensity = demographics.population_density.values.this.toFixed(
        1
      );
    }

    const { square_kms: squarekms, geo_level: geoLevel } = geography.this;
    let country;
    if (geoLevel === 'country') {
      const { geo_code: countryCode } = geography.this;
      country = countries.find(c => c.iso_code === countryCode);
    } else {
      // if level is not country, then we are in level 1
      const { parent_geoid: countryGeoId } = geography.this;
      country = countries.find(c => c.iso_code === countryGeoId.slice(8));
      country.name = geography.this.name;
    }

    return (
      <Grid container justify="center">
        <Layout classes={{ root: classes.layout }}>
          <div className={classes.root}>
            <Grid container direction="column">
              <CountrySelector country={country} context="topic" />
              <Grid container direction="row" wrap="nowrap">
                <Grid item>
                  <div className={classes.verticalLine} />
                </Grid>
                <Grid item container direction="column" justify="space-between">
                  {population && (
                    <Grid item>
                      <Typography
                        variant="body1"
                        className={classNames([
                          classes.label,
                          classes.detailLabel
                        ])}
                      >
                        Population
                      </Typography>
                      <Typography variant="body1" className={classes.detail}>
                        {Number(population).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                  {squarekms && (
                    <Grid item>
                      <Typography
                        variant="body1"
                        className={classNames([
                          classes.label,
                          classes.detailLabel
                        ])}
                      >
                        Square kilometres
                      </Typography>
                      <Typography variant="body1" className={classes.detail}>
                        {Number(squarekms).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                  {populationDensity && (
                    <Grid item>
                      <Typography
                        variant="body1"
                        className={classNames([
                          classes.label,
                          classes.detailLabel
                        ])}
                      >
                        People per square kilometre
                      </Typography>
                      <Typography variant="body1" className={classes.detail}>
                        {Number(populationDensity).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              {comparable && (
                <Grid container>
                  <div
                    ref={node => {
                      this.searchBarRef = node;
                    }}
                    className={classes.searchBar}
                  >
                    <Input
                      fullWidth
                      disableUnderline
                      className={classes.searchBarInput}
                      onFocus={this.handleSearch}
                      onBlur={this.hideSearchResults}
                      placeholder="Compare with"
                      onChange={this.handleSearch}
                    />
                    <img
                      alt=""
                      src={searchIcon}
                      className={classes.searchBarIcon}
                    />
                  </div>

                  <Popper
                    className={classes.popperIndex}
                    open={showSearchResults}
                    anchorEl={this.searchBarRef}
                    style={{
                      width: this.searchBarRef
                        ? this.searchBarRef.clientWidth
                        : null
                    }}
                  >
                    <Paper>
                      <MenuList>
                        <MenuItem>Example</MenuItem>
                      </MenuList>
                    </Paper>
                  </Popper>
                </Grid>
              )}
            </Grid>
            <Button href={`/profiles/${country.slug}`} fullWidth>
              Read the full country analysis
            </Button>
          </div>
        </Layout>
      </Grid>
    );
  }
}

ProfileDetail.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  takwimu: PropTypes.shape({
    countries: PropTypes.arrayOf(
      PropTypes.shape({
        slug: PropTypes.string,
        short_name: PropTypes.string
      }).isRequired
    ).isRequired
  }).isRequired,
  profile: PropTypes.shape({
    comparable: PropTypes.bool,
    demographics: PropTypes.shape({
      population_density: PropTypes.shape({
        values: PropTypes.shape({
          this: PropTypes.number
        })
      }),
      total_population: PropTypes.shape({
        values: PropTypes.shape({
          this: PropTypes.number
        })
      })
    }),
    geography: PropTypes.shape({
      this: PropTypes.shape({
        geo_code: PropTypes.string,
        geo_level: PropTypes.string,
        name: PropTypes.string,
        parent_geoid: PropTypes.string,
        square_kms: PropTypes.number
      })
    })
  }).isRequired
};

export default withStyles(styles)(ProfileDetail);
