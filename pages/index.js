import React from 'react';
import PropTyes from 'prop-types';

import FeaturedAnalysis from '../src/components/FeaturedAnalysis';
import FeaturedData from '../src/components/FeaturedData';
import Hero from '../src/components/Hero';
import LatestNewsStories from '../src/components/LatestNewsStories';
import MakingOfTakwimu from '../src/components/MakingOfTakwimu';
import Page from '../src/components/Page';
import WhatYouDoWithTakwimu from '../src/components/WhatYouCanDoWithTakwimu';
import WhereToNext from '../src/components/Next';
import getTakwimuPage from '../src/getTakwimuPage';

function Home({ takwimu, indicatorId }) {
  return (
    <Page takwimu={takwimu} indicatorId={indicatorId}>
      <Hero takwimu={takwimu} />
      <FeaturedAnalysis takwimu={takwimu} />
      <FeaturedData takwimu={takwimu} />
      <WhatYouDoWithTakwimu takwimu={takwimu} />
      <MakingOfTakwimu takwimu={takwimu} />
      <LatestNewsStories takwimu={takwimu} />
      <WhereToNext />
    </Page>
  );
}

Home.propTypes = {
  takwimu: PropTyes.shape({}).isRequired,
  indicatorId: PropTyes.string.isRequired
};

Home.getInitialProps = async ({ query: { indicator: indicatorId } }) => {
  return {
    indicatorId,
    takwimu: await getTakwimuPage('takwimu.IndexPage')
  };
};

export default Home;