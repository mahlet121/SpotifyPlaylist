import React from 'react';
import PropTypes from 'prop-types';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
  render() {
    // add a list of tracks from serach result
    const tracks = this.props.tracks.map(track=>{
      return(
        <Track key= {track.id}
               track = {track}
               onAdd= {this.props.onAdd}
               isRemoval={this.props.isRemoval}
               onRemove= {this.props.onRemove}/>
      );
    });

    return (
      <div className="TrackList">
      {tracks}
      </div>
    );
  }
};

TrackList.propTypes = {
  isRemoval: PropTypes.bool,
  tracks : PropTypes.array,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func
};

export default TrackList;
