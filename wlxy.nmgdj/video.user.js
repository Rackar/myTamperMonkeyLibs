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

  let loopInterval = null;
  async function loopCheck() {
    // 检查是否未播放完，同时有视频暂停状态
    loopInterval = setInterval(checkOnce, 7000);
  }

  async function checkOnce() {
    let video = document.querySelector("video");
    if (video && video.paused) {
      console.log("视频已暂停！");
      let btn = document.querySelector(".next-dialog-footer button");
      if (btn) {
        btn.click();
      } else {
        startPlay();
      }
    }
  }

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
    let index = parseInt(localStorage.getItem("list-start-index")) || 0;
    localStorage.setItem("list-start-index", index + 1);
    localStorage.setItem("retry-times", 0);
    loopInterval = null;
    window.history.back();
    await sleepSec(5);
    console.log("等待5秒");
    location.reload();
    console.log("刷新页面");
  }
  function checkRetryTimes() {
    let retryTimes = parseInt(localStorage.getItem("retry-times")) || 0;
    retryTimes++;
    if (retryTimes > 7) {
      closeCurrentPage();
    } else {
      localStorage.setItem("retry-times", retryTimes);
    }
  }

  async function startPlay() {
    if (checkCompletedState()) {
      return closeCurrentPage();
    } else {
      await skipFinishedVideo();
    }
    checkRetryTimes();
    let v = document.querySelector("video");
    v.muted = true; //必须先静音，不然不给播放
    v.play();
    v.addEventListener("ended", async function () {
      console.log("自定义监听：视频播放已结束！");
      await sleepSec(6);
      if (checkCompletedState()) {
        closeCurrentPage();
      }

      // 在这里添加你想要执行的代码
    });
    // player.videoMute();
    // let data = player.getMetaDate();

    console.log("finish part 1");
    // setTimeout(closeCurrentPage, toal * 1000);
  }

  function checkCompletedState() {
    let title = document.querySelector(
      '.simplebar-content div[class^="$id--player_side_title--"]'
    );
    let text = title.innerText.replace("课程章节(", "").replace(")", "");
    let split = text.split("/");
    let current = split[0];
    let total = split[1];
    if (current == total) return true;
    let list = document.querySelector(
      '.simplebar-content div[class^="$id--player_side_item_wrap"]'
    ).children;

    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      let percent = item.querySelector(
        'div[class^="$id--player_side_item_progress"] span.ant-progress-text'
      );
      if (percent.innerText == "100%") {
        continue;
      } else {
        return false;
      }
    }

    return true;
  }

  async function skipFinishedVideo() {
    let list = document.querySelector(
      '.simplebar-content div[class^="$id--player_side_item_wrap"]'
    ).children;

    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      let percent = item.querySelector(
        'div[class^="$id--player_side_item_progress"] span.ant-progress-text'
      );
      if (percent.innerText == "100%") {
        continue;
      } else {
        item.click();
        break;
      }
    }
    await sleepSec(3);
  }

  setTimeout(() => {
    startPlay();
    loopCheck();
  }, 3 * 1000);
})();
