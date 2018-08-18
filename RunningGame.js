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
var BASE_WIDTH = 608;
var BASE_HEIGHT = 342;
var score = 0;
var level = 1;
var themeMusicPlaying = false;
var GROUND_LEVEL = 60;
var currentGameScreen = new GameScreen("test");
var pressedDown = false;

//var audioCoin = new Audio('audio/smb_coin.wav');
//var audioJump = new Audio('audio/smb_jump-small.wav');
var audioJump = null;
//var audioThemeMusic = new Audio('audio/themeMusic.mp3');

var mediaSource = "http://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv"



var createCoinAudios = function () {

	var coinAudios = [];
	for (i = 0; i < COINAUDIOBUFFER; i++) {
		coinAudios.push(new Audio('audio/smb_coin.wav'));
	}
	return coinAudios;
}

var coinAudioNum = 0;
var myAudioCoins = null;

function playJumpAudio() {
	if (audioJump === null) {
		 audioJump = new Audio('audio/smb_jump-small.wav');
	}
	audioJump.play();
}

function playCoinAudio() {
	if (myAudioCoins === null) {
		myAudioCoins = createCoinAudios();
	}
	coinAudioNum = (coinAudioNum + 1) % COINAUDIOBUFFER;
	console.log(coinAudioNum);
	myAudioCoins[coinAudioNum].play();
	//audioCoin.play();
}


/**
 * Translates from the reference window size defined by BASE_WIDTH by BASE_HEIGHT.
 * @param {integer} refCoordX The reference coordinate x.
 * @return {integer} Returns the x value in the current canvas reference frame
 */
var translateDrawX = function (refCoordX) {
	ratio = canvas.width / BASE_WIDTH;
	newX = refCoordX * ratio;
	//console.log('newX =' + newX + ' ratio ' + ratio);
	return (newX);
}

/**
 * Translates from the reference window size defined by BASE_WIDTH by BASE_HEIGHT.
 * @param {integer} refCoordX The reference coordinate y.
 * @return {integer} Returns the y value in the current canvas reference frame
 */
var translateDrawY = function (refCoordY) {
	ratio = canvas.height / BASE_HEIGHT;
	newY = refCoordY * ratio;
	//console.log('y ' + refCoordY + ' newY =' + newY + 'canvas height ' + canvas.height + ' ratio ' + ratio);
	return (newY);
}

var myFontSize = function(fontPointSize) {
	var newFontPointSize = Math.trunc(translateDrawY(fontPointSize));
	//console.log("New Font Size = %i", newFontPointSize)
	return(newFontPointSize);
}



/**
 * Does a draw image but changes the fourth quadrant to first quadrant for the coordinates.
 */
var myDrawImage = function(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
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

var myDrawRect = function(aRect) {
	var x = translateDrawX(aRect.x);
	var	y = canvas.height - translateDrawY(aRect.y) - translateDrawY(aRect.height);
	var	width = translateDrawX(aRect.width);
	var	height = translateDrawY(aRect.height);
	ctx.rect(x, y, width, height);
	ctx.fillRect(x, y, width, height);
	ctx.stroke();
}



var isIntercecting = function (obj1, obj2) {

	if (obj1.x < obj2.x + obj2.width && obj2.x < obj1.x + obj1.width && obj1.y < obj2.y + obj2.height) {
		//    	console.log("Hit function");
		return obj2.y < obj1.y + obj1.height;
	} else
		return false;
}

var eventXYInRect = function(currentEvent, aRect) {
	var translatedX = currentEvent.x;
	var translatedY = canvas.height - currentEvent.y;
	//console.log("x = " + translatedX + " y = " + translatedY);
	if ((translatedX > translateDrawX(aRect.x)) &&
		(translatedY > translateDrawY(aRect.y)) &&
		(translatedX < translateDrawX(aRect.x + aRect.width)) &&
		(translatedY < translateDrawY(aRect.y + aRect.height))) {
		return true;
	} else {
		return false;
	}

}

function Button(options) {
	this.name = options.name;
	this.x = options.x;
	this.y = options.y;
	this.width = options.width;
	this.height = options.height;
	this.fontPointSize = Math.trunc(this.height*0.75);
	this.isPressed = false;
	this.isClicked = false;
}

Button.prototype.render = function () {
	// draw a box
	var tmpFillStyle = ctx.fillStyle;
	if (this.isPressed) {
		ctx.fillStyle = 'black';
	} else {
		ctx.fillStyle = 'white';
	}
	myDrawRect(this);
	// draw name
	if (this.isPressed) {
		ctx.fillStyle = 'white';
	} else {
		ctx.fillStyle = 'black';
	}
	ctx.font = myFontSize(this.fontPointSize) + "px Arial";
	ctx.textAlign = "center";
	ctx.fillText(this.name, 
		translateDrawX(this.x + (this.width/2)), 
		canvas.height - translateDrawY(this.y) - translateDrawY(this.height*0.25)) ;
	ctx.fillStyle = tmpFillStyle;
}

Button.prototype.onTouchStart = function (currentEvent) {
	//if (eventXYInRect(currentEvent, this)) {
		this.isPressed = true;
	//}
}

Button.prototype.onTouchMove = function (currentEvent) {
	if (pressedDown) {
		if (eventXYInRect(currentEvent, this)) {
			this.isPressed = true;
		} else {
			this.isPressed = false;
		}
	}  
}

Button.prototype.onTouchEnd = function (currentEvent) {
	if(this.isPressed) {
		this.isPressed = false;
		this.isClicked = true;
	}	

}



function Sprite(options) {
	this.frameIndex = 0;
	this.tickCount = 0;
	this.ticksPerFrame = options.ticksPerFrame || 0; // Default to 0 waits per frame
	this.numberOfFrames = options.numberOfFrames || 1; // Default to one frame
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

Sprite.prototype.startJumping = function () {
	if (this.moveMode != JUMPING) {
		this.moveMode = JUMPING;
		this.jumpStartY = this.y;
		playJumpAudio();
	}
};

Sprite.prototype.update = function () {

	if (this.moveMode === JUMPING) {
		//ohStartY -= jumpSpeed;
		this.jumpIncrement += 1;
		var myY = (-1 * (this.jumpHeight / (this.jumpIncrements * this.jumpIncrements)) * (this.jumpIncrement * this.jumpIncrement) + this.jumpHeight);
		this.y = myY + this.jumpStartY;
		//console.log("jumpIncrement " + this.jumpIncrement + " " + myY);
		if (this.jumpIncrement >= Math.abs(this.jumpIncrements)) {
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
			// Otherwise go back to the first frame
			this.frameIndex = 0;
		}
	}
};

Sprite.prototype.render = function () {
	// Draw the animation
	myDrawImage(
		this.image,
		(this.frameIndex * this.imageWidth / this.numberOfFrames),
		0,
		(this.imageWidth / this.numberOfFrames),
		this.imageHeight,
		this.x,
		this.y,
		this.width,
		this.height
	);
};

function BackgroundSprite(options) {
	Sprite.call(this, options);
}

BackgroundSprite.prototype = Object.create(Sprite.prototype);
BackgroundSprite.prototype.constructor = BackgroundSprite;

BackgroundSprite.prototype.update = function (speed) {
	// Draw the animation
	this.x = this.x - speed;
	this.speed = speed;
	Sprite.prototype.update.call(this);

};

var groundImage = new Image();
groundImage.src = "images/Ground.jpg";

var coinImage = new Image();
coinImage.src = "images/coin-sprite-animation.png";

var runningImage = new Image();
runningImage.src = "images/Running animation test (1).png"

var baseLevelY = GROUND_LEVEL;
var coords = [
	{ x: 400, y: baseLevelY + 0 },
	{ x: 650, y: baseLevelY + 0 },
	{ x: 655, y: baseLevelY + 0 },
	{ x: 660, y: baseLevelY + 0 },
	{ x: 670, y: baseLevelY + 0 },
	{ x: 800, y: baseLevelY + 0 },
	{ x: 1200, y: baseLevelY + 100 },
	{ x: 1550, y: baseLevelY + 100 },
	{ x: 1800, y: baseLevelY + 50 },
	{ x: 2250, y: baseLevelY + 50 },
	{ x: 2800, y: baseLevelY + 100 },
	{ x: 3550, y: baseLevelY + 100 },
];

var createCoins = function (coords) {

	var coins = [];
	for (var i in coords) {
		// Create Sprite
		coins.push(new BackgroundSprite({
			context: canvas.getContext("2d"),
			width: 30,
			height: 30,
			image: coinImage,
			numberOfFrames: 10,
			ticksPerFrame: 1,
			imageWidth: 1000,
			imageHeight: 100,
			x: coords[i].x,
			y: coords[i].y
		}));
	}
	return coins;
}

runningMan = new Sprite( {
	context: canvas.getContext("2d"),
	width: 27,
	height: 40,
	image: runningImage,
	numberOfFrames: 9,
	ticksPerFrame: 0,
	x: 70,
	y: GROUND_LEVEL,
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
	return myheight;
}

var setCanvasSize = function () {
	var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		width = w.innerWidth,
		height = w.innerHeight;
	//alert('window ' + w.innerWidth + ' × ' + w.innerHeight + ' element ' + + e.clientWidth + ' × ' + e.clientHeight + ' body ' + + g.clientWidth + ' × ' + g.clientHeight);
	var calculatedHeight = width/16*9;
	var calculatedWidth = height/9*16;
	
	if (calculatedHeight < height) {
		canvas.width = width;
		canvas.height = calculatedHeight;
	} else {
		canvas.width = calculatedWidth;
		canvas.height = height;
	}
	//canvas.width = width;
	//canvas.height = height;

}

// Event Listeners

window.addEventListener('keyup', function (e) {
	currentGameScreen.onKeyUp(e);
}, false);

window.addEventListener('touchstart', function (e) {
	currentGameScreen.onTouchStart(e);
	pressedDown = true;
}, false);

window.addEventListener('touchend', function (e) {
	currentGameScreen.onTouchEnd(e);
	pressedDown = false;
}, false);

window.addEventListener('touchmove', function (e) {
	currentGameScreen.onTouchMove(e);
}, false);

window.addEventListener('mousedown', function (e) {
	currentGameScreen.onTouchStart(e);
	pressedDown = true;
}, false);

window.addEventListener('mouseup', function (e) {
	currentGameScreen.onTouchEnd(e);
	pressedDown = false;
}, false);

window.addEventListener('mousemove', function (e) {
	currentGameScreen.onTouchMove(e);
}, false);

/*
audioThemeMusic.addEventListener("ended", function () {
	//	  themeMusicPlaying = false;
	console.log("Replaying music");
});
*/

function RunScreen(screenName) {
	GameScreen.call(this, screenName);
	this.backgroundX = 0;
	this.enteringScreen = true;
	this.coins = null;
	this.speed = 0;
	this.levelLength = 4000;
}

RunScreen.prototype = Object.create(GameScreen.prototype);
RunScreen.prototype.constructor = RunScreen;

RunScreen.prototype.enteringGameScreen = function() {
	this.enteringScreen = true;
	this.backgroundX = 0;
	this.coins = createCoins(coords);
	this.speed = 4 + level * 2;
	this.levelLength = 4000;

};

RunScreen.prototype.renderScreen = function () {
	if (!themeMusicPlaying) {
		//audioThemeMusic.play();
		themeMusicPlaying = true;
	}

	this.backgroundX = (this.backgroundX + this.speed) % 330;
	myDrawImage(groundImage, this.backgroundX, 0, BASE_WIDTH, 1080, 0, 0, BASE_WIDTH, BASE_HEIGHT);

	for (var i = 0; i < this.coins.length; i++) {  // For each coin
		if (isIntercecting(this.coins[i], runningMan)) { // If a coin is hit
			// console.log("Hit");
			playCoinAudio(); // Play audio
			score += 1;
			this.coins.splice(i, 1); // Remove from coin list so you don't hit it again or draw it
			i--;
		} else {
			this.coins[i].update(this.speed); // Update coin image to animate
			this.coins[i].render(); 
		}
	}
	runningMan.update(); // Update to animate
	runningMan.render(); 
		// Print Score
	ctx.textAlign = "left";
	ctx.font = myFontSize(16) + "px Arial";
	ctx.fillText("Level: " + level + "  Score: " + score, 10, 20);
	this.levelLength = this.levelLength - this.speed;
	if (this.levelLength < 0) {
		this.goToNextScreen();
		level += 1;
	}
};

RunScreen.prototype.onTouchEnd = function(currentEvent) {
	runningMan.startJumping();
};

RunScreen.prototype.onKeyUp = function(currentEvent) {
	if (currentEvent.keyCode === 32) {
		runningMan.startJumping();
	}
};

function GameOverScreen(screenName) {
	GameScreen.call(this, screenName);
	this.mybutton = new Button({name:"Next Level", x:BASE_WIDTH/2-150/2, y:BASE_HEIGHT/2-30/2, width:150, height:30})
}

GameOverScreen.prototype = Object.create(GameScreen.prototype);
GameOverScreen.prototype.constructor = GameOverScreen;

GameOverScreen.prototype.renderScreen = function () {
	ctx.textAlign = "left";
	ctx.font = myFontSize(16) + "px Arial";
	ctx.fillText("Level: " + (level-1) + "  Score: " + score, 10, 20);
	ctx.font = myFontSize(30) + "px Arial";
	ctx.textAlign = "center";
	ctx.fillText("Level Complete", canvas.width / 2, (canvas.height / 2) - 40);
	this.mybutton.render();
};

GameOverScreen.prototype.onTouchStart = function(currentEvent) {
	console.log("In onTouchStart");
	this.mybutton.onTouchStart(currentEvent);
};

GameOverScreen.prototype.onTouchMove = function(currentEvent) {
	this.mybutton.onTouchMove(currentEvent);
};

GameOverScreen.prototype.onTouchEnd = function(currentEvent) {
	console.log("In onTouchStart");
	this.mybutton.onTouchEnd(currentEvent);
    if (this.mybutton.isClicked) {
		this.moveToNextScreen = true;
		this.mybutton.isClicked = false;
	}
};


GameOverScreen.prototype.onKeyUp = function(currentEvent) {
	if (currentEvent.keyCode === 32) {
		this.goToNextScreen();
	}
};

var splashScreen = new GameScreen("Splash Screen 2");
var menuScreen = new GameScreen("Menu Screen");
var runScreen = new RunScreen("Run");
var gameOverScreen = new GameOverScreen("Game Over");
splashScreen.nextScreen = menuScreen;
menuScreen.nextScreen = gameOverScreen;
runScreen.nextScreen = gameOverScreen;
gameOverScreen.nextScreen = menuScreen;
currentGameScreen = splashScreen;

// Main Loop

function gameLoop() {
	var tmpGameScreen = currentGameScreen.checkAndGoToNext();
	currentGameScreen = tmpGameScreen;
	setCanvasSize();
	//console.log("levels.length " + levels.length + " level " + level);
	currentGameScreen.renderScreen();
	window.requestAnimationFrame(gameLoop);
};

gameLoop();