// ==UserScript==
// @name         农村乱占耕地建房数据汇交平台——批量审批上报
// @namespace    rackar
// @version      1.0
// @description  nclzgdjf
// @author       yx
// @match        https://xxcj.mnr.gov.cn/*
// @grant        none
// ==/UserScript==

(function () {
  ("use strict");

  let arr = [];
  let running = false;

  addUI();

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
    containerDiv.style.overflowWrap = "anywhere";
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
    // var textarea = document.createElement("textarea");
    // textarea.id = "customTextarea";
    // textarea.style.width = "300px";
    // textarea.style.height = "100px";
    // // textarea.style.resize = "both"; // 允许调整大小
    // containerDiv.appendChild(textarea);

    var divInfo = document.createElement("div");
    divInfo.id = "divInfo";
    divInfo.innerHTML = "点击前确认已进行查询，并修改为40条每页";
    divInfo.style.marginTop = "10px";
    containerDiv.appendChild(divInfo);

    // 创建开始执行按钮
    var startButton = document.createElement("button");
    startButton.id = "executeButton";
    startButton.innerHTML = "批量执行";
    startButton.style.marginTop = "10px";
    containerDiv.appendChild(startButton);

    // 创建停止执行按钮
    var stopButton = document.createElement("button");
    stopButton.id = "stopButton";
    stopButton.innerHTML = "停止任务";
    stopButton.style.marginTop = "10px";
    containerDiv.appendChild(stopButton);

    var processBar = document.createElement("div");
    processBar.id = "processBar";
    processBar.innerHTML = "批量任务未开始";
    processBar.style.marginTop = "10px";
    containerDiv.appendChild(processBar);

    // 绑定按钮点击事件
    startButton.addEventListener("click", readTextareaContent);

    stopButton.addEventListener("click", () => {
      running = false;
    });
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

  async function sleepSec(sec) {
    return new Promise((resolve) => {
      // console.info("准备等待", sec);
      setTimeout(() => {
        //  console.info("结束等待", sec);
        resolve();
      }, sec);
    });
  }

  async function loopFun() {
    const p = document.querySelector("#processBar");
    running = true;
    let breakid = 0;

    for (; running; ) {
      breakid++;
      p.innerText = "执行第" + breakid + "页";

      // 找到审核按钮
      let s = document.querySelector("input.ant-checkbox-input.ng-valid");
      s.click();

      await sleepSec(500);
      let b = document.querySelector(
        ".allBtn-left button.ant-btn.ng-star-inserted.ant-btn-primary"
      );
      b.click();
      await sleepSec(500);
      let ra = document.querySelector(".ant-modal-body .ant-radio input"); //通过
      ra.click();
      await sleepSec(700);
      let sub = document.querySelector(
        ".ant-modal-footer button.ant-btn-primary"
      );
      sub.click();
      // await sleepSec(500);

      await sleepSec(5500);
      // 是否下一页按钮可用
      let t = document.querySelector(
        ".list-right .ant-pagination .ant-pagination-next button"
      );
      if (!t || t.hasAttribute("disabled")) {
        break;
      } else {
        // alert("模拟下一页");
        // // t.click();
        // await sleepSec(2000);
      }
    }
  }

  async function readTextareaContent() {
    let hash = "#/mapRelevancy/dataCheck";
    if (location.hash != hash) {
      return alert("需进入审核上报页面: https://xxcj.mnr.gov.cn/" + hash);
    }
    await loopFun();
    // let idlist = getTextarea();

    // await sleepSec(300);
  }
})();
