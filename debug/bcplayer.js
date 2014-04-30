/*jslint devel: true, browser: true, node: true*/
/*global ais_client, ENV, $, brightcove, BRIGHTCOVE_RESET_AD, BRIGHTCOVE_EXTERNAL_AD*/
var bcplayer = (function () {
    "use strict";
    var ais,// instance of ais_client
        //  CONSTANTS ===================================================================================================
        Events = {
            DRM_WITH_HTML5 : "bcplayer_drm_with_html5",
            ERROR_NOT_AUTHZ : "bcplayer_error_not_authz",
            ERROR_NOT_AUTHN : "bcplayer_error_not_authn"
        },

        //  PROPERTIES ===================================================================================================
        tve,
        autoStart,
        timestamp,
        $bcplayer,
        player,
        playerType,
        APIModules,
        mediaEvent,
        adEvent,
        advertising,
        authModule,
        videoPlayer,
        video = {duration : 0, isDrm : false, isAuth : false, aisResource : "", aisVideoId: ""},
        adOrd, // unique id used for ad server URL
        adServerUrl = "",
        // legacy
        adZone,adSite,adPath,adPathHTML5,adShowKeys,adPos = 0,adTile = 0,
        // gpt
        gptAdUnit1, gptAdUnit2, gptAdKeys,
        adStarted = false,
        isMidroll = false,// more variable to handle ads...
        currentPosition = 0,
        lastSavedPosition = 0,
        seekToPosition = null,
        vcsInterval = 30,
        maxPosition = null,
        timeLastCheckedPosition = 0,
        timeLastAuthz = 0,
        firstAuthz = true,
        isAuthorized = false,
        isAuthenticated = false,
        templateReadyDone, // only one player by page

       // METHODS DECLARATION ==========================================================================================
        bind,
        trigger,
        getOrd,
        init,
        onLogoutHandler,
        onAuthZHandler,
        onVCSHandler,
        requestAuthorization,
        onAdStart,
        onMediaBegin,
        onMediaPlay,
        onMediaProgress,
        onMediaStop,
        onMediaChange,
        saveVideoPosition,
        checkDurationAndSave,
        retrieveVideoPosition,
        convertToTimecode,
        convertFromTimecode,
        onAuthNeeded,
        setAds,
        setGPTAds,
        checkVideo,
        onTemplateLoaded,
        onTemplateReady,
        onTemplateError,
        getAdStarted,
        getIsMidroll,
        getPlayer,
        getAPIModules,
        getMediaEvent,
        getAdEvent,
        log;

       // METHODS ======================================================================================================
    bind = function () {
        if (!$bcplayer) {
            $bcplayer = $(bcplayer);
        }
        $bcplayer.bind.apply($bcplayer, arguments);
    };

    trigger = function (event) {
        if (!$bcplayer) {
            $bcplayer = $(bcplayer);
        }
        $bcplayer.trigger(event);
    };

   //====== private methods =======//
    getOrd = function () {
        return Math.round(Math.random() * 100000000000);
    };

    init = function (config) {
        log("bcplayer --- init");
        tve = config.tve;
        autoStart = config.autoStart;
        timestamp = new Date().getTime();
        video = $.extend(video, config.video);
        adZone = config.adZone;
        adSite = config.adSite;
        adPath = config.adPath;
        adPathHTML5 = config.adPathHTML5;
        adShowKeys = config.adShowKeys;
        adOrd = getOrd();
        gptAdUnit1 = config.gptAdUnit1;
        gptAdUnit2 = config.gptAdUnit2;
        gptAdKeys = config.gptAdKeys;
        
        log("bcplayer --- ais_client setup :" + config.aisPlatformId);
        // we need one global JSONP method by ais_client
        window.bcplayer_aisresponse = function (resp) {
            ais.aisresponse(resp);
        };
        
        ais = new ais_client('bcplayer_aisresponse');
        ais.setPlatformId(config.aisPlatformId);
        ais.baseurl = config.baseurl;
        ais.assignhandler("authz_query", onAuthZHandler);
        ais.assignhandler("vcs", onVCSHandler);
        ais.assignhandler('logout_result', onLogoutHandler);
        ais.setCacheTime('authz_query', 15000);
    };

    // debug logging
    log = function (message) {

        if (window.console) {
            console.log(message);
        } else {
            alert(message);
        }
    };

    onLogoutHandler = function () {
        log("bcplayer --- onLogoutHandler");
        isAuthenticated = false;
        isAuthorized = false;
    };

    onAuthZHandler = function (type, response) {
        log("bcplayer --- authzHandler " + type);
        isAuthenticated = true;
        // if user is authorized, pass token to player and start playback
        if (response.authorization) {
            isAuthorized = true;
            if (video.isAuth) {
                authModule.playWithToken(response.security_token, 'ais');
            }
            // dont do the following on subsequent pause/play events
            if (firstAuthz) {
                // if auto-play : requires slight delay
                if (autoStart) {
                    setTimeout(function () {
                        videoPlayer.play();
                    }, 50);
                }
                // see if previous position has been saved
                retrieveVideoPosition();
                checkDurationAndSave();
            }
        // otherwise, report the error
        } else {
            console.log("bcplayer --- authz failed");
            isAuthorized = false;
        }
        firstAuthz = false;
    };

    onVCSHandler = function (type, response) {
        log("bcplayer --- vcs done : " + response.operation + ", pos :" + response.ph_pos + " " + type);
        var position;
        // only interested in position retrieval
        if (response.operation === "get" && !response.missing) {
            position = convertFromTimecode(response.ph_pos);
            // if valid number, set flag so player will seek there once it is ready
            if (position && !isNaN(position) && position > 0) {
                seekToPosition = position;
            }
        }
    };

    requestAuthorization = function (resourceId) {
        // don't fire authz too often
        var time = new Date().getTime();
        if ((time - timeLastAuthz) > 3000) {
            log("bcplayer --- request auzth for :" + resourceId);
            timeLastAuthz = new Date().getTime();
            ais.resourceAccess(resourceId);
        }
    };

    onAdStart = function () {
        adStarted = true;
        setAds();
        $(document).trigger(BRIGHTCOVE_RESET_AD, []);
        if (playerType === "html") {
            $(document).trigger(BRIGHTCOVE_EXTERNAL_AD, []);
        }
    };

    onMediaBegin = function () {
        isMidroll = true;
        if (adStarted === false) {
            $(document).trigger(BRIGHTCOVE_RESET_AD, []);
            $(document).trigger(BRIGHTCOVE_EXTERNAL_AD, []);
        }
    };

    onMediaPlay = function () {
        if (!tve) { return; }
        log("bcplayer --- onMediaPlay, type =" + playerType);
        checkVideo();
        if (!maxPosition) {
            setTimeout(function () {
                videoPlayer.getVideoDuration(false, function (res) {
                    maxPosition = res;
                    log("bcplayer --- video duration :" + convertToTimecode(res));
                });
            }, 3000);
        }
        requestAuthorization(video.aisResource);
    };

    onMediaProgress = function (event) {
        if (adStarted) {
            adPos = 0;
            adTile = 0;
            setAds();
        }
        adStarted = false;

        if (!tve) { return; }
        currentPosition = event.position;
        if (seekToPosition && seekToPosition > 0) {
            setTimeout(function () {
                if (seekToPosition && seekToPosition > 0) {
                    log("bcplayer --- progress, force seek :" + convertToTimecode(seekToPosition));
                    videoPlayer.seek(seekToPosition);
                    lastSavedPosition = seekToPosition; // to avoid useless VCS set
                    seekToPosition = null;
                }
            }, 50);
        }
        checkDurationAndSave();
        // fire authz every 5min for live stream
        if (maxPosition && maxPosition < 0) {
            var time = new Date().getTime(),
                liveCheckInterval = 300 * 1000;
            if ((time - timeLastAuthz) > liveCheckInterval) {
                requestAuthorization(video.aisResource);
            }
        }
    };

    onMediaStop = function (event) {
        if (!tve) { return; }
        currentPosition = event.position;
        checkDurationAndSave();
    };

    onMediaChange = function () {
        if (!tve) { return; }
        log("bcplayer --- onMediaChange");
        checkVideo();
        currentPosition = 0;
        lastSavedPosition = 0;
        if (video.isAuth === true) {
            seekToPosition = null;
            requestAuthorization(video.aisResource);
        }
    };

    // saves the lastPosition recorded to VCS
    saveVideoPosition = function (position) {
        if (position <= 0) {
            return;
        }
        log("bcplayer --- saveVideoPosition  :" + convertToTimecode(Math.round(position)));
        lastSavedPosition = position;
        ais.vcsSet(video.aisVideoId, convertToTimecode(Math.round(position)));
    };

    checkDurationAndSave = function () {
        // don't save position for short videos or live stream (maxPosition=-1 for live)
        if (!(maxPosition && (maxPosition > (vcsInterval * 2)))) { return; }
        // check only every 1 second
        var time = new Date().getTime(),
            delta = Math.abs(currentPosition - lastSavedPosition),
            timeToEnd;
        if ((time - timeLastCheckedPosition) < 1000) { return; }
        timeLastCheckedPosition =  new Date().getTime();
        // save only <vcsInterval> seconds after latest save
        if (delta >= vcsInterval) {
            timeToEnd = maxPosition - currentPosition;
            // if video ends within 30s force ph_pos to 0
            if (timeToEnd < vcsInterval && timeToEnd >= 0) {
                log(" bcplayer --- timeToEnd : " + timeToEnd);
                lastSavedPosition = currentPosition;
                ais.vcsSet(video.aisVideoId, convertToTimecode(0));
            } else if (currentPosition > vcsInterval) {
                saveVideoPosition(currentPosition);
            }
        }
    };

    // retrieves last viewed position from VCS
    retrieveVideoPosition = function () {
        log("bcplayer --- retrieve vcs for :" + video.aisVideoId + " isAuthorized :" + isAuthorized);
        if (isAuthorized) {
            ais.vcsGet(video.aisVideoId);
        }
    };

    // formats seconds into a timecode string that can be consumed by VCS
    convertToTimecode = function (time) {
        var hours,
            minutes,
            seconds,
            padDigit = function (digit) {
                return (digit >= 10) ? digit : "0" + digit;
            };
        hours = padDigit(Math.floor(time / 3600));
        time %= 3600;
        minutes = padDigit(Math.floor(time / 60));
        seconds = padDigit(Math.floor(time % 60));
        return hours + ":" + minutes + ":" + seconds;
    };

    // formats seconds into a timecode string that can be consumed by VCS
    convertFromTimecode = function (timecode) {
        var time = timecode.split(":");
        return parseInt(time[0], 10) * 3600 + parseInt(time[1], 10) * 60 + parseInt(time[2], 10);
    };

    // called when player attempts to play video that requires auth access and hasn't been given token
    onAuthNeeded = function (event) {
        log("bcplayer --- onAuthNeeded");
        if (event.type === 'authNeeded') {
            log("bcplayer --- onAuthNeeded : " + event.resourceId);
            requestAuthorization(event.resourceId);
        }
    };
    
    setAds = function () {

        log("bcplayer --- setAds");
        
        var sz = (video.duration < 300) ? "9x9" : "9x10";
        
        if (playerType === "html") {
        	gptAdUnit1 += "html5";
        }

        log("bcplayer --- setAds gptAdUnit1, isMidroll " + gptAdUnit1 + ", " + isMidroll);
        
        var gptAdUnit = gptAdUnit1 + "/" + gptAdUnit2;
        
        if (isMidroll) {
        	gptAdUnit += "/midroll";
        }
        
    	adServerUrl = "http://pubads.g.doubleclick.net/gampad/ads?iu=" + gptAdUnit
    	+ "&sz=" + sz + "&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1";
    	
        var adPolicy = Object.create(null);
	    adPolicy.adServerURL = adServerUrl;	    
	    adPolicy.prerollAds = (video.duration >= 180);
	    adPolicy.playerAdKeys = gptAdKeys;
	    adPolicy.adPlayCap = (video.duration < 300) ? 1 : 2;
	    adPolicy.midrollAds = true;
	    advertising.setAdPolicy(adPolicy);
	    

        log("bcplayer --- setAds, adServerUrl = " + adPolicy.adServerURL);
    };

    checkVideo = function () {
        if (video.isAuth) {
            if (isAuthenticated && !isAuthorized) {
                log(" bcplayer --- ERROR_NOT_AUTHORIZED");
                trigger(Events.ERROR_NOT_AUTHZ);
                videoPlayer.pause(true);
            } else if (!isAuthenticated) {
                log(" bcplayer --- ERROR_NOT_AUTHENTICATED");
                trigger(Events.ERROR_NOT_AUTHN);
                videoPlayer.pause(true);
            }
        }
    };

    //====== public methods =======//
    onTemplateLoaded = function (experienceID) {
    	
        log("bcplayer --- onTemplateLoaded");
        brightcove.createExperiences();
        player = brightcove.api.getExperience(experienceID);
        playerType = player.type;
        APIModules = brightcove.api.modules.APIModules;
        log("bcplayer --- onTemplateLoaded #1");
        mediaEvent = brightcove.api.events.MediaEvent;
        authModule = player.getModule(APIModules.AUTH);
        adEvent = brightcove.api.events.AdEvent;

        advertising = player.getModule(APIModules.ADVERTISING);
        setAds();
    };

    onTemplateReady = function () {
        if (templateReadyDone) { return; }
        log("bcplayer --- onTemplateReady");
        templateReadyDone = true;
        videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);

        // show stopper...
        if (playerType === "html" && video.isDrm) {
            log("drm not playable on html5");
            trigger(Events.DRM_WITH_HTML5);
            return;
        }
        if (playerType === "html") {
            adPath = adPathHTML5;
            adSite = adSite + "html5";
        }

        
        // events for advertisement
        advertising.addEventListener(adEvent.START, onAdStart);
        videoPlayer.addEventListener(mediaEvent.BEGIN, onMediaBegin);
        // events for VCS
        videoPlayer.addEventListener(mediaEvent.STOP, onMediaStop);
        videoPlayer.addEventListener(mediaEvent.PLAY, onMediaPlay);
        videoPlayer.addEventListener(mediaEvent.PROGRESS, onMediaProgress);

        if (!tve) { return; }
        authModule.addEventListener(brightcove.api.events.AuthEvent.AUTH_NEEDED, onAuthNeeded);
        seekToPosition = null;
        requestAuthorization(video.aisResource);

        // responsive and resize
        videoPlayer.getCurrentRendition( function (renditionDTO) {
            var newPercentage = ( renditionDTO.frameHeight / renditionDTO.frameWidth ) * 100;
            newPercentage = newPercentage + "%";
            $(".playerContainer").style.paddingBottom = newPercentage;
        });
    };

    onTemplateError = function (event) {
        log("type: " + event.type);
        log("errorType: " + event.errorType);
        log("code: " + event.code);
        log("info: " + event.info);
    };

    getAdStarted = function () {
        return adStarted;
    };
    getIsMidroll = function () {
        return isMidroll;
    };
    getPlayer = function () {
        return player;
    };
    getAPIModules = function () {
        return APIModules;
    };
    getMediaEvent = function () {
        return mediaEvent;
    };
    getAdEvent = function () {
        return adEvent;
    };

    return {
        init : init,
        onTemplateLoaded : onTemplateLoaded,
        onTemplateReady : onTemplateReady,
        onTemplateError : onTemplateError,
        Events : Events,
        bind : bind,
        getAdStarted: getAdStarted,
        getIsMidroll: getIsMidroll,
        getPlayer: getPlayer,
        getAPIModules: getAPIModules,
        getMediaEvent: getMediaEvent,
        getAdEvent: getAdEvent
    };
}());