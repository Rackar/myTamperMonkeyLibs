// ==UserScript==
// @name         注册测绘师继续教育_选修课添加列表
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://rsedu.ch.mnr.gov.cn//index/course?page=*
// @grant        none
// ==/UserScript==

(function() {
  "use strict";

  function sleepTime(secends) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), secends * 1000);
    });
  }
  async function doAllClassListen(obj) {
    for (let i = 0; i < obj.length; i++) {
      obj[i].click();
      console.log("点击按钮第" + i);
      await sleepTime(2);
    }
  }
  setTimeout(function() {
    var trs = $("ul.site-idea a");
    // console.log("monkey");
    // console.log(trs);

    let arrNeed = [];
    for (let index = 0; index < trs.length; index++) {
      const tr = trs[index];

      let button = tr;
      arrNeed.push(button);
    }
    doAllClassListen(arrNeed);
  }, 2000);
})();
