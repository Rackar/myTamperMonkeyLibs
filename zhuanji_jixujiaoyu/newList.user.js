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
  "use strict";

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
    // 获取页面上所有的按钮元素
    var allButtons = document.getElementsByTagName("button");

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
      loopBtns(btns);
    }
  }

  async function loopBtns(btns) {
    for (let i = 0; i < btns.length; i++) {
      const btn = btns[i];
      btn.click();
      await sleepTime(60 * 60);
    }
  }
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
  setTimeout(addUI, 4000);

  // Your code here...
})();
