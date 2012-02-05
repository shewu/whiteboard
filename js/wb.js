// Object class

function Obj(id, type) {
	this.id = id;
	this.type = type;
	this.div = null;
	this.currentlyBeingEdited = false;

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
		switch(this.type) {
			case "textbox":
				this.div = createTextletUnfocused(value, pos_x, pos_y, size_x, size_y, this.id);
				break;

			default:
				break;
		}
	};
}
objects = new Array();

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
				objs = eval(data);
				for(var i = 0; i < objs.length; i++) {
					objects = new Obj(parseInt(objs[i][0]), objs[i][1]);
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
				var obj = new Obj(parseInt(update[0]), data);
				objs.push(obj);	
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
					var found = false;
					for(var i = 0; i < objs.length; i++) {
						if(objs[i].id == id) {
							if(!deleted) {
								objs[i].update(update[1], update[2], update[3], update[4],
						        	           update[5], update[6]);
							} else {
								objs[i].remove();
								objs.splice(i, i);
							}
							found = true;
							break;
						}
					}
					if(!found && !deleted) {
						handleUpdateForNewObject(update);
					}
				}

				if(!onlyOnce)
					setTimeout("retrieveAllUpdates(false);", 1000);
			}
		}
	});
}

function sendUpdate(obj, value, x, y) {
	if(obj == null) {
		data = "action=create_object";
		data += "&type=textbox";
		data += "&value=" + value;
		data += "&style=" + style;
		data += "&position_x" + x;
		data += "&position_y" + y;
		data += "&" + get_id_string;
		s.ajax({
			url: URL,
			data: data
		});
	} else {
		data = "action=update_object";
		data += "&object_id=" + obj.id;
		data += "&value=" + value;
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
			if(textStatus == "success")
				retrieveAllUpdates();
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
		data: data
	});
	for(var i = 0; i < objs.length; i++) {
		if(objs[i] == obj) {
			objs.splice(i, i);
			break;
		}
	}
}

// keep these two values in sync with the css kthx
headerHeight = 16;
footerHeight = 12;

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
	id = div.attr('title');
	for(i in objs) {
		if(objs[i].id == id) {
			return objs[i];
		}
	}
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
	div.attr('title', $(this).attr('title'));
	div.click(divClickFn);
	div.mousedown(objectMousedownFn);
	div.text(text);
	if (text.length > 0) {
		if (obj == null) {
			$(this).remove();
			sendUpdate(obj, text, x, y);
		} else {
			$(this).replaceWith(div);
			obj.div = div;
			obj.currentlyBeingEditted = false;
			sendValueUpdate(obj, text);
		}
	} else {
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
		ta.attr('title', $(this).attr('title'));
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
	div.attr('title', '' + objid);
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
	createTextlet(e);
	return false;
}

function imageMenuHandler(e) {
	e.stopPropagation();
	alert('image');
	return false;
}

function hamburgerMenuHandler(e) {
	e.stopPropagation();
	alert('hamburger!');
	return false;
}

