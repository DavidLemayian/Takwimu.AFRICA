import React from 'react';
import { PropTypes } from 'prop-types';
import { ButtonBase, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import SearchResultItem from './SearchResultItem';

const useStyles = makeStyles(({ theme }) => ({
  root: {
    flexGrow: 1
  },
  searchResultsList: {
    paddingTop: '1.5rem',
    paddingBottom: '3rem',
    marginLeft: '2.0625rem',
    marginRight: '4.3125rem'
  },
  resultsFilter: {
    paddingTop: '2rem',
    paddingBottom: '2rem',
    marginLeft: '2.0625rem',
    display: 'flex'
  },
  filter: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    display: 'flex',
    width: '70%'
  },
  showResult: {
    width: '30%'
  },
  filterItem: {
    display: 'inline-block',
    marginLeft: '1rem',
    textDecoration: 'underline',
    color: theme.palette.primary.main,
    fontSize: theme.typography.body2.fontSize
  },
  filterActive: {
    color: theme.palette.text.primary,
    textDecoration: 'none'
  },
  filterItemLabel: {
    display: 'inline-block'
  },
  paginationContainer: {
    padding: '3rem'
  },
  pagginationButton: {},
  borderDiv: {
    borderStyle: 'solid',
    borderBottom: '4px',
    borderColor: theme.palette.primary.main
  },
  pagesList: {
    marginTop: '1rem'
  }
}));

function RenderPaginator({
  items,
  activePage,
  handleNextClick,
  handlePreviousClick,
  handlePageClick,
  endIndex
}) {
  const numPages = Math.floor(items / 10);
  const pages = Array.from({ length: numPages }, (v, k) => k + 1);
  const classes = useStyles();

  return (
    <div className={classes.pagesList}>
      {activePage > 0 && items > 0 && (
        <ButtonBase
          className={classes.filterItem}
          onClick={handlePreviousClick}
        >
          Previous
        </ButtonBase>
      )}
      {pages.map(page => (
        <ButtonBase
          className={classNames([
            classes.filterItem,
            { [classes.filterActive]: page === activePage + 1 }
          ])}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </ButtonBase>
      ))}
      {endIndex < items && items > 0 && (
        <ButtonBase className={classes.filterItem} onClick={handleNextClick}>
          Next
        </ButtonBase>
      )}
    </div>
  );
}
RenderPaginator.propTypes = {
  items: PropTypes.number.isRequired,
  activePage: PropTypes.number.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  handlePreviousClick: PropTypes.func.isRequired,
  handlePageClick: PropTypes.func.isRequired,
  endIndex: PropTypes.number.isRequired
};
export const Paginator = RenderPaginator;

class SearchResultsContainer extends React.Component {
  constructor(props) {
    super(props);

    const { filter } = this.props;
    this.state = {
      activePage: 0,
      startIndex: 0,
      filter
    };

    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
  }

  handleNextClick() {
    this.setState(prevState => ({
      activePage: prevState.activePage + 1,
      startIndex: prevState.startIndex + 10
    }));
  }

  handlePreviousClick() {
    this.setState(prevState => ({
      activePage: prevState.activePage - 1,
      startIndex: prevState.startIndex - 10
    }));
  }

  handlePageClick(pageNum) {
    const startIndex = (pageNum - 1) * 10;
    this.setState({
      activePage: pageNum - 1,
      startIndex
    });
  }

  handleFilterClick(category) {
    this.setState({
      activePage: 0,
      startIndex: 0,
      filter: category
    });
  }

  render() {
    const { results } = this.props;
    const { activePage, startIndex, filter } = this.state;
    const classes = useStyles();

    let filteredResults = results;
    // filter results with result_type equals to state's filter
    if (filter !== 'All') {
      filteredResults = results.filter(
        resultItem => resultItem.value.result_type === filter
      );
    }

    // compose show result string
    let resultIndexText = '';
    let endIndex = 10;
    const resultsLength = filteredResults.length;
    if (resultsLength > 10) {
      endIndex += 10 * activePage;

      if (resultsLength - startIndex < 10) {
        endIndex = startIndex + (resultsLength - startIndex);
      }
      resultIndexText = `Results ${startIndex + 1} - ${endIndex} of `;
    }

    return (
      <div className={classes.root}>
        <Grid className={classes.resultsFilter}>
          <Typography variant="body2" className={classes.showResult}>
            {`Showing ${resultIndexText}${filteredResults.length} results`}
          </Typography>
          <Grid item className={classes.filter}>
            <Typography
              variant="body2"
              color="inherit"
              className={classes.filterItemLabel}
            >
              Show:
            </Typography>
            {['All', 'Analysis', 'Data'].map(type => (
              <ButtonBase
                key={type}
                className={classNames([
                  classes.filterItem,
                  { [classes.filterActive]: filter === type }
                ])}
                onClick={() => this.handleFilterClick(type)}
              >
                {`${type} Results`}
              </ButtonBase>
            ))}
          </Grid>
        </Grid>
        <div className={classes.borderDiv} />
        {filteredResults.length > 0 ? (
          <div className={classes.searchResultsList}>
            {filteredResults.slice(startIndex, endIndex).map(result => (
              <SearchResultItem
                resultType={result.value.result_type}
                country={result.value.country}
                link={result.value.link}
                title={result.value.title}
                summary={result.value.summary}
                key={result.value.content_id}
              />
            ))}
          </div>
        ) : (
          <div className={classes.searchResultsList}>
            <Typography variant="h3"> No Results Found</Typography>
          </div>
        )}
        <div className={classes.borderDiv} />

        <div className={classes.paginationContainer}>
          <Typography variant="body2">
            {`Showing ${resultIndexText}${filteredResults.length} results`}
          </Typography>
          {filteredResults.length > 10 && (
            <Paginator
              items={filteredResults.length}
              activePage={activePage}
              handleNextClick={this.handleNextClick}
              handlePreviousClick={this.handlePreviousClick}
              handlePageClick={this.handlePageClick}
              endIndex={endIndex}
            />
          )}
        </div>
      </div>
    );
  }
}

SearchResultsContainer.propTypes = {
  filter: PropTypes.string,
  results: PropTypes.arrayOf(PropTypes.shape({}))
};

SearchResultsContainer.defaultProps = {
  filter: 'All',
  results: []
};

export default SearchResultsContainer;
