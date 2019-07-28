import React from 'react';

// import child components


class OldPlaylist extends React.Component
{
  constructor(props)
  {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(e)
  {
    let name = e.target.value;
    this.props.onNameChange(name);
  }

  render() {
    let playlist = this.props.playlist
    return (
      <div>
        
        
     
      </div>
    );
  }
};


export default OldPlaylist;
