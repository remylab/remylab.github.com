var player;

function tdPlayerApiReady() {
    console.log('TdPlayerApi is ready');
    //Player API is ready to be used, this is where you can instantiate a new TdPlayerApi instance.
    //Player configuration: list of modules
    var tdPlayerConfig = {
        coreModules: [{
            id: 'MediaPlayer',
            playerId: 'td_container',
            techPriority: ['Html5', 'Flash'],
            plugins: [{
                id: "vastAd"
            }]
        }, {
            id: 'NowPlayingApi'
        }]
    };
    //Player instance
    player = new TdPlayerApi(tdPlayerConfig);
    //Listen for player-ready callback
    player.addEventListener('player-ready', onPlayerReady);
    //Listen for module-error callback
    player.addEventListener('module-error', onModuleError);
    //Load the modules
    player.loadModules();
}
/* Callback function called to notify that the API is ready to be used */
function onPlayerReady() {
    var callsign = getParameterByName("callsign");
    if ( callsign == null) {
        callsign = 'TRITONRADIOMUSIC';
    }
    $('#callsign').html(callsign);
    //Listen for 'track-cue-point' event
    player.addEventListener('track-cue-point', onTrackCuePoint);
    //Play the stream: station is TRITONRADIOMUSIC
    player.play({
        station: callsign
    });
}
/* Callback function called to notify that a module has not been loaded properly */
function onModuleError(object) {
    console.log(object);
    console.log(object.data.errors);
    //Error code : object.data.errors[0].code
    //Error message : object.data.errors[0].message
}
/* Callback function called to notify that a new Track CuePoint comes in. */
function onTrackCuePoint(e) {
    $('#cuePoint').html(JSON.stringify(e.data.cuePoint));
    $('#nowPlaying').load(e.data.cuePoint.nowplayingURL);
}

function getParameterByName(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
