// ==UserScript==
// @name         2024年度卫片
// @version      0.5
// @description  年度卫片批量退回或通过
// @author       rackar
// @match        https://landcloud.org.cn/*
// @match        https://www.landcloud.org.cn/*
// @match        https://jg.landcloud.org.cn:5443/main/list/wpzfnddk2024/24/qbdk
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @grant        none
// ==/UserScript==

//注意事项：由于有跨域，必须安装access-control-allow-origin插件，并打开快捷方式目标命令 --disable-web-security --user-data-dir=E:\IDE。

//全部，筛选开关打开县级是否一致，市级是否一致，省级林草部门是否认定，审核阶段：省级
// 注意国土云有很多display:none;的元素，需要甄别后再获取操作。如获取到了非所需标签，指向打印结果时不会在页面上高亮

(function () {
  ("use strict");
  // const TEST_MODE = false; // 使用时将测试模式关闭
  const TEST_MODE = true; // 调试时将测试模式打开
  let db;
  let quitLoop = false;

  let code = "150000";
  let arr = ["150102202412020024", "150102202412040007"];

  let running = false;
  init();
  // openDb();
  /**
   * 打开或创建一个名为 myDatabase 的 IndexedDB 数据库
   * 该数据库版本为 1，如果数据库版本更新，会触发 onupgradeneeded 事件
   * @returns {void}
   */
  function openDb() {
    // 尝试打开名为 myDatabase 的数据库，版本为 1
    let request = window.indexedDB.open("myDatabase", 1);

    // 监听数据库打开成功事件
    request.onsuccess = function (event) {
      // 获取数据库对象
      db = event.target.result;
      // 打印日志表示数据库打开成功
      console.log("数据库打开成功");
    };

    // 监听数据库打开失败事件
    request.onerror = function (event) {
      // 打印错误日志，包含错误代码
      console.error(
        "An error occurred while opening the database:",
        event.target.errorCode
      );
    };

    // 监听数据库版本更新事件
    request.onupgradeneeded = function (event) {
      // 获取数据库对象
      db = event.target.result;
      // 创建一个名为 person 的对象存储，主键为 id，自动递增
      const objectStore = db.createObjectStore("person", {
        keyPath: "id",
        autoIncrement: true,
      });
      // 监听对象存储创建完成事件
      objectStore.transaction.oncomplete = function (event) {
        // 打印日志表示对象存储创建成功
        console.log("Object store created successfully!2");
      };
    };
  }

  function addRow(bsm, tongguo = 1) {
    // console.log("数据待写入", bsm);
    const transaction = db.transaction(["person"], "readwrite");
    // transaction.oncomplete = function (event) {
    //   console.log("事务完成，但无法确定是否成功创建了对象存储。");
    // };
    // transaction.onerror = function (event) {
    //   console.log("事务失败。");
    // };
    const request = transaction.objectStore("person").add({ bsm, tongguo });
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
      if (
        location.href.indexOf(
          "https://jg.landcloud.org.cn:5443/main/list/wpzfnddk2024/24/qbdk"
        ) > -1
      ) {
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
  async function operateWholeList(params) {
    await clickIntoInfo();
  }
  async function jumpInFirstDetail() {}

  async function findConditionAndNext(passOrRefuse = true) {
    let iframe = document.querySelector("iframe");
    let doc = iframe.contentDocument;

    //检测skipCheckbox是否选中,选中则直接提交
    let checkedSkip = document.querySelector("#skipCheckbox").checked;
    if (checkedSkip) return operateWholeList();

    let idlist = getRows();
    const errorList = [];
    const p = document.querySelector("#processBar");
    running = true;
    let breakid = -1;

    for (let i = 0; i < idlist.length; i++) {
      const id = idlist[i];
      if (!running) {
        breakid = id;
        break;
      }
      console.info("开始第" + i + "条数据", id);

      p.innerText =
        "正执行第" +
        (i + 1) +
        "条/总" +
        idlist.length +
        "条: " +
        id +
        ", 报错: " +
        errorList.length +
        "条";
      try {
        await searchId(id);
        await sleepSec(1001);
        let noNetError = await clickIntoInfo(passOrRefuse);
        if (!noNetError) {
          if (!errorList.includes(id)) {
            errorList.push(id);
          }
          continue;
        }
        await sleepSec(1002);
        let noNetError2 = await clickSaveBtn(id);
        if (!noNetError2) {
          if (!errorList.includes(id)) {
            errorList.push(id);
          }
          continue;
        }
        await sleepSec(1003);
      } catch (error) {
        try {
          //网络不好重试一次
          await searchId(id);
          await sleepSec(5001);
          let noNetError = await clickIntoInfo(passOrRefuse);
          if (!noNetError) {
            // 如果数组中不存在，则添加到数组中
            if (!errorList.includes(id)) {
              errorList.push(id);
            }
            continue;
          }
        } catch (error2) {
          console.info(error2);
          continue;
        }
      }
    }
    if (running) {
      p.innerText =
        "已执行完毕，总" +
        idlist.length +
        "条。其中出现问题" +
        errorList.length +
        "条，问题id号为 " +
        errorList.join(",");
    } else {
      p.innerText =
        "已中断于第" +
        breakid +
        "条" +
        " " +
        idlist[breakid] +
        ",总" +
        idlist.length +
        "条。其中出现问题" +
        errorList.length +
        "条，问题id号为 " +
        errorList.join(",");
    }
    running = false;
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
    // await jumpStartPage();//回到第一页
    // await clickDetail(); //进入详情页

    quitLoop = false;

    await findConditionAndNext(true);
  }

  async function readTextareaContentAndRefuse() {
    if (
      !(
        location.hash.indexOf("#/specialMission") > -1 &&
        new Date().getFullYear() === 2024
      )
    ) {
      return alert("需进入国土云林草审核专项");
    }
    // await jumpStartPage();//回到第一页
    // await clickDetail(); //进入详情页

    quitLoop = false;

    await findConditionAndNext(false);
  }

  async function clickDetail() {
    let iframe = document.querySelector("iframe");
    let doc = iframe.contentDocument;
    let detail = doc.querySelector(".list_table .el-table__row button");
    detail.click();
    await sleepTime(2.5);
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
    containerDiv.style.top = "400px";
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

    //创建一个div容器
    var subContainer = document.createElement("div");
    subContainer.style.paddingBottom = "4px";

    containerDiv.appendChild(subContainer);

    //创建一个复选框，可以选择是否跳过检测
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "skipCheckbox";
    checkbox.style.marginRight = "4px";
    subContainer.appendChild(checkbox);
    //复选框后加一个label绑定
    var checkboxLabel = document.createElement("label");
    checkboxLabel.htmlFor = "skipCheckbox";
    checkboxLabel.textContent = "勾选后不读列表，全部操作";
    subContainer.appendChild(checkboxLabel);
    //#endregion

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

    // 创建开始执行按钮
    const refuseButton = document.createElement("button");
    refuseButton.id = "refuseButton";
    refuseButton.innerHTML = "开始批量退回";
    refuseButton.style.marginTop = "10px";
    containerDiv.appendChild(refuseButton);

    var processBar = document.createElement("div");
    processBar.id = "processBar";
    processBar.innerHTML = "批量任务未开始";
    processBar.style.marginTop = "10px";
    containerDiv.appendChild(processBar);

    // 绑定按钮点击事件
    startButton.addEventListener("click", readTextareaContent);
    refuseButton.addEventListener("click", readTextareaContentAndRefuse);

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

  async function searchId(id) {
    let iframe = document.querySelector("iframe");
    let doc = iframe.contentDocument;
    //选择旗县
    // 暂时不用，使用地块标识列表

    //找到输入框
    let idInput = doc.querySelector("main.el-main .filter .searchInput input");
    if (idInput) {
      idInput.value = "";
      idInput.dispatchEvent(new Event("input", { bubbles: true })); //触发input事件
      await sleepSec(101);
      idInput.value = id;
      idInput.dispatchEvent(new Event("input", { bubbles: true })); //触发input事件
    }

    let btn = doc.querySelector("main.el-main .filter .searchInput button");

    btn && btn.click();
  }

  function getRows() {
    return arr;
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

  async function clickIntoInfo(pass = true) {
    let iframe = document.querySelector("iframe");
    let doc = iframe.contentDocument;
    let bu = doc.querySelector(
      "#ListMain-list .list_table .el-table__fixed-right .el-table__row .cell button"
    );
    bu.click();

    await sleepSec(2000);
    let tab1s = doc.querySelectorAll(".divbox2 #tab-1");
    let tab1 = tab1s[tab1s.length - 1];
    tab1.click();
    await sleepSec(500);
    let radios = doc.querySelectorAll(".pdTable .radiocontent input");

    // 如果通过
    if (pass) {
      radios[0].click();
      await sleepSec(200);

      let btns = doc.querySelectorAll(".pdTable button");
      if (!TEST_MODE) btns[0].click();
    } else {
      radios[1].click();
      await sleepSec(200);
      let btns = doc.querySelectorAll(".pdTable button");
      if (!TEST_MODE) btns[1].click();
    }

    return true;
  }
})();
