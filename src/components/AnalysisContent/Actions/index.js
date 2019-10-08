/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect } from 'react';

import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { PropTypes } from 'prop-types';

import { TwitterShareButton } from 'react-share';

import DownloadPDF from './DownloadPDF';

import shareIcon from '../../../assets/images/analysis/share.svg';

const useStyles = makeStyles({
  root: {
    padding: '30px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    '& > *': {
      marginRight: '50px'
    },
    '& > button:last-child': {
      marginRight: '0'
    }
  },
  actionIcon: {
    marginRight: '21px'
  },
  lastUpdated: {
    fontSize: '0.875rem',
    lineHeight: 'normal',
    fontStyle: 'italic'
  },
  shareButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  buttonText: {
    fontSize: '0.813rem',
    color: '#848484'
  },
  sharePopover: {
    width: '20.313rem',
    padding: '10px'
  }
});

function Actions({ hideLastUpdated, title, data, topic, takwimu, link }) {
  const classes = useStyles();
  const [analysisLink, setAnalysisLink] = useState(link);

  useEffect(() => {
    function locationHashChanged() {
      setAnalysisLink(window.location.href);
    }

    window.addEventListener('hashchange', locationHashChanged);

    return () => {
      window.removeEventListener('hashchange', locationHashChanged);
    };
  }, []);
  const {
    page: { last_published_at: lastUpdated }
  } = takwimu;

  return (
    <div className={classes.root}>
      {!hideLastUpdated && (
        <Typography className={classes.lastUpdated}>
          Last Updated: <strong>{lastUpdated}</strong>
        </Typography>
      )}

      <TwitterShareButton
        additionalProps={{
          'ga-on': 'click',
          'ga-event-category': 'Twitter',
          'ga-event-action': 'Tweet',
          'ga-event-label': analysisLink
        }}
        url={analysisLink}
      >
        <Grid
          container
          alignItems="center"
          className={classes.shareButtonContainer}
        >
          <img alt="share" src={shareIcon} className={classes.actionIcon} />
          <Typography className={classes.buttonText}>
            Share this analysis
          </Typography>
        </Grid>
      </TwitterShareButton>
      <DownloadPDF
        title={title}
        topic={topic}
        data={data}
        takwimu={takwimu}
        top={!hideLastUpdated}
      />
    </div>
  );
}

Actions.propTypes = {
  hideLastUpdated: PropTypes.bool,
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
  topic: PropTypes.oneOf(['topic', 'carousel_topic']).isRequired,
  takwimu: PropTypes.shape({
    page: PropTypes.shape({
      last_published_at: PropTypes.string
    }).isRequired
  }).isRequired,
  link: PropTypes.string.isRequired
};

Actions.defaultProps = {
  hideLastUpdated: false
};

export default Actions;
