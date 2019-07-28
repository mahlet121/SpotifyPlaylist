import React, { Component } from 'react';
import './App.css';

// import child components
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
//import utils
import Spotify from '../../util/Spotify';
import SpotifyWebApi from 'spotify-web-api-js';
// let fakeServerData = {
//   user: {
//     name: 'David',
//     playlists: [
//       {
//         name: 'My favorites',
//         songs: [
//           {name: 'Beat It', duration: 1345}, 
//           {name: 'Cannelloni Makaroni', duration: 1236},
//           {name: 'Rosa helikopter', duration: 70000}
//         ]
//       }
//     ]
//   }
// };


class App extends Component {
  constructor(props)
  {
    super(props);
    const params = this.getHashParams();
    console.log(params);
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
                   plays:[],
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
getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }
   componentDidMount(){
    let accessToken=Spotify.getAccessToken();
   fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      plays: data.items.map(item => {
        console.log(data.item)
        return {
          name: item.name,
          track:item.owner.display_name,
          imageUrl: item.images[0].url, 
          songs: []
        }
    })
    }))

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
          <SearchBar onSearch= {this.search}/>
          <div className="App-playlist">
          <div className="CurrentPlaylists">

          <h2>Current Playlist</h2>
          <h1></h1>
        <ul>
        {this.state.plays.map(playlist => (
          <li><h3>{playlist.name}</h3></li>
        ))}
        </ul>
        </div>

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
