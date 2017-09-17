var templateSource = document.getElementById('result-template').innerHTML,
template = Handlebars.compile(templateSource),
resultsPlaceholder = document.getElementById('results');

function login(callback) {
  var CLIENT_ID = 'f1c1c446383c485fa8f8b966596c6722';
  var REDIRECT_URI = 'https://qmit.tumblr.com';

  function getLoginURL(scopes) {
    return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
      '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
      '&scope=' + encodeURIComponent(scopes.join(' ')) +
      '&response_type=token';
  }

  var url = getLoginURL([
    'playlist-modify-public'
  ]);

  var width = 550,
    height = 630,
    left = (screen.width / 2) - (width / 2),
    top = (screen.height / 2) - (height / 2);

  window.addEventListener("message", function(event) {
    var hash = JSON.parse(event.data);
    if (hash.type == 'access_token') {
      callback(hash.access_token);
    }
  }, false);

  var w = window.open(url,
    'Spotify',
    'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
  );

};

function searchSongs(accessToken, songname) {
  var name = songname;
  return $.ajax({
    url: 'https://api.spotify.com/v1/search?q=' + name + '+remix&type=track',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    dataType: "text"
  });
};
    
    function buttonclick() {
        login(function(accessToken) {
            searchSongs(accessToken, document.getElementById("song_name").value).then(function(response){
                
                p = JSON.parse(response);
                returnstring ='';
                var song_input = document.getElementById("song_name").value.toLowerCase();
                for(i=0;i<p.tracks.items.length;i++){
                    var song_name = p.tracks.items[i].name;
                    if(song_name.toLowerCase().indexOf(song_input) !== -1){
                        returnstring += "<div class='song_container'><div id='title'><a href='"+p.tracks.items[i].album.external_urls.spotify+"'>"+song_name+"</a> from "+p.tracks.items[i].album.artists[0].name+"</div><img src="+p.tracks.items[i].album.images[1].url+" rotate='90' width = '300' height='300'><div class='audio'><audio controls><source src='"+p.tracks.items[i].preview_url+"' type='audio/mpeg'>Error</audio></div></div>";
                    }
                    
                }        
                resp.innerHTML = returnstring;
            })

        });
    };