// ==UserScript==
// @name         注册测绘师继续教育_选修列表页
// @namespace    https://rackar.github.io/article_tech/zhuCeCHS_edu.html
// @version      0.4
// @description  try to take over the world!
// @author       rackar
// @match        http://rsedu.ch.mnr.gov.cn//index/user/myColumn?columnType=2&*
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
      await sleepTime(60 * 60);
    }
  }
  setTimeout(function() {
    var trs = $("ul.site-idea a");
    // console.log("monkey");
    // console.log(trs);

    let arrNeed = [];
    for (let index = 0; index < trs.length; index++) {
      const tr = trs[index];
      let noComplete = tr.children[1].innerText;
      if (noComplete != "学习完成") {
        arrNeed.push(tr);
      }

      //   console.log(tr.children[4].innerText);
      // if (tr.children[4].innerText != "已完成") {
      //     let url = tr.children[5].children[0].children[0].href;
      //     let timeMin = tr.children[1].children[0].innerText;
      //     timeMin = timeMin.replace("约", "");
      //     timeMin = timeMin.replace("分钟", "");
      //     // console.log(timeMin);
      //     let time = (timeMin - 0 + 3) * 60;
      //     // let time = (timeMin - 0 + 3) * 60;
      //     let button = tr.children[5].children[0].children[0];
      //     let obj = {
      //         url,
      //         time,
      //         button
      //     };
      //     arrNeed.push(obj);
      //     // button.click()
      //     // return;
      // }
    }
    console.log(arrNeed);

    doAllClassListen(arrNeed);
  }, 2000);

  // Your code here...
})();
