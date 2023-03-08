// ==UserScript==
// @name         国土云退回图斑审核记录
// @namespace    https://rackar.github.io/article_tech/zhuCeCHS_edu.html
// @version      0.5
// @description  try to take over the world!
// @author       rackar
// @match        https://landcloud.org.cn/*
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
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
    let secend = text * 60 * 60;
    console.log(secend);
    return secend;
  }

  if (
    location.hash.indexOf("#/gzpt/specialMission") > -1 &&
    new Date().getFullYear() === 2023
  ) {
    setTimeout(function () {
      addInput();
      // $(".course-list.cb ul li a").attr("target", "_blank");

      // var trs = $(".course-list.cb ul li"); //2021以前的

      // for (let index = 0; index < trs.length; index++) {
      //   const button = buttonDom[index];
      //   const studyTime = timeDom[index];
      //   let curProcess = processDom[index].innerText;
      //   if (curProcess == "100%") {
      //     continue;
      //   }
      //   // const aMark = tr.children[1];
      //   //   console.log(tr.children[4].innerText);
      //   if (studyTime.innerText.substring(0, 3) == "学时：") {
      //     let time = gotTime(studyTime.innerText.slice(3));
      //     // aMark.attr("target", "_blank");
      //     let obj = {
      //       time,
      //       button,
      //     };
      //     arrNeed.push(obj);
      //     // button.click()
      //     // return;
      //   }
      // }
    }, 1000);
  }
  function onclickHandle() {
    console.log("点击按钮");
    let trs = $("#activeIframe table.el-table__body");
    // let trs = $("table", document.frames("activeIframe").document);
    // activeIframe;
    // let trs = $("table.el-table__body tbody tr.el-table__row");
    console.log(trs);
  }

  function addInput() {
    //使用DOM的创建元素方法
    let o = document.createElement("input");

    o.type = "button";

    o.value = "开始按钮";
    o.style = "position: absolute;top: 20px;left: 40%;z-index: 9999;";

    o.addEventListener("click", onclickHandle);

    document.body.appendChild(o);

    o = null; //及时解除不再使用的变量引用,即将其赋值为 null;
  }
})();
