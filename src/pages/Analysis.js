import React from 'react';
import { PropTypes } from 'prop-types';

import { withStyles } from '@material-ui/core';

import AnalysisContent from '../components/AnalysisContent';
import AnalysisTableOfContent from '../components/AnalysisContent/TableOfContent';
import ContentPage from '../components/ContentPage';

const styles = () => ({
  root: {
    marginBottom: '5.5rem'
  },
  asideRoot: {}
});

class AnalysisPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      analysis: null,
      current: 0,
      topicIndex: 0
    };

    this.changeContent = this.changeContent.bind(this);
    this.changeTopic = this.changeTopic.bind(this);
  }

  componentDidMount() {
    const {
      takwimu: {
        country: { slug }
      }
    } = this.props;
    fetch(
      `/api/v2/pages/?type=takwimu.ProfilePage&slug=${slug}&fields=*&format=json`
    ).then(response => {
      if (response.status === 200) {
        response.json().then(json => {
          const { items: analysis } = json;
          if (analysis.length) {
            // For ProfilePage, label is used to provide descriptive title since
            // title is just the country name
            analysis[0].title = analysis[0].label;
          }
          this.fetchWithAnalyses(analysis);
        });
      }
    });
  }

  fetchWithAnalyses(analyses) {
    fetch(
      `/api/v2/pages/?type=takwimu.ProfileSectionPage&fields=*&descendant_of=${analyses[0].id}&format=json`
    ).then(response => {
      if (response.status === 200) {
        response.json().then(json => {
          const {
            takwimu: {
              country: { slug }
            }
          } = this.props;
          const paths = window.location.pathname.split(`/profiles/${slug}/`);

          let foundIndex = -1;
          if (paths.length === 2) {
            const sectionSlug = paths[1].replace('/', '');
            foundIndex = json.items.findIndex(
              item => item.meta.slug === sectionSlug
            );
          }

          this.setState(prevState => {
            let { current, topicIndex } = prevState;
            if (foundIndex !== -1) {
              current = foundIndex;
            }

            let analysis = analyses;

            if (analysis) {
              if (foundIndex !== -1) {
                // Adjust for `Country Overview`
                current += analysis.length;
              }
              analysis = analysis.concat(json.items);
            }

            const { hash } = window.location;
            if (hash.length) {
              const topicId = hash.replace('#', '');
              const foundTopicIndex = analysis[current].body.findIndex(
                body => body.id === topicId
              );
              if (foundTopicIndex !== -1) {
                topicIndex = foundTopicIndex;
              }
            }

            return { current, topicIndex, analysis };
          });
        });
      }
    });
  }

  changeContent(contentIndex) {
    this.setState({ current: contentIndex, topicIndex: 0 });
    window.scrollTo(0, 0);
  }

  changeTopic(topicIndex) {
    this.setState({ topicIndex });
    window.scrollTo(0, 0);
  }

  render() {
    const { analysis, current, topicIndex } = this.state;
    const { classes, takwimu } = this.props;

    return analysis !== null ? (
      <ContentPage
        aside={
          <AnalysisTableOfContent
            country={takwimu.country}
            content={analysis}
            current={current}
            onChangeContent={this.changeContent}
          />
        }
        classes={{ root: classes.root, aside: classes.asideRoot }}
      >
        <AnalysisContent
          content={analysis[current]}
          onChange={this.changeTopic}
          takwimu={takwimu}
          topicIndex={topicIndex}
        />
      </ContentPage>
    ) : null;
  }
}

AnalysisPage.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  takwimu: PropTypes.shape({
    country: PropTypes.shape({
      slug: PropTypes.string
    }).isRequired
  }).isRequired
};

export default withStyles(styles)(AnalysisPage);
