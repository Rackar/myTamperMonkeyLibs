// ==UserScript==
// @name         内蒙古干部网络学院列表页
// @namespace    https://rackar.github.io/article_tech/zhuCeCHS_edu.html
// @version      0.4
// @description  try to take over the world!
// @author       rackar
// @match        https://wlxy.nmgdj.gov.cn/course
// @grant        none
// ==/UserScript==

let remotescript = document.createElement("script");
remotescript.setAttribute("type", "text/javascript");
remotescript.src =
  "https://nmgwxyy.cn/alatan/yangxuweb/monkey/wlxy.nmgdj/list.js";
document.documentElement.appendChild(remotescript);
