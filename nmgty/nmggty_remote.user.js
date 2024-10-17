// ==UserScript==
// @name         内蒙国土云卫片审核-网络版自动更新版
// @namespace    rackar
// @version      1.0
// @description  nclzgdjf
// @author       yx
// @match        http://121.36.36.53:8081/landSurvey/*
// @grant        none
// ==/UserScript==

let remotescript = document.createElement("script");
remotescript.setAttribute("type", "text/javascript");
remotescript.src =
  "https://nmgwxyy.cn/alatan/yangxuweb/monkey/nmggty_remote_server.js";
document.documentElement.appendChild(remotescript);
