window.onload=init;
var canvas;
var stage;
var queue;
var index=0;
var WIDTH=0;
var HEIGHT=0;
var player;
var stars;
var enemies;
var items;
var proyectils;
var enemyProyectils;
var backgroundMusic;
var amount_enemies=200;
var amount_stars=50;
var PRESSING=[];
var pressed=false;
var endGame=false;
var  backgroundMusic;
var textInfo;
var maxEnemies=10;
var level=-1;
var N=1;
var mult=1.2;
var rankEnemy=-1;
var wave;
var startTime=0;
var endTime=0;
var timeElapsed=5000;
var ready=false;
var waveNotLoaded=true;
 
function init(){
	canvas =document.getElementById('canvas');
	console.log("Running...");
	canvas.style.backgroundColor = "#000000";
	WIDTH=canvas.width;
	HEIGHT=canvas.height;
	
	stage = new createjs.Stage("canvas");
	queue = new createjs.LoadQueue(false);
	queue.installPlugin(createjs.Sound);
	
	queue.loadManifest([
	{id:"player", src:"resources/img/player.png"}, 
	{id:"shot", src:"resources/mp3/shot1.mp3"},
	{id:"laser", src:"resources/img/laser.png"},
	{id:"stage1", src:"resources/mp3/01.mp3"},
	{id:"enemyType1", src:"resources/img/havoc_zone___cerberus_by_squirrelsquid.gif"},
	{id:"boom", src:"resources/mp3/explosion.mp3"},
	{id:"hit", src:"resources/mp3/hitEnemy.wav"},
	{id:"pick", src:"resources/mp3/pickItem.wav"},
	{id:"enemyBullet", src:"resources/img/enemyBullet.png"}]);
	spritesheets= new createSpritesSheets();
	queue.addEventListener("complete", run);

	var rect = new createjs.Shape();
//	beginStroke("red").beginFill("blue").drawRect(20, 20, 100, 50);
	rect.graphics.beginFill("#000000").drawRect(0, 0, WIDTH,HEIGHT/20);
	stage.addChild(rect);
	stage.setChildIndex(rect,index++);
}


function run(){
	console.log("Loaded...");
	textInfo=new playerInfoClass();
	backgroundMusic = createjs.Sound.play("stage1" ,createjs.Sound.INTERRUPT_ANY, 0, 0, -1, 1, 0);
	player= new playerClass();
	stars=new Array();
	
	for (var i = 0; i < amount_stars; i++) 
		stars[i]=new star();

	proyectils= new Array();
	enemies=new Array();
	wave=new waveGenerator();
	items=new Array();
	enemyProyectils=new Array();
	createjs.Ticker.addEventListener("tick", gameloop);
	createjs.Ticker.setFPS(60);
	startTime=new Date().getTime();

}


var timeTranscurred=0;


function gameloop(){
	//console.log("proeyctiles en memoria: "+proyectils.length);
	if(enemies.length > 0 )
		startTime=new Date().getTime();
	if( !ready && enemies.length == 0 ){
		endTime=new Date().getTime();
		timeTranscurred=(endTime-startTime);
		console.log(timeTranscurred);
		if(timeTranscurred >=timeElapsed){
			console.log("elements on stage: "+stage.getNumChildren());
			ready=true;
			timeTranscurred=0;
		}
	}
	stage.update();
	textInfo.update();
	if(!endGame){
		if(enemies.length == 0 && ready)	
			wave.generate();
		gameUpdate();			
		KeyDetect();
	}else{
		backgroundMusic.stop();
	}
	stage.update();
}

function proyectilClass(angle1,coordx,coordy,size){
	var x=coordx;
	var y=coordy;
	var angle=angle1;
	var speed=10;
	var rad=angle*Math.PI / 180;
	var dx = Math.cos(rad) * speed;
	var dy = Math.sin(rad) * speed;
	var eliminate=false;
	var proyectil = new createjs.Bitmap(queue.getResult("laser"));
	
	proyectil.x = x;
	proyectil.y = y;
	stage.addChild(proyectil);
	stage.setChildIndex(proyectil,index++);
	shot=createjs.Sound.play("shot");
	shot.volume = 0.1;
	proyectil.scaleX=size;
	proyectil.scaleY=size;
	
	this.update=function(){
		x += dx;
		y += dy;
		proyectil.x = x;          
		proyectil.y = y;
		if(eliminate)
			return true;
		
		if (x < 0 || x > WIDTH || y < 0 || y > HEIGHT ) {
			stage.removeChild(proyectil);
			stage.update();	
			return true;
		}
		return false;
	}
	
	this.getProyectil=function(){
		return proyectil;
	}
	
	this.removeFromStage=function(){
		eliminate=true;
		stage.removeChild(proyectil);
	}
}





function enemyProyectilClass(angle1,coordx,coordy,size){
	var x=coordx;
	var y=coordy;
	var angle=angle1;
	var speed=10;
	var rad=angle*Math.PI / 180;
	var dx = Math.cos(rad) * speed;
	var dy = Math.sin(rad) * speed;
	var eliminate=false;

	var proyectil = new createjs.Bitmap(queue.getResult("enemyBullet"));
	proyectil.x = x;
	proyectil.y = y;
	stage.addChild(proyectil);

	
	
	proyectil.scaleX=size;
	proyectil.scaleY=size;
	
	this.update=function(){
		x += dx;
		y += dy;
		proyectil.x = x;          
		proyectil.y = y;
		if(eliminate)
			return true;
		
		if (x < 0 || x > WIDTH  || y > HEIGHT ) {
			stage.removeChild(proyectil);
			stage.update();	
			return true;
		}
		return false;
	}

	this.getProyectil=function(){
		return proyectil;
	}
	this.removeFromStage=function(){
		eliminate=true;
		stage.removeChild(proyectil);
	}
}

/*clase estrella*/
function star () {
	var speed=2;
	var x=Math.random()*WIDTH;
	var y=Math.random()*HEIGHT;
	var dy=speed;
	var star = new createjs.Shape();
	star.graphics.beginFill("#ffffff").drawCircle(0, 0, 1);
	star.x = x;
	star.y = y;
	stage.addChild(star);
	stage.setChildIndex(star,index++);
	this.update=function(){
		y+=dy;
		if (y >= HEIGHT) {
			x = Math.random() * WIDTH;
			y = 0;
		}
		star.x = x;
		star.y = y;
	}
}



function playerClass(type,rank){
	
	var x=+(WIDTH/10)+50;
	var y=HEIGHT-50;
	var dx=0;
	var dy=0;
	var width=32;
	var height=32;
	var shield=10;
	var damage;
	var dead=false;
	var z=Math.random()*WIDTH;
	var state="live";
	var dieSprite = spritesheets.explosion;
	var liveSprite;
	var speed=10;
	var playerSprite=spritesheets.player;
	var playerDieSprite=spritesheets.explosion2;
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
	var player = new createjs.Sprite(playerSprite, "moveAnimation");
	
	player.x =x;
	player.y = y;
	player.play();
	stage.addChild(player);
	
	this.getShield=function(){
		return shield;
	}
	
	this.getLives=function(){
		return lives;
	}
	
	this.setShield=function(value){
		shield+=value;
		if(shield >100)
			shield=100;
	}
	this.setSpeed=function(){
		if(speed++ > 15)
		speed=15;
	}
	this.setDoubleProyectile=function(b){
		doubleProyectile=b;
		tripleProyectile=false;
	}
	this.setTripleProyectile=function(b){
		tripleProyectile=b;
		doubleProyectile=false;
	}
	this.setProyectilDamage=function(){
		if(proyectilDamage++ > 50)
			proyectilDamage=20;
	}
	this.setProyectilSize=function(){
		proyectilSize=2;
	}
	this.setMaxProyectils=function(value){
		maxProyectils=value;
	}
	this.setFiringDelay=function(value){
		firingDelay=value;
	}
	this.update=function(){
		if(dead){
			this.explode();
			this.removeFromStage();
			dead=false;
			return true;
		}
		
		if (left) {
			dx = -speed;
			left=false;
		}
		if (right) {
			dx = speed;
			right=false;
		}
			
		if (up) {
			dy = -speed;
			up=false;
		}
			
		if (down) {
			dy = speed;
			down=false;
		}
		
		x += dx;
		y += dy;
		console.log("x: "+x+"y: "+y);
		
		if (x < 0)
			x = 0;
		if (y < 0)
			y = 0;
		if (x > WIDTH - width)
			x = WIDTH- width;
		if (y > HEIGHT - height)
			y = HEIGHT - height;
		dx = 0;
		dy = 0;
		
		//Asignamos nuevas coordenadas			
		player.x=x;
		player.y=y;
		
		if (firing){
			elapsed=new Date().getTime()-firingTimer;
			if (elapsed > firingDelay) {
				if(proyectils.length<maxProyectils){
					if(!doubleProyectile&&!tripleProyectile)
						this.proyectilsNormal();
					if(doubleProyectile)	
						this.proyectilsDouble();
					if(tripleProyectile)				
						this.proyectilsTriple();
				}
				firingTimer=new Date().getTime();
			}
			firing=false;
		}
	}
	this.proyectilsNormal=function(){
		proyectils.push(new proyectilClass(angle, x+width/2.5 , y - height/2,proyectilSize));
	}
	this.proyectilsDouble=function(){
		proyectils.push(new proyectilClass(angle+20, x+width/2.5 , y - height/2,proyectilSize));
		proyectils.push(new proyectilClass(angle-20, x+width/2.5 , y - height/2,proyectilSize));
	}
	this.proyectilsTriple=function(){
		proyectils.push(new proyectilClass(angle, x+width/2.5 , y - height/2,proyectilSize));
		proyectils.push(new proyectilClass(angle-20, x+width/2.5 , y - height/2,proyectilSize));
		proyectils.push(new proyectilClass(angle+20, x+width/2.5 , y - height/2,proyectilSize));
	}
	
	this.setLeft=function(b) {
		left = b;
	}
	this.setRight=function( b) {
		right = b;
	}
	this.setUp=function( b) {
		up = b;
	}
	this.setDown=function( b) {
		down = b;
	}
	this.setFiring=function(b) {
		firing = b;
	}
	
	this.getX=function(){
		return x;
	}
	this.getY=function(){
		return y;
	}
	this.getWidth=function(){
		return width;
	}
	this.getHeight=function(){
		return height;
	}
	
	this.getPlayer=function(){
		return player;
	}
	this.hit=function(value){
		shield-=value;

		var h=createjs.Sound.play("hit");
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
		var playerDied= new createjs.Sprite(playerDieSprite, "explode");
		playerDied.x=x;
		playerDied.y=y;
		playerDied.play();
		stage.addChild(playerDied);
		soundAlienDie=createjs.Sound.play("boom");
		soundAlienDie.volume = 1;	
		soundAlienDie.on("complete", remove=function(){stage.removeChild(playerDied);}, this);
	}
}

function enemyClass(type,rank,mult,N){
	var x=0;
	var y=0-Math.random()*(N*HEIGHT);
	var dx=0;
	var dy=(Math.random())+0.1;
	var width=64;
	var height=64;
	var spritesheet;
	var health=0;
	var damage=0;
	var dead=false;
	var z=Math.random()*WIDTH;
	var state="live";
	var dieSprite = spritesheets.explosion;
	var liveSprite;
	var alien;
	var soundAlienDie;
	var speed=1;
	var maxProyectils=1;
	var shootDelay=3000;
	var init=new Date().getTime();
	var end=0;
	var angle=90;
	var doubleProyectile=false;
	var tripleProyectile=false;
	
	this.shoot=function(){
		end=new Date().getTime();
		if(end-init > shootDelay){
			//console.log("disparo..");
			if(enemyProyectils.length<maxProyectils){
				if(!doubleProyectile&&!tripleProyectile)
					this.proyectilsNormal();
				if(doubleProyectile)
					this.proyectilsDouble();
				if(tripleProyectile)		
					this.proyectilsTriple();
			}
			init=end;
		}
	}

	this.proyectilsNormal=function(){
		enemyProyectils.push(new enemyProyectilClass(angle, x+width/2.5 , y + height/2,0.8));
	}
	this.proyectilsDouble=function(){
		enemyProyectils.push(new enemyProyectilClass(angle+20, x+width/2.5 , y - height/2,3));
		enemyProyectils.push(new enemyProyectilClass(angle-20, x+width/2.5 , y - height/2,3));
	}
	this.proyectilsTriple=function(){
		enemyProyectils.push(new enemyProyectilClass(angle, x+width/2.5 , y - height/2,3));
		enemyProyectils.push(new enemyProyectilClass(angle-20, x+width/2.5 , y - height/2,3));
		enemyProyectils.push(new enemyProyectilClass(angle+20, x+width/2.5 , y - height/2,3));
	}
	this.hit=function(){
		health--;
		var h=createjs.Sound.play("hit");
		h.volume = 1;
		if (health <= 0) 
			dead = true;
	}
	this.isDead=function(){
		return dead;
	}
	this.getX=function(){
		return x;
	}
	this.getY=function(){
		return y;
	}
	this.getWidth=function(){
		return width;
	}
	this.getHeight=function(){
		return height;
	}
	this.createEnemy=function(rank){
		switch(rank){
			case 0:	
				speed=1;
				health=1;
				maxProyectils=9;
				//tripleProyectile=true;
			break;
			
			case 1:
				speed=1;
				health=5;
				maxProyectils=9;
				//tripleProyectile=true;
			break;
			
			case 2:
				speed=1;
				health=10;
				maxProyectils=9;
				//tripleProyectile=true;
			break;
			case 3:
				speed=1;
				health=12;
				maxProyectils=9;
				//doubleProyectile=true;
			break;
			case 4:
				speed=2;
				health=15;
				maxProyectils=9;
				//tripleProyectile=true;
			break;
			case 5:
			maxProyectils=9;
				speed=2;
				health=20;
				//tripleProyectile=true;
			break;
			default:
			break;
		}
	}
	switch(type){
		case 0:	
		liveSprite = spritesheets.alien0;
		this.createEnemy(rank);
		break;
		
		case 1:
		liveSprite = spritesheets.alien1;
		this.createEnemy(rank);
		break;
		
		case 2:
		liveSprite = spritesheets.alien2;
		this.createEnemy(rank);
		break;
		
		case 3:
		liveSprite = spritesheets.alien3;
		this.createEnemy(rank);
		break;
		
		case 4:
		liveSprite = spritesheets.alien4;
		this.createEnemy(rank);
		break;
		
		case 5:
		liveSprite = spritesheets.alien5;
		this.createEnemy(rank);
		break;
		case 6:
		liveSprite = spritesheets.alien6;
		this.createEnemy(rank);
		break;
		case 7:
		liveSprite = spritesheets.alien7;
		this.createEnemy(rank);
		break;
		case 8:
		liveSprite = spritesheets.alien8;
		this.createEnemy(rank);
		break;
		case 9:
		liveSprite = spritesheets.alien9;
		this.createEnemy(rank);
		break;
		default:
		break;
	}
	alien= new createjs.Sprite(liveSprite, "moveAnimation");	
	alien.x = x;
	alien.y = y;
	alien.play();
	stage.addChild(alien);
	stage.setChildIndex(alien,index++);
	this.inside=function(){
		if(y>(HEIGHT)){
			stage.removeChild(alien);
			stage.update();	
			return false;
		}
		return true;
	}
	
	this.update=function(){
		this.moving(0);
		alien.x = x;
		alien.y = y;
		this.shoot();
		if(!this.inside())
			return true;
		if(dead){
			textInfo.scoreUpdate(1);
			this.removeFromStage();
			this.explode();
			return true;
		}	
		return false;
	}

	this.moving=function(move){
		switch(move){
			case 0:	
			y+=speed;
			x = z-(Math.sin(y/20)*120);
			break;
			default:
			break;
		}
	}


	this.getEnemy=function(){
		return alien;
	}
	
	this.explode=function(){
		var alienDied= new createjs.Sprite(dieSprite, "explode");
		alienDied.x=x;
		alienDied.y=y;
		alienDied.play();
		stage.addChild(alienDied);
		//stage.setChildIndex(alienDied,index++);
		soundAlienDie=createjs.Sound.play("boom");
		soundAlienDie.volume = 1;		
		soundAlienDie.on("complete", remove=function(){stage.removeChild(alienDied);}, this);
	}
	this.removeFromStage=function(){
		/*item drop*/
		if(Math.random()>0.9)
		items.push(new itemClass(0,x,y));
		stage.removeChild(alien);
	}
}


function createSpritesSheets(){
	this.item1 = new createjs.SpriteSheet({
		"images": ["resources/img/item1.png"],
		"frames": {"height": 32, "width": 36},
		"animations": {moveAnimation: {frames:[0,1,3],speed:0.1}}
	});
	
	this.player = new createjs.SpriteSheet({
		"images": ["resources/img/p1.png"],
		"frames": {"height": 32, "width": 32},
		"animations": {moveAnimation: {frames:[0,1,3],speed:0.1}}
	});
	
	this.explosion = new createjs.SpriteSheet({
		"images": ["resources/img/explode.png"],
		"frames": {"regX": 0, "height": 64, "count": 16, "regY": 0, "width": 64},
		"animations": {explode: {frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],next: false,speed: 0.5}}
	});
	
	this.explosion2 = new createjs.SpriteSheet({
		"images": ["resources/img/explodePlayer.png"],
		"frames": {"height": 128,"width": 128},
		"animations": {explode: {frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],next: false,speed: 0.5}}
	});
	
	this.alien0 = new createjs.SpriteSheet({
		"images": ["resources/img/enemy0.png"],
		"frames": {"height": 40,"width": 32},
		"animations": {moveAnimation:{frames: [0,1,2,3,4,5,6,7,8],speed:0.5}}
	});
	
	this.alien1 = new createjs.SpriteSheet({
		"images": ["resources/img/enemy1.png"],
		"frames": {"height": 64,"width": 64},
		"animations": {moveAnimation:{frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,
		30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63],speed:0.1}}
	});
	
	this.alien2 = new createjs.SpriteSheet({
		"images": ["resources/img/enemy2.png"],
		"frames": {"height": 64,"width": 64},
		"animations": {moveAnimation:{frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],speed:0.1}}
	});

	this.alien3 = new createjs.SpriteSheet({
		"images": ["resources/img/enemy3.png"],
		"frames": {"height": 128,"width": 64},
		"animations": {moveAnimation:{frames: [0,1,2,3,4,5,6,7,8,9],speed:0.1}}
	});
	
	
	this.alien4 = new createjs.SpriteSheet({
		"images": ["resources/img/enemy4.png"],
		"frames": {"height": 64,"width": 72},
		"animations": {moveAnimation:{frames: [0,1,2,3,4,5,6,7,8,9,11,12,13,15,16,17,19],speed:0.1}}
	});
	
	this.alien5 = new createjs.SpriteSheet({
		"images": ["resources/img/enemy5.png"],
		"frames": {"height": 32,"width": 64},
		"animations": {moveAnimation:{frames: [0,1,2,3,4,5,6,7,8],speed:0.1}}
	});
	
	this.alien6 = new createjs.SpriteSheet({
		"images": ["resources/img/enemy5.png"],
		"frames": {"height": 32,"width": 64},
		"animations": {moveAnimation:{frames: [0,1,2,3,4,5,6,7,8],speed:0.1}}
	});
	
	this.alien7 = new createjs.SpriteSheet({
		"images": ["resources/img/enemy5.png"],
		"frames": {"height": 32,"width": 64},
		"animations": {moveAnimation:{frames: [0,1,2,3,4,5,6,7,8],speed:0.1}}
	});
	
	this.alien8 = new createjs.SpriteSheet({
		"images": ["resources/img/enemy5.png"],
		"frames": {"height": 32,"width": 64},
		"animations": {moveAnimation:{frames: [0,1,2,3,4,5,6,7,8],speed:0.1}}
	});
	
	
	this.alien9 = new createjs.SpriteSheet({
		"images": ["resources/img/enemy5.png"],
		"frames": {"height": 32,"width": 64},
		"animations": {moveAnimation:{frames: [0,1,2,3,4,5,6,7,8],speed:0.1}}
	});
}



function collisionDetection(bitmap1,bitmap2){
	//var collision = ndgmr.checkRectCollision(bitmap1,bitmap2);
	//var collision = ndgmr.checkPixelCollision(bitmap1,bitmap2,0.2);
	return ndgmr.checkPixelCollision(bitmap1,bitmap2,0.2);;
}

//Funcion encargada de detectar si se pulsan las flechas o la barra	 del teclado	
function KeyDetect(){
	if (PRESSING[39])
         player.setRight(true);
    if (PRESSING[37])
        player.setLeft(true);
    if (PRESSING[40])
        player.setDown(true);
    if (PRESSING[38])
		player.setUp(true);
	if (PRESSING[32])
        player.setFiring(true);
	if (PRESSING[13])
		createjs.Ticker.paused = pause;
}
//Listeners para poder escuchar las pulsaciones
		
//tecla presionada
document.addEventListener('keydown', function(eve) {
	lastPress = eve.keyCode;
	PRESSING[eve.keyCode] = true;
}, false);
		
//tecla soltada
document.addEventListener('keyup', function(eve) {
	PRESSING[eve.keyCode] = false;
}, false);
	
function gameUpdate(){	
	var enemiesLength=enemies.length;
	var proyectilsLength=proyectils.length;

	if(enemiesLength>maxEnemies)
		enemiesLength=maxEnemies;
	for(var i=0;i<items.length;i++){
		if(items[i].update()){
		items[i].removeFromStage();
		items.splice(i,1);}
	}
	if(player.update())
		endGame=true;

	for (var i = 0; i < enemyProyectils.length; i++){
		if(enemyProyectils[i].update(i)){
		stage.removeChild(enemyProyectils[i].getProyectil());
		enemyProyectils.splice(i--, 1);
		}
	}
	for (var i = 0; i < enemiesLength; i++){
		if(enemies[i].update(i)){
			enemies.splice(i--,1);
			enemiesLength-=1;
		}
	}
	for (var i = 0; i < amount_stars; i++) 
		stars[i].update();	
	for (var i = 0; i < enemiesLength; i++) {
		if(collisionDetection(enemies[i].getEnemy(),player.getPlayer()))	
			player.hit(player.getShield());
		for(var j=0;j<proyectilsLength;j++){
			if(collisionDetection(proyectils[j].getProyectil(),enemies[i].getEnemy())){	
				proyectils[j].removeFromStage();
				enemies[i].hit();
			}
		}
	}

	for(var i=0;i<items.length;i++){
		if(collisionDetection(items[i].getItem(),player.getPlayer())){
			items[i].removeFromStage();
			items.splice(i,1);
		}
	}

	for (var i = 0; i < proyectilsLength; i++){
		if(proyectils[i].update(i)){
			stage.removeChild(proyectils[i].getProyectil());
			proyectils.splice(i--, 1);
			proyectilsLength-=1;
		}
	}
	for (var i=0;i<enemyProyectils.length;i++){
		if(collisionDetection(enemyProyectils[i].getProyectil(),player.getPlayer())){
			enemyProyectils[i].removeFromStage();
			player.hit(1);
		}
	}
}	
	
function waveGenerator(){
		
	var mtype=-1;
	var n=10;
	var c=1;
	var b=10;
	var d=0.2;
	var enemycant=0;
	var cant=0;
	this.generate=function(){
		
		if(waveNotLoaded && enemies.length == 0 ){
		console.log("wave starting...");
		level++;
		console.log("Nivel: "+level);
		textInfo.newLevelMessage();
		
		
		if(level % 10==0)
			N++;
		if(level % 2 == 0)
		{
		mtype+=3;
			if(mtype>9)
				mtype=9;
		rankEnemy++;
		}
		
		if(level % b == 0)
		{
			mult+=d;
		}
		
		enemycant=n+(level*c);
		
		
		if(enemycant>100)
			enemycant=100;
			console.log("enemigos generados "+enemycant);
			
		}
			
		if(enemies.length == 0 && enemycant>0 ){
			enemies.length=0;
			if(enemycant > maxEnemies)
				cant=maxEnemies;
			else
				cant=enemycant;
			
			for(var i=0;i<cant;i++)
				enemies[i]= new enemyClass(Math.floor((Math.random() * (mtype+1)) ),rankEnemy,mult,N);
			enemycant-=cant;
			console.log("enemys on memory: "+enemies.length+" enemigos restantes: "+enemycant);
		}
		if(enemycant <= 0 ){
			ready=false;
			waveNotLoaded=true;
		}else
			waveNotLoaded=false;
	}	
}

function itemClass(id=0,coordx=0,coordy=0){
	var x=coordx;
	var y=coordy;
	var itemSprite=spritesheets.item1;
	var item = new createjs.Sprite(itemSprite, "moveAnimation");
	item.x=x;
	item.y=y;
	item.play();
	stage.addChild(item);
	switch(id){
		case 0:
		break;
		
		case 1:
		break;
		
		case 2:
		break;
		
		case 3:
		break;
	}
	this.update=function(){
		item.y=y++;
		if(y>HEIGHT)
			return true;
		return false;
	}
	this.removeFromStage=function(){
		var sound=createjs.Sound.play("pick");
		sound.volume = 1;	
		player.setShield(1);
		player.setMaxProyectils(9);
		player.setFiringDelay(100);
		player.setTripleProyectile(true);
		stage.removeChild(item);	
	}
	this.getItem=function(){
		return item;
	}
}

function playerInfoClass(){
	var scorePoints=0;
	var lives=1;
	var shield=10;
	var x=WIDTH;
	var y=15;
	
	var Text = new createjs.Text("Score: "+scorePoints+"	 Shield:"+shield+"	Lives: "+lives, "20px Arial", "#ffffff");
	Text.x = x;
	Text.y= y;
	Text.textBaseline = "alphabetic";
	stage.addChild(Text);
	
	var Text1 = new createjs.Text("Level "+level,"20px Arial", "#ffffff");
	Text1.x = WIDTH;
	Text1.y= HEIGHT/2;
	Text1.textBaseline = "alphabetic";
	stage.addChild(Text1);
	
	var Text2 = new createjs.Text("GAME OVER","60px Arial", "#ffffff");
	Text2.x = WIDTH/4;
	Text2.y= HEIGHT/2;
	Text2.textBaseline = "alphabetic";
	stage.addChild(Text2);
	Text2.alpha=0;
	var z=WIDTH/2;
	var a=0;
	var alfa=1;
	var MessageNewLevel=false;
		
	this.scoreUpdate=function(points){
		scorePoints=scorePoints + points;
	}
	this.update=function(){
		if(!endGame){
			if(MessageNewLevel)
			this.LevelMessage();
			Text1.text="Level "+level;
			shield=player.getShield();
			lives=player.getLives();
			Text.text="Score: "+scorePoints+"     Shield:  "+shield+"   Lives: "+lives;
			if(x>0)
			Text.x=x-=5;
		}else
			this.gameOverMessage();
	}
	this.LevelMessage=function(){
		if(a<100){
			a+=0.1;
			Text1.setTransform(z, HEIGHT/2, a, a);
			Text1.alpha=alfa-=0.01;
			Text1.x=z-=4;
		}else{
			Text1.setTransform(0, 0, 1, 1);
			a=0;
			MessageNewLevel=false;
			z=WIDTH/2;
			alfa=1;
		}
	}
	this.newLevelMessage=function(){
			MessageNewLevel=true;
	}
	this.gameOverMessage=function(){
		Text1.alpha=0;
			if(alfa < 0)
				alfa=1;
			alfa-=0.01;
			Text2.alpha=alfa;
	}	
}