// ==UserScript==
// @name         农村乱占耕地建房数据汇交平台——批量通过2013前的部分
// @namespace    rackar
// @version      1.0
// @description  nclzgdjf
// @author       yx
// @match        https://xxcj.mnr.gov.cn/*
// @grant        none
// ==/UserScript==

(function () {
  ("use strict");

  hideUI();
  addUI();
  function hideUI() {
    setInterval(function () {
      var divCollectInfo = document.querySelector(".collect-info");

      if (divCollectInfo) {
        divCollectInfo.style.display = "none";
      }

      const hdiv = document.querySelectorAll(".spot-info");
      if (divCollectInfo) {
        hdiv[1].style.height = "500px";
      }
    }, 1000);
  }

  function addUI() {
    var css =
      "button.hoverbtn:hover{ background-color: #b3cbff }button.passbtn{background-color:#edffed}button.refusebtn{background-color:#e8806b}";
    var style = document.createElement("style");

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName("head")[0].appendChild(style);
    // 创建一个包装div
    var containerDiv = document.createElement("div");
    containerDiv.style.position = "absolute";
    containerDiv.style.zIndex = "9999";
    containerDiv.style.backgroundColor = "#fff";
    containerDiv.style.border = "1px solid #ccc";
    containerDiv.style.padding = "25px";
    containerDiv.style.paddingTop = "30px";
    containerDiv.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    containerDiv.style.display = "grid";
    containerDiv.style.backgroundColor = "#efefef";
    containerDiv.style.cursor = "move";

    containerDiv.style.left = "10px";
    containerDiv.style.top = "10px";
    document.body.appendChild(containerDiv);

    // 创建关闭按钮
    var closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;"; // 使用HTML实体表示关闭图标
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px"; // 调整距离顶部的距离
    closeButton.style.right = "5px"; // 距离右边缘的距离
    closeButton.style.background = "#ccc";
    closeButton.style.border = "none";
    closeButton.style.color = "#fff";
    // closeButton.style.padding = "2px 5px";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "50%"; // 使按钮呈圆形
    closeButton.title = "关闭后需刷新页面重新打开"; // 添加title属性

    // 绑定点击事件以隐藏或删除containerDiv
    closeButton.onclick = function () {
      containerDiv.style.display = "none"; // 隐藏div
      // 或者使用以下代码来彻底从DOM中移除div
      // containerDiv.parentNode.removeChild(containerDiv);
    };

    // 将关闭按钮添加到containerDiv中
    containerDiv.appendChild(closeButton);
    // 使整个div可拖动
    makeElementDraggable(containerDiv);

    //#region 创建可拖动的textarea元素

    // 创建可拖动的textarea元素
    var textarea = document.createElement("textarea");
    textarea.id = "customTextarea";
    textarea.style.width = "300px";
    textarea.style.height = "100px";
    // textarea.style.resize = "both"; // 允许调整大小
    containerDiv.appendChild(textarea);

    // 创建开始执行按钮
    var startButton = document.createElement("button");
    startButton.id = "executeButton";
    startButton.innerHTML = "批量执行（开发中）";
    startButton.style.marginTop = "10px";
    containerDiv.appendChild(startButton);

    var processBar = document.createElement("div");
    processBar.id = "processBar";
    processBar.innerHTML = "批量任务未开始";
    processBar.style.marginTop = "10px";
    containerDiv.appendChild(processBar);

    // 绑定按钮点击事件
    startButton.addEventListener("click", readTextareaContent);
    //#endregion

    // 使元素可拖动的函数
    function makeElementDraggable(element) {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

      element.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        if (e.target === element) {
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
        }
      }

      function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = element.offsetTop - pos2 + "px";
        element.style.left = element.offsetLeft - pos1 + "px";
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  }

  // 初始化
  function init() {}

  // 处理CSV文本
  function processCsv(csvText) {
    const lines = csvText.split("\n");
    lines.forEach((line, index) => {
      if (index > 0) {
        // 跳过标题行
        const id = line.trim(); // 假设每行仅包含一个ID
        setTimeout(() => {
          // 使用setTimeout模拟简单循环，真实场景可能需要更复杂的同步机制
          // 模拟复制ID到剪贴板（注意：此操作可能受限于浏览器的安全策略）
          // 实际应用中可能需要直接填充表单
          // document.execCommand('copy'); // 已废弃
          // 填充表单、点击按钮等操作
          fillAndSubmitForm(id);
        }, index * 5000); // 延迟执行，避免被网站识别为自动化行为
      }
    });
  }

  async function sleepSec(sec) {
    return new Promise((resolve) => {
      console.info("准备等待", sec);
      setTimeout(() => {
        console.info("结束等待", sec);
        resolve();
      }, sec);
    });
  }

  async function clickSaveBtn() {
    const inputSelector = "button.online-review";
    const inputElement = document.querySelector(inputSelector);
    if (inputElement) {
      let panelShow = document.querySelector(".spotDetial.showSpotDetial");
      if (panelShow && panelShow.hidden == true) {
        throw new Error("请先进入详情页面查看举证情况");
      }

      let radioPass = "2013年以前建设(影像)";

      // 模拟点击按钮
      inputElement.click();

      await sleepSec(802);

      let radios = document.querySelectorAll("input.ant-radio-input");
      let radio;
      for (let i = 0; i < radios.length; i++) {
        const e = radios[i];
        if (
          e.parentElement?.parentElement?.children?.length > 1 &&
          e.parentElement?.parentElement?.children[1]?.innerText == "通过"
        ) {
          radio = e;
        }
      }
      if (radio) {
        radio.click();
        await sleepSec(103);

        let textbox = document.querySelector(
          ".ant-tabs-content-holder .ant-tabs-content .ng-star-inserted textarea"
        );
        if (textbox) {
          textbox.value = radioPass;
          textbox.dispatchEvent(new Event("input", { bubbles: true })); //触发input事件
        }

        await sleepSec(204);

        let saveBtn = document.querySelector(
          ".ant-tabs-content-holder .ng-star-inserted button.ant-btn-primary"
        );
        saveBtn.click();
        await sleepSec(105);

        await sleepSec(806);
        let closeBtn = document.querySelector(
          ".inner-content .content-edit.ant-layout button.ant-drawer-close i.anticon-close"
        );
        closeBtn.click();
      }
    } else {
      throw new Error("请先进入详情页面查看举证情况", id);
    }
  }

  async function readTextareaContent() {
    let textbox = document.querySelector("#customTextarea");

    if (textbox) {
      console.info(textbox.value);
      let ids = textbox.value.split("\n");
      let idlist = [];
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i]
          .trim()
          .replace("\r", "")
          .replace("'", "")
          .replace(",", "");
        if (id) idlist.push(id);
      }

      for (let i = 0; i < idlist.length; i++) {
        const id = idlist[i];
        console.info("开始第" + i + "条数据", id);
        const p = document.querySelector("#processBar");
        p.innerText =
          "正执行第" + (i + 1) + "条/总" + idlist.length + "条: " + id;
        try {
          await searchId(id);
          await sleepSec(1001);
          clickIntoInfo(id);
          await sleepSec(1002);
          await clickSaveBtn(id);
          await sleepSec(1003);
        } catch (error) {
          try {
            //网络不好重试一次
            await searchId(id);
            await sleepSec(5001);
            clickIntoInfo(id);
            await sleepSec(5002);
            await clickSaveBtn(id);
            await sleepSec(5003);
          } catch (error2) {
            console.info(error2);
            continue;
          }
        }
      }
      p.innerText = "已执行完毕，总" + idlist.length + "条。";
    }
  }

  async function searchId(id) {
    let idInput = document.querySelector(
      ".listFull .list-right .ant-input-affix-wrapper input"
    );
    if (idInput) {
      idInput.value = "";
      idInput.dispatchEvent(new Event("input", { bubbles: true })); //触发input事件
      await sleepSec(101);
      idInput.value = id;
      idInput.dispatchEvent(new Event("input", { bubbles: true })); //触发input事件
    }

    let searchBtn = document.querySelectorAll(
      ".listFull .list-right button.ant-btn-primary"
    );
    for (let i = 0; i < searchBtn.length; i++) {
      const btn = searchBtn[i];
      if (btn.innerText == "查询") {
        btn.click();
      }
    }
  }

  function clickIntoInfo() {
    let nextBtn = document.querySelector(
      ".ant-table-tbody td.ant-table-cell-fix-right-first a"
    );
    nextBtn.click();
  }
  // 填充表单并点击按钮的示例函数
  async function fillAndSubmitForm(id) {
    // 请根据实际页面结构调整以下选择器

    if (true) {
      // 等待一段时间，确保操作完成（实际中可能需要更复杂的异步处理）
      waitForPageLoadCompletion(() => {
        //    document.querySelector(button2Selector).click();
      }); // 延迟时间根据实际情况调整
    } else {
      console.error("Input element not found");
    }
  }

  // 检查页面是否加载完成
  function waitForPageLoadCompletion(callback) {
    let checkCount = 0;
    const maxChecks = 10; // 最多重试次数
    const checkInterval = setInterval(() => {
      // 检查某个动态加载的内容是否稳定，或者某个特定的加载指示器是否消失
      // 请根据实际情况调整选择器
      const loadingIndicator = document.querySelector("#loading-indicator");
      if (!loadingIndicator || checkCount >= maxChecks) {
        clearInterval(checkInterval);
        callback();
      } else {
        checkCount++;
      }
    }, 500); // 每半秒检查一次
  }

  // 启动脚本
  init();
})();
