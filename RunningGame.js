var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
/*function drawCircle() {
    ctx.beginPath();
    ctx.arc(95,95,95,95,95*Math.PI);
    ctx.stroke();
}*/

var RUNNING = 0;
var JUMPING = 1;
var COINAUDIOBUFFER = 5;
var BASE_WIDTH = 600;
var BASE_HEIGHT = 400;
var backgroundX = 0;
var score = 0;
var level = 1; 
var speed = 6;
var endGame = false;

var themeMusicPlaying = false;

var audioCoin = new Audio('audio/smb_coin.wav');
var audioJump = new Audio('audio/smb_jump-small.wav'); 
var audioThemeMusic = new Audio('audio/themeMusic.mp3'); 

var mediaSource = "http://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv"



var createCoinAudios = function() {

	var coinAudios = [];
	for (i = 0; i < COINAUDIOBUFFER; i++) {
		// Create sprite
		coinAudios.push( new Audio('audio/smb_coin.wav') );  
	}	
	return coinAudios;
}

var coinAudioNum = 0;
var myAudioCoins = createCoinAudios();

function playCoinAudio() {
	//coinAudioNum = (coinAudioNum+ 1) % COINAUDIOBUFFER;
	//myAudioCoins[coinAudioNum].play();
	audioCoin.play();
}

var translateDrawX = function(baselineX) {
	ratio = canvas.width/BASE_WIDTH;
	newX = baselineX * ratio;
	console.log('x '+ baselineX + ' newX =' + newX + 'canvas width ' + canvas.width + ' ratio ' + ratio);
	return (newX);
 }
 
 var translateDrawY = function(baselineY) {
	ratio = canvas.height/BASE_HEIGHT;
	newY = baselineY * ratio;
	console.log('y '+ baselineY + ' newY =' + newY + 'canvas height ' + canvas.height + ' ratio ' + ratio);
	return (newY);
 }
 
function myDrawImage (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
	ctx.drawImage(image, 
		sx, 
		sy, 
		sWidth, 
		sHeight, 
		translateDrawX(dx), // Translating for window size from BASE coordinates
		canvas.height - translateDrawY(dy) - translateDrawY(dHeight), // translating so zero is at the bottom of the screen
		translateDrawX(dWidth), // Translating for window size from BASE coordinates
		translateDrawY(dHeight) // Translating for window size from BASE coordinates
	);
	
}

var isIntercecting = function(obj1, obj2) {
  if (obj1.x < obj2.x + obj2.width && obj2.x < obj1.x + obj1.width && obj1.y < obj2.y + obj2.height) {
//    	console.log("Hit function");
    return obj2.y < obj1.y + obj1.height;
  } else
    return false;
}

function Level(options) {
	this.speed = options.speed;
	this.coins = options.coins;
	this.length = 4000;
}

Level.prototype.update = function() {
	this.length = this.length - this.speed;
	if (this.length < 0) {
		level += 1;
//	    console.log("levels.length " + levels.length + " level " + level);
		if (level > levels.length) {
			endGame = true;
		} else {
			speed = levels[level-1].speed;
		}
	}
}



function sprite (options) {
	this.frameIndex = 0,
	this.tickCount = 0,
	this.ticksPerFrame = options.ticksPerFrame || 0,
	this.numberOfFrames = options.numberOfFrames || 1;
	this.context = options.context;
	this.width = options.width;
	this.height = options.height;
	this.image = options.image;
	this.x = options.x;
	this.y = options.y;
	this.imageWidth = options.imageWidth;
	this.imageHeight = options.imageHeight;
	// New Properties
	this.moveMode = RUNNING; 
    this.jumpStartY = 50;
    this.jumpIncrements = -30;
    this.jumpIncrement = this.jumpIncrements;
    this.jumpHeight = 130;
}

sprite.prototype.startJumping = function() {
	if (this.moveMode != JUMPING) {
		this.moveMode = JUMPING;
		this.jumpStartY = this.y;
		audioCoin.play();
	}
};


sprite.prototype.update = function() {

    if (this.moveMode === JUMPING) {
        //ohStartY -= jumpSpeed;
        this.jumpIncrement+=1;
        var myY = (-1 * (this.jumpHeight/(this.jumpIncrements*this.jumpIncrements)) * (this.jumpIncrement*this.jumpIncrement) + this.jumpHeight);
        this.y = myY + this.jumpStartY;
        //console.log("jumpIncrement " + this.jumpIncrement + " " + myY);
        if (this.jumpIncrement >= Math.abs(this.jumpIncrements)){
            //jumpSpeed = jumpSpeed * -1;
            this.moveMode = RUNNING;
            this.jumpIncrement = this.jumpIncrements;
        }
        
    }

	// Update animation frame 
	this.tickCount += 1;

	if (this.tickCount > this.ticksPerFrame) {

		this.tickCount = 0;

		// If the current frame index is in range
		if (this.frameIndex < this.numberOfFrames - 1) {	
			// Go to the next frame
			this.frameIndex += 1;
		} else {
			this.frameIndex = 0;
		}
	}
};


sprite.prototype.render = function() {
      // Draw the animation
	myDrawImage(
        this.image,
        (this.frameIndex * this.imageWidth / this.numberOfFrames) ,
        0,
        (this.imageWidth / this.numberOfFrames)   ,
        this.imageHeight,
        this.x,
        this.y,
        this.width,
		this.height
	);
};

function backgroundSprite (options) {
  sprite.call(this, options);
}

backgroundSprite.prototype = Object.create(sprite.prototype);
backgroundSprite.prototype.constructor = backgroundSprite;

backgroundSprite.prototype.update = function() {
      // Draw the animation
      this.x = this.x - speed;
	sprite.prototype.update.call(this);

};

var groundImage = new Image();
groundImage.src = "images/Ground.jpg";
 
var coinImage = new Image();
coinImage.src = "images/coin-sprite-animation.png";

var runningImage = new Image();
runningImage.src = "images/Running animation test (1).png"

var baseLevelY = 70;
var coords = [
  				{x: 400, y: baseLevelY + 0},
				{x: 650, y: baseLevelY + 0},
				{x: 655, y: baseLevelY + 0},
				{x: 660, y: baseLevelY + 0},
				{x: 670, y: baseLevelY + 0},
				{x: 800, y: baseLevelY + 0},
				{x: 1200, y: baseLevelY + 100},
				{x: 1550, y: baseLevelY + 100},
				{x: 1800, y: baseLevelY + 50},
				{x: 2250, y: baseLevelY + 50},
				{x: 2800, y: baseLevelY + 100},
				{x: 3550, y: baseLevelY + 100},
			 ];


var createCoins = function(coords) {

	var coins = [];
	for (var i in coords) {
		// Create sprite
		coins.push( new backgroundSprite({
			context: canvas.getContext("2d"),
			width: 30,
			height: 30,
			image: coinImage,
			numberOfFrames: 10,
			ticksPerFrame: 4,
			imageWidth: 1000,
			imageHeight: 100,
			x: coords[i].x,
			y: coords[i].y
		}));  
	}	
	return coins;
}

var createLevels = function() {
	var levels = [];
	levels.push(new Level({speed: 8, coins:createCoins(coords)}))
//	levels.push(new Level({speed: 5, coins:createCoins(coords)}))
//	levels.push(new Level({speed: 8 , coins:createCoins(coords)}))
	return levels;
}

var levels = createLevels();

var coins = createCoins(coords);



runningMan = new sprite({
		context: canvas.getContext("2d"),
	width: 27,
	height: 40,
	image: runningImage,
	numberOfFrames: 9,
	ticksPerFrame: 1,
	x: 70,
	y: 70,  
	imageWidth: 90,   
	imageHeight: 20
});

// this doesn't seem to work that greate but it's the best I've found so far
function determineFontHeight(fontStyle) {
  var body = document.getElementsByTagName("body")[0];
  var dummy = document.createElement("div");
  var dummyText = document.createTextNode("MgR");
  dummy.appendChild(dummyText);
  dummy.setAttribute("style", fontStyle);
  body.appendChild(dummy);
  var result = dummy.offsetHeight;
  body.removeChild(dummy);
  return result + 5;
};

function determineFontHeight2(fontStyle) {
	var emHeight = parseInt(ctx.font.split(' ')[0].replace('px', '')); //parsing string
	return emHeight;
};

function textLineHeight() {
//	console.log("font = " + ctx.font);
	var myheight = determineFontHeight2(ctx.font);
//	console.log("textLineHeight = " + myheight);
	return  myheight;
}


// Event Listeners

window.addEventListener('keyup', function (e) {
	if (e.keyCode === 32) {
		runningMan.startJumping();
	} else if (e.keyCode === 82) {
		levels = createLevels();
		level = 1;
		endGame = false;
	}
	console.log("keyCode = " + e.keyCode)
}, false);

window.addEventListener('touchstart', function (e) {
	if (endGame) {
		levels = createLevels();
		level = 1;
		endGame = false;
	} else  {
		runningMan.startJumping();
	}
}, false);

window.addEventListener('click', function (e) {
	if (endGame) {
		levels = createLevels();
		level = 1;
		endGame = false;
	} else  {
		runningMan.startJumping();
	}
}, false);

audioThemeMusic.addEventListener("ended", function() 
 {
//	  themeMusicPlaying = false;
	  console.log("Replaying music");
 });


 var setCanvasSize = function() {
	var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	xS = w.innerWidth,
	yS = w.innerHeight;
	//alert('window ' + w.innerWidth + ' × ' + w.innerHeight + ' element ' + + e.clientWidth + ' × ' + e.clientHeight + ' body ' + + g.clientWidth + ' × ' + g.clientHeight);
	canvas.width = xS;
	canvas.height = yS;
	}

// Main Loop

function gameLoop() {
	setCanvasSize();
	console.log("levels.length " + levels.length + " level " + level);
	if (endGame) {
		ctx.textAlign = "left";
		ctx.font = "16px Arial";
		ctx.fillText("Level: " + level + "  Score: "+ score,10,20);
		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.fillText("Game Over",canvas.width/2,canvas.height/2);
		ctx.fillText("Press here to start over",canvas.width/2,(canvas.height/2)+textLineHeight());
	} else {
		if (!themeMusicPlaying) { 
			//audioThemeMusic.play();
			themeMusicPlaying = true;
		}
		backgroundX = (backgroundX + speed) % 330;
		myDrawImage(groundImage, backgroundX , 0, BASE_WIDTH, 1080, 0, 0, BASE_WIDTH, BASE_HEIGHT);
		for (var i = 0; i < levels[level-1].coins.length; i++) {
			if (isIntercecting(levels[level-1].coins[i], runningMan )) {
				console.log("Hit");
				playCoinAudio();
				score +=1;
				levels[level-1].coins.splice(i,1);
				i--;
			} else {  
				levels[level-1].coins[i].update();
				levels[level-1].coins[i].render();
			}
		}
		runningMan.update();
		runningMan.render();
		levels[level-1].update();
		// Print Score
		ctx.textAlign = "left";
		ctx.font = "16px Arial";
		ctx.fillText("Level: " + level + "  Score: "+ score,10,20);
	}


		window.requestAnimationFrame(gameLoop);
};

gameLoop();