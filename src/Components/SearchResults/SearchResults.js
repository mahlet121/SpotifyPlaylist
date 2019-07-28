import React from 'react';
import PropTypes from 'prop-types';
import './SearchResults.css';
// import child components
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component
{
  render()
  {
    return(
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList tracks= {this.props.tracks}
                  onAdd = {this.props.onAdd}/>
      </div>
    );
  }
};

SearchResults.propTypes = {
  tracks: PropTypes.array,
  onAdd: PropTypes.func
};
export default SearchResults;
