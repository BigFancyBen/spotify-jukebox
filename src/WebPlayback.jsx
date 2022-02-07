import React, { useState, useEffect } from 'react';

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
    const [current_track, setTrack] = useState(track);

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

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();
        };
    }, []);

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
    
    function hooch(){

        // fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
        //     method: 'PUT',
        //     body: JSON.stringify({ uris: "spotify:album:39XRAKlA9dJ6wCVEDGxaDe" }),
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${props.token}`
        //     },
        // });

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
            // const tracks = data.tracks.items.map(obj => {
            //     return obj.uri
            // })
            queueAlbum(data.tracks.items);
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


    if (!is_active) { 
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
            <>
                <div className="container">
                    <div className="main-wrapper">

                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                &lt;&lt;
                            </button>

                            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>

                            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                &gt;&gt;
                            </button>
                            <button className="btn-spotify" onClick={() => { hooch() }} >
                                play album
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WebPlayback
