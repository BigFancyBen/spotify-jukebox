// <>
// <div className="container">
//     <div className="main-wrapper">

//         <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

//         <div className="now-playing__side">
//             <div className="now-playing__name">{current_track.name}</div>
//             <div className="now-playing__artist">{current_track.artists[0].name}</div>

//             <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
//                 &lt;&lt;
//             </button>

//             <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
//                 { is_paused ? "PLAY" : "PAUSE" }
//             </button>

//             <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
//                 &gt;&gt;
//             </button>
//             <button className="btn-spotify" onClick={() => { hooch() }} >
//                 play album
//             </button>
//         </div>
//     </div>
// </div>
// </>