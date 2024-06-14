// ==UserScript==
// @name         专业技术继续教育_列表页2024
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

  if (
    location.hash.indexOf("v_selected_course") > -1 &&
    new Date().getFullYear() === 2024
  ) {
    setTimeout(function () {
      // $(".course-list.cb ul li a").attr("target", "_blank");

      // var trs = $(".course-list.cb ul li"); //2021以前的
      let arrNeed = getList();
      if (arrNeed && arrNeed.length) {
        doAllClassListen(arrNeed);
      } else {
        getPage();
      }
    }, 4000);
  }
})();
function sleepTime(secends) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), secends * 1000);
  });
}
async function doAllClassListen(obj) {
  for (let i = 0; i < obj.length; i++) {
    obj[i].button.click();
    console.log("点击按钮第" + i);
    await sleepTime(5);
    console.log("等待5秒");
   // location.reload(); //这里为啥要刷新页面？忘记了，暂时屏蔽掉
    console.log("刷新页面");
    await sleepTime(obj[i].time);
  }
}
function gotTime(text) {
  let secend = text * 60 * 60;
  console.log(secend);
  return secend;
}
function getList() {
  let buttonDom = $(".course-list.cb ul li span.bg");
  let timeDom = $(".course-list ul li .page-view span.tipColor");
  let processDom = $(".course-list ul li div.progress-line span");
  // console.log(buttonDom);
  let arrNeed = [];
  for (let index = 0; index < buttonDom.length; index++) {
    const button = buttonDom[index];
    const studyTime = timeDom[index];
    let curProcess = processDom[index].innerText;
    if (curProcess == "100%") {
      continue;
    }
    // const aMark = tr.children[1];
    //   console.log(tr.children[4].innerText);
    if (studyTime.innerText.substring(0, 3) == "学时：") {
      let time = gotTime(studyTime.innerText.slice(3));
      // aMark.attr("target", "_blank");
      let obj = {
        time,
        button,
      };
      arrNeed.push(obj);
      // button.click()
      // return;
    }
  }
  console.log(arrNeed);
  return arrNeed;
}

async function getPage() {
  let buttons = $(".el-pagination button.btn-next");
  if (buttons[0] && buttons[0].click) {
    buttons[0].click();
    console.log("点击下一页");
    await sleepTime(4);
    let arrNeed = getList();
    if (arrNeed && arrNeed.length) {
      doAllClassListen(arrNeed);
    } else {
      getPage();
    }
  }
}
