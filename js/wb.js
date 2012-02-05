// Object class

function Obj(id, type) {
	this.id = id;
	this.type = type;
	this.div = null;
	this.currentlyBeingEdited = false;
	this.deleted = false;

	// deletes the div from view
	this.remove = function() {
		if(this.div != null)
			this.div.remove();
	};

	// updates the div
	this.update = function(value, style, pos_x, pos_y, size_x, size_y) {
		if(this.currentlyBeingEdited)
			return;
		this.remove();
		if(this.deleted)
			return;
		switch(this.type) {
			case "textbox":
				this.div = createTextletUnfocused(value, pos_x, pos_y, size_x, size_y, this.id);
				break;

			case "image":
				this.div = createImagelet(value, pos_x, pos_y);

			default:
				break;
		}
	};
}
objs = { };

// AJAX - keep updated with the server using jquery AJAX

URL = "util/request.php";

function createConnection() {
	$.ajax({
		url: URL,
		data: "action=create_connection&whiteboard_id=" + whiteboard_id,
		success: function(data, textStatus, jqXHR) {
			if(textStatus == "success") {
				connection_id = parseInt(data);
				get_id_string = "whiteboard_id=" + whiteboard_id + "&connection_id=" + connection_id;
				retrieveAllObjects();
			}
		}
	});
}

function retrieveAllObjects() {
	$.ajax({
		url: URL,
		data: "action=get_objects&" + get_id_string,
		success: function(data, textStatus, jqXHR) {
			if(textStatus == "success") {
				objs_unparsed = eval(data);
				for(var i = 0; i < objs_unparsed.length; i++) {
					var id = parseInt(objs_unparsed[i][0]);
					var type = objs_unparsed[i][1];
					objs[id] = new Obj(id, type);
				}
				retrieveAllUpdates(false);
			}
		}
	});
}

function handleUpdateForNewObject(update) {
	$.ajax({
		url: URL,
		data: "action=get_object_type&object_id=" + update[0] + "&" + get_id_string,
		success: function(data, textStatus, jqXHR) {
			if(textStatus == "success") {
				var id = parseInt(update[0]);
				var obj = new Obj(id, data);
				objs[id] = obj;
				obj.update(update[1], update[2], update[3], update[4],
				           update[5], update[6]);
			}
		}
	});
}

var retrieveAllUpdatesFirstTime = true;
function retrieveAllUpdates(onlyOnce) {
	var action = (retrieveAllUpdatesFirstTime ? "get_all_latest_updates" : "get_updates");
	retrieveAllUpdatesFirstTime = false;
	$.ajax({
		url: URL,
		data: "action=" + action + "&" + get_id_string,
		success: function(data, textStatus, jqXHR) {
			if(textStatus == "success") {
				var updates = eval(data);
				for(i in updates) {
					var update = updates[i];
					var id = parseInt(update[0]);
					var deleted = update[7];

					if(objs[id]) {
						if(!deleted) {
							objs[id].update(update[1], update[2], update[3], update[4],
										   update[5], update[6]);
						} else {
							objs[id].remove();
							delete objs[id];
						}
					} else {
						handleUpdateForNewObject(update);
					}

				}

				if(!onlyOnce)
					setTimeout("retrieveAllUpdates(false);", 1000);
			}
		}
	});
}

function sendUpdateCreate(type, value, x, y, div) {
	data = "action=create_object";
	data += "&type=" + type;
	data += "&value=" + value;
	data += "&position_x=" + x;
	data += "&position_y=" + y;
	data += "&" + get_id_string;
	$.ajax({
		url: URL,
		data: data,
		success: function(data, textStatus, jqXHR) {
			if(textStatus == "success") {
				if(div != null)
				div.remove();
				retrieveAllUpdates(true);
			}
		}
	});
}

function sendValueUpdate(obj, value) {
	data = "action=update_object";
	data += "&object_id=" + obj.id;
	data += "&value=" + value;
	data += "&" + get_id_string;
	$.ajax({
		url: URL,
		data: data,
		success: function(data, textStatus, jqXHR) {
			if(textStatus == "success") {
				retrieveAllUpdates(true);
			}
		}
	});
}

function sendMoveUpdate(obj, x, y) {
	data = "action=update_object";
	data += "&object_id=" + obj.id;
	data += "&position_x=" + x;
	data += "&position_y=" + y;
	data += "&" + get_id_string;
	$.ajax({
		url: URL,
		data: data,
		success: function(data, textStatus, jqXHR) {
			if(textStatus == "success")
				retrieveAllUpdates(true);
		}
	});
}

function sendDeleteUpdate(obj) {
	data = "action=delete_object";
	data += "&object_id=" + obj.id;
	data += "&" + get_id_string;
	$.ajax({
		url: URL,
		data: data,
		success: function(data, textStatus, jqXHR) {
			if(textStatus == "success")
				retrieveAllUpdates(true);
		}
	});
	delete objs[obj.id];
}

// keep these two values in sync with the css kthx
headerHeight = 16;
footerHeight = 12;

posx = -1;
posy = -1;

function resizeCapsule() {
	var screenViewportHeight = document.documentElement.clientHeight;
	document.getElementById('capsule').style.height = screenViewportHeight - headerHeight - footerHeight - 1 + 'px';
	return;
}

function resizeCanvas() {
	var screenViewportHeight = document.documentElement.clientHeight;
	document.getElementById('canvas').style.height = screenViewportHeight - headerHeight - footerHeight - 1 + 'px';
	return;
}

function getObjFromDiv(div) {
	id = div.attr('objid');
	if(objs[id])
		return objs[id];
	else
		return null;
}

function textareaBlurFn() {
	var text = $(this).val();
	var div = $("<div>");
	var obj = getObjFromDiv($(this));
	div.addClass("textlet");
	var x = $(this).position().left;
	var y = $(this).position().top;
	div.css('left', x);
	div.css('top', y);
	div.css('white-space', 'pre');
	div.attr('objid', $(this).attr('objid'));
	div.click(divClickFn);
	div.mousedown(objectMousedownFn);
	div.text(text);
	if (text.length > 0) {
		if (obj == null) {
			sendUpdateCreate("textbox", text, x, y, $(this));
		} else {
			$(this).replaceWith(div);
			obj.div = div;
			obj.currentlyBeingEdited = false;
			sendValueUpdate(obj, text);
		}
	} else {
		obj.deleted = true;
		$(this).remove();
		sendDeleteUpdate(obj);
	}
}

function textareaClickFn(event) {
	event.stopPropagation();
}

function divClickFn(event) {
	event.stopPropagation();
	if (!dragged) {
		var content = $(this).text();
		var ta = $("<textarea />");
		var obj = getObjFromDiv($(this));
		ta.addClass("textlet");
		ta.css('left', $(this).position().left);
		ta.css('top', $(this).position().top);
		ta.attr('objid', $(this).attr('objid'));
		ta.blur(textareaBlurFn);
		ta.click(textareaClickFn);
		ta.val(content);
		$(this).replaceWith(ta);
		ta.focus();
		obj.currentlyBeingEdited = true;
	}
}

function objectMousedownFn(event) {
	dragBaseX = event.pageX;
	dragBaseY = event.pageY;
	dragObjectBaseX = $(this).position().left;
	dragObjectBaseY = $(this).position().top;
	dragObject = $(this);
	getObjFromDiv($(this)).currentlyBeingEdited = true;
}

function createTextbox() {
	if (menuEvent != null)
		createTextlet(menuEvent);
}

// creates a textlet focused
function createTextlet(e) {
	if (!e) {
		e = window.event;
	}
	var posx = 0, posy = 0;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	var $textarea = $("<textarea class=textlet style='top:"+posy+"px;left:"+posx+"px'/>");
	$textarea.attr('objid','-1');
	$textarea.blur(textareaBlurFn);
	$textarea.click(function(event) {
		event.stopPropagation();
	});
	$('#canvas').append($textarea);
	$textarea.focus();
	return false;
}

// creates a textlet unfocused
function createTextletUnfocused(value, pos_x, pos_y, size_x, size_y, objid) {
	var div = $("<div>");
	div.addClass("textlet");
	div.css('left', pos_x);
	div.css('top', pos_y);
	div.css('white-space', 'pre');
	div.click(divClickFn);
	div.text(value);
	div.attr('objid', '' + objid);
	div.mousedown(objectMousedownFn);
	$('#canvas').append(div);
	return div;
}

$(document).ready(function() {
	isMouseDown = false;
	dragObject = null;
	dragBaseX = 0;
	dragBaseY = 0;
	dragObjectBaseX = 0;
	dragObjectBaseY = 0;
	dragged = false;

	$('body').mousedown(function() {
		isMouseDown = true;
		dragged = false;
	})
	.mouseup(function(e) {
		isMouseDown = false;
		if(dragged && dragObject != null) {
			sendMoveUpdate(getObjFromDiv(dragObject), dragObjectBaseX + e.pageX - dragBaseX, dragObjectBaseY + e.pageY - dragBaseY);
		}
		if(dragObject != null) {
			getObjFromDiv(dragObject).currentlyBeingEdited = false;
		}
		dragObject = null;
	})
	.mousemove(function(event) {
		if(isMouseDown && dragObject != null) {
			var curX = event.pageX;
			var curY = event.pageY;
			dragObject.css('left', dragObjectBaseX + curX - dragBaseX);
			dragObject.css('top', dragObjectBaseY + curY - dragBaseY);
			dragged = true;
		} else {
			dragged = false;
		}
	});

	createConnection();
});

function textMenuHandler(e) {
	e.stopPropagation();
	$('#vmenu').css('display', 'none');
	createTextbox();
	return false;
}

function imageMenuHandler(e) {
	e.stopPropagation();
	// we need to cache the mouse coordinates before anything
	if (!e) {
		e = window.event;
	}
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	$('#vmenu').css('display', 'none');
	$('.overlayLightbox').css('display', 'block');
	return false;
}

function hamburgerMenuHandler(e) {
	e.stopPropagation();
	$('#vmenu').css('display', 'none');
	return false;
}

function createImagelet(url, posx, posy) {
	img = $('<img/>');
	img.attr('src', url);
	imglet = $('<div>');
	imglet.addClass('textlet');
	imglet.append(img);
	imglet.css('left', posx);
	imglet.css('top', posy);
	imglet.mousedown(objectMousedownFn);
	$('#canvas').append(imglet);
	return imglet;
}

function processImgFileUpload(file) {
	if (!file || !file.type.match(/image.*/)) return;

	var fd = new FormData();
	fd.append('image', file);
	fd.append('key', 'ef01658e300dbcf7aa0ecdd18a3bed7c');

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://api.imgur.com/2/upload.json');
	xhr.onload = function() {
		// here is the response from the server
		var rsp = JSON.parse(xhr.responseText).upload.links.original;
		sendUpdateCreate("image", rsp, posx, posy, null);
	}

	xhr.send(fd);
}

function processImgUpload() {
	$('.overlayLightbox').css('display', 'none');
	imgURL = document.forms['imgUploadForm'].elements['imgURL'].value;
	imgFile = document.forms['imgUploadForm'].elements['imgUpload'].files[0];
	switch ($('input[name=imgRadio]:checked', '#imgUploadForm').val()) {
		case "file":
			if (imgFile) {
				processImgFileUpload(imgFile);
			}
			break;
		case "url":
			if (imgURL.length > 0) {
				// we need to do some url validation!!
				//createImagelet(imgURL);
				sendUpdateCreate("image", imgURL, posx, posy, null);
			}
			break;
		default:
			break;
	}
}

