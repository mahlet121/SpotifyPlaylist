
let spotifyAccesToken = '';
// Please provide the client ID of your Spotify App.
const clientId = 'f0f97d85bbe84b36a8f48fabefef4997';
//Please provide the redirect URI added in your Spotify App while registration.
const redirectUri = 'http://localhost:3000';

const Spotify = {
  // Get the access token using authorize API from Sportify.
  getAccessToken()
  {
    if(spotifyAccesToken)
    {
      return spotifyAccesToken;
    }
    const accessToken = window.location.href.match(/access_token=([^&]*)/);
    const expiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if(accessToken && expiresIn)
    {
      spotifyAccesToken = accessToken[1];
      let expiryTime = Number(expiresIn[1]);
      window.setTimeout(() => spotifyAccesToken = '', expiryTime * 1000);
      window.history.pushState('Access Token', null, '/');
      return spotifyAccesToken;
    }
    else
    {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=playlist-modify-public&response_type=token`;
    }
  },

   
 

  // Search for a track from Spotify
  async search(term)
  {
    try{
      const token = this.getAccessToken();
      const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
                          {
                            headers : {
                              Authorization: `Bearer ${token}`
                            }
                          }
                        );
      const jsonResponse = await response.json();
      if(jsonResponse.tracks && jsonResponse.tracks.items)
      {
        let searchResults = jsonResponse.tracks.items.map((track, index)=>{
          
          return {  id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                  };
        });
        return searchResults;
      };
    }
    catch(e)
    {
      console.log("Error occured in search");
    }
    // If response is empty return emty array.
    return [];
  },
  
      
   



  // Save the play list to Spotify account.
  // return true if playlist created successfully.
  async savePlaylist(name, trackURIs)
  {
    try{
      if(name && trackURIs)
      {
        const token = this.getAccessToken();
        const userId = await this.getUserId(token);
        if(userId)
        {
          //create Playlist
          const playlistID = await this.createPlayList(token, userId, name);
          if(playlistID)
          {
            //add tracks
            return await this.addTracks(token, userId, playlistID, trackURIs);
          }
        };
      }
    }
    catch(e)
    {
      console.log("Error occure while saving the playlist");
      console.log(e);
    }
    return false;
  },

// Get user Id of logged in account user.
  async getUserId(token)
  {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    let userId = '';
    const response = await fetch('https://api.spotify.com/v1/me',
                        {
                          headers : headers
                        }
                      );
    const jsonResponse = await response.json();
    
    if(jsonResponse)
    {
 
      userId = jsonResponse.id;

    }
    return userId;
    
  },

// Create a play list with given name and return it's ID
  async createPlayList(token, userId, name)
  {
    const headers = {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    };
    //create Playlist
    let playlistID = '';
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
                        {
                          body: JSON.stringify({name: name}),
                          headers : headers,
                          method: 'POST'
                        }
                      );
    const jsonResponse = await response.json();
    if(jsonResponse)
    {
      playlistID = jsonResponse.id;
    }
    return playlistID;
  },

// Add tracks to an existing playlist.
  async addTracks(token, userId, playlistID, trackURIs)
  {
    const headers = {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    };
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,
                        {
                          body: JSON.stringify(trackURIs),
                          headers : headers,
                          method: 'POST'
                        }
                      );
    const jsonResponse = await response.json();
    if(jsonResponse && jsonResponse.snapshot_id)
    {
    
      return true;
    }
    return false;
  },


async OldList(token)
  {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    
   const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers
    })

   const jsonResponse = await response.json();
   console.log(jsonResponse);
    // .then(data => this.setState({
    //   playlists: data.items.map(item => {
    //     console.log(data.items)
    //     return {
    //       name: item.name,
    //       track:item.owner.display_name,
    //       imageUrl: item.images[0].url, 
    //       songs: []
    //     }
    // })
    // }))
    }
  }
    
  



export default Spotify;
