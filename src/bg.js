chrome.runtime.onConnect.addListener(function(port) {
	// sendResponse({finish:false});
	// port.onMessage.addListener(function(obj){
	port.onMessage.addListener(function(msg) {
		console.log(msg);
		getBlob(msg.url).then(blob => {
			saveAs(blob, msg.filename);
			// sendResponse({finish:true});
			port.disconnect();
		});
		console.log(port);

		// });

	});



	// sendResponse({111:"222"});
	// getBlob2(request.url);
});

// function getBlob2(urll) {
// 	$.ajax({
// 		url: urll,
// 		type: "get",
// 		dataType: "JSONP",
// 		success: function(data) {
// 			console.log(data);
// 		}
// 	});
// }



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
// chrome.downloads.onDeterminingFilename.addListener(function(downloadItem, suggest) {
// 	var obj={};
// 	chrome.runtime.sendMessage(obj, function(response) {
// 		suggest({filename:response.filename});
// 	});
// 	// if (downloadItem.url) {}
// 	console.log(downloadItem);
// 	console.log(suggest);
// });