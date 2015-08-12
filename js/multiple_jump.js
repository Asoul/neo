var neo_x_speed = 0.0;
var neo_x_position = 50.0;
var neo_y_speed = 0.0;
var neo_y_position = 400.0;

var left_pressed = 0;
var left_pressed_time = 0;
var right_pressed = 0;
var right_pressed_time = 0;
var up_pressed = 0;
var up_pressed_time = 0;
var up_not_pressed_time = 0;

var test3 = 0;
var test2 = 0;


function downKey(event){
	test2 += 1;
	$("#text2_div").text("down times : " + test2);
	switch(event.which){
		case 32://space
		break;
		case 37://left
			left_pressed = 1;
		break;
		case 38://up
			up_pressed = 1;
		break;
		case 39://right
			right_pressed = 1;
		break;
		case 40://down
		break;
	}
}
function upKey(event){
	test3 += 1;
	$("#text3_div").text("up times : " + test3);
	switch(event.which){
		case 32://space
		break;
		case 37://left
			left_pressed = 0;
		break;
		case 38://up
			up_pressed = 0;
		break;
		case 39://right
			right_pressed = 0;
		break;
		case 40://down
		break;
	}	
}
$(document).ready(function(){
	changeNeoXSpeed();
	changeNeoYSpeed();
	neoMove();
});

function neoMove(){
	neo_x_position += neo_x_speed;
	$("#container").css("left", neo_x_position);
	neo_y_position += neo_y_speed;
	$("#container").css("top", neo_y_position);
	setTimeout("neoMove()", 0);
}

function changeNeoYSpeed(){
	if(up_pressed == 1){
		up_pressed_time += 1;
		up_not_pressed_time = 0;
		//average 185 times per sec, 1.3 sec to 240.5
		if(up_pressed_time <= 120){
			neo_y_speed = -6 + 1/10 * up_pressed_time;
		}else{
			neo_y_speed = 0;
		}
	}else{
		up_pressed_time = 0;
		up_not_pressed_time += 1;
		if(neo_y_position < 400){//falling down
			neo_y_speed += 0.2;
		}else{
			neo_y_speed = 0;
			neo_y_position = 400;
		}

	}
	$("#text4_div").text("neo_y_speed : " + neo_y_speed);
	setTimeout("changeNeoYSpeed()", 0);
}

function changeNeoXSpeed(){
	if(left_pressed == 1){
		left_pressed_time += 1;
		neo_x_speed = -Math.log(left_pressed_time + 1);
		if(neo_x_speed <= -10) neo_x_speed = -10;
	}else{
		left_pressed_time = 0;
		neo_x_speed *= 0.9;
		if(Math.abs(neo_x_speed) <=0.1) neo_x_speed = 0;
	}
	if(right_pressed == 1){
		right_pressed_time += 1;
		neo_x_speed = Math.log(right_pressed_time + 1);
		if(neo_x_speed >= 10) neo_x_speed = 10;
	}else{
		right_pressed_time = 0;
		neo_x_speed *= 0.9;
		if(Math.abs(neo_x_speed) <= 0.1) neo_x_speed = 0;
	}
	$("#text_div").text("neo_x_speed : " + neo_x_speed);
	$("#text5_div").text("pressed_time : " + (left_pressed_time + right_pressed_time));
	setTimeout("changeNeoXSpeed()", 0);
}