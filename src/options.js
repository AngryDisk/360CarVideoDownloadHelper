/*{"type":["111","222","333"],"type2":["22","33"]}
 * 数据格式
 * {[{"name":"111","type":"true"},{"name":"222","type":"false"},{"name":"333","type":"true"}]}
 * 
 * */

/*function Tag(data) {
 //	var tags = document.getElementById('tags');
 //	this.node = document.getElementById('tag-template').cloneNode(true);
 //	this.node.id = 'tag' + (Tag.next_id++);
 //	this.node.tag = this;
 //	tags.appendChild(this.node);
 //	this.node.hidden = false;

 if (data) {
 this.getElement('match-param').value = data.match_param;
 }

 this.getElement('match-param').onkeyup = storeTags;
 var tag = this;
 this.getElement('remove').onclick = function() {
 tag.node.parentNode.removeChild(tag.node);
 // storeTags();
 };
 // storeTags();
 }*/

//Tag.prototype.getElement = function(name) {
//	return document.querySelector('#' + this.node.id + ' .' + name);
//}
//Tag.next_id = 0;
/*
 * function loadTags() { var tags = localStorage.tags; try {
 * JSON.parse(tags).forEach(function(tag) { new Tag(tag); }); } catch (e) {
 * localStorage.tags = JSON.stringify([]); } }
 * 
 * function storeTags() { localStorage.tags =
 * JSON.stringify(Array.prototype.slice.apply(
 * document.getElementById('tags').childNodes).map(function(node) { return {
 * match_param : node.tag.getElement('match-param').value }; })); }
 */
function loadTags() {
	var tags = "tags";
	chrome.storage.local.get(tags, function(data) {

		// try {
		data["tags"].forEach(function(tag) {
			new Tag(tag);
		});
		// } catch (e) {
		// localStorage.tags = JSON.stringify([]);
		// var tags =JSON.stringify([]);
		// chrome.storage.local.set(tags,function(){});
		// }
	});
	/*
	 * try { JSON.parse(tags).forEach(function(tag) { new Tag(tag); }); } catch
	 * (e) { //localStorage.tags = JSON.stringify([]); var tags
	 * =JSON.stringify([]); chrome.storage.local.set(var); }
	 */
}
//function storeTags() {
//	var obj = {};
//	var tags = "tags";
//	obj[tags] = Array.prototype.slice.apply(
//			document.getElementById('tags').childNodes).map(function(node) {
//		return {
//			match_param : node.tag.getElement('match-param').value
//		};
//	});
//	chrome.storage.local.set(obj);
//}

// window.onload = function() {
// // loadTags();
// document.getElementById('new').onclick = function() {
// new Tag();
// };
// }

var nextId = 0;
function Tag(data) {
	// console.log($("tag-template"));
	var tag = $("#tag-template").clone(true);
	var tagId = "tag" + nextId++;
	tag.attr("id", tagId);
	// if(data){
	// tag.children("td .tagName").css("background-color", "red");
	// console.log(tag.children("td .tagName"));
	// }
	$("#tags").append(tag);
	// if(data){
	$("#" + tagId + " .tagName").val(nextId);
	$("#" + tagId + " .tagName").keyup(function(){
		storeTags();
	});
	
	// }
}
function storeTags(){
	$("#tags").children().each(function(index,ele){
		console.log(ele);
	})
}

$(document).ready(function() {
	//按钮事件
	$("#new").click(function(event) {
		new Tag();
		// console.log("11111");
	});
	//操作后，保存事件
//	$("input.tagName").keyup(storeTags());
});