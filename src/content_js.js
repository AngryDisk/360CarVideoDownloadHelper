//显示在页面上的js，要有几个下载的tag，然后还要有下载的按钮，再加一个备注



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
function genfileName(){
    var r=document.getElementsByClassName("checkBoxTags");
    var fileName= (new Date()).Format("yyyyMMdd") ;
    for(var i=0;i<r.length;i++){
         if(r[i].checked){
        	 fileName+=(" "+r[i].value);
       }
    }
    fileName+=".mp4";
	return fileName;
}

/**
 * 绘制右侧HTML
 */
function divGenerater() {
	/*
	 * 1.画一个右边的div 2.添加一个按钮 3.读取chrome storage 中的配置，依次画出所有的按钮
	 */
	// 区域div
	var div = document.createElement("div");
	div.id = "downloadDiv";
//	div.style.cssText = "width:20%;height:-webkit-fill-available;z-index:9999;position:absolute;right:20px;background-color:yellowgreen;";
	// 下载按钮
	var button = document.createElement("button");
	button.innerHTML = "下载";
	button.id = "downloadButton";
	button.style.cssText = "width: 80%;height: 40px;top: 10px;left: 10%;position: relative;";
	div.appendChild(button);
	button.onclick = function(event) {
		// 禁用不生效???不清楚原因！！！！！！！！！！！！！！！！！！！！
		event.target.disabled=true;
		// 这里调用下载的函数
		downloadEvent();
		event.target.disabled=false;
	};
	// checkbox div
	var checkboxDiv = document.createElement("div");
	checkboxDiv.id="checkboxDiv";
	checkboxDiv.style.cssText="position:fixed;top:100px;";
	// 循环添加checkbox内容
	
	/*
	 * var i; for(i=0;i<10;i++){ var input = document.createElement("input");
	 * input.id="input-"+i; input.setAttribute("class","checkBoxTags");
	 * input.setAttribute("type","checkbox"); input.setAttribute("value",i);
	 * checkboxDiv.appendChild(input); var label =
	 * document.createElement("label"); label.setAttribute("for","input-"+i);
	 * label.innerHTML=i; checkboxDiv.appendChild(label); }
	 */
	chrome.storage.local.get("tags",function(data){
		data["tags"].forEach(function(item,index,array) {
			var input = document.createElement("input");
			input.id="input-"+index;
			input.setAttribute("class","checkBoxTags");
			input.setAttribute("type","checkbox");
			input.setAttribute("value",item.match_param);
			checkboxDiv.appendChild(input);
			var label = document.createElement("label");
			label.setAttribute("for","input-"+index);
			label.innerHTML=item.match_param;
			checkboxDiv.appendChild(label);
		});});
	
	
// document.getElementsByClassName("checkBoxTags").style.cssText="display:
// block;"
	div.appendChild(checkboxDiv);
	// div添加到body上
	document.body.appendChild(div);
}

/**
 * 下载函数
 */
function downloadEvent() {
	var fileName = genfileName();// 生成文件名！！！！！！！！！！！！！！！！！！还没写
	// 使用blob来获得下载链接，才能避开 【chrome 非同域名不生效问题】，异步调用
    getBlob(realDownloadUrl()).then(blob => {
    	document.getElementById("downloadButton").setAttr
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
 *            url 目标文件地址
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

// 标签按钮的toggle事件，点一下，选中，再点一下，选中



// 下面这部分是从 contentjs 往background发送信息的部分
// chrome.runtime.onMessage.addListener(
// );

divGenerater();


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

