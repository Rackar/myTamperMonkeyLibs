// ==UserScript==
// @name         新注册测绘师继续教育_列表页
// @namespace    https://rsedu.ch.mnr.gov.cn/Geo_Manage/index
// @version      0.4
// @description  try to take over the world!
// @author       rackar
// @match        https://rsedu.ch.mnr.gov.cn/Geo_Manage/index
// @match        https://rsedu.ch.mnr.gov.cn/Geo_Manage/index
// @grant        none
// ==/UserScript==

(function () {
  ("use strict");

  // 可以加 @run-at       document-idle
  // 这条会等待页面全部加载后执行脚本

  // 用户脚本的主体部分
  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM已加载完毕。");
  });

  window.addEventListener("load", function () {
    console.log("页面已完全加载完毕。");
  });

  let btns = [];
  function sleepTime(secends) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), secends * 1000);
    });
  }
  async function doAllClassListen(obj) {
    for (let i = 0; i < obj.length; i++) {
      obj[i].button.click();
      console.log("点击按钮第" + i);
      await sleepTime(obj[i].time);
    }
  }

  function addUI() {
    // 创建一个新的<style>元素
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `
                #fixed-button {
                    position: fixed;
                    top: 76px;
                    right: 12px;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: white;
                    background-color: blue;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    z-index: 1000;
                }
                #fixed-button:hover {
                    background-color: darkblue;
                }
            `;

    // 将<style>元素添加到<head>中
    document.head.appendChild(style);

    // 创建一个新的按钮元素
    var newButton = document.createElement("button");
    newButton.id = "fixed-button";

    // 设置按钮的文本
    newButton.textContent = "开始课程";

    // 为按钮添加点击事件监听器
    newButton.addEventListener("click", clickUIbtn);

    // 将按钮添加到body元素中
    document.body.appendChild(newButton);
  }

  function clickUIbtn() {
    var iframe = document.getElementById("bodyIframe");
    if (iframe?.contentDocument?.readyState == "complete") {
      var iframeDoc = iframe.contentWindow.document;

      // 获取页面上所有的按钮元素
      var allButtons = iframeDoc.getElementsByTagName("button");

      btns = [];
      // 遍历所有按钮
      for (var i = 0; i < allButtons.length; i++) {
        // 检查按钮的文本内容是否为“立即学习”
        if (allButtons[i].textContent === "立即学习") {
          // 执行操作，例如添加点击事件监听器
          btns.push(allButtons[i]);
          // 可以在这里添加更多的操作
        }
      }
      if (btns.length == 0) {
        alert("未找到立即学习按钮，是否未进入课程列表页？");
      } else {
        console.log(btns[0]);
        btns[0].click();
      }
    }
    // 确保iframe加载完成后再进行操作
    iframe.addEventListener("load", function () {});
  }

  function nextPage(params) {
    var iframe = document.getElementById("bodyIframe");
    if (iframe?.contentDocument?.readyState == "complete") {
      var iframeDoc = iframe.contentWindow.document;

      // 获取页面上所有的按钮元素
      var allButtons = iframeDoc.querySelectorAll(".layui-laypage-next");
      if (allButtons && allButtons.length) {
        allButtons[0].click();
      }
    }

    async function loopBtns(btns) {
      for (let i = 0; i < btns.length; i++) {
        const btn = btns[i];
        btn.click();
        await sleepTime(60 * 60);
      }
    }

    function clickNode(node) {
      var divText = node.textContent || node.innerText;
      console.log("Detected popup div with text:", divText);
      // 这里可以添加你想要执行的操作，比如发送文本到服务器等

      // 使用querySelector来查找子孙中的链接，假设链接有一个特定的类名'your-link-class'
      var link = node.querySelector(".layui-layer-btn0");

      // 检查链接是否存在
      if (link && link.innerText == "确定") {
        link.click();
        // 关闭弹窗
        setTimeout(() => {
          var closeBtns = document.body.querySelectorAll(".layui-layer-close");
          if (closeBtns && closeBtns.length) {
            closeBtns[0].click();
          }
          setTimeout(() => {
            clickUIbtn();
          }, 3000);
        }, 3000);

        // 模拟点击事件
        //link.dispatchEvent(clickEvent);
      } else {
        console.log("Link not found");
      }
    }

    function findDialog() {
      var targetDiv = document.getElementsByClassName("layui-layer-dialog");
      if (targetDiv && targetDiv.length) {
        console.log("5秒遍历找到", targetDiv);
        clickNode(targetDiv[0]);
      }
    }

    setInterval(findDialog, 5 * 1000);

    function mainfun(btns) {
      var trs = $("tbody tr");
      // console.log("monkey");
      // console.log(trs);

      let arrNeed = [];
      for (let index = 0; index < trs.length; index++) {
        const tr = trs[index];
        //   console.log(tr.children[4].innerText);
        if (tr.children[4].innerText != "已完成") {
          let url = tr.children[5].children[0].children[0].href;
          let timeMin = tr.children[1].children[0].innerText;
          timeMin = timeMin.replace("约", "");
          timeMin = timeMin.replace("分钟", "");
          // console.log(timeMin);
          let time = (timeMin - 0 + 3) * 60;
          if (tr.children[4].innerText != "未开始") {
            let rate = tr.children[4].innerText;

            time *= parseFloat(rate) / 100;
            debugger;
          }

          // let time = (timeMin - 0 + 3) * 60;
          let button = tr.children[5].children[0].children[0];
          let obj = {
            url,
            time,
            button,
          };
          arrNeed.push(obj);
          // button.click()
          // return;
        }
      }
      console.log(arrNeed);

      doAllClassListen(arrNeed);
    }
    setTimeout(addUI, 2000);

    // Your code here...
  }
})();
