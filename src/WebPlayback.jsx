import React, { useState, useEffect } from 'react';
import RecordPlayer from './RecordPlayer/RecordPlayer';

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function WebPlayback(props) {

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [device, setDevice] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(track);
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [currentAlbumColors, setCurrentAlbumColors] = useState(null);
    
    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Jukebox',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                //console.log('Ready with Device ID', device_id);
                setDevice(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setCurrentTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();
        };
    }, []);

    useEffect(() => {
        const url = currentTrack.album.images[0].url
        setCurrentAlbum(url);

    }, [currentTrack]);

    useEffect(() => {
      if(currentAlbum === null){return;}
      getAlbumColors(currentAlbum);

    }, [currentAlbum]);
    

    useEffect(() => {
        if(device == false ){return;}
        fetch(`https://api.spotify.com/v1/me/player`, {
            "method": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.token}`
            },
            "body":JSON.stringify({device_ids: [device]})
        })
    }, [device]);

    useEffect(() => {
      if(currentAlbumColors===null){return};

    }, [currentAlbumColors])
    

    function getAlbumColors(albumUrl){
      let albumBody = {"album": albumUrl};

      fetch("http://localhost:5000/albumcolors", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
      },
        "body": JSON.stringify(albumBody)
      })
      .then(function(response) {
          return response.json();
      }).then(function(data) {
          setCurrentAlbumColors(data);
      })
      .catch(err => {
        console.error(err);
      });
    }
    
    function hooch(){
        fetch("https://api.spotify.com/v1/albums/1Ki56K82avE7nTkZEyVIE7", {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.token}`
            }
        })
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
            queueAlbum(data.tracks.items);
        })
        .catch(err => {
            console.error(err);
        });              
    }

    async function searchSong(searchValue){
      const query = encodeURIComponent(searchValue);
      await fetch(`https://api.spotify.com/v1/search?query=${query}&type=track&market=US&limit=10&offset=0`, {
        "method": "GET",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${props.token}`
        }
      })
      .then(response => {
          return response;
        response.json().then(parsedJson => {
          console.log(parsedJson);
          return parsedJson;
        })
    })
      .catch(err => {
        console.error(err);
      });
    }

    async function queueAlbum(songs){
        for(let i=0;i<songs.length;i++){
            await queueSong(songs[i].uri);
        }

    }

    async function queueSong(songUri){
        let response = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${songUri}`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.token}`
            }
        })
        const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));
        await waitFor(500);
        return await response;
    }

    useEffect(() => {
        console.log(device," ^^^^^ ", props.token);
    }, [device]);


    if (!is_active || !currentAlbumColors) { 
        return (
            <div>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </div>)
    } else {
        return (
          <RecordPlayer colors={currentAlbumColors} track={currentTrack} album={currentAlbum} queueSong={queueSong} searchSong={searchSong}/>
        );
    }
}

export default WebPlayback
