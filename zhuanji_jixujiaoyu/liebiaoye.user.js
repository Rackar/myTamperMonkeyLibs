// ==UserScript==
// @name         专业技术继续教育_列表页2022
// @namespace    https://rackar.github.io/article_tech/zhuCeCHS_edu.html
// @version      0.5
// @description  try to take over the world!
// @author       rackar
// @match        https://web.chinahrt.com/index.html*
// @grant        none
// ==/UserScript==

(function() {
  "use strict";

  // Your code here...
  function sleepTime(secends) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), secends * 1000);
    });
  }
  async function doAllClassListen(obj) {
    for (let i = 0; i < obj.length; i++) {
      obj[i].button.click();
      console.log("点击按钮第" + i);
      await sleepTime(5);
      console.log("等待5秒");
      location.reload();
      console.log("刷新页面");
      await sleepTime(obj[i].time);
    }
  }
  function gotTime(text) {
    // let right = text.split("(")[1];
    // let left = right.split(")")[0];
    // console.log(left);
    // let timearr = left.split(":");
    // let secend = timearr[0] * 60 * 60 + timearr[1] * 60 + timearr[2] * 1 + 30;
    let secend=text*60*60
    console.log(secend);
    return secend;
  }

  if (location.hash.indexOf("v_selected_course") > -1 && (new Date()).getFullYear()===2022) {
     setTimeout(function() {
    // $(".course-list.cb ul li a").attr("target", "_blank");

    // var trs = $(".course-list.cb ul li"); //2021以前的
    let  trs  = $(".course-list.cb ul li span.bg");
    let timeDom = $(".course-list ul li .page-view span.tipColor")
    // console.log("monkey");
    console.log(trs);
    let arrNeed = [];
    for (let index = 0; index < trs.length; index++) {
      const button = trs[index];
      const aMark= timeDom[index]
      // const aMark = tr.children[1];
      //   console.log(tr.children[4].innerText);
      if (aMark.innerText.substring(0, 3) == "学时：") {
        let time = gotTime(aMark.innerText.slice(3));
        // aMark.attr("target", "_blank");
        let obj = {
          time,
          button
        };
        arrNeed.push(obj);
        // button.click()
        // return;
      }
    }
    console.log(arrNeed);

    doAllClassListen(arrNeed);
  }, 4000);
  }
})();


