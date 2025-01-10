// ==UserScript==
// @name         专业技术继续教育_视频页2025//已作废
// @namespace    https://rackar.github.io/article_tech/zhuCeCHS_edu.html
// @version      0.5
// @description  try to take over the world!
// @author       rackar
// @match        https://gp.chinahrt.com/index.html*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // $(".video-container.cb").append(
  //   `<a src="${src}" id="newlinktoVideo">新插入链接</a>`
  // );
  if (location.hash.indexOf("v_video") > -1) {
    setTimeout(function () {
      let myiframe = $("#iframe");
      let src = myiframe[0].src.replace("ifPauseBlur=1", "ifPauseBlur=0");
      console.log(src);
      $("body").append(
        '<a href="' + src + '" id="newlinktoVideo">这是添加的A标签</a>'
      );
      setTimeout(function () {
        let btn = $("#newlinktoVideo");
        console.log(btn);
        // btn[0].click();
      }, 500);

      // window.location.href = src;
    }, 3000);
  }

  // Your code here...
})();
