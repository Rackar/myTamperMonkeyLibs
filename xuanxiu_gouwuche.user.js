// ==UserScript==
// @name         注册测绘师继续教育_选修课加入购物车
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://rsedu.ch.mnr.gov.cn//index/course/courseInfo?courseId*
// @grant        none
// ==/UserScript==

(function() {
  "use strict";

  function sleepTime(secends) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), secends * 1000);
    });
  }
  async function doAllClassListen() {
    await sleepTime(2);
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
      window.location.href = "about:blank";
      window.close();
    } else {
      window.opener = null;
      window.open("", "_self");
      window.close();
    }
  }
  setTimeout(function() {
    var trs = $("#ljgm");
    trs.click();
    doAllClassListen();
  }, 2000);
})();
