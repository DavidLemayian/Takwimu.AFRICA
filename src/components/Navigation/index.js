import React from 'react';
import { PropTypes } from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';

import {
  withWidth,
  withStyles,
  Grid,
  MenuList,
  Link,
  Drawer,
  IconButton,
  MenuItem,
  ButtonBase
} from '@material-ui/core';
import { Search, MenuOutlined, Close } from '@material-ui/icons';

import { isWidthUp } from '@material-ui/core/withWidth';
import classNames from 'classnames';
import logoWhite from '../../assets/images/logo-white-all.png';

import Layout from '../Layout';
import DropDowns, { DropDownDrawer } from './DropDowns';
import SearchDrawer from './SearchDrawer';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    position: 'relative',
    zIndex: '999',
    width: '100%',
    height: '6.313rem',
    padding: '1.25rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.07)',
    color: theme.palette.text.secondary
  },
  noShadow: {
    boxShadow: 'unset'
  },
  drawer: {
    backgroundColor: theme.palette.primary.main,
    outline: 'none',
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.07)'
  },
  link: {
    color: theme.palette.text.secondary,
    margin: '1.375rem 3.25rem',
    [theme.breakpoints.up('md')]: {
      margin: '0.625rem'
    },
    [theme.breakpoints.up('lg')]: {
      margin: '1.375rem'
    },

    // Override original Takwimu & Bootstrap styles
    '&:hover': {
      color: theme.palette.text.secondary,
      textDecoration: 'none'
    }
  },
  searchButton: {
    color: theme.palette.text.secondary,
    marginBottom: '0.313rem' // Move to align icon
  },
  iconLink: {
    margin: '1.375rem 0.7rem'
  }
});

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobileDrawerOpen: false,
      openDrawer: null
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.toggleMobileDrawer = this.toggleMobileDrawer.bind(this);

    window.toggleDrawer = this.toggleDrawer;
  }

  toggleMobileDrawer() {
    this.setState(prevState => ({
      isMobileDrawerOpen: !prevState.isMobileDrawerOpen,
      openDrawer: !prevState.isMobileDrawerOpen ? prevState.openDrawer : null
    }));
  }

  toggleDrawer(drawer) {
    const { openDrawer, isMobileDrawerOpen } = this.state;
    const newOpenDrawer = openDrawer !== drawer ? drawer : null;
    const hasDrawer = newOpenDrawer !== null || isMobileDrawerOpen;

    return () => {
      const { width } = this.props;
      this.setState({
        isMobileDrawerOpen: isWidthUp('md', width) ? false : hasDrawer,
        openDrawer: newOpenDrawer
      });
    };
  }

  renderNavBar(inDrawer = false) {
    const { classes, width } = this.props;
    return (
      <nav
        className={classNames(classes.root, { [classes.noShadow]: inDrawer })}
      >
        <Layout>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Link component={RouterLink} to="/">
                <img alt="logo" src={logoWhite} height={19} />
              </Link>
            </Grid>

            {isWidthUp('md', width)
              ? this.renderDesktopNav()
              : this.renderMobileNav()}
          </Grid>
        </Layout>
      </nav>
    );
  }

  renderMobileNav() {
    const { openDrawer } = this.state;
    return (
      <>
        <Grid item>
          <IconButton
            disableRipple
            disableTouchRipple
            color="inherit"
            onClick={this.toggleMobileDrawer}
          >
            {openDrawer === 'search' ? <Close /> : <MenuOutlined />}
          </IconButton>
        </Grid>
      </>
    );
  }

  renderDesktopNav() {
    const {
      classes,
      takwimu: { page, countries }
    } = this.props;
    const { openDrawer } = this.state;
    return (
      <>
        <Grid item>
          <DropDowns
            page={page}
            active={openDrawer}
            toggle={this.toggleDrawer}
            countries={countries}
          />
        </Grid>
        <Grid item>
          <Link
            component={RouterLink}
            color="textSecondary"
            className={classes.link}
            href="/about"
          >
            About Us
          </Link>
          <Link
            component={RouterLink}
            color="textSecondary"
            className={classes.link}
            href="/faqs"
          >
            FAQs
          </Link>
          <Link
            component={RouterLink}
            color="textSecondary"
            className={classes.link}
            href="/contact"
          >
            Contact Us
          </Link>
          <ButtonBase
            className={classes.searchButton}
            onClick={this.toggleDrawer('search')}
          >
            {openDrawer === 'search' ? <Close /> : <Search />}
          </ButtonBase>
        </Grid>
      </>
    );
  }

  renderDropDownDrawer() {
    const {
      width,
      takwimu: { countries, settings }
    } = this.props;
    const { openDrawer } = this.state;
    return (
      <DropDownDrawer
        active={openDrawer}
        countries={countries}
        navigation={settings.navigation}
        toggle={
          isWidthUp('md', width)
            ? this.toggleDrawer(null)
            : this.toggleMobileDrawer
        }
      >
        {isWidthUp('md', width) ? this.renderNavBar(true) : <div />}
      </DropDownDrawer>
    );
  }

  renderSearchDrawer() {
    const { width } = this.props;
    const { openDrawer } = this.state;
    return (
      <SearchDrawer
        active={openDrawer === 'search'}
        toggle={
          isWidthUp('md', width)
            ? this.toggleDrawer(null)
            : this.toggleMobileDrawer
        }
      >
        {this.renderNavBar(true)}
      </SearchDrawer>
    );
  }

  renderMobileDrawer() {
    const {
      classes,
      takwimu: { page, countries }
    } = this.props;
    const { openDrawer, isMobileDrawerOpen } = this.state;
    return (
      <Drawer
        anchor="top"
        BackdropProps={{
          style: {
            backgroundColor: 'transparent'
          }
        }}
        PaperProps={{
          className: classes.drawer
        }}
        open={isMobileDrawerOpen}
        elevation={0}
        transitionDuration={0}
        onEscapeKeyDown={this.toggleMobileDrawer}
        onBackdropClick={this.toggleMobileDrawer}
      >
        <Grid container direction="column" alignItems="flex-start">
          {this.renderNavBar(true)}
          <MenuList>
            <DropDowns
              page={page}
              active={openDrawer}
              countries={countries}
              toggle={this.toggleDrawer}
            />
            <MenuItem>
              <Link
                component={RouterLink}
                className={classes.link}
                href="/about"
              >
                About
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                component={RouterLink}
                className={classes.link}
                href="/faqs"
              >
                FAQs
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                component={RouterLink}
                className={classes.link}
                href="/contact"
              >
                Contact Us
              </Link>
            </MenuItem>
            <MenuItem>
              <ButtonBase
                className={classes.searchButton}
                onClick={this.toggleDrawer('search')}
              >
                <Search className={classes.search} />
              </ButtonBase>
            </MenuItem>
          </MenuList>
        </Grid>
      </Drawer>
    );
  }

  render() {
    return (
      <>
        {this.renderNavBar()}
        {this.renderMobileDrawer()}
        {this.renderDropDownDrawer()}
        {this.renderSearchDrawer()}
      </>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  width: PropTypes.string.isRequired,
  takwimu: PropTypes.shape({
    page: PropTypes.shape({}).isRequired,
    countries: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
    settings: PropTypes.shape({
      navigation: PropTypes.shape({})
    }).isRequired
  }).isRequired
};

export default withWidth()(withStyles(styles)(Navigation));
