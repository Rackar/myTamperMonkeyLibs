// ==UserScript==
// @name         内蒙古干部网络学院视频页
// @namespace    https://rackar.github.io/article_tech/zhuCeCHS_edu.html
// @version      0.4
// @description  try to take over the world!
// @author       rackar
// @match        https://wlxy.nmgdj.gov.cn/detail/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  // $("body").off("blur");
  window.onblur = function () {};
  document.body.onblur = function () {};
  document.body.onfocus = function () {};
  document.body.onvisibilitychange = function () {};
  document.body.onfocusin = function () {};

  // 用脚本禁用离开页面的检测
  document.addEventListener("visibilitychange", async function () {
    if (document.visibilityState === "hidden") {
      console.log("页面已离开！");
      await sleepSec(1);
      let btn = document.querySelector(".next-dialog-footer button");
      if (btn) btn.click();
    }
  });

  function sleepSec(sec) {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
  }
  async function closeCurrentPage() {
    // var userAgent = navigator.userAgent;
    // if (
    //   userAgent.indexOf("Firefox") != -1 ||
    //   userAgent.indexOf("Chrome") != -1
    // ) {
    //   window.location.href = "about:blank";
    //   window.close();
    // } else {
    //   window.opener = null;
    //   window.open("", "_self");
    //   window.close();
    // }
    window.history.back();
    await sleepSec(5);
    console.log("等待5秒");
    location.reload();
    console.log("刷新页面");
  }
  function closePage() {
    let v = document.querySelector("video");
    // v.muted = true;
    v.play();
    v.addEventListener("ended", async function () {
      console.log("自定义监听：视频播放已结束！");
      let index = parseInt(localStorage.getItem("list-start-index")) || 0;
      localStorage.setItem("list-start-index", index + 1);
      await sleepSec(6);
      closeCurrentPage();
      // 在这里添加你想要执行的代码
    });
    // player.videoMute();
    // let data = player.getMetaDate();
    let toal = data.v + 120;
    console.log("finish part 1");
    // setTimeout(closeCurrentPage, toal * 1000);
  }

  setTimeout(() => {
    closePage();
  }, 4 * 1000);
})();
