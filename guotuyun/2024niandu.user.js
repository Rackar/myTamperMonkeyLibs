// ==UserScript==
// @name         国土云2024年度卫片批量提交-网络版自动更新版
// @namespace    rackar
// @version      1.0
// @description  批量操作插件
// @author       yx
// @match        https://landcloud.org.cn/*
// @match        https://www.landcloud.org.cn/*
// @match        https://jg.landcloud.org.cn:5443/main/list/wpzfnddk2024/24/qbdk
// @grant        none
// ==/UserScript==

let remotescript = document.createElement("script");
remotescript.setAttribute("type", "text/javascript");
remotescript.src = "https://nmgwxyy.cn/alatan/yangxuweb/monkey/2024niandu.js";
document.documentElement.appendChild(remotescript);
