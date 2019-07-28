import React from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

class SearchBar extends React.Component
{
  constructor(props)
  {
      super(props);
      this.state = {searchTerm:''};
      this.search = this.search.bind(this);
      this.handleTermChange = this.handleTermChange.bind(this);
  }

  search()
  {
      this.props.onSearch(this.state.searchTerm);
  }

  handleTermChange(e)
  {
    let searchTerm = e.target.value;
    this.setState({searchTerm:searchTerm});
  }

  render()
  {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"
                onChange = {this.handleTermChange}/>
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
};

SearchBar.propTypes = {
                        onSearch: PropTypes.func
                      };
export default SearchBar;
