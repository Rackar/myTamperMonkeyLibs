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

    // // 创建可拖动的textarea元素
    // var textarea = document.createElement("textarea");
    // textarea.id = "customTextarea";
    // textarea.style.width = "300px";
    // textarea.style.height = "100px";
    // // textarea.style.resize = "both"; // 允许调整大小
    // containerDiv.appendChild(textarea);

    // // 创建开始执行按钮
    // var startButton = document.createElement("button");
    // startButton.id = "executeButton";
    // startButton.innerHTML = "开始批量执行（开发中）";
    // startButton.style.marginTop = "10px";
    // containerDiv.appendChild(startButton);

    // // 绑定按钮点击事件
    // startButton.addEventListener("click", readTextareaContent);
    // #endregion

    // 创建单次通过按钮
    var singleButton = document.createElement("button");
    singleButton.id = "singleButton";
    singleButton.innerHTML = "√ 单次通过（需先进入查看详情页）";
    singleButton.style.marginTop = "10px";
    containerDiv.appendChild(singleButton);
    singleButton.addEventListener("click", clickSaveBtn);

    // 创建多选框组
    var options = [
      "现有手续无法证明",
      "补充有效用地手续",
      "现场照片无法证明",
      "拍摄图斑范围房屋近距离正面照片",
      "图斑内有房屋未拍摄",
      "图斑范围有房子，应填报为住宅类",
      "现有材料无法证明，补充2012年套合影像",
      "拆除类提供2024年套合影像",
      "提供12年前（含12年）卫星影像套合图",
      "卫星影像套合图红框位置不是下发的图斑位置",
      "材料内图斑号不符",
    ];
    var container = document.createElement("div"); // 创建一个容器来存放所有的选择框
    container.style.display = "block"; // 改变布局方式以便更好地排列复选框
    container.style.flexWrap = "wrap"; // 允许换行
    container.style.justifyContent = "center"; // 水平居中
    container.style.paddingTop = "20px";
    container.id = "myCheckbox";

    // 动态创建多个复选框
    options.forEach(function (optionText, index) {
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox"; // 设置类型为复选框
      checkbox.id = "checkbox" + (index + 1); // 为每个复选框分配唯一ID
      checkbox.name = "options" + index + 1; // 如果需要在表单提交时收集这些值，可以设置相同的name属性

      var label = document.createElement("label");
      label.htmlFor = checkbox.id; // 关联label和checkbox
      label.appendChild(document.createTextNode(optionText)); // 在label中添加文本

      container.appendChild(checkbox); // 将复选框添加到容器中
      container.appendChild(label); // 将label添加到容器中
      container.appendChild(document.createElement("br")); // 添加换行，可按需调整布局
    });

    // 创建单次不通过按钮
    var singleRefuseButton = document.createElement("button");
    singleRefuseButton.id = "singleRefuseButton";
    singleRefuseButton.innerHTML = "× 单次不通过（需多选理由）";
    singleRefuseButton.style.marginTop = "10px";
    container.appendChild(singleRefuseButton);
    singleRefuseButton.addEventListener("click", clickRefuseBtn);

    // 创建清除对勾按钮
    var singleClearButton = document.createElement("button");
    singleClearButton.id = "singleClearButton";
    singleClearButton.innerHTML = "清除对勾";
    singleClearButton.title = "每次需手动清空所有对勾选择";
    singleClearButton.style.marginTop = "5px";
    singleClearButton.style.marginLeft = "10px";
    container.appendChild(singleClearButton);
    singleClearButton.addEventListener("click", uncheckAllBox);

    containerDiv.appendChild(container); // 将容器添加到页面中

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
      let panelShow = document.querySelector(".spotDetial.showSpotDetial");
      if (panelShow && panelShow.hidden == true) {
        return alert("请先进入详情页面查看举证情况");
      }
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

  async function clickRefuseBtn() {
    var selectedTexts = readCheckboxValues();
    if (selectedTexts) {
      console.log("选中的理由:", selectedTexts);
      // 这里可以根据需要处理选中的理由字符串，比如提交到服务器等

      let panelShow = document.querySelector(".spotDetial.showSpotDetial");
      if (panelShow && panelShow.hidden == true) {
        return alert("请先进入详情页面查看举证情况");
      }

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
            e.parentElement?.parentElement?.children[1]?.innerText == "不通过"
          ) {
            radio = e;
          }
        }
        if (radio) {
          radio.click();
          await sleepSec(100);
          let textbox = document.querySelector(
            ".ant-tabs-content-holder .ant-tabs-content .ng-star-inserted textarea"
          );
          if (textbox) {
            textbox.value = selectedTexts;
          }
          await sleepSec(200);

          // let saveBtn = document.querySelector(
          //   ".ant-tabs-content-holder .ng-star-inserted button.ant-btn-primary"
          // );
          // saveBtn.click();

          // await sleepSec(600);
          // let closeBtn = document.querySelector(
          //   ".inner-content .content-edit.ant-layout button.ant-drawer-close i.anticon-close"
          // );
          // closeBtn.click();
          // await sleepSec(600);
          // let nextBtn = document.querySelector(
          //   ".ant-table-tbody td.ant-table-cell-fix-right-first a"
          // );
          // nextBtn.click();
        }
      }
    } else {
      alert("请至少选择一个理由");
    }
  }

  async function uncheckAllBox() {
    let checkBoxes = document.querySelectorAll(
      "#myCheckbox input[type=checkbox]"
    );
    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
        checkBoxes[i].checked = false;
      }
    }
  }

  // 新增函数：读取所有选中的多选框的文本值并拼接
  function readCheckboxValues() {
    var checkboxes = document.querySelectorAll(
      '#myCheckbox input[type="checkbox"]:checked'
    ); // 选取所有被选中的复选框
    var selectedOptions = []; // 用于存储选中的选项文本

    checkboxes.forEach(function (checkbox) {
      var label = checkbox.labels[0];
      if (label) {
        selectedOptions.push(label.innerText);
      }
    });

    return selectedOptions.join("。"); // 将数组转换为以逗号分隔的字符串并返回
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
