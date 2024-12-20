// ==UserScript==
// @name         2024年度卫片
// @version      0.5
// @description  年度卫片批量退回或通过
// @author       rackar
// @match        https://landcloud.org.cn/*
// @match        https://www.landcloud.org.cn/*
// @match        https://jg.landcloud.org.cn:5443/main/list/wpzfnddk2024/24/qbdk
// @grant        none
// ==/UserScript==

//注意事项：由于有跨域，必须安装access-control-allow-origin插件，并打开快捷方式目标命令 --disable-web-security --user-data-dir=E:\IDE。

//全部，筛选开关打开县级是否一致，市级是否一致，省级林草部门是否认定，审核阶段：省级
// 注意国土云有很多display:none;的元素，需要甄别后再获取操作。如获取到了非所需标签，指向打印结果时不会在页面上高亮
try {
  (function () {
    ("use strict");
    // const TEST_MODE = false; // 使用时将测试模式关闭
    const TEST_MODE = false; // 调试时将测试模式打开
    let db;

    let code = "150000";
    let arr = [];

    let running = false;
    init();
    openDb();
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
        const objectStore = db.createObjectStore("record", {
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
      const transaction = db.transaction(["record"], "readwrite");
      // transaction.oncomplete = function (event) {
      //   console.log("事务完成，但无法确定是否成功创建了对象存储。");
      // };
      // transaction.onerror = function (event) {
      //   console.log("事务失败。");
      // };
      const request = transaction.objectStore("record").add({ bsm, tongguo });
      request.onsuccess = function (event) {
        console.log("数据写入成功", bsm);
      };
      request.onerror = function (event) {
        console.log("数据写入失败", event);
      };
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
    }
    async function operateWholeList(passOrRefuse = true) {
      await clickIntoInfo(passOrRefuse);
    }
    async function jumpInFirstDetail() {}

    async function findConditionAndNext(passOrRefuse = true) {
      let iframe = document.querySelector("iframe");
      let doc = iframe.contentDocument;

      //检测skipCheckbox是否选中,选中则直接提交
      let checkedSkip = document.querySelector("#skipCheckbox").checked;
      if (checkedSkip && arr.length != 0) {
        alert("已勾选全部操作，但是列表没有清空");
        return;
      } else if (checkedSkip) return operateWholeList(passOrRefuse);

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
        return alert("需进入国土云2024卫片专项的全部地块列表");
      }

      // 获取文本框内容并处理成数组
      const textarea = document.querySelector("#batchInput");
      const content = textarea.value.trim();
      if (!content) {
        return alert("请输入要处理的编号");
      }

      // 将输入的文本按行分割，并过滤掉空行
      arr = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);

      if (arr.length === 0) {
        return alert("没有有效的编号");
      }

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

      // 获取文本框内容并处理成数组
      const textarea = document.querySelector("#batchInput");
      const content = textarea.value.trim();
      if (!content) {
        return alert("请输入要处理的编号");
      }

      // 将输入的文本按行分割，并过滤掉空行
      arr = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);

      if (arr.length === 0) {
        return alert("没有有效的编号");
      }

      await findConditionAndNext(false);
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

      // 添加多行文本输入
      const textarea = document.createElement("textarea");
      textarea.id = "batchInput";
      textarea.placeholder = "请输入要处理的编号，每行一个";
      textarea.style.width = "320px";
      textarea.style.height = "100px";
      textarea.style.marginBottom = "10px";
      containerDiv.appendChild(textarea);

      //#endregion

      // // 创建页码和跳过
      // const startPageIndexLabel = document.createElement("span");
      // startPageIndexLabel.id = "startPageIndexLabel";
      // startPageIndexLabel.innerText = "起始页码：";
      // // startPageIndex.style.width = "80px";
      // // textarea.style.resize = "both"; // 允许调整大小
      // containerDiv.appendChild(startPageIndexLabel);

      // const startPageIndex = document.createElement("input");
      // startPageIndex.id = "startPageIndex";
      // startPageIndex.style.width = "100px";
      // // textarea.style.resize = "both"; // 允许调整大小
      // containerDiv.appendChild(startPageIndex);

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
      //复选框加一个label绑定
      var checkboxLabel = document.createElement("label");
      checkboxLabel.htmlFor = "skipCheckbox";
      checkboxLabel.textContent =
        "全部处理（勾选则忽略输入框。注意先筛选确认）";
      subContainer.appendChild(checkboxLabel);

      // 创建开始执行按钮
      const startButton = document.createElement("button");
      startButton.id = "executeButton";
      startButton.innerHTML = "批量提交";
      startButton.style.marginTop = "10px";
      containerDiv.appendChild(startButton);

      // 创建开始执行按钮
      const refuseButton = document.createElement("button");
      refuseButton.id = "refuseButton";
      refuseButton.innerHTML = "批量退回";
      refuseButton.style.marginTop = "10px";
      containerDiv.appendChild(refuseButton);

      // 创建停止执行按钮
      const stopButton = document.createElement("button");
      stopButton.id = "stopButton";
      stopButton.innerHTML = "停止";
      stopButton.style.marginTop = "10px";
      containerDiv.appendChild(stopButton);

      var processBar = document.createElement("div");
      processBar.id = "processBar";
      processBar.innerHTML = "批量任务未开始";
      processBar.style.marginTop = "10px";
      containerDiv.appendChild(processBar);

      // 绑定按钮点击事件
      startButton.addEventListener("click", readTextareaContent);
      refuseButton.addEventListener("click", readTextareaContentAndRefuse);

      // 绑定按钮点击事件
      stopButton.addEventListener("click", () => {
        running = false;
      });

      // let pageIndex = localStorage.getItem("pageIndex");
      // if (pageIndex) startPageIndex.value = pageIndex;
      //textarea.focus();

      //#endregion

      // 使元素可拖动的函数
      function makeElementDraggable(element) {
        let pos1 = 0,
          pos2 = 0,
          pos3 = 0,
          pos4 = 0;
        let isDragging = false;

        // 设置容器的初始样式
        element.style.position = "fixed";
        element.style.margin = "0";
        element.style.left = "4px";
        element.style.top = "400px";
        // 移除 transform，改用直接定位
        element.style.transform = "";

        const dragHandle = document.createElement("div");
        dragHandle.style.position = "absolute";
        dragHandle.style.top = "0";
        dragHandle.style.left = "0";
        dragHandle.style.right = "0";
        dragHandle.style.height = "30px";
        dragHandle.style.backgroundColor = "#e0e0e0";
        dragHandle.style.cursor = "move";
        dragHandle.style.borderBottom = "1px solid #ccc";
        dragHandle.style.zIndex = "10000";
        dragHandle.style.userSelect = "none";
        dragHandle.style.webkitUserSelect = "none";
        dragHandle.style.pointerEvents = "auto";
        element.insertBefore(dragHandle, element.firstChild);

        ["mousedown", "pointerdown", "touchstart"].forEach((eventType) => {
          dragHandle.addEventListener(eventType, dragMouseDown, {
            capture: true,
            passive: false,
          });
        });

        function dragMouseDown(e) {
          if (e.target !== dragHandle) return;

          e.preventDefault();
          e.stopPropagation();

          isDragging = true;

          // 获取初始位置
          const point = e.touches ? e.touches[0] : e;
          pos3 = point.clientX;
          pos4 = point.clientY;

          // 记录元素的初始位置
          const rect = element.getBoundingClientRect();
          element.initialLeft = rect.left;
          element.initialTop = rect.top;

          document.addEventListener("mousemove", elementDrag, {
            capture: true,
            passive: false,
          });
          document.addEventListener("mouseup", closeDragElement, {
            capture: true,
            passive: false,
          });
          document.addEventListener("pointermove", elementDrag, {
            capture: true,
            passive: false,
          });
          document.addEventListener("pointerup", closeDragElement, {
            capture: true,
            passive: false,
          });
        }

        function elementDrag(e) {
          if (!isDragging) return;

          e.preventDefault();
          e.stopPropagation();

          const point = e.touches ? e.touches[0] : e;

          // 计算位移
          const dx = point.clientX - pos3;
          const dy = point.clientY - pos4;

          // 更新位置记录
          pos3 = point.clientX;
          pos4 = point.clientY;

          // 直接更新元素位置
          const newLeft = element.offsetLeft + dx;
          const newTop = element.offsetTop + dy;

          // 添加边界检查
          const maxX = window.innerWidth - element.offsetWidth;
          const maxY = window.innerHeight - element.offsetHeight;

          element.style.left = Math.max(0, Math.min(newLeft, maxX)) + "px";
          element.style.top = Math.max(0, Math.min(newTop, maxY)) + "px";
        }

        function closeDragElement(e) {
          if (!isDragging) return;

          e.preventDefault();
          e.stopPropagation();

          isDragging = false;

          // 移除事件监听
          document.removeEventListener("mousemove", elementDrag, {
            capture: true,
          });
          document.removeEventListener("mouseup", closeDragElement, {
            capture: true,
          });
          document.removeEventListener("pointermove", elementDrag, {
            capture: true,
          });
          document.removeEventListener("pointerup", closeDragElement, {
            capture: true,
          });
        }

        // 添加调试样式
        dragHandle.innerHTML = "可拖动区域 (点击这里拖动)";
        dragHandle.style.textAlign = "center";
        dragHandle.style.lineHeight = "30px";
        dragHandle.style.color = "#666";
      }
    }

    async function searchId(id) {
      let iframe = document.querySelector("iframe");
      let doc = iframe.contentDocument;
      //选择旗县
      // 暂时不用，使用地块标识列表

      //找到输入框
      let idInput = doc.querySelector(
        "main.el-main .filter .searchInput input"
      );
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
        if (!TEST_MODE) {
          btns[0].click();
          await sleepSec(300);
          let submit = doc.querySelector(
            'button.el-button.el-button--default.el-button--small.el-button--primary[type="button"] > span:nth-child(1)'
          );
          submit.click();
        }
      } else {
        radios[1].click();
        await sleepSec(200);
        let btns = doc.querySelectorAll(".pdTable button");
        if (!TEST_MODE) {
          btns[1].click();
          await sleepSec(300);
          let submit = doc.querySelector(
            'button.el-button.el-button--default.el-button--small.el-button--primary[type="button"] > span:nth-child(1)'
          );
          submit.click();
        }
      }
      // 获取id
      let ids = doc.querySelectorAll("#pane-1 table.pdTable td");
      // 找到其中text为地块标识的索引，使用for循环获取

      let index = -1;
      for (let i = 0; i < ids.length; i++) {
        if (ids[i].innerText == "地块标识") {
          index = i;
          break;
        }
      }
      if (index != -1) {
        id = ids[index + 1].innerText;
        addRow(index, pass ? 1 : 0);
      }

      return true;
    }
  })();
} catch (e) {
  alert("脚本出现报错，群里通知下");
}
