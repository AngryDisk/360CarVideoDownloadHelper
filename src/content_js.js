/**
 * 重构步骤 1.添加几个网址的筛选 2.使用jQuery重绘整个页面 3.注意使用BootStrap的样式整体使用（class） 4. 使用bs 的
 * panels 和 active button样式 5. 可能还需要找一个浮动的东西，我也不知道叫什么？
 */
/**
 * css 出了些问题，http://blog.csdn.net/samt007/article/details/52769957
 * web_accessible_resources
 * https://stackoverflow.com/questions/12783217/how-to-really-isolate-stylesheets-in-the-google-chrome-extension
 * chrome extension css conflict
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

function canvsGen() {
  // 构造iframe
  if ($("#ifframe") != 0) {
    $("#ifframe").remove();
  }
  var ifr = $("<iframe></iframe>").attr("id", "ifframe");
  $("body").append(ifr);

  // 主面板div
  var fDiv = $("<div></div>").attr("id", "frameDiv").addClass("panel-default");
  var dDiv = $("<div></div>").addClass("panel panel-body").appendTo(fDiv);

  // 备注表单id=remark
  // var rDiv = "<div class='from-group'><label for='remark'>remark</label><input type='text' id='remark' class='form-control'></div>"
  var rDiv = "<div class='panel panel-default'><div class='panel-heading'><b>remark</b></div><div class='panel-body'><input type='text' id='remark' class='form-control'></div></div>"
  dDiv.append(rDiv);
  // 预览id=previewText
  var pDiv = "<div class='panel panel-default'><div class='panel-heading'><b>preview</b></div><div id='previewText' class='panel-body'></div></div>";
  dDiv.append(pDiv);
  // 下载按钮id=downloadBtn
  var dBtn = "<button id='downloadBtn' class='btn btn-lg btn-primary center-block'>DOWNLOAD</button>";
  dDiv.append(dBtn);
  /*
   * //
   * 测试数据{[{"name":"D","type":"true"},{"name":"变态","type":"false"},{"name":"G","type":"true"}]} //
   * 特例1.只有分组，无内容2.只有内容，无分组3.按钮数量多于n行 // 正常数据 var nData =
   * [{"name":"D","type":"true"},{"name":"变态","type":"false"},{"name":"D","type":"true"},{"name":"变态","type":"false"},{"name":"D","type":"true"},{"name":"变态","type":"false"}]; //
   * 异常1 var unData1 =
   * [{"name":"D","type":"true"},{"name":"变态","type":"true"},{"name":"G","type":"true"}];
   * var unData2 =
   * [{"name":"D","type":"false"},{"name":"变态","type":"false"},{"name":"G","type":"false"}];
   * var unData3 =
   * [{"name":"D","type":"true"},{"name":"大变态","type":"false"},{"name":"G","type":"false"}
   * ,{"name":"大变态","type":"false"},{"name":"大变态","type":"false"},{"name":"大变态","type":"false"}
   * ,{"name":"大变态","type":"false"},{"name":"大变态","type":"false"},{"name":"大变态","type":"false"}
   * ,{"name":"大变态","type":"false"},{"name":"大变态","type":"false"},{"name":"大变态","type":"false"}
   * ,{"name":"大变态","type":"false"},{"name":"大变态","type":"false"},{"name":"大变态","type":"false"}
   * ,{"name":"大变态","type":"false"},{"name":"大变态","type":"false"},{"name":"大变态","type":"false"} ];
   */
  // var data = nData;

  // 绘制选择表单 .buttonV 中选择已激活的
  chrome.storage.local.get("tags", function(dataa) {
    var defaultDiv = "<div class=' panel panel-default'><div class='panel-heading'><b>default</b></div><div class='panel-body'>";
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
          buttonDiv += "<div class=' panel panel-default'><div class='panel-heading'><b>";
          buttonDiv += ele.name;
          buttonDiv += "</b></div><div class='panel-body'>";
        } else {
          // 按钮 要加 buttonVclass
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
    case "wap.che.360.cn": //能用
      var configs = document.getElementsByName('flashvars')[0].getAttribute(
        'value').replace(/\'/g, "\"").substring(7);
      var configsObj = JSON.parse(configs);
      // console.log(configsObj.playlist[0].url).replace(/http/, "https");
      return configsObj.playlist[0].url;
    case "v.xiaoyi.com":
      return $("#myVideo").attr("src");
    case "camera.leautolink.com":
      //需要先播放一下视频
      return $("#video_player").attr("src");
    case "qsurl.goluk.cn":
      return $("#wonvideo video").attr("src");
    case "cdn.static.ddpai.com": //能用
      return $("video").attr("src");
    default:

  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // getBlob(request.url).then(blob => {
    //  saveAs(blob, request.filename);
    // });
    var obj = {};
    obj["url"] = realDownloadUrl();
    obj["filename"] = genfileName();
    sendResponse(obj);
    // getBlob2(request.url);
  });

/**
 * 下载函数
 */
function downloadEvent() {
  // var fileName = genfileName();
  // 使用blob来获得下载链接，才能避开 【chrome 非同域名不生效问题】，异步调用
  // getBlob(realDownloadUrl()).then(blob => {
  //   saveAs(blob, fileName);
  //   $("#ifframe").contents().find("#downloadBtn").removeAttr("disabled");
  // });

  // var hostValue = window.location.host;
  // switch (hostValue) {
  //   case "wap.che.360.cn":
  //   case "cdn.static.ddpai.com":

  //     getBlob(realDownloadUrl()).then(blob => {
  //       saveAs(blob, fileName);
  //       $("#ifframe").contents().find("#downloadBtn").removeAttr("disabled");
  //     });

  //     break;

  //   case "v.xiaoyi.com":
  //   case "qsurl.goluk.cn":
  //   case "camera.leautolink.com":
  //发送到后台
  var obj = {};
  obj["url"] = realDownloadUrl();
  obj["filename"] = genfileName();
  var port = chrome.runtime.connect(); //建立连接
  port.postMessage(obj);
  // port.onMessage.addListener(function(){

  // });
  port.onDisconnect.addListener(function() {
    // console.log("111");
    $("#ifframe").contents().find("#downloadBtn").removeAttr("disabled");
  });

  // ,function(response){
  //   console.log(response);
  //   if (response.finish) {
  //     $("#ifframe").contents().find("#downloadBtn").removeAttr("disabled");
  //   }
  // }
  // saveAs2(realDownloadUrl(), genfileName());
  //   break;

  // default:

  // }
}

/**
 * 保存并重命名
 */
function saveAs2(url, filename) {
  /*
   * 伪造一个a标签，使用blob方式生成href，并对文件进行重命名，然后点击下载
   */
  var downloada = document.createElement("a");
  downloada.href = url;
  // downloada.href=realDownloadUrl();
  downloada.download = filename; // 文件名
  downloada.style.cssText = "display:none";
  // 不加append 和remove 好像会导致zepto报错
  document.body.appendChild(downloada);
  downloada.click();
  document.body.removeChild(downloada);
  // 释放
  // window.URL.revokeObjectURL(downloada.href);
}
/**
 * 保存并重命名
 */
function saveAs(blob, filename) {
  /*
   * 伪造一个a标签，使用blob方式生成href，并对文件进行重命名，然后点击下载
   */
  var downloada = document.createElement("a");
  downloada.href = window.URL.createObjectURL(blob);
  // downloada.href=realDownloadUrl();
  downloada.download = filename; // 文件名
  downloada.style.cssText = "display:none";
  // 不加append 和remove 好像会导致zepto报错
  document.body.appendChild(downloada);
  downloada.click();
  document.body.removeChild(downloada);
  // 释放
  window.URL.revokeObjectURL(downloada.href);
}

/**
 * 获取 blob 异步方式
 * 
 * @param {String}
 *          url 目标文件地址
 * @return {Promise}
 */
function getBlob(url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };
    xhr.send();
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
}