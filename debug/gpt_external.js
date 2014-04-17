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
       if (config.siteName.indexOf("canalvie.") > -1 ) {
           config.adUnit = "/3826/sri.canalvie/external";
           config.kruxConfig = "I3-1j0iA";
       } else if (config.siteName.indexOf("historiatv.") > -1 ) {
           config.adUnit = "/3826/sri.historiatv/external";
           config.kruxConfig = "I3-14UpL";  
       } else if (config.siteName.indexOf("seriesplus.") > -1 ) {
           config.adUnit = "/3826/sri.seriesplus/external";
           config.kruxConfig = "I3-1ufu0";
       } else if (config.siteName.indexOf("canald.") > -1 ) {
           config.adUnit = "/3826/sri.canald/external";
           config.kruxConfig = "I3-1UUmG";
       } else if (config.siteName.indexOf("ztele.") > -1 ) {
           config.adUnit = "/3826/sri.ztele/external";
           config.kruxConfig = "I3-1pk-8";
       } else if (config.siteName.indexOf("investigationtele.") > -1 ) {
           config.adUnit = "/3826/sri.investigation/external";
           config.kruxConfig = "I3-17UNo";
       } else if (config.siteName.indexOf("vrak.") > -1 ) {
           config.adUnit = "/3826/sri.vrak/external";
           config.kruxConfig = "I3-1zhOp";
       } else {
           config.adUnit = "/3826/sri.canalvie/homepage";
           config.kruxConfig = "";
       }
 
       //Path Specific
       var subsections = location.pathname.split("/");
       
       //We don't need the first path split so we put the subdomain in it
       subsections[0] = config.siteName.substring(0,config.siteName.indexOf('.'));
       if(subsections[subsections.length-1].indexOf(".")!=-1){
           subsections.pop(); //we remove the last item
       }
       
       for(var i = 0 ; i < subsections.length ; i ++ ){
           subsections[i] = subsections[i].toLowerCase();
           subsections[i] = subsections[i].replace(/[^\w\-]/g, "");
       }
 
       config.ssValues = subsections;
 
       return config;
   }
 
   function init(){
       
       // no ads for kids
       if (getCookie("age") === "under12") { return; }
       
       //Load GPT
       var gads = document.createElement('script');
       gads.async = true;
       gads.type = 'text/javascript';
       var useSSL = 'https:' == document.location.protocol;
       gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
       var node = document.getElementsByTagName('script')[0];
       node.parentNode.insertBefore(gads, node);
       
       //Setup Krux
       var kruxCode = "window.Krux||((Krux=function(){Krux.q.push(arguments)}).q=[]);" +
                       "(function(){" +
                           "var k=document.createElement('script');k.type='text/javascript';k.async=true;" +
                           "var m,src=(m=location.href.match(/\bkxsrc=([^&]+)/))&&decodeURIComponent(m[1]);" +
                           "k.src = (location.protocol==='https:'?'https:':'http:')+'//cdn.krxd.net/controltag?confid=" + config.kruxConfig + "';" +
                           "var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(k,s);" +
                       "}());";
 
       var headNode = document.getElementsByTagName('head')[0];
       var kruxNode = document.createElement('script');
       kruxNode.className = "kxct";
       kruxNode.setAttribute("data-id", config.kruxConfig);
       kruxNode.setAttribute("data-timing", "async");
       kruxNode.setAttribute("data-version", "1.9");
       kruxNode.innerHTML = kruxCode;
       headNode.appendChild(kruxNode);
 
       window.Krux||((Krux=function(){Krux.q.push(arguments);}).q=[]);
       (function(){
           function retrieve(n){
               var m, k='kx'+n;
               if (window.localStorage) {
                   return window.localStorage[k] || "";
               } else if (navigator.cookieEnabled) {
                   m = document.cookie.match(k+'=([^;]*)');
                   return (m && unescape(m[1])) || "";
               } else {
                   return '';
               }
           }
           Krux.user = retrieve('user');
           Krux.segments = retrieve('segs') && retrieve('segs').split(',') || [];
       })();
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
           googletag.pubads().setTargeting('ss',[config.ssValues]);
           
           //Krux targeting
           googletag.pubads().setTargeting("ksgmnt", Krux.segments);
           googletag.pubads().setTargeting("u", Krux.user);
 
           googletag.pubads().enableAsyncRendering();
           googletag.enableServices();
       });
 
       googletag.cmd.push(function() { googletag.display(oopDivId); });
   }
   
   function getCookie(cname){
       var name = cname + "=";
       var ca = document.cookie.split(';');
       for(var i=0; i<ca.length; i++){
           var c = ca[i].trim();
           if (c.indexOf(name)==0){ return c.substring(name.length,c.length);}
       }
       return "";
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
