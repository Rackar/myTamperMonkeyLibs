// ==UserScript==
// @name         国土云云查询
// @namespace    http://tampermonkey.net/
// @version      2024-07-01
// @description  国土云云查询，经纬度查询
// @author       yx
// @match        https://www.landcloud.org.cn/
// @match        https://landcloud.org.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=landcloud.org.cn
// @grant        none
// ==/UserScript==

(function () {
  ("use strict");

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
    var textarea = document.createElement("textarea");
    textarea.id = "customTextarea";
    textarea.style.width = "300px";
    textarea.style.height = "100px";
    // textarea.style.resize = "both"; // 允许调整大小
    containerDiv.appendChild(textarea);

    // 创建开始执行按钮
    var startButton = document.createElement("button");
    startButton.id = "executeButton";
    startButton.innerHTML = "云查询-面查询";
    startButton.style.marginTop = "10px";
    containerDiv.appendChild(startButton);

    // 绑定按钮点击事件
    startButton.addEventListener("click", readTextareaContent);

    textarea.focus();

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

  async function sleepSec(sec) {
    return new Promise((resolve) => {
      // console.info("准备等待", sec);
      setTimeout(() => {
        //  console.info("结束等待", sec);
        resolve();
      }, sec);
    });
  }

  function checkTextInput(stringin = "") {
    let dataArr = [];

    function trim(str) {
      //使用正则表达式,\s为空格，^\s为开头的空格，*代表0个或多个，\s*$为结尾的零个或多个空格
      const reg = /^\s*|\s*$/g;
      return str.replace(reg, "");
    }
    let string = trim(stringin);

    string.replace("\r\n", "\n");
    let strArr = string.split("\n");
    let splitChars = [",", "，", "\t", " "];
    for (let str of strArr) {
      //替换连续空格为1个
      const reg2 = /\s+/g;
      str = str.replace(reg2, " ");
      str = trim(str);
      //如果本行无有效内容
      if (!str || str.length <= 2) {
        continue;
      }
      let splitIndex = -1;

      for (const split of splitChars) {
        let i = str.indexOf(split);
        if (i != -1) {
          splitIndex = i;
          break;
        }
      }

      //如果没匹配到
      if (splitIndex == -1) {
        continue;
      }
      console.log(
        "分割后",
        str.substring(0, splitIndex),
        str.substring(splitIndex + 1)
      );
      try {
        const x = Number(trim(str.substring(0, splitIndex)));
        const y = Number(trim(str.substring(splitIndex + 1)));
        dataArr.push([x, y]);
      } catch (error) {
        console.log(error);
      }
    }
    if (dataArr.length <= 2) {
      console.log("错误：有效点数不足以构面");
      return [];
    }

    return dataArr;
  }

  function getTextarea() {
    let textbox = document.querySelector("#customTextarea");
    if (textbox) {
      console.info(textbox.value);
      return checkTextInput(textbox.value);
      // let ids = textbox.value.split("\n");
      // let idlist = [];
      // for (let i = 0; i < ids.length; i++) {
      //   let id = ids[i].trim();
      //   if (!id) continue;
      //   id = id
      //     .trim()
      //     .replace("\r", "")
      //     .replace("\n", "")
      //     .replace("'", "")
      //     .replace('"', "")
      //     .replace(" ", ",")
      //     .split(",")
      //     .filter((e) => {
      //       return e.trim() != "";
      //     });
      //   if (id) {
      //     idlist.push(id);
      //   }
      // }
      // return idlist;
    } else {
      return [];
    }
  }

  async function readTextareaContent() {
    let hash = "#/cloudQuery";
    if (location.hash != hash) {
      return alert("需进入云查询页面: https://landcloud.org.cn/" + hash);
    }
    //监测面查询是否打开
    let ds = document.querySelectorAll(
      "#app .el-card__body .container .el-dialog__wrapper .el-dialog__title"
    );
    for (let i = 0; i < ds.length; i++) {
      const card_title = ds[i];
      if (card_title.innerText == "地块查询") {
        if (card_title) {
          if (
            card_title.parentNode.parentNode.parentNode.style.display == "none"
          ) {
            // 需要点击面查询按钮
            let m = document.querySelectorAll(".toolItem");
            if (m?.length && m[0]) {
              m[0].click();
              await sleepSec(100);
            }
          }
        }
      }
    }

    let idlist = getTextarea();

    let rows = document.querySelectorAll("#app .el-dialog__body .blockDialog");

    for (let i = 0; i < idlist.length; i++) {
      const id = idlist[i];

      console.info("开始第" + i + "条数据", id);

      let row = rows[i].querySelectorAll("input");
      row[0].value = id[0];
      row[0].dispatchEvent(new Event("input", { bubbles: true })); //触发input事件
      await sleepSec(101);
      row[1].value = id[1];
      row[1].dispatchEvent(new Event("input", { bubbles: true })); //触发input事件
      await sleepSec(102);
      if (i == rows.length - 1 && i != idlist.length - 1) {
        rows[i].querySelector("img").click();
        await sleepSec(203);
        rows = document.querySelectorAll("#app .el-dialog__body .blockDialog");
      }
    }
  }
})();
