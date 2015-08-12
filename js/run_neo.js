//Neo X,Y軸速度和位置，轉動位置
var neo_x_speed = 0.0;
var neo_x_position = 50.0;
var neo_y_speed = 0.0;
var neo_y_position = 380.0;
var neo_rotate_position = 0;
var neo_squeeze_degree = 0;

//鍵盤有沒有壓
var left_pressed = 0;
var left_pressed_time = 0;
var right_pressed = 0;
var right_pressed_time = 0;
var up_pressed = 0;
var up_pressed_time = 0;

//有沒有跳起來
var neo_have_jumped = 0;

//函數重複執行的時間間隔、速度變化參數
const TIME_BASE_ALPHA = 15;//較短的一個時間
const TIME_BASE_BETA = 50;//X軸速度、旋轉刷新間隔

const X_SPEED_FRICTION = 0.2;
var X_SPEED_ACCELERATION = 10;//25

const ROTATE_FRICTION = 0.4;//旋轉回復速度
const ROTATE_ACCELERATION = 10;//旋轉速度

var Y_SPEED_ORIGIN = 35;//跳躍初始速度,40
const Y_SPEED_ACCELERATION = 8;//落下加速度

//位置參數
const MAX_NEO_X_POSITION = 1050;
const MIN_NEO_X_POSITION = 100;
const MAX_NEO_Y_POSITION = 380;
const MIN_MISSLE_X_POSITION = 20;
const MAX_MISSLE_X_POSITION = 1300;
const MIN_MISSLE_Y_POSITION = 0;
const MAX_MISSLE_Y_POSITION = 600;

//Missle
var missle_x_speed = new Array();
var missle_x_position = new Array();
var missle_y_speed = new Array();
var missle_y_position = new Array();

//愛心
var heart_x_position = 0;
var heart_y_speed = 0;
var heart_y_position = 0;

//遊戲參數
var game_score = -1000000;
var game_score_base = 1;
var neo_hp = 1000000;
var time_pass = 0;
var MAX_MISSLE_NUMBER = 5;
var MISSLE_MIN_SPEED = 5;
var MISSLE_MAX_SPEED = 15;
var HEART_SPEED = 5;
var HEART_INTERVAL = 10;
var HEART_QUANTITY = 7;
var SCORE_HEART = 10;
var SCORE_MISSLE = 1;
var SCORE_TIME = 2;

function downKey(event){
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
	missleInit();
	heartInit();
});

function heartInit(){
	heart_x_position = randomInt(100,1000);
	heart_y_position = 0;
	setTimeout("heartMove()", 1000 * HEART_INTERVAL);
}

function heartMove(){
	heart_y_position += HEART_SPEED;
	if(heart_x_position > neo_x_position - 15 && heart_x_position < neo_x_position + 80 && heart_y_position > neo_y_position && heart_y_position < neo_y_position + 105){
		neo_hp += HEART_QUANTITY;
		game_score += HEART_QUANTITY;
		$("#score_div").text("Score : " + game_score);
		$("#hp_div").text("HP : " + neo_hp);
		heart_y_position = -100;
		$("#heart").css({
			"left" : heart_x_position,
			"top" : heart_y_position
		});
		heartInit();
	}else if(heart_y_position > 550){
		heart_y_position = -100;
		$("#heart").css({
			"left" : heart_x_position,
			"top" : heart_y_position
		});
		heartInit();
	}else{
		$("#heart").css({
			"left" : heart_x_position,
			"top" : heart_y_position
		});
		setTimeout("heartMove()", TIME_BASE_ALPHA);
	}
}

function missleInitI(i){
	missle_x_position[i] = randomInt(0, 1000);
	missle_y_position[i] = randomInt(-200, -100);
	missle_x_speed[i] = (randomInt(0,1) == 1)?randomInt(MISSLE_MIN_SPEED, MISSLE_MAX_SPEED):randomInt(-MISSLE_MAX_SPEED, -MISSLE_MIN_SPEED);
	missle_y_speed[i] = randomInt(MISSLE_MIN_SPEED, MISSLE_MAX_SPEED);
	$("#missle_" + i).css({"background-color" : "#" + randomInt(0, 128).toString(16) + randomInt(0,128).toString(16) + randomInt(0,128).toString(16)});
}

function missleInit(){
	for(var i = 0; i < MAX_MISSLE_NUMBER; i++){
		missle_x_position[i] = randomInt(0, 1000);
		missle_y_position[i] = randomInt(-200, -100);
		missle_x_speed[i] = (randomInt(0,1) == 1)?randomInt(MISSLE_MIN_SPEED, MISSLE_MAX_SPEED):randomInt(-MISSLE_MAX_SPEED, -MISSLE_MIN_SPEED);
		missle_y_speed[i] = randomInt(MISSLE_MIN_SPEED, MISSLE_MAX_SPEED);
		$("#missle_" + i).css({"background-color" : "#" + randomInt(0, 128).toString(16) + randomInt(0,128).toString(16) + randomInt(0,128).toString(16)});
	}
	missleMove();
}

function missleMove(){
	for(var i = 0; i < MAX_MISSLE_NUMBER; i++){
		//Change position
		missle_x_position[i] += missle_x_speed[i];
		if(missle_x_position[i] > MAX_MISSLE_X_POSITION) missle_x_position[i] = MIN_MISSLE_X_POSITION;
		else if(missle_x_position[i] < MIN_MISSLE_X_POSITION) missle_x_position[i] = MAX_MISSLE_X_POSITION;
		missle_y_position[i] += missle_y_speed[i];
		if(missle_y_position[i] > MAX_MISSLE_Y_POSITION){
			missle_y_position[i] = MIN_MISSLE_Y_POSITION;
			missle_x_speed[i] = (randomInt(0,1) == 1)?randomInt(MISSLE_MIN_SPEED, MISSLE_MAX_SPEED):randomInt(-MISSLE_MAX_SPEED, -MISSLE_MIN_SPEED);	
			$("#missle_" + i).css({"background-color" : "#" + randomInt(0, 128).toString(16) + randomInt(0,128).toString(16) + randomInt(0,128).toString(16)});
		}

		//Hit or not
		if(missle_x_position[i] > neo_x_position + 20 && missle_x_position[i] < neo_x_position + 115 && missle_y_position[i] > neo_y_position + 20 && missle_y_position[i] < neo_y_position + 90){
			neo_hp -= 1;
			if(neo_hp == 0){
				gameOver();
			}
			game_score += SCORE_MISSLE;
			missle_x_position[i] = 500;
			missle_y_position[i] = -100;
			missle_x_speed[i] = (randomInt(0,1) == 1)?randomInt(MISSLE_MIN_SPEED, MISSLE_MAX_SPEED):randomInt(-MISSLE_MAX_SPEED, -MISSLE_MIN_SPEED);
			missle_y_speed[i] = randomInt(MISSLE_MIN_SPEED, MISSLE_MAX_SPEED);
			$("#missle_" + i).css({"background-color" : "#" + randomInt(0, 128).toString(16) + randomInt(0,128).toString(16) + randomInt(0,128).toString(16)});
			$("#hp_div").text("HP : " + neo_hp);
			$("#score_div").text("Score : " + game_score);
			neoIsHitted();
		}

		//Show missle
		$("#missle_" + i).css({
			"left" : missle_x_position[i],
			"top" : missle_y_position[i]
		});
	}

	//Restart
	setTimeout("missleMove()", TIME_BASE_ALPHA);
}

function neoIsHitted(){
	$('#face').css({'background-color': '#ffe4e4'});
	$('#ear_left_front').css({'border-bottom-color': '#ffe4e4'});
	$('#ear_right_front').css({'border-bottom-color': '#ffe4e4'});
	setTimeout( function( ){
		$('#face').css({'background-color': '#ffffff'});
		$('#ear_left_front').css({'border-bottom-color': '#ffffff'});
		$('#ear_right_front').css({'border-bottom-color': '#ffffff'});
	},200);
}

function showNeo(){
	$("#my_div").css("left", neo_x_position);
	$("#my_div").css("top", neo_y_position);
	$("#my_div").css("-webkit-transform", "rotate(" + neo_rotate_position + "deg");
	setTimeout("showNeo()", TIME_BASE_ALPHA);
}

function neoMove(){
	neo_x_position += neo_x_speed;
	if(neo_x_position < MIN_NEO_X_POSITION) neo_x_position = MIN_NEO_X_POSITION;
	else if(neo_x_position > MAX_NEO_X_POSITION) neo_x_position = MAX_NEO_X_POSITION;

	neo_y_position += neo_y_speed;
	if(neo_y_position > MAX_NEO_Y_POSITION) neo_y_position = MAX_NEO_Y_POSITION;
	setTimeout("neoMove()", TIME_BASE_ALPHA);
}

function changeNeoXSpeed(){//X speed and rotate
	if(left_pressed == 1){
		left_pressed_time += 1;
		neo_x_speed = -X_SPEED_ACCELERATION * Math.log(left_pressed_time + 1);
		neo_rotate_position = parseInt(-ROTATE_ACCELERATION * Math.log(1 - neo_x_speed));
	}else if(right_pressed == 1){
		right_pressed_time += 1;
		neo_x_speed = X_SPEED_ACCELERATION * Math.log(right_pressed_time + 1);
		neo_rotate_position = parseInt(ROTATE_ACCELERATION * Math.log(neo_x_speed + 1));
	}else{
		left_pressed_time = 0;
		right_pressed_time = 0;
		neo_x_speed *= X_SPEED_FRICTION;
		neo_rotate_position = parseInt(neo_rotate_position * ROTATE_FRICTION);
		if(Math.abs(neo_x_speed) <=0.1) neo_x_speed = 0;
	}

	setTimeout("changeNeoXSpeed()", TIME_BASE_BETA);
}

function changeNeoYSpeed(){
	if(up_pressed == 1 && neo_have_jumped < 1){
		up_pressed_time += 1;
		neo_y_speed = -Y_SPEED_ORIGIN + Y_SPEED_ACCELERATION * up_pressed_time;
	}else{
		neo_have_jumped = 1;
		up_pressed_time = 0;
		if(neo_y_position < MAX_NEO_Y_POSITION){//falling down
			neo_y_speed += 2 * Y_SPEED_ACCELERATION;
		}else{//on the ground
			neo_have_jumped = 0;
		}
	}
	
	setTimeout("changeNeoYSpeed()", TIME_BASE_BETA);
}

function timePassed(){
	time_pass += 1;
	game_score += SCORE_TIME;
	
	if(game_score > game_score_base * 100 && game_score < 1600){
	//game_score only increase and don't care score > 1600
		game_score_base += 1;
		missleInitI(4 + parseInt(game_score/100));
		MAX_MISSLE_NUMBER = 5 + parseInt(game_score/100);
	}

	if(neo_hp >= 100){//neo_hp > 100 is the maximum bound
		HEART_QUANTITY = 1;
		X_SPEED_ACCELERATION = 22;
		Y_SPEED_ORIGIN = 50;
	}else if(neo_hp >= 10){
		HEART_QUANTITY = 11 -parseInt(neo_hp/10);
		X_SPEED_ACCELERATION = 2 * parseInt(neo_hp/10);
		Y_SPEED_ORIGIN = 20 + 3 * parseInt(neo_hp/10);
	}else{
		HEART_QUANTITY = 15;
		X_SPEED_ACCELERATION = 1;
		Y_SPEED_ORIGIN = 20;
	}

	if(time_pass % 1800 == 0 && time_pass != 0){
		game_score += 1500;
	}else if(time_pass % 360 == 0 && time_pass != 0){
		game_score += 250;
	}else if(time_pass % 180 == 0 && time_pass != 0){
		game_score += 100;
	}else if(time_pass % 30 == 0 && time_pass != 0){
		game_score += 10;
	}

	$("#score_div").text("Score : " + game_score);
	setTimeout("timePassed()", 1000);
}

function gameStart(){
	changeNeoXSpeed();//x speed and rotate
	changeNeoYSpeed();
	neoMove();
	showNeo();
	neo_hp = 50;
	game_score = 0;
	timePassed();
	$("#score_div").text("Score : " + game_score);
	$("#score_div").show();
	
	$("#hp_div").text("HP : " + neo_hp);
	$("#hp_div").show();
	$("#my_div").show();
	$("#pop_out_div").hide();
}

function gameOver(){
	$("#pop_out_h1").text("Score : " + game_score);
	$("#pop_out_h1").css("font-size", "150px");
	if(game_score > 5000) $("#pop_out_h2").text("God Like!");
	else if(game_score > 3000) $("#pop_out_h2").text("Legendary!");
	else if(game_score > 2000) $("#pop_out_h2").text("Unbelievable..");
	else if(game_score > 1000) $("#pop_out_h2").text("You are awesome!");
	else if(game_score > 500) $("#pop_out_h2").text("Perfect!");
	else if(game_score > 300) $("#pop_out_h2").text("Good!");
	else if(game_score > 100) $("#pop_out_h2").text("That's OK!");
	else if(game_score > 50) $("#pop_out_h2").text("You are tired!");
	else if(game_score > 10) $("#pop_out_h2").text("Are you OK?");
	else $("#pop_out_h2").text("God like!");
	$("#start_button").hide();
	$("#pop_out_a").show();
	$("#pop_out_div").show();
}

function randomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}