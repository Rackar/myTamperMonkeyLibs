// ==UserScript==
// @name         内蒙古干部网络学院列表页
// @namespace    https://rackar.github.io/article_tech/zhuCeCHS_edu.html
// @version      0.4
// @description  try to take over the world!
// @author       rackar
// @match        https://wlxy.nmgdj.gov.cn/course
// @match        https://wlxy.nmgdj.gov.cn/course
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  function sleepSec(sec) {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
  }

  async function getList() {
    let wraper = document.querySelector('div[class^="Course--container--"]');
    let cards = wraper.querySelectorAll('div[class^="Card--card--"]');
    let index = parseInt(localStorage.getItem("list-start-index")) || 0;

    // for (let i = index; i < cards.length; i++) {
    let card = cards[index];
    let limit = index > 100 ? index / 10 : 10;
    for (let i = 0; i < limit; i++) {
      if (!card) {
        document.body.scrollTo({ top: 1000 + i * 800, behavior: "smooth" });
        await sleepSec(1.5);
        console.log("等待1.5秒");
        cards = wraper.querySelectorAll('div[class^="Card--card--"]');
        card = cards[index];
      } else {
        break;
      }
    }
    card.click();
    await sleepSec(5);
    console.log("等待5秒");
    location.reload();
    console.log("刷新页面");
    await sleepSec(2 * 3600);
    // }
  }

  setTimeout(() => {
    getList();
  }, 4 * 1000);
})();
