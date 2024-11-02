// ==UserScript==
// @name         内蒙国土云卫片审核-网络更新版服务端
// @namespace    rackar
// @version      1.0
// @description  nclzgdjf
// @author       yx
// @match        http://121.36.36.53:8081/landSurvey/*
// @grant        none
// ==/UserScript==

try {
  //引入Vue
  let script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.src = "https://nmgwxyy.cn/alatan/yangxuweb/monkey/vue3.5.12.global.js";
  document.documentElement.appendChild(script);
  //引入element-plus的CSS样式文件 样式冲突暂时屏蔽
  // let link = document.createElement("link");
  // link.setAttribute("rel", "stylesheet");
  // link.href = "https://unpkg.com/element-plus/dist/index.css";
  // document.documentElement.appendChild(link);
  //引入element-plus的JS文件
  let elscript = document.createElement("script");
  elscript.setAttribute("type", "text/javascript");
  elscript.src =
    "https://nmgwxyy.cn/alatan/yangxuweb/monkey/element-plus@2.8.6.full.js";
  document.documentElement.appendChild(elscript);
  window.onload = () => {
    let text = `<div id="app">
    <el-dialog id="dialog" v-model="showMsg" class="topdia" title="判定辅助工具" width="400" draggable :modal="false"
      modal-class="dialog_class" :append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false">

      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="图斑类型" name="图斑类型">
          <el-checkbox-group v-model="typeChecked">
            <el-checkbox v-for="el in typeOptions" :label="el.name" :value="el.name">
            </el-checkbox>
          </el-checkbox-group>
          <el-button type="primary" @click="dai_tong_guo">待通过</el-button>
          <el-button type="warning" @click="dai_bu_tong_guo">待不通过</el-button>
        </el-tab-pane>
        <el-tab-pane label="通过" name="通过">
          <el-checkbox-group v-model="passChecked">
            <el-checkbox v-for="el in passOptions" :label="el.name" :value="el.name">
            </el-checkbox>
          </el-checkbox-group>
          <div>
            <el-input v-model="textarea" :rows="2" type="textarea" placeholder="输入其他补充内容" key="pass" />
          </div>

          <el-button type="primary" @click="tong_guo">通过</el-button>
        </el-tab-pane>
        <el-tab-pane label="不通过" name="不通过">
          <el-checkbox-group v-model="refuseChecked">
            <el-checkbox v-for="el in refuseOptions" :label="el.name" :value="el.name">
            </el-checkbox>
          </el-checkbox-group>
          <div>
            <el-input v-model="textarea2" :rows="2" type="textarea" placeholder="输入其他补充内容" key="refuse" />
          </div>

          <el-button type="warning" @click="bu_tong_guo">不通过</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <div>
      test
      <el-button>test</el-button>
    </div>


    <div>


    </div>

  </div>
  <style>
    /* #app div:first-child {
      inset: auto !important;
    } */

    #dialog {
      width: 350px;
    }

    #dialog .el-dialog__header {
      cursor: move;
    }

    #dialog .el-dialog__close svg {
      width: 20px;
    }

    .dialog_class {
      pointer-events: none;
    }

    /* // 覆盖层元素增加可穿透点击事件 */
    .el-overlay-dialog {
      pointer-events: none;
    }

    /* // 弹窗层元素不可穿透点击事件（不影响弹窗层元素的点击事件） */
    .el-dialog {
      pointer-events: auto;
    }
  </style>`;

    var el = document.createElement("div");
    el.innerHTML = text;
    document.body.append(el);

    const { createApp } = Vue;
    const HOST = "https://nmgwxyy.cn/alatan/yangxut/noauth/"; // t正式地址 pm2启用
    const API_ADDRESS = HOST + "nmgty"; //
    const DICT_ADDRESS = HOST + "nmgty/dict";
    function getDetail() {
      let d = document.querySelector("#pane-图斑信息");
      let list = d.querySelectorAll("div.el-col");
      let result = {};
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        let name = row
          .querySelector("label")
          .innerText.trim()
          .replace("：", "");

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
    function sleepSec(sec) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, sec);
      });
    }
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
            alert("后台响应报错");
            resolve(false);
          });
      });
    }

    function resetSubmitArea(textbox) {
      if (textbox) {
        textbox.value = "";
        textbox.dispatchEvent(new Event("input", { bubbles: true })); //触发input事件
      }
    }

    createApp({
      data() {
        return {
          showMsg: true,
          message: "Hello Vue!",
          activeTab: "图斑类型",
          dictOptions: [],
          typeChecked: [],
          passChecked: [],
          refuseChecked: [],
          textarea: "",
          textarea2: "",
        };
      },
      computed: {
        // 一个计算属性的 getter
        typeOptions() {
          return this.dictOptions.filter((el) => el.type == "图斑类型") || [];
        },
        passOptions() {
          return this.dictOptions.filter((el) => el.type == "通过") || [];
        },
        refuseOptions() {
          return this.dictOptions.filter((el) => el.type == "不通过") || [];
        },
      },
      async mounted() {
        console.log("mounted");
        const data = await fetch(DICT_ADDRESS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        }).then((response) => response.json());
        this.dictOptions = data.data || [];
      },
      methods: {
        resetAll() {
          this.typeChecked = [];
          this.passChecked = [];
          this.refuseChecked = [];
          this.textarea = "";
          this.textarea2 = "";
        },
        dai_tong_guo() {
          this.activeTab = "通过";
        },
        dai_bu_tong_guo() {
          this.activeTab = "不通过";
        },
        async tong_guo() {
          if (this.passChecked.length == 0) {
            return this.$message.error("未选择通过类型");
          }
          if (this.typeChecked.length == 0) {
            return this.$message.error("未选择图斑类型");
          }
          let url = window.location.href;
          if (!url.includes("spotListDetail")) {
            return this.$message.error("请先进入详情页面查看举证情况");
          }

          let data = await getDetail();
          data.sh_lx = this.typeChecked.join(";") || "";

          await jumpToPassTab();

          let radioPass = this.passChecked.join("; ") + "; " + this.textarea;

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
          let postok = await postRefuseReason(
            "通过",
            this.typeChecked.join("; ") + radioPass,
            data
          );
          this.resetAll();
          resetSubmitArea(textbox);
          if (!postok) {
            this.$message.error(
              "出现问题，提交保存失败。请记录图斑号和通过理由在群里上报"
            );
          }
        },
        async bu_tong_guo() {
          if (this.refuseChecked.length == 0) {
            return this.$message.error("未选择不通过类型");
          }
          if (this.typeChecked.length == 0) {
            return this.$message.error("未选择图斑类型");
          }
          let url = window.location.href;
          if (!url.includes("spotListDetail")) {
            return this.$message.error("请先进入详情页面查看举证情况");
          }

          let data = await getDetail();
          data.sh_lx = this.typeChecked.join(";") || "";

          await jumpToPassTab();

          let radioPass = this.refuseChecked.join("; ") + "; " + this.textarea2;

          let passpanel = document.querySelector("#pane-check");
          let inputRadio = passpanel.querySelectorAll("input[type=radio]");
          inputRadio[1].click(); //不通过
          let textbox = passpanel.querySelector("textarea");
          if (textbox) {
            textbox.value = radioPass;
            textbox.dispatchEvent(new Event("input", { bubbles: true })); //触发input事件
          }

          await sleepSec(400);
          let btn = passpanel.querySelector("button.el-button--default");
          btn.click();
          await sleepSec(300);
          let sbtn = document.querySelectorAll(
            ".el-message-box .el-message-box__btns button"
          );
          sbtn[1].click(); //确定键，调试时按取消[0]
          let postok = await postRefuseReason(
            "不通过",
            this.typeChecked.join("; ") + radioPass,
            data
          );
          this.resetAll();
          resetSubmitArea(textbox);
          if (!postok) {
            this.$message.error(
              "出现问题，提交保存失败。请记录图斑号和通过理由在群里上报"
            );
          }
        },
      },
    })
      .use(ElementPlus)
      .mount("#app");

    //以下为Window.load结束及try catch
  };
} catch (error) {
  alert("脚本出现报错，群里通知下");
}
