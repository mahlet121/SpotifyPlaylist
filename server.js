let express = require('express')
let request = require('request')
let querystring = require('querystring')
const SPOTIFY_CLIENT_ID= 'f0f97d85bbe84b36a8f48fabefef4997';
const SPOTIFY_CLIENT_SECRET = '4c5b579de68e4d518d53101c736360bc';

//Please provide the redirect URI added in your Spotify App while registration.
const redirect_uri = 'http://localhost:3000';

let app = express()



let redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:8888/callback'


app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

let port = process.env.PORT || 3000
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)