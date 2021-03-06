import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import InsightContainer from '@hurumap-ui/core/InsightContainer';
import ChartFactory from '@hurumap-ui/charts/ChartFactory';
import useProfileLoader from '@hurumap-ui/core/useProfileLoader';
import { shareIndicator } from '@hurumap-ui/core/utils';

import config from '../../config';

import Page from '../Page';
import ProfileDetail from '../ProfileDetail';
import ProfileSection, { ProfileSectionTitle } from '../ProfileSection';
import Section from '../Section';

import logo from '../../assets/images/logo-white-all.png';

const MapIt = dynamic({
  ssr: false,
  loader: () => {
    return typeof window !== 'undefined' && import('@hurumap-ui/core/MapIt');
  }
});

const useStyles = makeStyles(({ palette, breakpoints, typography }) => ({
  actionsShareButton: {
    minWidth: '4rem'
  },
  actionsRoot: {
    border: 'solid 1px #eaeaea'
  },
  container: {
    marginBottom: '0.625rem'
  },
  containerRoot: ({ loading }) => ({
    width: '100%',
    minHeight: loading && '300px',
    backgroundColor: '#f6f6f6',
    margin: 0
  }),
  containerInsightAnalysisLink: {
    padding: 0
  },
  containerInsightDataLink: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: `solid 2px ${palette.primary.main}`,
    padding: 0
  },
  containerSourceGrid: {
    [breakpoints.up('md')]: {
      whiteSpace: 'nowrap'
    }
  },
  containerSourceLink: {
    fontSize: typography.caption.fontSize,
    color: palette.text.primary
  },
  insight: {
    paddingTop: '1.275rem'
  },
  insightGrid: {
    [breakpoints.up('lg')]: {
      maxWidth: '23.6875rem'
    }
  },
  numberTitle: {
    fontWeight: 'bold'
  },
  hideHighlightGrid: {
    display: 'none'
  },
  statDescription: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.71,
    wordBreak: 'break-word'
  },
  statStatistic: {
    fontWeight: 'bold',
    fontSize: '2.5rem',
    lineHeight: 1.03,
    marginBottom: '0.6875rem',
    marginTop: '1.125rem'
  },
  statSubtitle: {
    fontWeight: 'bold',
    fontSize: '1.25rem',
    marginTop: '1rem',
    paddingRight: '1.25rem' // On the same line as chart title hence better to have spacing between them
  },
  title: {
    fontFamily: typography.fontText,
    lineHeight: 2.05,
    marginTop: '1rem'
  }
}));

function Chart({ chartData, definition, profiles, classes }) {
  return (
    !chartData.isLoading && (
      <ChartFactory
        definition={definition}
        data={chartData.profileVisualsData[definition.queryAlias].nodes}
        profiles={profiles}
        classes={classes}
      />
    )
  );
}

Chart.propTypes = {
  chartData: PropTypes.shape({
    isLoading: PropTypes.bool,
    profileVisualsData: PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired,
  definition: PropTypes.shape({
    queryAlias: PropTypes.string
  }).isRequired,
  profiles: PropTypes.shape({}).isRequired
};

const overrideTypePropsFor = chartType => {
  switch (chartType) {
    case 'column': // Fall through
    case 'grouped_column':
      return {
        parts: {
          axis: {
            dependent: {
              style: {
                grid: {
                  display: 'none'
                },
                tickLabels: {
                  display: 'none'
                }
              }
            }
          }
        }
      };
    default:
      return {};
  }
};

function Profile({ sectionedCharts, language }) {
  const router = useRouter();
  const {
    query: { geoIdOrCountrySlug }
  } = router;
  const geoId =
    (geoIdOrCountrySlug &&
      geoIdOrCountrySlug.length &&
      geoIdOrCountrySlug[0]) ||
    '';

  const [activeTab, setActiveTab] = useState(
    process.browser && window.location.hash.slice(1)
      ? window.location.hash.slice(1)
      : 'all'
  );

  const charts = useMemo(
    () =>
      sectionedCharts
        .map(({ charts: definitions }) => definitions)
        .reduce((a, b) => a.concat(b), []),
    [sectionedCharts]
  );

  const [visuals] = useState(
    charts.filter(({ type }) => type === 'hurumap').map(({ visual }) => visual)
  );

  const { profiles, chartData } = useProfileLoader({
    geoId,
    visuals,
    populationTables: config.populationTables
  });
  const classes = useStyles({ loading: chartData.isLoading });

  const country = useMemo(() => {
    if (!profiles.profile || !profiles.profile.geoLevel) {
      return {};
    }
    if (profiles.profile.geoLevel === 'country') {
      return config.countries.find(
        c => c.iso_code === profiles.profile.geoCode
      );
    }
    return config.countries.find(c => c.iso_code === profiles.parent.geoCode);
  }, [profiles]);

  const onClickGeoLayer = useCallback(
    area => {
      router.push(`/profiles/${area.codes.AFR}`);
    },
    [router]
  );

  // get all available profile tabs
  const profileTabs = useMemo(
    () => [
      {
        name: 'All',
        slug: 'all'
      },
      ...sectionedCharts
        // Filter empty sections
        .filter(
          ({ charts: sectionCharts }) =>
            sectionCharts.filter(
              ({ type, visual }) =>
                type !== 'hurumap' ||
                chartData.isLoading ||
                !(
                  !chartData.profileVisualsData ||
                  /* hurumap data is missing */
                  chartData.profileVisualsData[visual.queryAlias].nodes
                    .length === 0
                )
            ).length !== 0
        )
    ],
    [chartData.isLoading, chartData.profileVisualsData, sectionedCharts]
  );

  /**
   * Victory renders take a lot of time
   * causing a few seconds UI block which is bad UX.
   * This caches the components so they do not have to render again.
   */
  const chartComponents = useMemo(
    () =>
      profileTabs.slice(1).map(tab => (
        <Grid item container id={tab.slug} key={tab.slug}>
          <ProfileSectionTitle loading={chartData.isLoading} tab={tab} />
          {tab.charts
            // Filter loaded charts
            .filter(
              ({ type, visual }) =>
                type !== 'hurumap' ||
                chartData.isLoading ||
                (chartData.profileVisualsData &&
                  /* hurumap data is not missing */
                  chartData.profileVisualsData[visual.queryAlias].nodes
                    .length !== 0)
            )
            .map(chart => {
              const embedPath =
                chart.type === 'hurumap'
                  ? `hurumap/${geoId}/${chart.id}`
                  : `flourish/${chart.id}`;

              const sourceResult = chartData.profileVisualsData
                ? chartData.profileVisualsData[
                    `${chart.visual.queryAlias}Source`
                  ]
                : null;
              const source =
                sourceResult && sourceResult.nodes && sourceResult.nodes.length
                  ? sourceResult.nodes[0]
                  : null;

              const rawData =
                !chartData.isLoading &&
                chartData.profileVisualsData[chart.visual.queryAlias].nodes;
              return (
                <Grid item xs={12} key={chart.id} className={classes.container}>
                  <InsightContainer
                    key={chart.id}
                    actions={{
                      handleShare: shareIndicator.bind(
                        null,
                        chart.id,
                        geoId,
                        '/api/share'
                      ),
                      handleShowData: null,
                      handleCompare: null
                    }}
                    classes={{
                      insight: classes.insight,
                      actionsCompareButton: classes.actionsCompareButton,
                      actionsShareButton: classes.actionsShareButton,
                      actionsShowDataButton: classes.actionsShowDataButton,
                      actionsRoot: classes.actionsRoot,
                      root: classes.containerRoot,
                      sourceGrid: classes.containerSourceGrid,
                      sourceLink: classes.containerSourceLink,
                      insightAnalysisLink: classes.containerInsightAnalysisLink,
                      insightDataLink: classes.containerInsightDataLink,
                      insightGrid: classes.insightGrid,
                      highlightGrid:
                        chart.type === 'flourish' && classes.hideHighlightGrid,
                      title: classes.title
                    }}
                    embedCode={`<iframe
                        id="${chart.id}"
                        src="${config.url}/embed/${embedPath}"
                        title="${chart.title}"
                        allowFullScreen
                      />`}
                    insight={{
                      dataLink: {
                        href: `/profiles/${country.slug}`,
                        title: 'Read the country analysis'
                      }
                    }}
                    loading={chartData.isLoading}
                    logo={logo}
                    source={source}
                    title={chart.title}
                    dataTable={{
                      tableTitle: chart.visual.table.slice(3),
                      dataValueTitle: chart.visual.y,
                      dataLabelTitle: chart.visual.x,
                      groupByTitle: chart.visual.groupBy,
                      rawData
                    }}
                  >
                    {chart.type === 'hurumap'
                      ? [
                          <Chart
                            key={chart.id}
                            chartData={chartData}
                            definition={{
                              ...chart.stat,
                              typeProps: {
                                ...chart.stat.typeProps,
                                classes: {
                                  description: classes.statDescription,
                                  statistic: classes.statStatistic,
                                  subtitle: classes.statSubtitle
                                }
                              }
                            }}
                            profiles={profiles}
                            classes={classes}
                          />,
                          <Chart
                            key={chart.id}
                            chartData={chartData}
                            definition={{
                              ...chart.visual,
                              typeProps: {
                                ...chart.visual.typeProps,
                                ...overrideTypePropsFor(chart.visual.type)
                              }
                            }}
                            profiles={profiles}
                            classes={classes}
                          />
                        ]
                      : [
                          <div key={chart.id} />,
                          <iframe
                            key={chart.id}
                            width="100%"
                            scrolling="no"
                            frameBorder="0"
                            title={chart.title}
                            src={`${config.WP_HURUMAP_DATA_API}/flourish/${chart.id}`}
                          />
                        ]}
                  </InsightContainer>
                </Grid>
              );
            })}
        </Grid>
      )),
    [profileTabs, chartData, geoId, classes, country.slug, profiles]
  );

  // Show and hide sections
  useEffect(() => {
    if (activeTab === 'all') {
      profileTabs.slice(1).forEach(tab => {
        const tabElement = document.getElementById(tab.slug);
        if (tabElement && tabElement.children[0]) {
          // Remember to display all section titles
          tabElement.children[0].style.display = 'block';
          tabElement.style.display = 'flex';
        }
      });
    } else {
      profileTabs.slice(1).forEach(tab => {
        const tabElement = document.getElementById(tab.slug);
        if (tabElement && tabElement.children[0]) {
          if (tab.slug === activeTab) {
            // Hide section title for active tab
            tabElement.children[0].style.display = 'none';
            tabElement.style.display = 'flex';
          } else {
            tabElement.style.display = 'none';
          }
        }
      });
    }
  }, [activeTab, profileTabs]);

  return (
    <Page takwimu={{ ...config, language }}>
      {!profiles.isLoading && (
        <ProfileDetail
          profile={{
            geo: profiles.profile
          }}
        />
      )}

      <div style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
        <MapIt
          drawProfile
          codeType="AFR"
          drawChildren={
            geoId.split('-')[1] === 'NG' || geoId.split('-')[1] === 'KE'
          }
          geoLevel={geoId.split('-')[0]}
          geoCode={geoId.split('-')[1]}
          onClickGeoLayer={onClickGeoLayer}
        />
      </div>
      {!profiles.isLoading && (
        <ProfileSection
          profile={{ geo: profiles.profile }}
          tabs={profileTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      <Section>{chartComponents}</Section>
    </Page>
  );
}

Profile.propTypes = {
  language: PropTypes.string.isRequired,
  sectionedCharts: PropTypes.arrayOf(
    PropTypes.shape({
      charts: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string
        })
      ).isRequired
    })
  ).isRequired
};

export default Profile;
