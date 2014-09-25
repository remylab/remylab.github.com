var base      = base || {},
    googletag = googletag || {};
    googletag.cmd  = googletag.cmd || [];
 
base.gpt = (function(){
   //privates members
   var gptadslots     = [],
       config         = setupConfig();
 
   function setupConfig(){
       var config   = config || {};
       config.adUnit = "/5479/sri.testing2/homepage";
       return config;
   }
 
   function init(){
	   
       var gads = document.createElement('script');
       gads.async = true;
       gads.type = 'text/javascript';
       var useSSL = 'https:' == document.location.protocol;
       gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
       var node = document.getElementsByTagName('script')[0];
       node.parentNode.insertBefore(gads, node);
   }
   
   return{
       init: function() { init(); },
       renderAd : function (parentId, position, sizesArray){
           googletag.cmd.push(function() {
        	   googletag.pubads().enableSingleRequest();
               googletag.defineSlot(config.adUnit , sizesArray, parentId).addService(googletag.pubads())
               .setTargeting('pos',[position]);
               
               googletag.pubads().enableAsyncRendering();
               googletag.enableServices();
           });
 
           googletag.cmd.push(function() { googletag.display(parentId); });
       }
   }
   
})();

(function() {
   base.gpt.init();
})();