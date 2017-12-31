/*JQuery ajax 对 blob 支持不好，弃用
 *可以通过接管 chrome.downloads.onDeterminingFilename 来监听下载内容，而文件名的交互需要使用chrome.tabs.sendMessage从前台页面获取（未测试）
 */

/*
 *使用chrome.runtime.onMessage方式，必须马上返回response
 * connect方式可以通过 port.disconnect 方式通知 content恢复按钮禁用
 */
chrome.runtime.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(msg) {
		console.log(msg);
		getBlob(msg.url).then(blob => {
			saveAs(blob, msg.filename);
			port.disconnect();
		});
		// console.log(port);
	});
});

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