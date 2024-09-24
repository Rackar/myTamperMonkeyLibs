// ==UserScript==
// @name         内蒙国土云卫片审核
// @namespace    rackar
// @version      1.0
// @description  nclzgdjf
// @author       yx
// @match        http://121.36.36.53:8081/landSurvey/*
// @grant        none
// ==/UserScript==

(function () {
  ("use strict");
  const API_ADDRESS = "https://nmgwxyy.cn/alatan/yangxut/noauth/nmgty"; //正式地址

  // const API_ADDRESS = "https://nmgwxyy.cn/alatan/yangxuweb/noauth/nmgty"; // 调试地址

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

    //#region   添加通过UI框

    var passContainer = document.createElement("div"); // 创建一个容器来存放所有的选择框
    passContainer.style.display = "block"; // 改变布局方式以便更好地排列复选框
    passContainer.style.flexWrap = "wrap"; // 允许换行
    passContainer.style.justifyContent = "center"; // 水平居中
    passContainer.style.marginTop = "20px";
    passContainer.style.cursor = "default";
    passContainer.style.backgroundColor = "#e6e6e6";
    passContainer.id = "myPassPanel";
    containerDiv.appendChild(passContainer); // 将容器添加到页面中

    var optionsPass = [
      { text: "批供手续齐全" },
      {
        text: "有实地照片",
      },
      { text: "只有农转用" },
      { text: "只有供地" },
      { text: "设施农符合用途" },
      { text: "临时用地复合用途" },
      { text: "其他权证合法" },
      { text: "大棚及种植设施" },
      { text: "203范围内" },
      { text: "宅基地" },
      { text: "推填土" },
      { text: "非卫片关心变化" },
      { text: "伪图斑提取错误" },
      { text: "有瑕疵" },
      { text: "采矿用地" },
      {
        text: "大面积工程建设",
      },
    ];
    for (let i = 0; i < optionsPass.length; i++) {
      optionsPass[i].value = optionsPass[i].text;
    }

    // 用于存储当前选中的值
    var selectedValue = "";

    var passContainer = document.createElement("div"); // 创建一个容器来存放所有的选择框
    passContainer.style.display = "block"; // 改变布局方式以便更好地排列复选框
    passContainer.style.flexWrap = "wrap"; // 允许换行
    passContainer.style.justifyContent = "center"; // 水平居中
    passContainer.style.marginTop = "20px";
    passContainer.style.cursor = "default";
    passContainer.style.backgroundColor = "#e6e6e6";
    passContainer.id = "myPassCheckbox";
    containerDiv.appendChild(passContainer); // 将容器添加到页面中

    // #region 多选退回理由模块
    // 动态创建多个复选框
    optionsPass.forEach(function (optionText, index) {
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox"; // 设置类型为复选框
      checkbox.id = "passcheckbox" + (index + 1); // 为每个复选框分配唯一ID
      checkbox.name = "passoptions" + index + 1; // 如果需要在表单提交时收集这些值，可以设置相同的name属性

      var div = document.createElement("div");
      div.style.display = "flex";
      div.style.alignItems = "normal";

      var label = document.createElement("label");
      label.htmlFor = checkbox.id; // 关联label和checkbox
      label.style.marginLeft = "2px";
      label.appendChild(document.createTextNode(optionText.text)); // 在label中添加文本

      div.appendChild(checkbox); // 将复选框添加到容器中
      div.appendChild(label); // 将label添加到容器中
      passContainer.appendChild(div); // 添加换行，可按需调整布局
    });

    // 创建单次通过按钮
    var singleButton = document.createElement("button");
    singleButton.id = "singleButton";
    singleButton.innerHTML = "√ 单次通过（需先进入查看详情页）";
    singleButton.style.marginTop = "10px";
    singleButton.style.cursor = "pointer";
    //  singleButton.style.backgroundColor = "#edffed";
    singleButton.classList.add("hoverbtn");
    singleButton.classList.add("passbtn");
    containerDiv.appendChild(singleButton);
    singleButton.addEventListener("click", clickSaveBtn);

    var singleClearButton1 = document.createElement("button");
    singleClearButton1.id = "singleClearButton1";
    singleClearButton1.innerHTML = "清除对勾";
    singleClearButton1.title = "每次需手动清空所有对勾选择";
    singleClearButton1.style.cursor = "pointer";
    singleClearButton1.style.marginTop = "5px";
    singleClearButton1.style.marginLeft = "10px";

    containerDiv.appendChild(singleClearButton1);
    singleClearButton1.addEventListener("click", uncheckAllBox);

    //#endregion

    // 创建多选框组
    var options = [
      "需补充农转用批地手续",
      "需补充供地手续",
      "需补充实地照片",
      "需补充内部照片",
      "需提供套合图",
      "举证材料非属于本图斑",
      "材料中的位置、面积或图斑号不符",

      "应判定为违法",
      "设施农不得占耕",
      "临时用地禁止永久建筑",
      "有弄虚作假嫌疑",

      "采矿用地",
      "大面积工程建设",
      "明显已动工，非推土",
    ];
    var refuseContainer2 = document.createElement("div"); // 创建一个容器来存放所有的选择框
    refuseContainer2.style.display = "block"; // 改变布局方式以便更好地排列复选框
    refuseContainer2.style.flexWrap = "wrap"; // 允许换行
    refuseContainer2.style.justifyContent = "center"; // 水平居中
    refuseContainer2.style.marginTop = "20px";
    refuseContainer2.style.cursor = "default";
    refuseContainer2.style.backgroundColor = "#e6e6e6";
    refuseContainer2.id = "myCheckbox";
    containerDiv.appendChild(refuseContainer2); // 将容器添加到页面中

    // #region 多选退回理由模块
    // 动态创建多个复选框
    options.forEach(function (optionText, index) {
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox"; // 设置类型为复选框
      checkbox.id = "checkbox" + (index + 1); // 为每个复选框分配唯一ID
      checkbox.name = "options" + index + 1; // 如果需要在表单提交时收集这些值，可以设置相同的name属性

      var div = document.createElement("div");
      div.style.display = "flex";
      div.style.alignItems = "normal";

      var label = document.createElement("label");
      label.htmlFor = checkbox.id; // 关联label和checkbox
      label.style.marginLeft = "2px";
      label.appendChild(document.createTextNode(optionText)); // 在label中添加文本

      div.appendChild(checkbox); // 将复选框添加到容器中
      div.appendChild(label); // 将label添加到容器中
      refuseContainer2.appendChild(div); // 添加换行，可按需调整布局
    });

    var reBtnContainer = document.createElement("div");
    containerDiv.appendChild(reBtnContainer);
    // 创建单次不通过按钮
    var singleRefuseButton = document.createElement("button");
    singleRefuseButton.id = "singleRefuseButton";
    singleRefuseButton.innerHTML = "× 单次不通过（需多选理由）";
    singleRefuseButton.style.cursor = "pointer";
    singleRefuseButton.style.marginTop = "10px";
    // singleRefuseButton.style.backgroundColor = "#e8806b";
    //  singleRefuseButton.style.hover = "background-color: #ff0000";
    singleRefuseButton.classList.add("hoverbtn");
    singleRefuseButton.classList.add("refusebtn");
    reBtnContainer.appendChild(singleRefuseButton);
    singleRefuseButton.addEventListener("click", clickRefuseBtn);

    // 创建清除对勾按钮
    var singleClearButton = document.createElement("button");
    singleClearButton.id = "singleClearButton";
    singleClearButton.innerHTML = "清除对勾";
    singleClearButton.title = "每次需手动清空所有对勾选择";
    singleClearButton.style.cursor = "pointer";
    singleClearButton.style.marginTop = "5px";
    singleClearButton.style.marginLeft = "10px";

    reBtnContainer.appendChild(singleClearButton);
    singleClearButton.addEventListener("click", uncheckAllBox);

    // #endregion

    // #region 无理由退回模块

    // // 创建单次不通过按钮
    // var singleRefuseButton = document.createElement("button");
    // singleRefuseButton.id = "singleRefuseButton";
    // singleRefuseButton.innerHTML = "× 不通过（需将图斑号及理由记录到表格中）";
    // singleRefuseButton.style.cursor = "pointer";
    // singleRefuseButton.style.marginTop = "10px";
    // // singleRefuseButton.style.backgroundColor = "#e8806b";
    // //  singleRefuseButton.style.hover = "background-color: #ff0000";
    // singleRefuseButton.classList.add("hoverbtn");
    // singleRefuseButton.classList.add("refusebtn");
    // refuseContainer.appendChild(singleRefuseButton);
    // singleRefuseButton.addEventListener("click", () => clickRefuseBtn(false));

    // #endregion

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
  function getSelectedRadioValue() {
    var radios = document.getElementsByName("radioPass");
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        return radios[i].value; // 返回选中项的值
      }
    }
    return null; // 如果没有选中任何项，则返回null
  }
  function clearRadioSelection() {
    var radios = document.getElementsByName("radioPass");
    for (var i = 0; i < radios.length; i++) {
      radios[i].checked = false;
    }
    console.info("所有单选按钮的值已清空");
  }

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
      // console.info("准备等待", sec);
      setTimeout(() => {
        // console.info("结束等待", sec);
        resolve();
      }, sec);
    });
  }

  /**
   *
   * @param {*} id
   * @param {*} code
   * @param {*} region
   * @param {*} remark
   * @param {*} name
   * @param {number} state  1为通过 2为退回
   * @returns promise: true为成功 false为失败
   */
  async function postRefuseReason(sh_jg, sh_bz, data) {
    return new Promise((resolve, reject) => {
      let sh_passStatus = 0;
      if (sh_jg == "通过") {
        sh_passStatus = 1;
      }
      const postData = {
        ...data,
        sh_passStatus,
        sh_jg,
        sh_bz,
      };

      fetch(API_ADDRESS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.info("响应:", data);
          resolve(true);
        })
        .catch((error) => {
          console.error("错误:", error);
          resolve(false);
        });
    });
  }

  function getOperatorName() {
    return document
      .querySelector(".app-header .top_right label span")
      .innerText.trim();
  }

  async function getDetail() {
    let d = document.querySelector("#pane-图斑信息");
    let list = d.querySelectorAll("div.el-col");
    let result = {};
    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      let name = row.querySelector("label").innerText.trim().replace("：", "");

      let value = row.querySelector("input").value.trim();
      if (name == "月份") result.month = value;
      else if (name == "下发时间") result.xfsj = value;
      else if (name == "县名称") result.xmc = value;
      else if (name == "乡镇街道") result.xzjd = value;
      else if (name == "图斑编号") result.tbbh = value;
      else if (name == "图斑面积(亩)") result.tbmj = value;
      else if (name == "占耕面积（亩）") result.zgmj = value;
      else if (name == "占永久基本农田面积（亩）") result.ynmj = value;
      else if (name == "图斑中心点经度") result.long = value;
      else if (name == "图斑中心点纬度") result.lat = value;
      else if (name == "图斑级别") result.level = value;
      else if (name == "图斑类型") result.tblx = value;
      else if (name == "前时相") result.qsx = value;
      else if (name == "后时相") result.hsx = value;
      else if (name == "当期景号") result.dqjh = value;
      else if (name == "变化前类型") result.bhqlx = value;
      else if (name == "变化后类型") result.bhhlx = value;
      else if (name == "变化后类型标注") result.bhhlxbz = value;
      else if (name == "备注") result.bz = value;
      else if (name == "合法性判定") result.sh_hfxpd = value;
      else if (name == "其他用地") result.sh_ejl = value;
      else if (name == "合法新增建设用地") result.sh_ejl = value;
      else if (name == "违法用地") result.sh_ejl = value;
      else if (name == "判定依据说明") result.sh_pdsm = value;
    }

    let username = document.querySelector("div.body span.username");
    if (username)
      result.username = username.innerText.trim().replace("内蒙古", "");

    return result;
  }
  async function jumpToPassTab() {
    let t = document.querySelector("#tab-check");
    t.click();
    await sleepSec(300);
  }

  async function clickSaveBtn() {
    // 检查url中包含不包含spotListDetail
    let url = window.location.href;
    if (!url.includes("spotListDetail")) {
      return alert("请先进入详情页面查看举证情况");
    }

    let data = await getDetail();

    await jumpToPassTab();

    let radioPass = readPassCheckboxValues();
    if (!radioPass) {
      return alert("请先进选择通过类型");
    }

    let passpanel = document.querySelector("#pane-check");
    let inputRadio = passpanel.querySelectorAll("input[type=radio]");
    inputRadio[0].click();

    let textbox = passpanel.querySelector("textarea");
    if (textbox) {
      textbox.value = radioPass;
      textbox.dispatchEvent(new Event("input", { bubbles: true })); //触发input事件
    }

    await sleepSec(400);
    let btn = passpanel.querySelector("button.el-button--success");
    btn.click();
    await sleepSec(300);
    let sbtn = document.querySelectorAll(
      ".el-message-box .el-message-box__btns button"
    );
    sbtn[1].click(); //确定键，调试时按取消[0]
    // sbtn[0].click();
    let postok = await postRefuseReason("通过", radioPass, data);
    if (postok === false) {
      alert("出现问题，提交保存失败。请记录图斑号和通过理由在群里上报");
    }

    // await sleepSec(600);
    // let nextBtn = document.querySelector(
    //   ".ant-table-tbody td.ant-table-cell-fix-right-first a"
    // );
    // nextBtn.click();
  }

  async function clickRefuseBtn(liyou = true) {
    // 检查url中包含不包含spotListDetail
    let url = window.location.href;
    if (!url.includes("spotListDetail")) {
      return alert("请先进入详情页面查看举证情况");
    }

    let data = getDetail();
    await jumpToPassTab();

    let radioPass = readCheckboxValues();
    if (!radioPass) {
      return alert("请先进选择通过类型");
    }

    let passpanel = document.querySelector("#pane-check");
    let inputRadio = passpanel.querySelectorAll("input[type=radio]");
    inputRadio[1].click(); //不通过

    let textbox = passpanel.querySelector("textarea");
    if (textbox) {
      textbox.value = radioPass;
      textbox.dispatchEvent(new Event("input", { bubbles: true })); //触发input事件
    }

    await sleepSec(400);
    let btn = passpanel.querySelector("button.el-button--success");
    btn.click();
    await sleepSec(300);
    let sbtn = document.querySelectorAll(
      ".el-message-box .el-message-box__btns button"
    );
    sbtn[1].click(); //确定键，调试时按取消
    // sbtn[0].click();
    let postok = await postRefuseReason("不通过", radioPass, data);
    if (postok === false) {
      alert("出现问题，提交保存失败。请记录图斑号和通过理由在群里上报");
    }

    // await sleepSec(600);
    // let nextBtn = document.querySelector(
    //   ".ant-table-tbody td.ant-table-cell-fix-right-first a"
    // );
    // nextBtn.click();
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

    let checkBoxes1 = document.querySelectorAll(
      "#myPassCheckbox input[type=checkbox]"
    );
    for (let i = 0; i < checkBoxes1.length; i++) {
      if (checkBoxes1[i].checked) {
        checkBoxes1[i].checked = false;
      }
    }
  }

  // 读取通过多选项
  function readPassCheckboxValues() {
    var checkboxes = document.querySelectorAll(
      '#myPassCheckbox input[type="checkbox"]:checked'
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

  // 读取不通过多选项
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
})();
