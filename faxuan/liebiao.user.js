// ==UserScript==
// @name         法宣列表页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://xf.faxuan.net/sps/lesson/t/lesson_1_t.html*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  function sleepTime(secends) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), secends * 1000);
    });
  }
  async function doAllClassListen(obj) {
    for (let i = 0; i <= 2; i++) {
      // 先确定前三节有练习课，否则改一下初始序号。
      obj[i].click();
      console.log("点击按钮第" + i + "次");
      await sleepTime(11 * 60);
    }
    if (base && base.index2) {
      base.index2(0);
    }
  }
  setTimeout(function () {
    var trs = $("ul#page div a");
    // console.log("monkey");
    // console.log(trs);

    let arrNeed = [];
    for (let index = 0; index < trs.length; index++) {
      const tr = trs[index];
      if (tr.innerText) {
        arrNeed.push(tr);
      }
    }
    console.log(arrNeed);

    doAllClassListen(arrNeed);
  }, 4000);
})();
