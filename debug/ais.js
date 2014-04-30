// -- Akamai Identity Services - Client Object
// -- Version 2.7.2013.10.10 for AIS v3.1.16.2

// AIS Client object
function ais_client(responsefield) {
    this.callbacks = {
        "bounce": this._nullhandler,
        "echo_response": this._nullhandler,
        "chooser": this._nullhandler,
        "init": this._nullhandler,
        "identity": this._nullhandler,
        "logout_result": this._nullhandler,
        "becomes_authenticated": this._nullhandler,
        "becomes_unauthenticated": this._nullhandler,
        "authz_query": this._nullhandler,
        "resources": this._nullhandler,
        "device": this._nullhandler,
        "vcs": this._nullhandler,
        "vcs_list": this._nullhandler,
        "authz_query_list": this._nullhandler
    };
    this.baseurl = 'idp.securetve.com/rest/1.0/'; //'http://idp.securetve.com/rest/1.0/';
    this.responsefield = responsefield ; // NOTE: If this is changed, must also change name of public dispatcher (above) and all instances of "aisresponse" in the code below
    this.authstate = false; // Only 2 states, all transitions allowed
    this.platform_id = ''; // SP platform_id/configuration
    this.aisuid = ''; // Akamai Identity Services - Identity ID
    this.use_logging = false;
    this.log_target = ''; // Page element name for HTML log output
    this.use_cache = true; // Usecache flag (default true, not used at this time)
    this.response_cache = {}; // Internal JS response cache
    this.cache_time = {
        "init": 30000,
        "chooser": 30000,
        "authz_query": 30000,
        "identity": 30000,
        "bounce": 2000,
        "echo_response": 30000,
        "vcs": 2000,
        "vcs_list": 5000,
        "resources": 30000,
        "authz_query_list": 30000
    }; // Default internal JS resopnse cache settings
    this.script_insert_type = ''; // Use default or jquery
    this.log_toggle = 0; // for alternating color lines for log
    this.supportsLocalStorage = undefined; // Check if localstorage is supported (Added 11/26)
    this.ls_prepend = 'AIS_client___'; //Prepend for LocalStorage keys
    this.language_override = '';
    this.protocol = ((window.location.protocol == 'http:' || window.location.protocol == 'https:') ? window.location.protocol + '//' : 'http://');
    this.log_object = {}; //[];
    this.log_object_keys = [];
    this.log_object_size = 20;
}

//////////////////////////////////////////
// Public interface
////////////////////////////////////////// 

// AIS Client - Public Interface
ais_client.prototype.assignhandler = function(type, handler) {
    if (this._isFunction(handler)) {
        this.callbacks[type] = handler;
    } else {
        this.log("unable to assign handler to callback type (" + type + ") because it is not callable", true);
    }
}

ais_client.prototype.setPlatformId = function(platform_id) {
    if (this.platform_id != platform_id) {
        this._reset_cache(true);
    }
    this.platform_id = platform_id;
    this.log('setPlatformId (' + this.platform_id + ')', true);
}

ais_client.prototype.setLanguageOverride = function(language_code) { // ADDED 3.1.16.2 7/24/2013
    this.language_override = language_code;
    this.log('setLanguageOverride (' + this.language_override + ')', true);
}

//** ADD TO TEST HARNESS PAGE
ais_client.prototype.setProtocol = function(protocol) { // ADDED 3.1.16.2 8/22/2013
    this.protocol = protocol;
    this.log('setProtocol (' + this.protocol + ')', true);
}

//** ADD TO TEST HARNESS PAGE
ais_client.prototype.setResponsefield = function(responsefield) { // ADDED 3.1.16.2 8/27/2013
    this.responsefield = responsefield;
    this.log('setResponsefield (' + this.responsefield + ')', true);
}

ais_client.prototype.aisresponse = function(resp) {
    // capture any state transition messages that impact the type of callback issued
    // Auth N
    if (resp['authenticated'] !== undefined && this.authstate !== this._mkboolean(resp['authenticated'])) {
        // AuthN state has transitioned
        this.authstate = this._mkboolean(resp['authenticated']);
        this._reset_cache(); // Clear Response Cache
        //	Dispatch Events
        if (this.authstate) {
            this.log("Authenticated", true);
            this._dispatch('becomes_authenticated', resp);
        } else {
            this.log("Not Authenticated", true);
            this._dispatch('becomes_unauthenticated', resp);
        }
    }

    // AuthZ
    if (resp['authorization'] !== undefined) {
        // AuthZ state has transitioned
        if (this._mkboolean(resp['authorization'])) {
            this.log("Authorized: " + resp['resource'], true);
        } else {
            this.log("Not Authorized: " + resp['resource'], true);
        }
    }

    // AISUID (Identity, Init)
    if (resp['aisuid'] !== undefined) {
        this.aisuid = resp['aisuid']; // Get & Store AISUID
        this.log("Init: AISUID - " + this.aisuid, true);
    } else if (resp['identity'] !== undefined) {
        this.aisuid = resp['identity']['aisuid']; // Get & Store AISUID
        this.log("Identity: AISUID - " + this.aisuid, true);
    }

    this._set_cache(resp); // Set Response Cache to Response data

    // FOR "LIST" Responses (VCS, AuthZ)
    if (resp['_type'] == 'authz_query_list' || resp['_type'] == 'vcs_list') { // ADDED 7/24/2013, updated 10/2013
        for (i = 0; i < resp['documents'].length; i++) {
            this._set_cache(resp['documents'][i]);
        }
    }

    if (resp['_type'] == 'logout_result') {
        this.log("aisresponse: clearing cache", true);
        this._reset_cache(true);
    }

    // Dispatch Events
    var type = resp['_type'];
    this._dispatch(type, resp);
}


// AIS Client Public Interface - Direct API Calls
ais_client.prototype.bounce = function(force) {
    this.log("bounce ", true);
    if (force == true || this._use_cache('bounce') == false) {
        this._call_ais('bounce');
    }
}

ais_client.prototype.echo = function(message, force) {
    this.log("echo ", true);
    if (force == true || this._use_cache('echo_response', message) == false) {
        this._call_ais('echo', message);
    }
}

ais_client.prototype.init = function(force) {
    this.log("init: (" + ((this.authstate == true) ? 'init' : 'chooser') + ")", true);
    if (force == true || this._use_cache(((this.authstate == true) ? 'init' : 'chooser')) == false) {
        this._call_ais('init');
    }
}

ais_client.prototype.chooser = function(force) {
    this.log("chooser ", true);
    if (force == true || this._use_cache('chooser') == false) {
        this._call_ais('chooser');
    }
}

//init_increaseScope DEPRECATED as of 7/2012 (underlying API no longer available), use chooser
ais_client.prototype.init_increaseScope = function(force) {
    this.log("init_increaseScope DEPRECATED, using chooser", true);
    if (force == true || this._use_cache('chooser') == false) {
        this._call_ais('chooser');
    }
}

ais_client.prototype.identity = function(force) {
    this.log("identity ", true);
    if (force == true || this._use_cache('identity') == false) {
        this._call_ais('identity');
    }
}

//logout SHOULD NOT BE USED as of 9/25/2012, use logoutFormat + call in page
ais_client.prototype.logout = function() {
    this.log("logout ", true);
    this._reset_cache(); // Clear Response Cache on logout
    this._call_ais('logout');
}

ais_client.prototype.resourceAccess = function(resourceid, force) { //NEW AS OF AIS v3.1.10 7/2012
    this.log("resourceAccess: " + resourceid, true);
    if (force == true || this._use_cache('authz_query', resourceid) == false) {
        this._call_ais('resourceAccess', resourceid);
    }
}

ais_client.prototype.resourceAccessList = function(resourceid_array, force) { //NEW AS OF AIS v3.1.16.2 7/2013
    this.log("resourceAccessList: " + resourceid_array.join(','), true);
    if (resourceid_array == undefined || typeof resourceid_array != 'object') {
        this.log("resourceAccessList: no resourceid_array provided" + (typeof resourceid_array != 'object'), true);
    } else if (force == true || this._use_cache('authz_query_list', resourceid_array) == false) {
        this._call_ais('resourceAccessList', resourceid_array);
    } else {}
}

//channelAccess DEPRECATED as of 7/2012 (underlying API still available), use resourceAccess
ais_client.prototype.channelAccess = function(channelid, force) {
    this.log("channelAccess: " + channelid, true);
    if (force == true || this._use_cache('authz_query', channelid) == false) {
        this._call_ais('channelAccess', channelid);
    }
}

ais_client.prototype.resources = function(force) { //NEW AS OF AIS v3.1.11 7/2012
    this.log("resources ", true);
    if (force == true || this._use_cache('resources') == false) {
        this._call_ais('resources');
    }
}

ais_client.prototype.registerDevice = function(shortcode) { //NEW AS OF AIS v3.1.13 8/2012
    this.log("registerDevice ", true);
    this._call_ais('registerDevice', shortcode);
}

ais_client.prototype.vcsGet = function(contentid, force) {
    this.log("vcsGet: " + contentid, true);
    if (contentid == undefined || contentid == '') {
        this.log("vcsGet: no contentid provided", true);
    } else if (force == true || this._use_cache('vcs', contentid) == false) {
        this._call_ais('vcsGet', contentid);
    }
}

ais_client.prototype.vcsSet = function(contentid, ph_pos) {
    this.log("vcsSet: " + contentid + "," + ph_pos, true);
    this._call_ais('vcsSet', contentid, ph_pos);
}

ais_client.prototype.vcsList = function(contentid_array, force) { //NEW AS OF AIS 3.1.15 11/2012, modified 10/2013
    this.log("vcsList: " + ((contentid_array != undefined) ? contentid_array.join(',') : 'no contentid_array'), true);
    if (force == true || this._use_cache('vcs_list', contentid_array) == false) {
        this._call_ais('vcsList', contentid_array);
    } else {}
}

ais_client.prototype.vcsListRecent = function(limit, force) { //NEW AS OF AIS 3.1.16.2 10/2013 for implicit/recent
    this.log("vcsListRecent: " + limit, true);
    if (force == true || this._use_cache('vcs_list', limit) == false) {
        this._call_ais('vcsListRecent', limit);
    }
}

// AIS Client Public Interface - Other Available methods
ais_client.prototype.loginFormat = function(idp_platformid, response_target) { //Updated AIS 3.1.16.2 7/2013, added language, updated 10/2013
	var url=this._getResourceUrl(this.baseurl, this.protocol, this.platform_id);
    return url + "/init/" + idp_platformid + "?responsemethod=redirect&format=jsonp" + ((response_target != undefined && response_target != '') ? '&responsetarget=' + response_target : '') + ((this.language_override != '') ? '&lang=' + this.language_override : '');
}

// Added 9/25/2012 
ais_client.prototype.logoutFormat = function(response_target) {
	var url=this._getResourceUrl(this.baseurl, this.protocol, this.platform_id);
    return url + "/slo/?responsemethod=redirect&format=jsonp" + ((response_target != undefined) ? '&responsetarget=' + response_target : '');
}

// DEPRECATED - Use loginFormat instead
ais_client.prototype.login = function(platformid) {
    this.log('ais_client.login DEPRECATED. Use ais_client.loginFormat instead.', true);
    var url=this._getResourceUrl(this.baseurl, this.protocol, this.platform_id);
    return url + "/init/" + platformid + "?format=jsonp";
}


ais_client.prototype.setLogging = function(bool, page_element) {
    if (bool == true) {
        this.use_logging = bool;
        this.log('setLogging: Logging enabled (' + ((page_element != undefined && document.getElementById(page_element)) ? 'HTML - ' + page_element : 'console.log') + ')', true);
    } else {
        this.log('setLogging: Logging disabled', true);
        this.use_logging = bool;
    }
    if (page_element != undefined) {
        if (document.getElementById(page_element)) {
            this.log_target = page_element;
        }
    } else {
        this.log_target = '';
    }
}

ais_client.prototype.setCacheTime = function(call, cache_time) {
    var return_val = false;
    if (typeof cache_time == 'number') {
        switch (call) {
            case 'init':
            case 'chooser':
            case 'authz_query':
            case 'identity':
            case 'bounce':
            case 'echo_response':
            case 'vcs':
            case 'resources':
            case 'vcs_list':
            case 'authz_query_list':
                this.cache_time[call] = cache_time;
                return_val = true;
                break;
        }
    }
    this.log('setCache (' + call + ',' + cache_time + ') ' + ((return_val == true) ? 'changed successfully' : 'invalid call'), true);
    this.log(this.cache_time);
    return return_val;
}

ais_client.prototype.setUseCache = function(bool) {
    if ((bool == true || bool == false) && bool != this.use_cache) {
        this.use_cache = bool;
        this.log('setUseCache: changed to (use_cache=' + bool + ')', true);
    }
    this.log('setUseCache: (use_cache=' + this.use_cache + ')', true);
}

ais_client.prototype.setScriptInsert = function(insert_type) {
    this.script_insert_type = '';
    if (insert_type == 'jquery') {
        this.script_insert_type = insert_type;
    }
    this.log('setScriptInsert (' + insert_type + ')', true);
}

ais_client.prototype.setRedirectLocation = function(redirect_location) {
    this.log('setRedirectLocation (' + redirect_location + ')', true);
    this._set('ais_client_redirect_location', redirect_location);
}

ais_client.prototype.getRedirectLocation = function() {
    this.log('getRedirectLocation (' + this._get('ais_client_redirect_location') + ')', true);
    return this._get('ais_client_redirect_location');
}

ais_client.prototype.clearRedirectLocation = function() {
    this._clear('ais_client_redirect_location');
    this.log('clearRedirectLocation', true);
}

ais_client.prototype.log = function(str, prepend) {
    var log_message = "";
    if (prepend == true) {
        log_message = ("[AIS] " + str);
    } else {
        log_message = str;
    }
    if (this.log_object_keys.length >= this.log_object_size) {
        var first_log_key = this.log_object_keys.shift();
        delete this.log_object[first_log_key];
    }
    var d = new Date();
    var log_key = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds();
    this.log_object[log_key] = log_message;
    this.log_object_keys[this.log_object_keys.length] = log_key;
    if (this.use_logging == true) {
        if (window.console && console.log) {
            console.log(log_message);
        }
        if (this.log_target != '') {
            var object_output = '';
            if (typeof str == 'object') {
                object_output += '<br>';
                object_output += this._create_object_log_output(str) //JSON.stringify(str);
                log_message = '[AIS] ' + log_message + object_output;
            }
            //document.getElementById(this.log_target).innerHTML += '<div style="border-collapse: collapse; border-width: 1px 0 1px 0; border-style: solid; border-color: #F;">'+log_message+'</div>';
            document.getElementById(this.log_target).innerHTML += '<div' + ((this.log_toggle == 0) ? '' : ' style="background: #E8E8E8;"') + '>' + log_message + '</div>';
            this.log_toggle = (this.log_toggle == 1) ? 0 : 1;
        }
    }
}

//////////////////////////////////////////
// Private interface
////////////////////////////////////////// 
ais_client.prototype._call_ais = function(call, extra, extra2) {
    var url;
    url=this._getResourceUrl(this.baseurl, this.protocol, this.platform_id);
    if (call == 'echo') {
        url += "/echo/" + extra;
    } else if (call == 'bounce') {
        url += "/bounce/";
    } else if (call == 'init') {
        url += "/init/";
    } else if (call == 'chooser') {
        url += "/chooser/";
        //} else if (call == 'init_increaseScope') {	//DEPRECATED, USE chooser
        //	url += "/init/increaseScope";				//DEPRECATED, USE chooser
    } else if (call == 'identity') {
        url += "/identity/";
        //    } else if (call == 'logout') {
        //		url += "/slo/";
    } else if (call == 'resourceAccess') { //ADDED AS OF AIS v3.1.10 7/2012
        url += "/identity/resourceAccess/" + extra;
    } else if (call == 'channelAccess') { //TO BE DEPRECATED, USE resourceAccess
        url += "/identity/channelAccess/" + extra; //TO BE DEPRECATED, USE resourceAccess
    } else if (call == 'resources') { //ADDED AS OF AIS v3.1.11 7/2012
        url += "/identity/resourceAccess/";
    } else if (call == 'registerDevice') { //ADDED AS OF AIS v3.1.13 8/2012
        url += "/identity/registerDevice/" + extra;
    } else if (call == 'vcsGet') {
        url += "/vcs/" + extra;
    } else if (call == 'vcsList') { //ADDED AS OF AIS v3.1.15 11/2012
        url += "/vcs/";
    } else if (call == 'vcsListRecent') { //ADDED AS OF AIS 3.1.16.2 10/2013
        url += "/vcs/";
    } else if (call == 'vcsSet') {
        url += "/vcs/" + extra;
    } else if (call == 'resourceAccessList') { //ADDED AS OF AIS v3.1.16.2 7/2013
        url += "/identity/resourceAccess/";
    }
    url += "?format=jsonp" + "&responsefield=" + this.responsefield;

    if (call == 'vcsSet') {
        url += "&ph_pos=" + extra2 + "&trickmode=post";
    }
    if (call == 'vcsList' && extra != undefined && extra != null && extra != '') {
        url += "&content_id=" + extra.join('&content_id=');
    }
    if (call == 'vcsListRecent' && extra != undefined && extra != null && extra != '') { //ADDED AS OF AIS 3.1.16.2 10/2013
        url += "&limit=" + extra;
    }
    if (call == 'resourceAccessList') { //ADDED AS OF AIS v3.1.16.2 7/2013
        url += "&resource_id=" + extra.join('&resource_id=');
    }
    if (this.language_override != '' && (call == 'resourceAccess' || call == 'channelAccess' || call == 'resourceAccessList')) {
        url += "&lang=" + this.language_override;
    }

    this.log(call + ': ' + url, true);
    if (this.script_insert_type == 'jquery') {
        // Use jQuery AJAX
        (function($) {
            $.ajax({
                url: url,
                dataType: "script",
                cache: true,
                async: true
            });
        }(jQuery));
    } else {
        // Use dynamic script insertion
        var script = document.createElement('script');
        script.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}

ais_client.prototype._mkboolean = function(val) {
    return (/^true$/i).test(val);
}

ais_client.prototype._isFunction = function(x) {
    return !!x && x.constructor == Function;
}

// Handler to ignore the response
ais_client.prototype._nullhandler = function(type, resp) {}

ais_client.prototype._alerthandler = function(type, resp) {
    alert("alert handler received message of type: " + type + "\n with: " + resp, true);
}

ais_client.prototype._dispatch = function(type, resp) {
    if (this.callbacks[type] !== undefined && this._isFunction(this.callbacks[type])) {
        runner = this.callbacks[type];
        runner(type, resp);
    } else {
        this.log("callable is not set for handler: " + type, true);
    }
}

// For Logging
ais_client.prototype._create_object_log_output = function(resp) {
    var output_value = '';
    output_value = '{';
    for (key in resp) {
        if (typeof resp[key] == 'object') {
            output_value += '' + ((typeof key == 'string') ? '"' + key + '"' : key) + ':';
            output_value += this._create_object_log_output(resp[key]);
            output_value += ', ';
        } else {
            output_value += '' + ((typeof key == 'string') ? '"' + key + '"' : key) + ':' + ((typeof resp[key] == 'string') ? '"' + resp[key] + '"' : resp[key]) + ', ';
        }
    }
    output_value = output_value.substring(0, output_value.length - 2);
    output_value += '}';
    return output_value;
}

// For Response Cache
ais_client.prototype._use_cache = function(call) {
    var return_val = false;
    if (this.use_cache == false) {
        this.log("_use_cache: caching disabled", true);
        return return_val;
    }
    var last_update = 0;
    var cache_type = '';
    var d = new Date();
    var response_call = call; //var response_call = ( (call == 'authz_query')?call+"-"+arguments[1] : call );
    if (response_call == 'authz_query' || response_call == 'vcs') {
        response_call += "-" + arguments[1];
    } else if (response_call == 'echo_response') {
        response_call += "-" + escape(arguments[1]);
    } else if (response_call == 'vcs_list') {
        response_call += "-" + ((typeof arguments[1] != 'object') ? arguments[1] : arguments[1].join('-')); //UPDATED 10/2013 implicit vs explicit
    }
    var localStorage_responseCacheUpdate = undefined;
    if (this.supportsLocalStorage == true) {
        localStorage_responseCacheUpdate = localStorage.getItem(this.ls_prepend + this.platform_id + '__' + 'response_cache_update__' + response_call);
    }
    if (this.response_cache['_response_cache_updates'][response_call] !== undefined) {
        last_update = this.response_cache['_response_cache_updates'][response_call];
        cache_type = 'js';
    } else if (localStorage_responseCacheUpdate != undefined) {
        last_update = localStorage_responseCacheUpdate;
        cache_type = 'localStorage';
    }
    if (last_update > 0 && d.getTime() - last_update < this.cache_time[call]) {
        if (cache_type == 'js') {
            window[this.responsefield + '(this.response_cache[response_call],true)']; //Added 8/27/13
            //aisresponse(this.response_cache[response_call],true);	// If using a different responsefield, this must be changed
        } else if (cache_type == 'localStorage') {
            window[this.responsefield + '(JSON.parse(localStorage.getItem(this.ls_prepend+this.platform_id+"__"+response_call)),true)']; //Added 8/27/13
            //aisresponse(JSON.parse(localStorage.getItem(this.ls_prepend+this.platform_id+'__'+response_call)),true);	// If using a different responsefield, this must be changed (added 11/26)
        }
        return_val = true;
        this.log("_use_cache: " + response_call + " (" + cache_type + " cached " + (this.cache_time[call] - (d.getTime() - last_update)) + "/" + this.cache_time[call] + ")", true);
    } else {
        return_val = false;
        //clear local storage
        if (this.supportsLocalStorage == true) {
            localStorage.removeItem(this.ls_prepend + this.platform_id + '__' + 'response_cache_update__' + response_call);
            localStorage.removeItem(this.ls_prepend + this.platform_id + '__' + response_call)
        }
    }
    return return_val;
}

// For Response Cache
ais_client.prototype._set_cache = function(resp) {
    var d = new Date();
    var response_type = resp['_type']; //var response_type = ((resp['_type'] == 'authz_query')? resp['_type']+"-"+resp['resource'] : resp['_type']);
    if (response_type == 'authz_query') {
        response_type = resp['_type'] + "-" + resp['resource'];
    } else if (response_type == 'echo_response') {
        response_type += "-" + escape(resp['response_value']);
    } else if (response_type == 'vcs') {
        response_type += "-" + escape(resp['content_id']);
    } else if (response_type == 'vcs_list') {
        for (i = 0; i < resp['documents'].length; i++) {
            response_type += "-" + resp['documents'][i].content_id;
        }
    }
    if (this.response_cache[response_type] === undefined || d.getTime() - this.response_cache['_response_cache_updates'][response_type] > this.cache_time[resp['_type']]) {
        var localStorage_responseCacheUpdate = undefined;
        if (this.supportsLocalStorage == true) {
            localStorage_responseCacheUpdate = localStorage.getItem(this.ls_prepend + this.platform_id + '__' + 'response_cache_update__' + response_type);
        }
        if (localStorage_responseCacheUpdate != undefined) {
            this.response_cache['_response_cache_updates'][response_type] = localStorage_responseCacheUpdate;
        } else {
            this.response_cache['_response_cache_updates'][response_type] = d.getTime();
        }
        if (this.supportsLocalStorage == true) { // 11/27
            localStorage.setItem(this.ls_prepend + this.platform_id + '__' + 'response_cache_update__' + response_type, d.getTime()); // 11/27
        }
    }
    this.response_cache[response_type] = resp;
    if (this.supportsLocalStorage == true) { // 11/27
        localStorage.setItem(this.ls_prepend + this.platform_id + '__' + response_type, JSON.stringify(resp));
    }
    //LOGGING
    this.log('_set_cache: ' + response_type + ' (caching length = ' + this.cache_time[resp['_type']] + ')', true);
    this.log(this.response_cache);
}

// For Response Cache
ais_client.prototype._reset_cache = function(clearLocalStorage) {
    this.response_cache = {
        "_response_cache_updates": {}
    };
    if (clearLocalStorage == true && this.supportsLocalStorage == true) { // (added 11/26)
        var keyArray = [];
        for (i = 0; i <= localStorage.length - 1; i++) {
            keyArray[i] = localStorage.key(i);
        }
        var ls_prefix = this.ls_prepend + this.platform_id + '__';
        for (i = 0; i <= keyArray.length - 1; i++) {
            if (keyArray[i].substring(0, ls_prefix.length) == ls_prefix) {
                this.log('_reset_cache: Removing| ' + keyArray[i], true);
                localStorage.removeItem(keyArray[i]);
            }
        }
    }
}

ais_client.prototype._set = function(key, value) {
    if (this.supportsLocalStorage == true) { // use HTML5 local storage
        this.log('_set: using localStorage (key: "' + key + '", value: "' + value + '")', true);
        localStorage.removeItem(key);
        return localStorage.setItem(key, escape(value));
    } else { // use cookies
        var expires = "";
        if (arguments[2]) {
            var d = new Date();
            d.setTime(d.getTime() + (arguments[2] * 24 * 60 * 60 * 1000));
            expires = "; expires=" + d.toGMTString();
        }
        document.cookie = key + "=" + escape(value) + expires + "; path=/";
        this.log('_set: using cookies (key: "' + key + '", value: "' + value + '", expires: "' + expires + '", cookie_value: "' + key + "=" + value + expires + "; path=/" + '")', true);
        return;
    }
}
ais_client.prototype._get = function(key) {
    if (this.supportsLocalStorage == true) {
        this.log('_get: using localStorage (key: "' + key + '", value: "' + localStorage.getItem(key) + '")', true);
        return unescape(localStorage.getItem(key));
    } else {
        var keyEQ = key + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(keyEQ) == 0) {
                this.log('_get: using cookies (key: "' + key + '", value: "' + c.substring(keyEQ.length, c.length) + '")', true);
                return unescape(c.substring(keyEQ.length, c.length));
            }
        }
        return null;
    }
}
ais_client.prototype._clear = function(key) {
    if (this.supportsLocalStorage == true) {
        localStorage.removeItem(key);
    } else {
        this._set(key, "", - 1);
    }
}

// Added 11/26
ais_client.prototype._setLocalStorageSupport = function() {
    this.supportsLocalStorage = this.__checkLocalStorageSupport();
}

// Added 11/26
ais_client.prototype.__checkLocalStorageSupport = function() {
    try {
        JSON.stringify({
            "a": "b"
        });
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

ais_client.prototype._getResourceUrl = function (baseurl, protocol, platform_id) {
	var url;
    if (baseurl.indexOf(protocol) >= 0){
         url= baseurl + platform_id;
    }else{
         url = protocol + baseurl + platform_id;
    }
    return url;
}
