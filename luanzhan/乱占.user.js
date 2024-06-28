// ==UserScript==
// @name         农村乱占耕地建房数据汇交平台2
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
  function hideUI(params) {
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
    // 创建一个包装div
    var containerDiv = document.createElement("div");
    containerDiv.style.position = "absolute";
    containerDiv.style.zIndex = "9999";
    containerDiv.style.backgroundColor = "#fff";
    containerDiv.style.border = "1px solid #ccc";
    containerDiv.style.padding = "15px";
    containerDiv.style.paddingTop = "22px";
    containerDiv.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    containerDiv.style.display = "grid";
    containerDiv.style.backgroundColor = "#efefef";
    containerDiv.style.cursor = "move";

    containerDiv.style.left = "10px";
    containerDiv.style.top = "10px";
    document.body.appendChild(containerDiv);

    // 创建可拖动的textarea元素
    var textarea = document.createElement("textarea");
    textarea.id = "customTextarea";
    textarea.style.width = "300px";
    textarea.style.height = "100px";
    // textarea.style.resize = "both"; // 允许调整大小
    containerDiv.appendChild(textarea);

    // 使整个div可拖动
    makeElementDraggable(containerDiv);

    // 创建开始执行按钮
    var startButton = document.createElement("button");
    startButton.id = "executeButton";
    startButton.innerHTML = "开始批量执行（开发中）";
    startButton.style.marginTop = "10px";
    containerDiv.appendChild(startButton);

    // 绑定按钮点击事件
    startButton.addEventListener("click", readTextareaContent);

    // 创建单次通过按钮
    var singleButton = document.createElement("button");
    singleButton.id = "singleButton";
    singleButton.innerHTML = "单次通过（需先进入查看详情页）";
    singleButton.style.marginTop = "10px";
    containerDiv.appendChild(singleButton);
    singleButton.addEventListener("click", clickSaveBtn);

    // 使元素可拖动的函数
    function makeElementDraggable(element) {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

      element.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
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
      console.log("准备等待", sec);
      setTimeout(() => {
        console.log("结束等待", sec);
        resolve();
      }, sec);
    });
  }

  async function clickSaveBtn() {
    const inputSelector = "button.online-review";
    const inputElement = document.querySelector(inputSelector);
    if (inputElement) {
      // inputElement.value = id; // 填充ID
      // 模拟点击按钮
      inputElement.click();

      await sleepSec(1000);
      console.log("");
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
        await sleepSec(100);
        let selectors = document.querySelectorAll(
          "nz-select-search.ant-select-selection-search.ng-star-inserted"
        );
        if (selectors.length > 5) {
          let selector = selectors[5];
          selector.click();

          await sleepSec(500);

          let option = document.querySelector(
            'nz-option-item[title="审核通过"].ant-select-item-option-active.ant-select-item-option'
          );
          option.click();
          await sleepSec(200);
          let saveBtn = document.querySelector(
            ".ant-tabs-content-holder .ng-star-inserted button.ant-btn-primary"
          );
          saveBtn.click();

          await sleepSec(600);
          let closeBtn = document.querySelector(
            ".inner-content .content-edit.ant-layout button.ant-drawer-close i.anticon-close"
          );
          closeBtn.click();
          await sleepSec(600);
          let nextBtn = document.querySelector(
            ".ant-table-tbody td.ant-table-cell-fix-right-first a"
          );
          nextBtn.click();
        }
      }
    }
  }

  function readTextareaContent() {}
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
