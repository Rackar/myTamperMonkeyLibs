// ==UserScript==
// @name         专业技术继续教育_真的视频页2022
// @namespace    https://rackar.github.io/article_tech/zhuCeCHS_edu.html
// @version      0.5
// @description  try to take over the world!
// @author       rackar
// @match        https://videoadmin.chinahrt.com/videoPlay/play*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  function closeCurrentPage() {
    setTimeout(() => {
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
    }, 8000);
  }
  setTimeout(function () {
    // CKobject.getObjectById(playerId).videoPlay();
    document.getElementById("video").click();
    window.player.videoMute();

    setTimeout(() => {
      window.player.videoPlay();
    }, 1000);
    setTimeout(() => {
      // CKobject.getObjectById(playerId).addListener("pause", closeCurrentPage);
      window.player.addListener("pause", closeCurrentPage);
    }, 5000);

    setTimeout(closeCurrentPage, 60 * 60 * 1000);
  }, 5000);
  //   CKobject.getObjectById(playerId).videoPlay();
  // Your code here...
})();
