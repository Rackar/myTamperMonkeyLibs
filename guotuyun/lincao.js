// ==UserScript==
// @name         国土云林草专项
// @version      0.5
// @description  国土云林草专项1-5符合的自动通过
// @author       rackar
// @match        https://landcloud.org.cn/*
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  init();

  // Your code here...
  function sleepTime(secends) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), secends * 1000);
    });
  }

  function init() {
    setTimeout(function () {
      addUI();
      if (location.href.indexOf("jg.landcloud.org.cn:9443") > -1) {
        // iframe内
        console.log("进入iframe内部9443");
      } else if (location.href.indexOf("jg.landcloud.org.cn:5443") > -1) {
        // iframe内
        console.log("进入iframe内部5443");
      }
    }, 200);
  }

  function findConditionAndNext() {
    if (true) {
      let idInput = document.querySelector(
        '#activeIframe #app [role="tablist"] [role="tabpanel"]  .el-form-item__content'
      );
    }
  }

  async function readTextareaContent() {
    if (
      !(
        location.hash.indexOf("#/specialMission") > -1 &&
        new Date().getFullYear() === 2024
      )
    ) {
      return alert("需进入国土云林草审核专项");
    }
    findConditionAndNext();
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
    containerDiv.style.overflowWrap = "anywhere";
    containerDiv.style.left = "10px";
    containerDiv.style.top = "410px";
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

    // 创建开始执行按钮
    var startButton = document.createElement("button");
    startButton.id = "executeButton";
    startButton.innerHTML = "开始";
    startButton.style.marginTop = "10px";
    containerDiv.appendChild(startButton);

    // 绑定按钮点击事件
    startButton.addEventListener("click", readTextareaContent);

    //textarea.focus();

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
        if (e.target === element) {
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          element.style.top = element.offsetTop - pos2 + "px";
          element.style.left = element.offsetLeft - pos1 + "px";
        }
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  }
})();
