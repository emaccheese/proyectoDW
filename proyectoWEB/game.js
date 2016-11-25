window.onload=init;
var canvas;
var stage;
var queue;
var WIDTH=0;
var HEIGHT=0;
var player1ArmySize = 20;
var player2ArmySize = 15;
var player1Amry;
var player2Army;
var gameTime;
var gameEnd = false;
var PRESSING=[];
var testUnit;
var tickCounter = 0;
var i=0;
var kDown = false;
//tecla presionada
document.addEventListener('keydown', function(eve) {
	PRESSING[eve.keyCode] = true;
}, false);

//tecla soltada
document.addEventListener('keyup', function(eve) {
	PRESSING[eve.keyCode] = false;
  kDown = false;
}, false);
function mouseClick(evt){
    if(evt.which==1){

    }
}
function init(){
  window.addEventListener('click',mouseClick,false);
  canvas =document.getElementById('canvas');
	//console.log("Running...");
	canvas.style.backgroundColor = "#2E64FE";
	WIDTH=canvas.width;
	HEIGHT=canvas.height;

	stage = new createjs.Stage("canvas");
	queue = new createjs.LoadQueue(false);
	queue.installPlugin(createjs.Sound);

	queue.loadManifest([
	{id:"unitSprite1", src:"resources/imgs/unit1.png"},
  {id:"arrowImg", src:"resources/imgs/arrow1.png"},
	{id:"arrowSound", src:"resources/sounds/arrow_shot.wav"},
	{id:"backgroundMusic", src:"resources/sounds/fieldwithbirds.wav"},
	{id:"arrowHit", src:"resources/sounds/hurt_male.wav"},
	{id:"explosion", src:"resources/sounds/explosion.mp3"},
	]);
	spritesheets= new createSpritesSheets();
	queue.addEventListener("complete", run);
}

function run(){
	console.log("Loaded...");
	backgroundMusic = createjs.Sound.play("backgroundMusic",createjs.Sound.INTERRUPT_ANY, 0, 0, -1, 1, 0);
  // player1Army = new armyClass(player1ArmySize,1);
  // player2Army = new armyClass(player2ArmySize,2);
	testUnit = new unitClass(1);
	createjs.Ticker.addEventListener("tick", gameloop);
	createjs.Ticker.setFPS(60);
	startTime=new Date().getTime();

}

function gameloop(){

  KeyDetect();
	testUnit.update();
	stage.update();
}
function createSpritesSheets(){

	this.explosion = new createjs.SpriteSheet({
		"images": ["resources/imgs/explodePlayer.png"],
		"frames": {"height": 125,"width": 128},
		"animations": {explode: {frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],next: false,speed: 0.5}}
	});
  this.bloodExplosion = new createjs.SpriteSheet({
		"images": ["resources/imgs/blood2.png"],
		"frames": {"height": 128,"width": 128},
		"animations": {explode: {frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],next: false,speed: 0.5}}
	});
  this.unitWalking = new createjs.SpriteSheet({
    "images":["resources/imgs/archerWalk.png"],
    "frames":{"height":128,"width":108},
    "animations": {
      moveAnimation: {frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],next: false,speed: 0.5}
    }
  });
	this.unit = new createjs.SpriteSheet({
    "images":["resources/imgs/archerStanding.png"],
    "frames":{"height":128,"width":72, "count":5},
    "animations": {
      stand: 0,
      walkR:{frames:[0,1,2,3,4],next: "walkR",speed: 0.2},
      walkL: {frames:[0,1,2,3,4],next: "walkL",speed: 0.2}
    }
  });
}

function armyClass(amount,numPlayer){
  var x=+(WIDTH/10)+50;
	var y=HEIGHT-50;

	var width=32;
	var height=32;
	var playerSprite=spritesheets.player;
	var damage;
	var z=Math.random()*WIDTH;
	var speed=10;
	var left;
	var right;
	var firing=false;
	var firingTimer=new Date().getTime();
	var firingDelay=300;
	var elapsed;
	var lives=1;
	var proyectilSize=1;
	var proyectilDamage=1;
	var angle=270;
  var size = amount;
  var unitsArray = Array();

  for(var i = 0; i < size; i++){
    var unit = new unitClass();
    unit.x =(WIDTH/100)+(i*50);
    unit.y = HEIGHT-50;
    unitsArray[i] = unit;
  }

  this.update=function(){

		if (left) {
			dx = -speed;
			left=false;
		}

		if (right) {
			dx = speed;
			right=false;
		}
		if (firing){

			firing=false;
		}
	}
	this.proyectilsNormal=function(){

	}
  this.getSize = function(){
    return size;
  }
  this.setLeft=function(b) {
		left = b;
	}
	this.setRight=function( b) {
		right = b;
	}
}
function unitClass(numP){
	var dx=0;
	var dy=0;
	var width=12;
	var height=32;
  var x=WIDTH-(WIDTH-15);
  var y=HEIGHT-128;
	var shield=10;
	var damage;
	var dead=false;
	var z=Math.random()*WIDTH;
	var state="live";
	var speed=10;
	var soundPlayerDie;
	var left;
	var right;
	var up;
	var down;
	var firing=false;
	var firingTimer=new Date().getTime();
	var firingDelay=300;
	var elapsed;
	var lives=1;
	var maxProyectils=3;
	var proyectilSize=1;
	var proyectilDamage=1;
	var doubleProyectile=false;
	var tripleProyectile=false;
	var angle=270;
	var unit = new createjs.Sprite(spritesheets.unit);
  unit.gotoAndPlay("walkL");
	unit.x =x;
	unit.y = y;
	stage.addChild(unit);
  this.update=function(){
    if(left||right){
      if (left) {
        dx = -speed;
      }
      if (right) {
        dx = speed;
      }
      x += dx;
      if (x < 0)
        x = 0;
      if (x > WIDTH - width)
        x = WIDTH- width;
      dx = 0;
      //Asignamos nuevas coordenadas
      unit.x=x;

      if(kDown == false){
        unit.gotoAndPlay("walkR");
        console.log("kdown false")
        kDown = true;
      }
    }else{
      unit.gotoAndStop("walkR");
    }

  }



	this.setLeft=function(b) {
		left = b;
	}
	this.setRight=function(b) {
		right = b;
	}
	this.getX=function(){
		return x;
	}
	this.getY=function(){
		return y;
	}
  this.setX=function(a){
		 x = a;
	}
	this.setY=function(a){
		y= a;
	}
	this.getWidth=function(){
		return width;
	}
	this.getHeight=function(){
		return height;
	}
  this.setWidth=function(a){
		width=a;
	}
	this.setHeight=function(a){
		height=a;
	}

	this.getUnit=function(){
		return unit;
	}
	this.hit=function(value){
		shield-=value;

		var h=createjs.Sound.play("arrowHit");
		h.volume = 1;
		if (shield <= 0)
			dead = true;
	}

	this.isDead=function(){
		return dead;
	}
	this.removeFromStage=function(){
		stage.removeChild(player);
	}
	this.explode=function(){
		var unitDied= new createjs.Sprite(playerDieSprite, "explode");
		unitDied.x=x;
		unitDied.y=y;
		unitDied.play();
		stage.addChild(unitDied);
		soundUnitDie=createjs.Sound.play("boom");
		soundUnitDie.volume = 1;
		soundUnitDie.on("complete", remove=function(){stage.removeChild(playerDied);}, this);
	}
}
function KeyDetect(){
	if (PRESSING[39]){
    testUnit.setRight(true);
  }else{
    testUnit.setRight(false);
  }

    if (PRESSING[37]){
      testUnit.setLeft(true);
    }else {
      testUnit.setLeft(false);
    }

    if (PRESSING[40])
        // army.setDown(true);
    if (PRESSING[38])
		  // army.setUp(true);
	if (PRESSING[32])
        player.setFiring(true);
	if (PRESSING[13])
		createjs.Ticker.paused = pause;
}
