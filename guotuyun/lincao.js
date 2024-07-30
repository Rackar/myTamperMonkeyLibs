// ==UserScript==
// @name         国土云林草专项
// @version      0.5
// @description  国土云林草专项1-5符合的自动通过
// @author       rackar
// @match        https://landcloud.org.cn/*
// @match        https://jg.landcloud.org.cn:5443/main/list/lddjzxdk/1/xftbsj
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @grant        none
// ==/UserScript==

//注意事项：由于有跨域，必须安装access-control-allow-origin插件，并打开快捷方式目标命令 --disable-web-security --user-data-dir=E:\IDE。

//全部，筛选开关打开县级是否一致，市级是否一致，省级林草部门是否认定，审核阶段：省级

(function () {
  "use strict";
  let db;
  let quitLoop = false;
  init();
  openDb();
  function openDb() {
    let request = window.indexedDB.open("myDatabase", 1);
    request.onsuccess = function (event) {
      db = event.target.result;

      console.log("数据库打开成功");
    };
    request.onerror = function (event) {
      console.error(
        "An error occurred while opening the database:",
        event.target.errorCode
      );
    };
    request.onupgradeneeded = function (event) {
      db = event.target.result;

      // Create or modify object stores here
      const objectStore = db.createObjectStore("person", {
        keyPath: "id",
        autoIncrement: true,
      });

      objectStore.transaction.oncomplete = function (event) {
        console.log("Object store created successfully!2");
      };
    };
  }

  function addRow(bsm) {
    // console.log("数据待写入", bsm);
    const transaction = db.transaction(["person"], "readwrite");
    // transaction.oncomplete = function (event) {
    //   console.log("事务完成，但无法确定是否成功创建了对象存储。");
    // };
    // transaction.onerror = function (event) {
    //   console.log("事务失败。");
    // };
    const request = transaction.objectStore("person").add({ bsm });
    // request.onsuccess = function (event) {
    //   console.log("数据写入成功", bsm);
    // };
    // request.onerror = function (event) {
    //   console.log("数据写入失败", event);
    // };
  }

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
      } else {
        // 其他页面
        console.log("其他页面");
      }
    }, 100);
    // $(document).ready(function () {
    //   setTimeout(function () {
    //     var iframe = $("#activeIframe")[0].contentWindow;
    //     var contentDoc = iframe.document || iframe.contentWindow.document;

    //     var element = $(contentDoc).find("#app");
    //     console.log(element);
    //   }, 10000);

    //   // 现在你可以操作element了
    // });
  }

  async function findConditionAndNext() {
    let iframe = document.querySelector("iframe");
    let doc = iframe.contentDocument;

    let textbox = document.querySelector("#startPageIndex");

    //获取分页大小和页码
    let pagi = doc.querySelector(".customPager .el-select input");
    let pNum = pagi.value.replace(/条\/页/, "");
    let pageSize = (pNum && pNum - 0) || 20;
    let pageIndex = (textbox.value && textbox.value - 0) || 1;
    let index = 0;

    while (!quitLoop) {
      let title = doc.querySelectorAll("form .comgroupparent"); //3个
      if (title.length === 0) {
        await sleepTime(3);
        title = doc.querySelectorAll("form .comgroupparent"); //3个
      }
      let id = doc
        .querySelector("div.el-tooltip.xmtitleCont")
        .innerText.replace(/图斑编码：/, "");

      let divDiaochaXinxi = title[1];
      let subDiaocha = divDiaochaXinxi.querySelectorAll(".el-form-item"); //48个
      let shengji = null;
      let allow = 0;
      for (let i = 0; i < subDiaocha.length; i++) {
        const item = subDiaocha[i];
        let label = item.children[0].innerText;
        let value = item.children[1];
        if (
          label == "县级林草部门地类认定结果" ||
          label == "县级调查部门地类认定结果"
        ) {
          let option = value.querySelector(
            "li.el-select-dropdown__item.selected"
          );
          if (option) {
            let text = option.innerText;
            if (text === "认定2023年“一上”成果") allow++;
            // console.log(label + "：" + text, allow);
          } else {
            // console.log(label + "： 未找到");
          }
        } else if (
          label == "市级林草部门是否认定县级核实结论" ||
          label == "市级调查部门是否认定县级核实结论" ||
          label == "省级林草部门是否认定县级核实结论"
        ) {
          let radio = value.querySelector(
            "label.el-radio.is-disabled.is-checked"
          );
          if (radio) {
            let text = radio.innerText;
            if (text.trim() === "是") allow++;
            // console.log(label + "：" + text, allow);
          } else {
            // console.log(label + "： 未找到");
          }
        } else if (label == "省级调查部门是否认定县级核实结论") {
          shengji = value.querySelector("label.el-radio");
        }
      }
      if (allow === 5) {
        // console.log("通过,点击按钮");
        shengji.click();
        await sleepTime(0.3);
        let divShenheTuban = title[2];
        let passRadio = divShenheTuban.querySelector("label.el-radio");
        passRadio.click();
        await sleepTime(0.3);
        let submitBtn = divShenheTuban.querySelector(
          "button.el-button.el-button--success"
        );
        submitBtn.click();
        await sleepTime(1.4);
        let sureBtn = doc.querySelector(
          ".el-message-box__wrapper .el-message-box__btns .el-button--small.el-button--primary"
        );
        sureBtn.click();
        await sleepTime(1.3);
        addRow(id);
        // alert("测试通过，模拟点击提交按钮");
      } else {
        // console.log("未通过");
        await sleepTime(0.3);
      }
      // 下一条
      let nextBtns = doc.querySelectorAll(
        ".pro-detail-head .el-button-group .el-button--primary"
      );
      if (nextBtns.length === 0) {
        return alert("未找到下一条按钮");
      } else {
        let nextBtn = nextBtns[1];
        nextBtn.click();
        // alert("点击下一条按钮");
        index++;
        textbox.value = pageIndex + Math.floor(index / pageSize);

        localStorage.setItem("pageIndex", textbox.value);
        localStorage.setItem("index", index);
        localStorage.setItem("pageSize", pageSize);

        await sleepTime(1.5);
      }
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
    jumpStartPage();
    clickDetail();

    quitLoop = false;

    findConditionAndNext();
  }
  async function clickDetail() {
    let iframe = document.querySelector("iframe");
    let doc = iframe.contentDocument;
    let detail = doc.querySelector(".list_table .el-table__row button");
    detail.click();
    await sleepTime(1.5);
  }

  async function jumpStartPage() {
    let textbox = document.querySelector("#startPageIndex");
    let iframe = document.querySelector("iframe");
    let doc = iframe.contentDocument;
    let pagi = doc.querySelector(".customPager");
    let pageNum = pagi.querySelector(".el-input-number input");

    if (!textbox.value || textbox.value == pageNum.value) {
      return true;
    } else {
      pageNum.value = textbox.value;
      // pageNum.dispatchEvent(new Event("input"));

      setTimeout(() => {
        // 给input标签触发回车键事件
        // pageNum.focus();
        // pageNum.click();
        pageNum.dispatchEvent(new Event("change")); //element input 监听回车只需要发送change事件触发
        // pageNum.dispatchEvent(new Event("keydown", { KeyCode: 13 }));
      }, 50);

      await sleepTime(2);

      return false;
    }
  }

  function addUI() {
    const css =
      "button.hoverbtn:hover{ background-color: #b3cbff }button.passbtn{background-color:#edffed}button.refusebtn{background-color:#e8806b}";
    const style = document.createElement("style");

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName("head")[0].appendChild(style);
    // 创建一个包装div
    const containerDiv = document.createElement("div");
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
    containerDiv.style.left = "4px";
    containerDiv.style.top = "350px";
    containerDiv.style.fontSize = "14px";
    document.body.appendChild(containerDiv);

    // 创建关闭按钮
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;"; // 使用HTML实体表示关闭图标
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px"; // 调整距离顶部的距离
    closeButton.style.right = "5px"; // 距离右边缘的距离
    closeButton.style.background = "#ccc";
    closeButton.style.border = "none";
    closeButton.style.color = "#fff";
    // closeButton.style.padding = "2px 5px";
    closeButton.style.width = "15px";
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

    // 创建可拖动的textarea元素
    const startPageIndexLabel = document.createElement("span");
    startPageIndexLabel.id = "startPageIndexLabel";
    startPageIndexLabel.innerText = "起始页码：";
    // startPageIndex.style.width = "80px";
    // textarea.style.resize = "both"; // 允许调整大小
    containerDiv.appendChild(startPageIndexLabel);

    const startPageIndex = document.createElement("input");
    startPageIndex.id = "startPageIndex";
    startPageIndex.style.width = "100px";
    // textarea.style.resize = "both"; // 允许调整大小
    containerDiv.appendChild(startPageIndex);

    // 创建开始执行按钮
    const startButton = document.createElement("button");
    startButton.id = "executeButton";
    startButton.innerHTML = "开始批量提交";
    startButton.style.marginTop = "10px";
    containerDiv.appendChild(startButton);

    // 绑定按钮点击事件
    startButton.addEventListener("click", readTextareaContent);

    // 创建开始执行按钮
    const stopButton = document.createElement("button");
    stopButton.id = "stopButton";
    stopButton.innerHTML = "停止";
    stopButton.style.marginTop = "10px";
    containerDiv.appendChild(stopButton);

    // 绑定按钮点击事件
    stopButton.addEventListener("click", () => {
      quitLoop = true;
    });

    let pageIndex = localStorage.getItem("pageIndex");
    if (pageIndex) startPageIndex.value = pageIndex;
    //textarea.focus();

    //#endregion

    // 使元素可拖动的函数
    function makeElementDraggable(element) {
      let pos1 = 0,
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
