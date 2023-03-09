// ==UserScript==
// @name         国土云退回图斑审核记录
// @namespace    https://rackar.github.io/article_tech/zhuCeCHS_edu.html
// @version      0.5
// @description  try to take over the world!
// @author       rackar
// @match        https://landcloud.org.cn/*
// @match        https://jg.landcloud.org.cn:9443/*
// @match https://jg.landcloud.org.cn:5443/*
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
      //addInput();
    }, 1000);
  } else if (location.href.indexOf("jg.landcloud.org.cn:9443") > -1) {
    // iframe内
  } else if (location.href.indexOf("jg.landcloud.org.cn:5443") > -1) {
    // iframe内
    console.log("进入iframe内部5443");
    setTimeout(function () {
      addInput();
    }, 5000);
  }

  async function getList() {
    console.log("进入getlist");
    let trs = $(
      ".el-table__fixed-body-wrapper table button.el-button--success"
    );
    // console.log(trs);

    let btn = trs[0];
    btn.click();
    await sleepTime(2);
    let continues = true;
    let recoreds = [];
    while (continues) {
      let result = await getShenhe();
      if (result) {
        recoreds.push(result);
      }
      continues = await goNext();
    }
    console.log(JSON.stringify(recoreds));
  }
  async function getShenhe() {
    let tab = $("#tab-6");
    tab.click();

    await sleepTime(1);
    let divs = $(".el-timeline-item__wrapper");
    // console.log(divs);
    let shengjieguo = null;
    for (let i = 0; i < divs.length; i++) {
      const wrap = divs[i];
      if (wrap.children[0].innerText === "省级审核") {
        let person = wrap.children[1].children[0].children[0].innerText;
        let result = wrap.children[1].children[1].innerText;

        shengjieguo = { person, result };
      }
    }
    // console.log(shengjieguo);
    return shengjieguo;
  }

  async function goNext() {
    let nextBtn = $(
      ".pro-detail .pro-detail-head button.el-button.el-button--primary.el-button--mini"
    );
    // console.log("获取下一条btn", nextBtn);
    for (const btn of nextBtn) {
      if (btn.innerText === "下一条 ") {
        btn.click();
        await sleepTime(2);
        return true;
      }
    }

    return false;
  }
  function onclickHandle() {}

  function addInput() {
    //使用DOM的创建元素方法
    let o = document.createElement("input");

    o.type = "button";

    o.value = "开始按钮";
    o.style = "position: absolute;top: 20px;left: 40%;z-index: 9999;";

    o.addEventListener("click", getList);

    document.body.appendChild(o);

    o = null; //及时解除不再使用的变量引用,即将其赋值为 null;
  }
})();
