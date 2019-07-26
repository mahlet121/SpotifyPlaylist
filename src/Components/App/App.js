import React, { Component } from 'react';
import './App.css';

// import child components
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
//import utils
import Spotify from '../../util/Spotify';
import OldPlaylist from '../OldPlaylist/OldPlaylist';


class App extends Component {
  constructor(props)
  {
    super(props);
    /*
    // Test data
    this.state =  {
                    searchResults:[{id:1, name:'Buffalo', artist:'Bob M', album:'Soldier', uri:''},
                                  {id:2, name:'Ost', artist:'vangelis', album:'baldeRunner',uri:''},
                                  {id:3, name:'Ost', artist:'Hans', album:'Interstellar',uri:''}],
                    playList:{ name:'Favourite',
                               tracks:[{id:1, name:'Buffalo', artist:'Bob M', album:'Soldier', uri:''}]
                             }
                  };*/
    this.state =  {
                    searchResults:[],
                    playList:{ name:'New Playlist',
                               tracks:[]
                             }
                  };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  // adds a track to playlist
  addTrack(track)
  {
    // check if the track is already present in the playlist.
    let trackPresent = this.state.playList.tracks.some(playLisTrack=>{
      return playLisTrack.id === track.id;
    });
    if(!trackPresent)
    {
      this.state.playList.tracks.push(track);
      this.setState({playList: this.state.playList});
    }
  }

  // remove a track from the playlist
  removeTrack(track)
  {
    let updatedPlaylist = this.state.playList.tracks.filter(playLisTrack=>{
      return playLisTrack.id !== track.id;
    });

    this.setState({playList: {...this.state.playList, tracks: updatedPlaylist}});
  }

  // Update playlist name
  updatePlaylistName(name)
  {
    this.setState({playList: {...this.state.playList, name: name}});
  }

  // Save the playlist to Spotify account.
  async savePlaylist()
  {
    let trackURIs = this.state.playList.tracks.map(track=>track.uri);
    const isSuccess = await Spotify.savePlaylist(this.state.playList.name, trackURIs);

    // Reset the playlist once it is saved to Spotify
    if(isSuccess)
    {
      this.setState({
                      playList:{ name:'New Playlist',
                                 tracks:[]
                                }
                    });
    }
  }

  // Search for a track in Spotify
  async search(searchTerm)
  {
    let searchResults = await Spotify.search(searchTerm);
    this.setState({searchResults:searchResults});
  }
  

  render() {
    return (
      <div>
        <h1>Create And Manage your Spotify Playlist</h1>
        <div className="App">
         <OldPlaylist  />
          <SearchBar onSearch= {this.search}/>
          <div className="App-playlist">
            <SearchResults tracks = {this.state.searchResults}
                           onAdd = {this.addTrack}/>
            <Playlist tracks= {this.state.playList.tracks}
                      onRemove= {this.removeTrack}
                      onNameChange = {this.updatePlaylistName}
                      onSave = {this.savePlaylist}/>

                     
          </div>
        </div>
      </div>
    );
  }
}

export default App;
