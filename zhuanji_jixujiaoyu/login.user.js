// ==UserScript==
// @name         自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://web.chinahrt.com/nmglogin1.html
// @grant        none
// ==/UserScript==

(function() {
  "use strict";
  setTimeout(function() {
    console.log("will be click");
    window.setInterval(checkUser, 30 * 1000);
  }, 3000);

  function checkUser() {
    var username = $("#userName").val();
    var pd = $("#password")
      .val()
      .toMD5();
    var md5Password = $("#password").attr("md5");
    if (md5Password == "1") pd = $("#password").val();
    var platformId = $("#platformId").val();
    var admin = $("#admin").val();
    var onlyManagerLogin = $("#onlyManagerLogin").val();

    if (admin == "1") platformId = "";
    if (onlyManagerLogin == "" && typeof onlyManagerLogin == "undefined") onlyManagerLogin = "0";

    var urldata = "userName=" + username + "&password=" + pd;
    if ($("#checkbox").is(":checked")) {
      urldata = urldata + "&remember=" + $("#password").val();
    }
    if (platformId != "" && typeof platformId != "undefined") {
      urldata = urldata + "&platformId=" + platformId;
    }
    $.ajax({
      type: "POST",
      async: true,
      url: "/loginValid?t=" + new Date().getTime(),
      data: urldata,
      dataType: "json",
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $("#pmessage").show();
        $("#pmessage").text("网络不给力，请稍后重试．．．");
        markLoginButton(false);
      },
      success: function(data, textStatus) {
        if (data.status != "success") {
          $("#pmessage").show();
          $("#pmessage").text(data.status);
          markLoginButton(false);
          reloadVerifyCode();
        } else {
          $("#pmessage").hide();
          if (onlyManagerLogin == "1" && data.ifStudent == "1") {
            alert("输入的不是管理员");
            markLoginButton(false);
            return;
          }
          if (onlyManagerLogin == "0" && data.ifStudent == "0") {
            alert("输入的不是学员");
            markLoginButton(false);
            return;
          }
          //1.学员 2.既是学员又是管理员，并且登录页面标识学员登录
          if (data.ifStudent == "1" || (data.ifStudent == "2" && onlyManagerLogin == "0")) {
            //window.parent.location.href ="/loginValid/go?t="+new Date().getTime();
          } else {
            loginGp5(username, pd, data.domain);
          }
        }
      }
    });
  }
})();
