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
	$("#" + tagId + " .moveU").click(function(event) {
		var $now = $(event.delegateTarget).parent().parent();
		$(event.delegateTarget).parent().parent().prev().before($now);
		storeTags();
		moveDisable();
	});
	$("#" + tagId + " .moveD").click(function(event) {
		var $now = $(event.delegateTarget).parent().parent();
		$(event.delegateTarget).parent().parent().next().after($now);
		storeTags();
		moveDisable();
	});
	moveDisable();
}
//move button disable
function moveDisable() {
	$("[disabled]").removeAttr("disabled");
	$("#tags .moveU:first").attr("disabled", "disabled");
	$("#tags .moveD:last").attr("disabled", "disabled");
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

	$("#tags").children().children().each(function(index, ele) {
		//排除空tag
		if (index != 0) {
			var newObj = {};
			newObj.name = $(ele).find("[type='text']").val();
			newObj.type = $(ele).find(".isType")[0].checked;
			tags[index - 1] = newObj;
		}
	});

	obj["tags"] = tags;
	// console.log(obj);
	chrome.storage.local.set(obj);
}
//拖动相关事件
function dragf() {
	var $dragObj = null;

	$("[draggable]").bind("dragstart", function(e) {
		$dragObj = $(e.currentTarget).parent();
		$(e.currentTarget).parent().addClass("opacitys");
	});

	$("[draggable]").bind("dragend", function(e) {
		$(e.currentTarget).parent().removeClass("opacitys");
	});

	$("[draggable]").bind("dragenter", function(e) {
		if ($dragObj[0].id != $(e.currentTarget).parent()[0].id) {
			$(e.currentTarget).parent().addClass("over");
		}
	});

	$("[draggable]").bind("dragleave", function(e) {
		$(e.currentTarget).parent().removeClass("over");
	});

	$("[draggable]").bind("dragover", function(e) {
		event.preventDefault();
	});

	$("[draggable]").bind("drop", function(e) {
		e.preventDefault();
		if (($dragObj)[0].id != $(e.currentTarget).parent()[0].id) {
			var $dragPrev = $dragObj.prev();
			$(e.currentTarget).parent().prev().after($dragObj);
			if ($dragPrev.id != $(e.currentTarget).parent()[0].id) {
				$dragPrev.after($(e.currentTarget).parent());
			}
		}
		$("[draggable]").parent().removeClass("over");
		$("[draggable]").parent().removeClass("opacitys");
		storeTags();
	});

}

function getWebData() {
	//返回值为json！！！！！！！！！！！！
}

function storeTagsFromWeb() {
	var data = getWebData();
	//然后把数据同步到local！！！！！！！！！！！！！！！！！！
}

$(document).ready(function() {
	// new
	$("#new").click(function(event) {
		new Tag();
	});

	loadTags();

	$("#refresh").click(function() {
		canvsGen();
	});

	//sync from static web page！！！！！！！！！！！！！！！！
	$("#sync").click(function() {
		storeTagsFromWeb();
		loadTags();
	});
	dragf();
});