// ==UserScript==
// @name         专业技术继续教育_真的视频页2_2025

// @version      0.8s
// @description  进入视频自动开始并静音。解除失去焦点自动暂停，后台听不也挺好吗。一般情形可用。注：使用本脚本视频会一直处于播放状态，请关注提示是否已经播完，如弹出课程评价等。
// @author       DrS
// @license      AGPL License
// @match        *://videoadmin.chinahrt.com*/videoPlay/play*
// @match        *://web.chinahrt.com*/index.html#/v_video*
// @grant        none

// ==/UserScript==
$(document).ready(function () {
  // (function () {
  // 'use strict';
  var speedup = false;

  //----------------函数定义----------------//
  function goPlayAction(addstr) {
    addstr = addstr || "默认调用";
    try {
      // timer.change(0.333);
      player.videoPlay();
      player.changeVolume(0.1);
      player.videoMute();

      console.log("timehooker加速");
      speedup = true;
    } catch (e) {
      console.log("没有timehooker，或其他命令失败", e);
    }

    //player.changePlaybackRate(4); //修改播放速度
    console.log("播放静音倍速3连【" + addstr + "】");
    //  setTimeout(function(){player.videoMute();}, 10000);
  }
  function pauseAction(addstr, waitTime) {
    addstr = "pauseAction" + addstr || "pauseAction默认调用";
    waitTime = waitTime || 1000;
    if (videoIsEnd == true) {
      document.title = "【已播完】" + document.title;
      return setTimeout(closeCurrentPage, 3000);
    }
    if (document.URL.search("end") > 34 || videoIsEnd == true) {
      //window.close();
      console.log("检测到视频结束,本次视频恢复取消等待系统进入下一视频");
      document.getElementsByClassName("ths")[0].innerText =
        "【本视频已经播放过至少1次】";
      document.title = "【已播完】" + document.title;
      $(".f14:first").prepend("【重播】");
      waitTime = 5000;
      videoIsEnd = false;
    } else {
      setTimeout(function () {
        goPlayAction(addstr);
      }, waitTime);
    }
  }
  //时间监听器

  function refreshIfMultipleCoursesMessage() {
    // 使用querySelectorAll来查找所有<h1>元素，并遍历它们
    var h1Elements = document.querySelectorAll("h1");
    for (var i = 0; i < h1Elements.length; i++) {
      // 检查元素的文本内容是否与预期的一致
      if (
        h1Elements[i].innerHTML.trim() ===
        "不允许同时观看多门课程，请关闭当前页面！"
      ) {
        // 如果找到了元素，并且它的样式和文本内容与预期的一致，则刷新页面
        window.location.reload();
        return; // 停止函数执行
      }
    }
  }

  function closeCurrentPage() {
    setTimeout(() => {
      var userAgent = navigator.userAgent;
      if (
        userAgent.indexOf("Firefox") != -1 ||
        userAgent.indexOf("Chrome") != -1
      ) {
        window.location.href = "about:blank";
        window.close();
      } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
      }
    }, 8000);
  }

  //----------------函数定义end----------------//

  window.onfocus = function () {
    console.log("onfocus焦点监控事件已被替换");
  };
  window.onblur = function () {
    console.log("onblur原始事件已被替换");
  };
  var videoIsEnd = false;

  var tmp = setInterval(function () {
    if (player) {
      player.addListener("loadedmetadata", function () {
        setTimeout(function () {
          goPlayAction("初始加载");
        }, 1000);
        clearInterval(tmp);
      });
      //player.addListener('pause',pauseAction('暂停监听'));
      player.addListener("ended", function () {
        videoIsEnd = true;
      });
    }
  }, 5000);
  setInterval(function () {
    refreshIfMultipleCoursesMessage();
    var rtime = player.V.duration - player.time;
    //console.log('剩余时间：'+rtime)
    if (rtime <= 60) {
      console.log("视频剩余时间小于60秒，恢复播放速度");
      timer.change(1);
    }
    try {
      player.videoMute();
    } catch {
      console.log("没有player");
    }
    var playerMetaDate = player.getMetaDate();
    if (playerMetaDate["paused"]) {
      pauseAction("循环检测发现暂停");
    }
  }, 20000);
});
