<?
include('util/header.php');
include('util/mysql.php');
?>

<body onload="resizeCanvas()" onresize="resizeCanvas()">

<script>
$(document).ready(function() {
	$('#canvas').bind('contextmenu', function(e) {
		var $cmenu = $(this).next();
		$('<div class=overlay></div>').css({
			left: '0px',
			top: '0px',
			position: 'absolute',
			width: '100%',
			height: '100%',
			zIndex: '100'
		}).click(function() {
			$(this).remove();
			$cmenu.hide();
		}).bind('contextmenu', function() {
			return false;
		}).appendTo(document.body);
		$(this).next().css({
			left: e.pageX,
			top: e.pageY,
			zIndex: '101'
		}).show();
		return false;
	});
	$('#vmenu .firstLi').live('click', function() {
		if ($(this).children().size() == 1) {
			$('#vmenu').hide();
			$('.overlay').hide();
		}
	});
	$('.firstLi').hover(function() {
		$(this).css({
			backgroundColor: '#E0EDFE',
			cursor: 'pointer'
		});
		if ($(this).children().size() > 0) {
			$(this).find('.innerLi').show();
			$(this).css({
				cursor: 'default'
			});
		},
		function() {
			$(this).css('background-color', '#fff');
			$(this).find('.innerLi').hide();
		}
	});
});
</script>

<header>
<?
function get_field($key) {
	if($_GET[$key])
		return $_GET[$key];
	if($_POST[$key])
		return $_POST[$key];
	return "";
}

$whiteboard_id = 0;
$name = "";
if(get_field('create') == 'yes') {
	$name = get_field('whiteboard_name');
	if($name == '')
		die('no name');
	mysql_query("INSERT INTO whiteboards (name) VALUES ('" . mysql_real_escape_string($name) . "')") or die('could not insert');
	$whiteboard_id = mysql_insert_id();
} else {
	$whiteboard_id = get_field('whiteboard_id');
	$result = mysql_query("SELECT name FROM whiteboards WHERE id=$whiteboard_id") or die('select query failed');
	$row = mysql_fetch_assoc($result);
	if($row) {
		$name = $row['name'];
	} else {
		die('no whiteboard with that id');
	}
	mysql_free_result($result);
}

echo "viewing whiteboard $name";

?>
</header>

<div id=vmenu>
<div class=firstLi>Text</div>
<div class=firstLi>Image</div>
<div class=firstLi>Hamburger</div>
</div>


<div id=canvas onclick="createTextlet(event)">
</div>

<?
include('util/footer.php');
?>

