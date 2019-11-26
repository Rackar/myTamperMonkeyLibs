// ==UserScript==
// @name         专业技术继续教育_真的视频页
// @namespace    https://rackar.github.io/article_tech/zhuCeCHS_edu.html
// @version      0.4
// @description  try to take over the world!
// @author       rackar
// @match        https://videoadmin.chinahrt.com/videoPlay/play*
// @grant        none
// ==/UserScript==

(function() {
  "use strict";
  setTimeout(function() {
    CKobject.getObjectById(playerId).videoPlay();
  }, 2000);
  //   CKobject.getObjectById(playerId).videoPlay();
  // Your code here...
})();
