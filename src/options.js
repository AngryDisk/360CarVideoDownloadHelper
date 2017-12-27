/**
 * 数据格式
 * {[{"name":"111","type":"true"},{"name":"222","type":"false"},{"name":"333","type":"true"}]}
 */

var nextId = 0;

function Tag(data) {
	// console.log($("tag-template"));
	var tag = $("#tag-template").clone(true);
	var tagId = "tag" + nextId++;
	tag.attr("id", tagId);
	$("#tags").append(tag);
	// 初始化参数
	if (data) {
		$("#" + tagId + " .tagName").val(data.name);
		$("#" + tagId + " .isType").attr("checked", data.type);
	}
	// 注册监听事件
	$("#" + tagId + " .tagName").keyup(function() {
		storeTags();
	});
	$("#" + tagId + " .isType").change(function() {
		storeTags();
	});
	$("#" + tagId + " .remove").click(function(event) {
		$(event.delegateTarget).parent().parent().remove();
		storeTags();
	});
}

function loadTags() {
	chrome.storage.local.get("tags", function(data) {
		// console.log(data);
		if (JSON.stringify(data) != "{}") {
			data["tags"].forEach(function(tag) {
				new Tag(tag);
			});
		}
	});
}

function storeTags() {
	var obj = {};
	var tags = [];
	$("#tags").children().each(function(index, ele) {
		var newObj = {};
		newObj.name = $(ele).find("[type='text']").val();
		newObj.type = $(ele).find(".isType")[0].checked;
		tags[index] = newObj;
	});
	obj["tags"] = tags;
	// console.log(obj);
	chrome.storage.local.set(obj);
}

$(document).ready(function() {
	// 按钮事件
	$("#new").click(function(event) {
		new Tag();
	});
	loadTags();
	$("#refresh").click(function() {
	  canvsGen();
	})
});