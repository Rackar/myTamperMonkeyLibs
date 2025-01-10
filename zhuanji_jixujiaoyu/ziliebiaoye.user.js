// ==UserScript==
// @name         专业技术继续教育_子列表页2025
// @namespace    https://rackar.github.io/article_tech/zhuCeCHS_edu.html
// @version      0.5
// @description  try to take over the world!
// @author       rackar
// @match        https://web.chinahrt.com/index.html*
// @match        https://gp.chinahrt.com/index.html*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  function sleepTime(secends) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), secends * 1000);
    });
  }
  async function doAllClassListen(obj) {
    for (let i = 0; i < obj.length; i++) {
      obj[i].button.click();
      console.log("点击按钮第" + i + ", 预计等待时长为:" + obj[i].time);
      await sleepTime(obj[i].time);
    }
    await sleepTime(5);
    //原地刷新更新进度
    location.reload();
  }

  if (
    location.hash.indexOf("v_courseDetails") > -1 &&
    new Date().getFullYear() === 2025
  ) {
    setTimeout(async function () {
      // $(".course-h.oh ul li a").attr("target", "_blank");
      debugger;
      const arrNeed = checkJobDown();

      if (arrNeed.length) {
        doAllClassListen(arrNeed);
      } else {
        //返回主列表页 刷新激活
        let backBtns = $(".details-main .crumbs-title p a");
        backBtns[1].click();
        await sleepTime(5);
        location.reload();
      }
    }, 4000);
  }
})();

function checkJobDown() {
  var trs = $(".course-h.oh ul li");
  // console.log("monkey");
  console.log(trs);
  let arrNeed = [];
  for (let index = 0; index < trs.length; index++) {
    const tr = trs[index];
    const aMark = tr.children[2];
    //   console.log(tr.children[4].innerText);
    if (aMark.innerText.substring(0, 3) != "已学完") {
      let time = gotTime(tr.children[1].innerText);
      let doneTime = gotTime(aMark.innerText);
      // aMark.attr("target", "_blank");
      let button = aMark;
      let obj = {
        time: (time - doneTime) * 1.2 + 20, //长时间有偏移
        button,
      };
      arrNeed.push(obj);
    }
  }
  console.log(arrNeed);
  return arrNeed;
}
function gotTime(text) {
  let right = text.split("(")[1];
  let left = right.split(")")[0];
  let timearr = left.split(":");
  let secend = timearr[0] * 60 * 60 + timearr[1] * 60 + timearr[2] * 1;
  // console.log(`${left}换算为${secend}秒`);
  return secend;
}
