/*
* GPT/KRUX for externals sites
* 
* How to use : call the function base.gpt.renderAd(divId, position, sizesArray)
* Parameters
*  -parentId : Id of the html tag that will contain the ad. Format should begin by 'gpt-ad-'.
*  -position : position of the ad banner.
*  -sizesArray : array of the possibles sizes for the ad banner. 
*                Exemple for one format : [[120,90]]
*                Exemple for two or more formats : [[120,90],[120,60]]
*
* Exemple
*
*   <!-- Display of a ad banner -->
*   <div id="gpt-ad-bigbox-top1"></div> 
*   
*   <script type="text/javascript">
*       base.gpt.renderAd("gpt-ad-bigbox-top1", "top", [[300,200]]);
*   </script>
*
* Legacy code to new GPT code
*
*    ---Legacy---
*    <div class="pub ">
*        <div class="banner valignTop" role="banner">
*            <div id="div-gpt-ad-top1" class="alignBanner">
*                <script>window.astral.ads.renderAd("sri.vrak/"+ vrak.adCampaign +";ss="+ vrak.adSubSection +";pos=top;tile=2;sz=300x250,300x600,300x1050;ord=64898380451");</script>
*                <noscript><a href=""+ vrak.adCampaign +";ss="+ vrak.adSubSection +";pos=top;tile=2;sz=300x250,300x600,300x1050;ord=64898380451" target="pub"> <img src=""+ vrak.adCampaign +";ss="+ vrak.adSubSection +"pos=top;tile=2;sz=300x250,300x600,300x1050;ord=64898380451" width="300" height="250" alt="publicité"/></a></noscript>
*            </div>
*        </div>
*    </div>
*
*    ---GPT---
*    <div id="headerLeaderboard">
*        <div class="banner" role="banner">
*            <div id="div-gpt-ad-top1" class="alignBanner"></div>
*        </div><!-- /.banner -->
*    </div><!-- /#headerLeaderboard -->
*    <script type="text/javascript">
*       base.gpt.renderAd("div-gpt-ad-top1", "top", [[300,250],[300,600],[300,1050]);
*    </script>
*/
var base      = base || {},
    googletag = googletag || {};
    googletag.cmd  = googletag.cmd || [];
 
base.gpt = (function(){
   //privates members
   var gptadslots     = [],
       config         = setupConfig(),
       oopDivId       = "div-gpt-ad-oop";
 
   function setupConfig(){
       var config   = config || {};
       config.pageUrl  = document.location + "";
 
       //URL
       config.pageUrl  = config.pageUrl.substring(7,config.pageUrl.length);
       config.urlPath  = config.pageUrl.split("/");
       config.siteName = config.urlPath[0];
       
       //Site Specific
       config.adUnit = "/5479/sri.testing2";
       config.ssValues = ["homepage"];
 
       return config;
   }
 
   function init(){
      
       //Load GPT
       var gads = document.createElement('script');
       gads.async = true;
       gads.type = 'text/javascript';
       var useSSL = 'https:' == document.location.protocol;
       gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
       var node = document.getElementsByTagName('script')[0];
       node.parentNode.insertBefore(gads, node);
   }
   
   function enableServices(){
	 //Add oopDiv
       var oopDiv = document.createElement('div');
       oopDiv.id = oopDivId;
       var body = document.getElementsByTagName('body')[0];
       body.appendChild(oopDiv);
       
       //Setup GPT
       googletag.cmd.push(function() {
           googletag.pubads().enableSingleRequest();
           
           googletag.defineOutOfPageSlot(config.adUnit , oopDivId).addService(googletag.pubads());
           //Page-level key-value targeting
           googletag.pubads().setTargeting('ss',config.ssValues);
           googletag.pubads().enableAsyncRendering();
           googletag.enableServices();
       });
 
       googletag.cmd.push(function() { googletag.display(oopDivId); });
   }

   //public methods
   return{
       init: function() { init(); },
       renderAll : function() { enableServices(); },
       renderAd : function (parentId, position, sizesArray){
           googletag.cmd.push(function() {
               googletag.defineSlot(config.adUnit , sizesArray, parentId).addService(googletag.pubads())
               .setTargeting('pos',[position]);
           });
 
           googletag.cmd.push(function() { googletag.display(parentId); });
       }
   }
   
})();

(function() {
   base.gpt.init();
   window.onload = function () {
       base.gpt.renderAll();
   };
})();