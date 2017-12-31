/*
 *1.如果直接把div等内容注入到页面中，会让页面与该代码的css互相影响，使用iframe进行隔离
 *2.使用jquery 对整体页面进行了重构简化操作
 * 3.chrome.runtime.onMessage.addListener 在content 域 失效 因为只能是content像background发送消息，而background向content发送消息只能使用tabs.onMessage
 */


$(document).ready(function() {
  canvsGen();
  // 批量绑定 指定 class button 激活 active
  // $("#ifframe").contents().find("#downloadBtn") $("#downloadBtn")
  $("#ifframe").contents().find("#downloadBtn").click(function() {
    //下载时禁用button
    $("#ifframe").contents().find("#downloadBtn").attr("disabled", "disabled");
    downloadEvent();
  });
  // $("#ifframe").contents().find("#remark") $("#remark")
  $("#ifframe").contents().find("#remark").keyup(function() {
    genfileName();
  });

});

/**
 *由于iframe 样式的引入问题，在代码中，增加了部分style样式
 */
function canvsGen() {
  // 构造iframe
  if ($("#ifframe") != 0) {
    $("#ifframe").remove();
  }
  var ifr = $("<iframe></iframe>").attr("id", "ifframe");
  $("body").append(ifr);

  // 主面板div
  var fDiv = $("<div></div>").attr("id", "frameDiv").addClass("panel-default");
  var dDiv = $("<div></div>").addClass("panel panel-body").css({
    "padding": "6px",
    "margin-bottom": "9px"
  }).appendTo(fDiv);

  // 备注表单id=remark
  // var rDiv = "<div class='panel panel-default'><div class='panel-heading'><b>remark</b></div><div class='panel-body'><input type='text' id='remark' class='form-control'></div></div>"
  var rDiv = "<p><span class='label label-primary'>remark</span></p><div class='panel panel-default' style='margin-bottom: 9px'><div class='panel-body' style='padding: 6px'><input type='text' id='remark' class='form-control'></div></div>";
  dDiv.append(rDiv);

  // 预览id=previewText
  // var pDiv = "<div class='panel panel-default'><div class='panel-heading'><b>preview</b></div><div id='previewText' class='panel-body'></div></div>";
  var pDiv = "<p><span class='label label-primary'>preview</span></p><div class='panel panel-default' style='margin-bottom: 9px'><div id='previewText' class='panel-body' style='padding: 6px'></div></div>";
  dDiv.append(pDiv);

  // 下载按钮id=downloadBtn
  var dBtn = "<button id='downloadBtn' class='btn btn-lg btn-primary center-block'>DOWNLOAD</button>";
  dDiv.append(dBtn);

  // 绘制选择表单 .buttonV 中选择已激活的
  chrome.storage.local.get("tags", function(dataa) {
    // var defaultDiv = "<div class=' panel panel-default'><div class='panel-heading'><b>default</b></div><div class='panel-body'>";
    var defaultDiv = "<p><span class='label label-primary'>default</span></p><div class=' panel panel-default' style='margin-bottom: 9px'><div class='panel-body' style='padding: 6px'>";
    var buttonDiv = "";
    // console.log(dataa);
    var data = dataa["tags"];
    if (data.length > 0) {
      // 开始绘画
      data.forEach(function(ele, index, array) {
        if (ele.type == true) {
          // 标题
          if (index != 0) {
            buttonDiv += "</div></div>";
          }
          buttonDiv += "<p><span class='label label-primary'>";
          buttonDiv += ele.name;
          buttonDiv += "</span></p><div class=' panel panel-default' style='margin-bottom: 9px'><div class='panel-body' style='padding: 6px'>";
        } else {
          // 按钮 要加 buttonV class
          if (index == 0) {
            buttonDiv += defaultDiv;
          }
          buttonDiv += "<button  class='btn btn-default buttonV'>";
          buttonDiv += ele.name;
          buttonDiv += "</button>";
        }
      });
      buttonDiv += "</div></div>";
    }
    dDiv.prepend(buttonDiv);
    // $("#ifframe").contents().find(".buttonV") $(".buttonV")
    $(dDiv).find(".buttonV").click(function(event) {
      if ($(event.delegateTarget).hasClass("active")) {
        $(event.delegateTarget).removeClass("active");
      } else {
        $(event.delegateTarget).addClass("active");
      }
      genfileName();
    });
  });

  if (document.location.toString().substring(0, 6) != "chrome") {
    $("#ifframe").contents().find("head").append("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'>");
    // $("#ifframe").contents().find("head").append("<link rel='stylesheet' href='bootstrap.css'>");
  } else {
    $("#ifframe").contents().find("head").append("<link rel='stylesheet' href='bootstrap.css'>");
  }
  $("#ifframe").contents().find("body").append(fDiv);

}

function genfileName() {
  var fileName = (new Date()).Format("yyyyMMdd");
  fileName = fileName + " " + whichTV();
  // $("#ifframe").contents().find("#remark") $("#remark")
  fileName = fileName + " " + $("#ifframe").contents().find("#remark").val();
  // $("#ifframe").contents().find("#frameDiv") $("#frameDiv")
  $("#ifframe").contents().find("#frameDiv").find(".active").each(function(index, ele) {
    fileName = fileName + " " + $(ele).text();
  });
  fileName += ".mp4"; //暂时不处理，都是mp4
  // $("#ifframe").contents().find("#previewText") $("#previewText")
  $("#ifframe").contents().find("#previewText").text(fileName);
  return fileName;
}


function whichTV() {
  var hostValue = window.location.host;
  switch (hostValue) {
    case "wap.che.360.cn":
      return "360";
    case "v.xiaoyi.com":
      return "小蚁";
    case "camera.leautolink.com":
      return "乐视";
    case "qsurl.goluk.cn":
      return "极路客";
    case "cdn.static.ddpai.com":
      return "盯盯拍";
    default:
      return "?";
  }
}

/**
 * 获取下载链接
 */
function realDownloadUrl() {

  var hostValue = window.location.host;
  switch (hostValue) {
    case "wap.che.360.cn":
      var configs = document.getElementsByName('flashvars')[0].getAttribute(
        'value').replace(/\'/g, "\"").substring(7);
      var configsObj = JSON.parse(configs);
      // .replace(/http/, "https");
      return configsObj.playlist[0].url;
    case "v.xiaoyi.com":
      return $("#myVideo").attr("src");
    case "camera.leautolink.com":
      //需要先播放一下视频
      return $("#video_player").attr("src");
    case "qsurl.goluk.cn":
      return $("#wonvideo video").attr("src");
    case "cdn.static.ddpai.com":
      return $("video").attr("src");
    default:

  }
}

/**
 * 调用background 中的下载代码，因为content域的ajax请求有https限制，也有跨域限制,而background没有这样的限制
 */
function downloadEvent() {
  //发送到后台
  var obj = {};
  obj["url"] = realDownloadUrl();
  obj["filename"] = genfileName();
  var port = chrome.runtime.connect(); //建立连接
  port.postMessage(obj); //发送下载数据
  //监听关闭，来恢复按钮禁用
  port.onDisconnect.addListener(function() {
    // console.log("111");
    $("#ifframe").contents().find("#downloadBtn").removeAttr("disabled");
  });

}

// 格式化日期
Date.prototype.Format = function(fmt) {
  var o = {
    "y+": this.getFullYear(),
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "h+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    "S+": this.getMilliseconds() // 毫秒
  };
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      if (k == "y+") {
        fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
      } else if (k == "S+") {
        var lens = RegExp.$1.length;
        lens = lens == 1 ? 3 : lens;
        fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens));
      } else {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
  }
  return fmt;
};