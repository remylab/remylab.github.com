/*jslint devel: true, browser: true, node: true*/
/*global ais_client, $, brightcove */
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
        isAfterMidroll = false,
        isPlaying = false,
        currentClip = 1,
        mediaClip,
        streamSense,
        videoMetrixC2,
        streamSenseC2,
        siteTag,
        autoStart,
        timestamp,
        $bcplayer,
        player,
        playerType,
        APIModules,
        mediaEvent,
        adEvent,
        adModule,
        authModule,
        cuePointsModule,
        cuePoints = [],
        videoPlayer,
        video = {bcId:"", duration : 0, isDrm : false, isAuth : false, aisResource : "", aisVideoId: ""},
        videoType,
        adOrd, // unique id used for ad server URL
        adServerUrl = "",
        // ads
        adSite, adPath, adPathHTML5, gptAdUnit1, gptAdUnit2, gptAdKeys,
        adStarted = false, isMidroll = false,// more variable to handle ads...
        isMediaComplete = false,
        currentPosition = 0,
        latestPositions = [0], indexLatestPositions = 0, timeUpdateLatestPositions = 0, // cue points variables
        kickAdsPending = false, kickAdsPosition = 0,
        lastSavedPosition = 0,
        seekToPosition = null,
        vcsInterval = 30,
        maxPosition = null,
        refId = null,
        timeLastCheckedPosition = 0,
        timeLastAuthz = 0,
        firstAuthz = true,
        isAuthorized = false,
        isAuthenticated = false,
        templateReadyDone, 
        comscoreBeacon,
        withLogs = false,

        // METHODS DECLARATION ==========================================================================================
        bind,
        trigger,
        getOrd,
        getParam,
        init,
        onLogoutHandler,
        onAuthZHandler,
        onVCSHandler,
        requestAuthorization,
        onAdStart,
        onAdComplete,
        onMediaBegin,
        onMediaPlay,
        onMediaProgress,
        onMediaStop,
        onMediaChange,
        onMediaSeek,
        onMediaComplete,
        onMediaError,
        saveVideoPosition,
        streamSenseClip,
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
        triggerAdOnSeek, updateLatestPositions, getBeforeSeekPosition, kickSomeAds, logCuePoints,
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
    
    getParam = function(name){
	   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) {
		      return decodeURIComponent(name[1]);
	   }
	};

    init = function (config) {
    	
        log("bcplayer --- init");
        siteTag = config.siteTag;
        videoMetrixC2 = config.videoMetrixC2;
        streamSenseC2 = config.streamSenseC2;
        refId = config.refId;
        tve = config.tve;
        autoStart = config.autoStart;
        timestamp = new Date().getTime();
        video = $.extend(video, config.video);
        adSite = config.adSite;
        adPath = config.adPath;
        adPathHTML5 = config.adPathHTML5;
        adOrd = getOrd();
        withLogs = (getParam("bclogs") === "true");
        gptAdUnit1 = config.gptAdUnit1;
        gptAdUnit2 = config.gptAdUnit2;
        gptAdKeys = config.gptAdKeys;
        videoType = config.videoType;

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

    	if ( !withLogs) return;
    	
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

    onAdStart = function (event) {

        adStarted = true;

        if (isMidroll && !isAfterMidroll) {
            //The first part of the video has ended.
            streamSense.notify(ns_.StreamSense.PlayerEvents.END, {}, event.position * 1000);
            comscoreBeacon("11");
            isAfterMidroll = true;
        } else {
            comscoreBeacon("09");
        }
        //Change the clip and notify the ad has started.
        streamSenseClip("1", "0", true, "none");
        streamSense.notify(ns_.StreamSense.PlayerEvents.PLAY, {}, event.position * 1000);
        setAds();
        
        
        // clear kickAds after it has been played
        if ( kickAdsPosition > 0 ) {

            log("bcplayer --- remove kickAds position : " + convertToTimecode(kickAdsPosition) );
        	cuePointsModule.removeAdCuePointsAtTime(video.bcId, kickAdsPosition);
        	kickAdsPosition = 0;
			kickAdsPending = false;
			logCuePoints();
        }
    };

    onAdComplete = function (event) {
        streamSense.notify(ns_.StreamSense.PlayerEvents.END, {}, event.position * 1000);
    };

    onMediaBegin = function (event) {
        isMidroll = true;
        isMediaComplete = false;
        if (event.duration > 600) {
            comscoreBeacon("03");
        } else {
            comscoreBeacon("02");
        }
    };

    onMediaPlay = function (event) {
        isPlaying = true;
        if (mediaClip === undefined) {
            //Set the media as the current clip and notify the first part has started.
            mediaClip = currentClip;
            streamSenseClip("1", event.duration * 1000, false, event.media.FLVFullLengthURL);
        }
        streamSense.notify(ns_.StreamSense.PlayerEvents.PLAY, {}, event.position * 1000);
        

    	triggerAdOnSeek(event.position);
        
        if (tve) { 
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
        }

    };

    onMediaProgress = function (event) {
        if (adStarted) {
            setAds();
        }
        adStarted = false;
        if (isAfterMidroll) {
          //Set the second part of the media as the current clip
            streamSenseClip("2", event.duration * 1000, false, event.media.FLVFullLengthURL);
            streamSense.notify(ns_.StreamSense.PlayerEvents.PLAY, {}, event.position * 1000);
            isAfterMidroll = false;
        }
        currentPosition = event.position;
        
        // array of latestPositions so we make to find one < seekPosition
        updateLatestPositions(currentPosition);
        
        if (tve) { 
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
        }

    };
    
    // latestPositions is an array of the 20 latest position 
    // with 200 ms distance, ex : [2.796, 2.534, 2.29, 2.056, 1.791, 1.49, 1.277, 1.074, 0.851, 0.556, 0.27] 
    updateLatestPositions = function(pos) {
    	var timeNow = new Date().getTime() / 1000;
    	if ( timeNow - timeUpdateLatestPositions > 0.2 ) {
    		timeUpdateLatestPositions = timeNow;
    		
    		if ( pos  < latestPositions[0] ) {
    			latestPositions = [0];
    			return;
    		}
    		
        	latestPositions[indexLatestPositions] = Math.round(pos * 100) / 100;
        	indexLatestPositions += 1;
        	if ( indexLatestPositions > 10) {
        		indexLatestPositions = 0;
        	}
        	
        	latestPositions.sort(function(n1,n2){return n2 - n1});
    		
    	}
    };
    
    // From the latestPositions array, ex : [188.161, 187.916, 2.796, 2.534, 2.29, 2.056, 1.791, 1.49, 1.277, 1.074, 0.851, 0.556, 0.27] 
    // we can say the latestSeekPosition is 2.796
    getBeforeSeekPosition = function(seekPos) {
    	for(var i in latestPositions) {
    		var time = latestPositions[i];
    		if ( Math.abs(seekPos-time) > 0.5) {
    			return time;
    		}
    	}
    	return 0;
    };

    onMediaStop = function (event) {
        isPlaying = false;
        streamSense.notify(ns_.StreamSense.PlayerEvents.PAUSE, {}, event.position * 1000);
        
        if (tve) { 
	        currentPosition = event.position;
	        checkDurationAndSave();
        }

    };

    onMediaChange = function () {
        
        if (tve) {  
	        checkVideo();
	        currentPosition = 0;
	        lastSavedPosition = 0;
	        if (video.isAuth === true) {
	            seekToPosition = null;
	            requestAuthorization(video.aisResource);
	        }
        }

    };

    onMediaSeek = function (event) {
        if (!isMediaComplete && isPlaying){
        	
        	triggerAdOnSeek(event.position);
            
            //Stop the stream at the last currentPosition and start it again at seeked position.
            streamSense.notify(ns_.StreamSense.PlayerEvents.PAUSE, {}, currentPosition * 1000);
            streamSense.notify(ns_.StreamSense.PlayerEvents.PLAY, {}, event.position * 1000);
        }
    };
    
    triggerAdOnSeek = function(seekPos) {
    	
    	if ( kickAdsPending ) return;
    	
    	var beforePos = getBeforeSeekPosition(seekPos);
    	if ( seekPos > beforePos) {
    		for (var i in cuePoints) {
    			var cueTime = cuePoints[i];
    			if ( beforePos < cueTime && cueTime < seekPos) {
    				kickAdsPending = true;
    				kickSomeAds(seekPos);
    				return;
    			}
    		}
    	}
    };
    
    kickSomeAds = function(pos) {
    	kickAdsPosition = pos+1;
		log("Force midroll ads / at :" + convertToTimecode(kickAdsPosition) );
	
    	var cuePoints = [{time:kickAdsPosition, type:0}];
    	cuePointsModule.addCuePoints(video.bcId, cuePoints);
		
    	logCuePoints();
    };
    
    logCuePoints = function(){
    	log(" === LOG cuePoints from cuePointsModule.getCuePoints");
    	if ( withLogs ) {
        	cuePointsModule.getCuePoints(video.bcId, function(result){
        		for(var data in result){
        			var cuepoint = result[data];
        			log(cuepoint.name + " : " +convertToTimecode(cuepoint.time));
        		}
        	});
    	}
    }

    onMediaError = function (event) {
        streamSense.notify(ns_.StreamSense.PlayerEvents.END, {}, event.position * 1000);
    };

    onMediaComplete = function (event) {
        isMediaComplete = true;
        streamSense.notify(ns_.StreamSense.PlayerEvents.END, {}, event.position * 1000);
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
    	// no ads for kids...
        if (userAge === "under12" || videoType == "Bandes-annonces") { return; }

        //var sz = (video.duration < 300) ? "9x9" : "9x10";
        var sz = "9x10";

        if (playerType === "html") {
            gptAdUnit1 += "html5";
        }

        var gptAdUnit = gptAdUnit1 + "/" + gptAdUnit2;
        
        if (isMidroll) {
            gptAdUnit += "/midroll";
        }

        adServerUrl = "http://pubads.g.doubleclick.net/gampad/ads?iu=" + gptAdUnit
            + "&sz=" + sz + "&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1";
        
        var adPolicy = {};
        adPolicy.adServerURL = adServerUrl;
        adPolicy.prerollAds = false;//true;
        adPolicy.playerAdKeys = gptAdKeys;
        adPolicy.adPlayCap = (video.duration < 300) ? 1 : 2;
        adPolicy.midrollAds = true;
        adModule.setAdPolicy(adPolicy);
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
        log("bcplayer --- onTemplateLoad");
        brightcove.createExperiences();
        player = brightcove.api.getExperience(experienceID);
        playerType = player.type;
        APIModules = brightcove.api.modules.APIModules;
        mediaEvent = brightcove.api.events.MediaEvent;
        authModule = player.getModule(APIModules.AUTH);
        adEvent = brightcove.api.events.AdEvent;
        adModule = player.getModule(APIModules.ADVERTISING);
        cuePointsModule = player.getModule(APIModules.CUE_POINTS);
        setAds();

        //comScore StreamSense Analytics
        streamSense = new ns_.StreamSense({}, 'http://b.scorecardresearch.com/p?c1=2&c2=' + streamSenseC2 + "&c3=" + siteTag);
        streamSense.setPlaylist();
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
        
        // get videoDTO id and array of cue points (in seconds)
        videoPlayer.getCurrentVideo(function(result){
        	video.bcId = result.id;
        	cuePointsModule.getCuePoints(video.bcId, function(result){
        		for(var data in result){
        			var cuepoint = result[data];
        			log(cuepoint.name + " : " +convertToTimecode(cuepoint.time));
        			if ( cuepoint.time > 0 ) {
        				cuePoints.push(cuepoint.time);
        			}
        		}
        	});
        });

        // events for advertisement
        adModule.addEventListener(adEvent.START, onAdStart);
        adModule.addEventListener(adEvent.COMPLETE, onAdComplete);
        // events for VCS
        videoPlayer.addEventListener(mediaEvent.BEGIN, onMediaBegin);
        videoPlayer.addEventListener(mediaEvent.STOP, onMediaStop);
        videoPlayer.addEventListener(mediaEvent.PLAY, onMediaPlay);
        videoPlayer.addEventListener(mediaEvent.PROGRESS, onMediaProgress);
        videoPlayer.addEventListener(mediaEvent.SEEK_NOTIFY, onMediaSeek);
        videoPlayer.addEventListener(mediaEvent.ERROR, onMediaError);
        videoPlayer.addEventListener(mediaEvent.COMPLETE, onMediaComplete);
        
        if (tve) {
            authModule.addEventListener(brightcove.api.events.AuthEvent.AUTH_NEEDED, onAuthNeeded);
            seekToPosition = null;
            requestAuthorization(video.aisResource); 
        }


        // responsive and resize
        videoPlayer.getCurrentRendition(function (renditionDTO) {
            var newPercentage = (renditionDTO.frameHeight / renditionDTO.frameWidth) * 100;
            newPercentage = newPercentage + "%";
            
            if ( $(".playerContainer").length>0 ) {
                $(".playerContainer").style.paddingBottom = newPercentage;
            }
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
    comscoreBeacon = function (c5) {
        COMSCORE.beacon({
            c1 : 1,
            c2 : videoMetrixC2,
            c3 : siteTag,
            c5 : c5
        });
    };

    streamSenseClip = function (part, duration, isAd, source) {
        var classification, clip;
        duration = duration * 1000;
        if (isAd) {
            if (isMidroll) {
                classification = "va12";
            } else {
                classification = "va11";
            }
            clip = {
                "ns_st_cn" : currentClip,
                "ns_st_ci" : refId,
                "ns_st_pn" : "1",
                "ns_st_tp" : "1",
                "ns_st_cl" : duration,
                "ns_st_pu" : "Bell Media",
                "ns_st_cu" : source,
                "ns_st_ad" : "1",
                "ns_st_ct" : classification,
                "ns_st_de" : siteTag
            };
        } else {
            if (duration > 600) {
                classification = "vc12";
            } else {
                classification = "vc11";
            }
            clip = {
                "ns_st_cn" : mediaClip,
                "ns_st_ci" : refId,
                "ns_st_pn" : part,
                "ns_st_tp" : "0",
                "ns_st_cl" : duration,
                "ns_st_pu" : "Bell Media",
                "ns_st_cu" : source,
                "ns_st_ct" : classification,
                "ns_st_de" : siteTag
            };
        }
        streamSense.setClip(clip);
        currentClip += 1;
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