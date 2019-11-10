// ==UserScript==
// @name         注册测绘师继续教育_视频页
// @namespace    https://rackar.github.io/article_tech/zhuCeCHS_edu.html
// @version      0.4
// @description  try to take over the world!
// @author       rackar
// @match        http://rsedu.ch.mnr.gov.cn//index/onlineCourseUser/play?*
// @grant        none
// ==/UserScript==

(function() {
  "use strict";
  $("body").off("blur");
  window.onblur = function() {};
  $.fn.pointsVerify = function(options, callbacks) {
    options.success();
  };

  function closeCurrentPage() {
    var userAgent = navigator.userAgent;
    if (
      userAgent.indexOf("Firefox") != -1 ||
      userAgent.indexOf("Chrome") != -1
    ) {
      window.location.href = "about:blank";
      window.close();
    } else {
      window.opener = null;
      window.open("", "_self");
      window.close();
    }
  }
function closePage(){
      player.videoMute()
    let data=  player.getMetaDate()
    let toal = data.duration
      console.log('init')
      setTimeout(closeCurrentPage, toal* 1000);
  }

     setTimeout(()=>{
         closePage()


     }, 4 * 1000);

})();