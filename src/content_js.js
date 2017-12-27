// 显示在页面上的js，要有几个下载的tag，然后还要有下载的按钮，再加一个备注

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


$(document).ready(function(){
	canvsGen();
	// 批量绑定 指定 class button 激活 active

	 $("#downloadBtn").click(function(){
	   downloadEvent();
	 });
	 $("#remark").keyup(function(){
	   genfileName();
	 });
});

function canvsGen(){
  if($("#frameDiv")!=0){
    $("#frameDiv").remove();
  }
  var panelStyle= "style='margin-bottom: 20px; background-color: rgb(255, 255, 255); border: 1px solid transparent; " +
      "box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 1px;'";
	// 主面板div
	var fDiv=$("<div></div>").attr("id","frameDiv").addClass("panel-default");
	// 使用class引入 panel 会被 原始网页的panel覆盖样式
	fDiv.css({"margin-bottom":"20px","background-color":"#fff","border":"1px solid transparent"
	  ,"border-radius":"4px;","-webkit-box-shadow":"0 1px 1px rgba(0, 0, 0, .05)"
	    ,"box-shadow":" 0 1px 1px rgba(0, 0, 0, .05)","background-color":"#66FF66"});
	var dDiv=$("<div></div>").addClass("panel-body").appendTo(fDiv);
	// 下载按钮id=downloadBtn
	var dBtn = "<button id='downloadBtn' class='btn btn-lg btn-primary center-block'>DOWNLOAD</button>";
	dDiv.append(dBtn);
	 // 备注表单id=remark
  var rDiv = "<div class='from-group'><label for='remark'>remark</label><input type='text' id='remark' class='form-control'></div>"
	dDiv.append(rDiv);
  // 预览id=previewText
	var pDiv = "<div class='panel-default' " + panelStyle +
			"><div class='panel-heading'><b>preview</b></div><div id='previewText' class='panel-body'></div></div>";
	dDiv.append(pDiv);
	
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

  chrome.storage.local.get("tags",function(dataa){
    var defaultDiv = "<div class=' panel-default'" + panelStyle +
      "><div class='panel-heading'><b>default</b></div><div class='panel-body'>";
    var buttonDiv = "";
// console.log(dataa);
    var data = dataa["tags"];
    if(data.length >0){
      // 开始绘画
        data.forEach(function(ele,index,array){
          if(ele.type==true){
            // 标题
            if(index!=0){
              buttonDiv +="</div></div>";
            }
            buttonDiv =buttonDiv+"<div class=' panel-default'" + panelStyle +"><div class='panel-heading'><b>";
            buttonDiv +=ele.name;
            buttonDiv +="</b></div><div class='panel-body'>";

          }else{
            // 按钮 要加 buttonVclass
            if(index==0){
              buttonDiv+=defaultDiv;
            }
            buttonDiv+="<button  class='btn btn-default buttonV'>";
            buttonDiv+=ele.name;
            buttonDiv+="</button>";
// preButton = true;
          }
        });
// if(preButton){
       buttonDiv +="</div></div>";
// }
    }
    dDiv.append(buttonDiv);
    $(".buttonV").click(function(event){
      if($(event.delegateTarget).hasClass("active")){
        $(event.delegateTarget).removeClass("active");
      }else{
        $(event.delegateTarget).addClass("active");
      }
      genfileName();
     });
  });

  
	$("body").append(fDiv);
}
function genfileName(){ 
  var fileName= (new Date()).Format("yyyyMMdd") ;
  fileName =fileName+ " "+$("#remark").val();
  // 这里可能还会加上哪个网站，视频格式
  $("#frameDiv").find(".active").each(function(index,ele){
    fileName = fileName+ " "+ $(ele).text();
  });
  fileName+=".mp4";
  $("#previewText").text(fileName);
return fileName;
}




/**
 * 获取下载链接
 */
function realDownloadUrl() {
  var configs = document.getElementsByName('flashvars')[0].getAttribute(
      'value').replace(/\'/g, "\"").substring(7);
  var configsObj = JSON.parse(configs);
  // console.log(configsObj.playlist[0].url);
  return configsObj.playlist[0].url.replace(/http/, "https");
}


/**
 * 绘制右侧HTML
 *//*
     * function divGenerater() {
     * 
     * 1.画一个右边的div 2.添加一个按钮 3.读取chrome storage 中的配置，依次画出所有的按钮 // 区域div var div =
     * document.createElement("div"); div.id = "downloadDiv"; //
     * div.style.cssText = //
     * "width:20%;height:-webkit-fill-available;z-index:9999;position:absolute;right:20px;background-color:yellowgreen;"; //
     * 下载按钮 var button = document.createElement("button"); button.innerHTML =
     * "下载"; button.id = "downloadButton"; button.style.cssText = "width:
     * 80%;height: 40px;top: 10px;left: 10%;position: relative;";
     * div.appendChild(button); button.onclick = function(event) { //
     * 禁用不生效???不清楚原因！！！！！！！！！！！！！！！！！！！！ event.target.disabled=true; //
     * 这里调用下载的函数 downloadEvent(); event.target.disabled=false; }; // checkbox
     * div var checkboxDiv = document.createElement("div");
     * checkboxDiv.id="checkboxDiv";
     * checkboxDiv.style.cssText="position:fixed;top:100px;"; // 循环添加checkbox内容 //
     * chrome.storage.local.get("tags",function(data){ //
     * data["tags"].forEach(function(item,index,array) { // var input =
     * document.createElement("input"); // input.id="input-"+index; //
     * input.setAttribute("class","checkBoxTags"); //
     * input.setAttribute("type","checkbox"); //
     * input.setAttribute("value",item.name); // checkboxDiv.appendChild(input); //
     * var label = document.createElement("label"); //
     * label.setAttribute("for","input-"+index); // label.innerHTML=item.name; //
     * checkboxDiv.appendChild(label); // });});
     * 
     * 
     * div.appendChild(checkboxDiv); // div添加到body上
     * document.body.appendChild(div); }
     */




/**
 * 下载函数
 */
function downloadEvent() {
	var fileName = genfileName();
	// 使用blob来获得下载链接，才能避开 【chrome 非同域名不生效问题】，异步调用
    getBlob(realDownloadUrl()).then(blob => {
// document.getElementById("downloadButton").setAttr
    	saveAs(blob,fileName);
    });
}


/**
 * 保存并重命名
 */
function saveAs(blob,filename){
	/*
   * 伪造一个a标签，使用blob方式生成href，并对文件进行重命名，然后点击下载
   */
	var downloada = document.createElement("a");
	downloada.href = window.URL.createObjectURL(blob);
	// downloada.href=realDownloadUrl();
	downloada.download = filename;// 文件名
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
Date.prototype.Format = function (fmt) {
  var o = {
    "y+": this.getFullYear(),
    "M+": this.getMonth() + 1,                 // 月份
    "d+": this.getDate(),                    // 日
    "h+": this.getHours(),                   // 小时
    "m+": this.getMinutes(),                 // 分
    "s+": this.getSeconds(),                 // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    "S+": this.getMilliseconds()             // 毫秒
  };
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)){
      if(k == "y+"){
        fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
      }
      else if(k=="S+"){
        var lens = RegExp.$1.length;
        lens = lens==1?3:lens;
        fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1,lens));
      }
      else{
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
  }
  return fmt;
}

