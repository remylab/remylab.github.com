/*jslint devel: true, browser: true, node: true*/
/*global ais_client, $, brightcove */
var bcplayer = (function() {
    "use strict";
    var isAfterMidroll = false,
        isPlaying = false,
        currentClip = 1,
        mediaClip,
        streamSense,
        videoMetrixC2,
        streamSenseC2,
        siteTag,
        autoStart,
        ageRestricted,
        timestamp,
        $bcplayer,
        player,
        playerType,
        APIModules,
        mediaEvent,
        adEvent,
        adModule,
        cuePointsModule,
        cuePoints = [],
        videoPlayer,
        video = {
            bcId: "",
            duration: 0,
            aisVideoId: "",
            rating: ""
        },
        videoType,
        adOrd, // unique id used for ad server URL
        adServerUrl = "",
    // ads
        adSite, adPath, adPathHTML5, gptAdUnit1, gptAdUnit2, gptAdKeys,
        adStarted = false,
        isMidroll = false, // more variable to handle ads...
        isMediaComplete = false,
        currentPosition = 0,
        latestPositions = [0],
        indexLatestPositions = 0,
        timeUpdateLatestPositions = 0, // cue points variables
        forceMidrollPending = false,
        forceMidrollPosition = 0,
        onForcedMidrollCompleted,
        maxPosition = null,
        refId = null,
        templateReadyDone,
        comscoreBeacon,
        withLogs = true,
        currentVideoIndex, //next video list index
        videoArray = [], //next video list array


    // METHODS DECLARATION ==========================================================================================
        bind,
        trigger,
        getOrd,
        getParam,
        init,
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
        streamSenseClip,
        setAds,
        setGPTAds,
        onTemplateLoaded,
        onTemplateReady,
        onTemplateError,
        getAdStarted,
        getIsMidroll,
        getPlayer,
        getAPIModules,
        getMediaEvent,
        getAdEvent,
        triggerAdOnSeek, updateLatestPositions, getBeforeSeekPosition, forceMidroll, logCuePoints, convertToTimecode,displayNextVideoTitle,
        loadVideo,
        getCurrentVideoIndex,
        log;

    // METHODS ======================================================================================================
    bind = function() {
        if (!$bcplayer) {
            $bcplayer = $(bcplayer);
        }
        $bcplayer.bind.apply($bcplayer, arguments);
    };

    trigger = function(event) {
        if (!$bcplayer) {
            $bcplayer = $(bcplayer);
        }
        $bcplayer.trigger(event);
    };

    //====== private methods =======//
    getOrd = function() {
        return Math.round(Math.random() * 100000000000);
    };

    getParam = function(name) {
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search)) {
            return decodeURIComponent(name[1]);
        }
    };

    init = function(config) {
        withLogs = (getParam("bclogs") === "true");
        log("bcplayer --- init");
        siteTag = config.siteTag;
        videoMetrixC2 = config.videoMetrixC2;
        streamSenseC2 = config.streamSenseC2;
        refId = config.refId;
        autoStart = config.autoStart;
        ageRestricted = config.ageRestricted;
        timestamp = new Date().getTime();
        video = $.extend(video, config.video);
        adSite = config.adSite;
        adPath = config.adPath;
        adPathHTML5 = config.adPathHTML5;
        adOrd = getOrd();
        gptAdUnit1 = config.gptAdUnit1;
        gptAdUnit2 = config.gptAdUnit2;
        gptAdKeys = config.gptAdKeys;
        videoType = config.videoType;
        currentVideoIndex = config.currentVideoIndex;
        videoArray = config.videoArray;
    };

    // debug logging
    log = function(message) {

        if (!withLogs) return;

        if (window.console) {
            console.log(message);
        } else {
            alert(message);
        }
    };


    onAdStart = function(event) {

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

        onForcedMidrollCompleted()
    };

    onForcedMidrollCompleted = function() {
        // clearforcedMidroll after it has been played
        if (forceMidrollPosition > 0) {

            log("bcplayer --- remove forcedMidroll cuePoint : " + convertToTimecode(forceMidrollPosition));
            cuePointsModule.removeAdCuePointsAtTime(video.bcId, forceMidrollPosition);
            forceMidrollPosition = 0;
            forceMidrollPending = false;
            logCuePoints();
        }
    };

    // formats seconds into a timecode string that can be consumed by VCS
    convertToTimecode = function(time) {
        var hours,
            minutes,
            seconds,
            padDigit = function(digit) {
                return (digit >= 10) ? digit : "0" + digit;
            };
        hours = padDigit(Math.floor(time / 3600));
        time %= 3600;
        minutes = padDigit(Math.floor(time / 60));
        seconds = padDigit(Math.floor(time % 60));
        return hours + ":" + minutes + ":" + seconds;
    };

    onAdComplete = function(event) {
        streamSense.notify(ns_.StreamSense.PlayerEvents.END, {}, event.position * 1000);
    };

    onMediaBegin = function(event) {
        isMidroll = true;
        isMediaComplete = false;
        if (event.duration > 600) {
            comscoreBeacon("03");
        } else {
            comscoreBeacon("02");
        }
    };

    onMediaPlay = function(event) {
        isPlaying = true;
        if (mediaClip === undefined) {
            //Set the media as the current clip and notify the first part has started.
            mediaClip = currentClip;
            streamSenseClip("1", event.duration * 1000, false, event.media.FLVFullLengthURL);
        }
        streamSense.notify(ns_.StreamSense.PlayerEvents.PLAY, {}, event.position * 1000);
    };

    onMediaProgress = function(event) {

        if (isAfterMidroll) {
            //Set the second part of the media as the current clip
            streamSenseClip("2", event.duration * 1000, false, event.media.FLVFullLengthURL);
            streamSense.notify(ns_.StreamSense.PlayerEvents.PLAY, {}, event.position * 1000);
            isAfterMidroll = false;
        }
        currentPosition = event.position;

        // array of latestPositions so we can find one < seekPosition
        updateLatestPositions(currentPosition);

        //TODO uncomment when div#id will be done on mockups to display next video Title
        displayNextVideoTitle(event.position, event.duration)

    };

    //TODO div#id set to label... maybe change it
    displayNextVideoTitle = function(pos, dur){
        var nextVideoTitle;
        if ( (dur - pos) < 10 ) {

            if(currentVideoIndex < videoArray.length){
                $("div.next-media-caption").show(800);

                //set new Video
                nextVideoTitle = videoArray[currentVideoIndex].title;
                $("em.next-title").html(nextVideoTitle);
            }
        }else{
            $(".next-media-caption").hide(800);
            $("em.next-title").html("");
        }
    };

    // latestPositions is an array of the 20 latest position
    // with 200 ms distance, ex : [2.796, 2.534, 2.29, 2.056, 1.791, 1.49, 1.277, 1.074, 0.851, 0.556, 0.27]
    updateLatestPositions = function(pos) {
        var timeNow = new Date().getTime() / 1000;
        if (timeNow - timeUpdateLatestPositions > 0.5) {
            timeUpdateLatestPositions = timeNow;

            if (pos < latestPositions[0]) {
                latestPositions = [0];
                return;
            }

            latestPositions[indexLatestPositions] = Math.round(pos * 100) / 100;
            indexLatestPositions += 1;
            if (indexLatestPositions > 10) {
                indexLatestPositions = 0;
            }

            latestPositions.sort(function(n1, n2) {
                return n2 - n1
            });

        }
    };

    // From the latestPositions array, ex : [188.161, 187.916, 2.796, 2.534, 2.29, 2.056, 1.791, 1.49, 1.277, 1.074, 0.851, 0.556, 0.27]
    // we can say the latestSeekPosition is 2.796
    getBeforeSeekPosition = function() {
        var max = latestPositions.length - 1;
        for (var i = 0; i < max; i++) {
            var n1Pos = latestPositions[i];
            var n2Pos = latestPositions[i + 1];
            if (Math.abs(n1Pos - n2Pos) > 1) {
                return n2Pos;
            }
            seekPos
        }
        return 0;
    };

    onMediaStop = function(event) {
        isPlaying = false;
        streamSense.notify(ns_.StreamSense.PlayerEvents.PAUSE, {}, event.position * 1000);
    };

    onMediaChange = function() {
       setAds();
    };

    onMediaSeek = function(event) {

        log(" === onMediaSeek ==== latestPositions :" + latestPositions);

        if (!isMediaComplete && isPlaying) {

            triggerAdOnSeek(event.position);

            //Stop the stream at the last currentPosition and start it again at seeked position.
            streamSense.notify(ns_.StreamSense.PlayerEvents.PAUSE, {}, currentPosition * 1000);
            streamSense.notify(ns_.StreamSense.PlayerEvents.PLAY, {}, event.position * 1000);
        }
    };

    triggerAdOnSeek = function(seekPos) {

        log("=== triggerAdOnSeek === , forceMidrollPending : " + forceMidrollPending);
        if (forceMidrollPending) return;

        var beforePos = getBeforeSeekPosition();

        if (seekPos > beforePos && beforePos > 0) {
            for (var i in cuePoints) {
                var cueTime = cuePoints[i].time;
                if (beforePos < cueTime && cueTime < seekPos) {
                    forceMidrollPending = true;
                    forceMidroll(seekPos);
                    return;
                }
            }
        }
    };

    forceMidroll = function(pos) {
        forceMidrollPosition = pos + 0.2;
        log("Force midroll ads / at :" + convertToTimecode(forceMidrollPosition));

        // if the adServer fail to return a VAST xml
        // we have a fallback to cleanup the forced cuepoint
        setTimeout(function() {
            onForcedMidrollCompleted();
        }, 2000);

        var cuePoints = [{
            name: "forcedCuePoint",
            time: forceMidrollPosition,
            type: 0
        }];
        cuePointsModule.addCuePoints(video.bcId, cuePoints);

        logCuePoints();
    };

    logCuePoints = function() {
        log(" === LOG cuePoints from cuePointsModule.getCuePoints");
        if (withLogs) {
            cuePointsModule.getCuePoints(video.bcId, function(result) {
                for (var data in result) {
                    var cuepoint = result[data];
                    log(cuepoint.name + " : " + convertToTimecode(cuepoint.time));
                }
            });
        }
    }

    onMediaError = function(event) {
        streamSense.notify(ns_.StreamSense.PlayerEvents.END, {}, event.position * 1000);
    };

    onMediaComplete = function(event) {
        isMediaComplete = true;
        loadVideo();
        streamSense.notify(ns_.StreamSense.PlayerEvents.END, {}, event.position * 1000);
    };

    setAds = function() {
        // no ads for kids...
        if ((typeof userAge != 'undefined' && userAge === "under12") || videoType == "Bandes-annonces") {
            return;
        }

        //var sz = (video.duration < 300) ? "9x9" : "9x10";
        var sz = "9x10";
        
        if (playerType === "html" && (gptAdUnit1.indexOf("html5") == -1) ) {
            gptAdUnit1 += "html5";
        	log("setup html5 adUnit :" + gptAdUnit1);
        }

        var gptAdUnit = gptAdUnit1 + "/" + gptAdUnit2;

        if (isMidroll) {
            gptAdUnit += "/midroll";
        }
        
        log("final adUnit :" + gptAdUnit);
        
        adServerUrl = "http://pubads.g.doubleclick.net/gampad/ads?iu=" + gptAdUnit + "&sz=" + sz + "&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1";

        var adPolicy = {};
        adPolicy.adServerURL = adServerUrl;
        adPolicy.prerollAds = true;
        adPolicy.playerAdKeys = gptAdKeys;
        adPolicy.adPlayCap = (video.duration < 300) ? 1 : 2;
        adPolicy.midrollAds = true;
        adModule.setAdPolicy(adPolicy);
    };

    //====== public methods =======//
    onTemplateLoaded = function(experienceID) {
        log("bcplayer --- onTemplateLoad");
        brightcove.createExperiences();
        player = brightcove.api.getExperience(experienceID);
        playerType = player.type;
        APIModules = brightcove.api.modules.APIModules;
        mediaEvent = brightcove.api.events.MediaEvent;
        adEvent = brightcove.api.events.AdEvent;
        adModule = player.getModule(APIModules.ADVERTISING);
        cuePointsModule = player.getModule(APIModules.CUE_POINTS);
        log("bcplayer --- setAds");
        setAds();
        //comScore StreamSense Analytics
        streamSense = new ns_.StreamSense({}, 'http://b.scorecardresearch.com/p?c1=2&c2=' + streamSenseC2 + "&c3=" + siteTag);
        streamSense.setPlaylist();
    };

    onTemplateReady = function() {
        if (templateReadyDone) {
            log("bcplayer --- onTemplateReadyDone");
            return;
        }

        log("bcplayer --- ageRestricted: " + ageRestricted + ", video rating: " + video.rating);
        if (ageRestricted && video.rating == "13+" && (typeof userAge != 'undefined' && userAge === "under12")) {
            log("bcplayer --- User is under 12 don't display video player");
            $("img#ageRatingWarning").show();
            $('div.playerContainer').remove();
            return;
        }

        log("bcplayer --- onTemplateReady");
        templateReadyDone = true;
        videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);

        if (playerType === "html") {
            adPath = adPathHTML5;
            adSite = adSite + "html5";
        }


        // get videoDTO id and array of cue points (in seconds)
        videoPlayer.getCurrentVideo(function(result) {
            video.bcId = result.id;

            logCuePoints();

            cuePointsModule.getCuePoints(video.bcId, function(result) {
                for (var data in result) {
                    var cuepoint = result[data];
                    if (cuepoint.time > 0) {
                        cuePoints.push(cuepoint);
                    }
                }
            });
        });


        // ad events
        adModule.addEventListener(adEvent.START, onAdStart);
        adModule.addEventListener(adEvent.COMPLETE, onAdComplete);
        // player events
        videoPlayer.addEventListener(mediaEvent.BEGIN, onMediaBegin);
        videoPlayer.addEventListener(mediaEvent.STOP, onMediaStop);
        videoPlayer.addEventListener(mediaEvent.PLAY, onMediaPlay);
        videoPlayer.addEventListener(mediaEvent.PROGRESS, onMediaProgress);
        videoPlayer.addEventListener(mediaEvent.SEEK_NOTIFY, onMediaSeek);
        videoPlayer.addEventListener(mediaEvent.ERROR, onMediaError);
        videoPlayer.addEventListener(mediaEvent.COMPLETE, onMediaComplete);

        // responsive and resize
        videoPlayer.getCurrentRendition(function(renditionDTO) {
            var newPercentage = (renditionDTO.frameHeight / renditionDTO.frameWidth) * 100;
            newPercentage = newPercentage + "%";

            if ($(".playerContainer").length > 0 && (typeof $(".playerContainer").style !== 'undefined')) {
                $(".playerContainer").style.paddingBottom = newPercentage;
            }
        });
    };

    onTemplateError = function(event) {
        log("type: " + event.type);
        log("errorType: " + event.errorType);
        log("code: " + event.code);
        log("info: " + event.info);
    };

    getAdStarted = function() {
        return adStarted;
    };
    getIsMidroll = function() {
        return isMidroll;
    };

    getCurrentVideoIndex = function(){
        return currentVideoIndex;
    };

    getPlayer = function() {
        return player;
    };
    getAPIModules = function() {
        return APIModules;
    };
    getMediaEvent = function() {
        return mediaEvent;
    };
    getAdEvent = function() {
        return adEvent;
    };
    comscoreBeacon = function(c5) {
        COMSCORE.beacon({
            c1: 1,
            c2: videoMetrixC2,
            c3: siteTag,
            c5: c5
        });
    };

    streamSenseClip = function(part, duration, isAd, source) {
        var classification, clip;
        duration = duration * 1000;
        if (isAd) {
            if (isMidroll) {
                classification = "va12";
            } else {
                classification = "va11";
            }
            clip = {
                "ns_st_cn": currentClip,
                "ns_st_ci": refId,
                "ns_st_pn": "1",
                "ns_st_tp": "1",
                "ns_st_cl": duration,
                "ns_st_pu": "Bell Media",
                "ns_st_cu": source,
                "ns_st_ad": "1",
                "ns_st_ct": classification,
                "ns_st_de": siteTag
            };
        } else {
            if (duration > 600) {
                classification = "vc12";
            } else {
                classification = "vc11";
            }
            clip = {
                "ns_st_cn": mediaClip,
                "ns_st_ci": refId,
                "ns_st_pn": part,
                "ns_st_tp": "0",
                "ns_st_cl": duration,
                "ns_st_pu": "Bell Media",
                "ns_st_cu": source,
                "ns_st_ct": classification,
                "ns_st_de": siteTag
            };
        }
        streamSense.setClip(clip);
        currentClip += 1;
    };

    loadVideo =  function(){
        var newVideo;
        if(currentVideoIndex < videoArray.length){
            //set new Video
            newVideo = videoArray[currentVideoIndex].id;
            //load new video
            videoPlayer.loadVideoByReferenceID(newVideo);
            currentVideoIndex++

        } else{
            isMediaComplete = true;
        }
    };



    return {
        init: init,
        onTemplateLoaded: onTemplateLoaded,
        onTemplateReady: onTemplateReady,
        onTemplateError: onTemplateError,
        bind: bind,
        getAdStarted: getAdStarted,
        getIsMidroll: getIsMidroll,
        getPlayer: getPlayer,
        getAPIModules: getAPIModules,
        getMediaEvent: getMediaEvent,
        getCurrentVideoIndex: getCurrentVideoIndex,
        getAdEvent: getAdEvent
    };
}());