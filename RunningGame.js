// go to directory 
// git push origin master
// 

class RunScreen extends GameScreen {

	static get GROUND_LEVEL() { return 60; } // Class constant

	constructor(screenName) {
		super(screenName);
		this.backgroundX = 0;
		this.enteringScreen = true;
		this.coins = null;
		this.speed = 0;
		this.levelLength = 4000;
		this.score = 0;
		this.level = 1;
		this.themeMusicPlaying = false;
	}

	enteringGameScreen() {
		this.enteringScreen = true;
		this.backgroundX = 0;
		this.coins = createCoins(coords);
		this.speed = 4 + this.level * 2;
		this.levelLength = 4000;
	}

	renderScreen() {
		if (!this.themeMusicPlaying) {
			//AudioPlayer.play("audioThemeMusic");
			this.themeMusicPlaying = true;
		}

		this.backgroundX = (this.backgroundX + this.speed) % 330;
		myDrawImage(groundImage, this.backgroundX, 0, BASE_WIDTH, 1080, 0, 0, BASE_WIDTH, BASE_HEIGHT);

		for (var i = 0; i < this.coins.length; i++) {  // For each coin
			if (isIntercecting(this.coins[i], runningMan)) { // If a coin is hit
				// console.log("Hit");
				AudioPlayer.play("Coin"); // Play audio
				this.score += 1;
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
		ctx.fillText("Level: " + this.level + "  Score: " + this.score, 10, 20);
		this.levelLength = this.levelLength - this.speed;
		if (this.levelLength < 0) {
			AllScreens.getInstance().setScreenTo("Game Over");
			this.level += 1;
		}
	}

	onTouchEnd(currentEvent) {
		runningMan.startJumping();
	}

	onKeyUp(currentEvent) {
		if (currentEvent.keyCode === 32) {
			runningMan.startJumping();
		}
	}

}

function nextLevelButtonCB() {
	AllScreens.getInstance().setScreenTo("Run");
}

function mainMenuButtonCB() {
	AllScreens.getInstance().setScreenTo("Menu Screen");
}

class GameOverScreen extends GameScreen {
	constructor(screenName) {
		super(screenName);
		var tmpButton = new Button({ name: "Next Level", x: BASE_WIDTH / 2 - 150 / 2, y: BASE_HEIGHT / 2 - 30 / 2, width: 150, height: 30 })
		tmpButton.setCallback(nextLevelButtonCB);
		this.eventObjs.push(tmpButton);
		tmpButton = new Button({ name: "Main Menu", x: BASE_WIDTH / 2 - 150 / 2, y: BASE_HEIGHT / 2 - 30 * 2, width: 150, height: 30 })
		tmpButton.setCallback(mainMenuButtonCB);
		this.eventObjs.push(tmpButton);
	}

	renderScreen() {
		ctx.textAlign = "left";
		ctx.font = myFontSize(16) + "px Arial";
		var runScreen = AllScreens.getInstance().getScreen("Run");
		ctx.fillText("Level: " + (runScreen.level - 1) + "  Score: " + runScreen.score, 10, 20);
		ctx.font = myFontSize(30) + "px Arial";
		ctx.textAlign = "center";
		ctx.fillText("X = " + touchStartX + " Y = " + touchStartY + " Touches Len " + touchLength, canvas.width / 2, (canvas.height / 2) - 40);
		super.renderScreen(this);
	}

}

class AudioObj {
	constructor(audioName, audioFile, poolNumber) {
		this.name = audioName;
		this.audioFile = audioFile;
		this.poolNumber = poolNumber;
		this.audios = [];
		for (var i = 0; i < this.poolNumber; i++) {
			this.audios.push(new Audio(this.audioFile));
		}
		this.poolIndex = 0;
	}
	play() {
		this.poolIndex = (this.poolIndex + 1) % this.poolNumber;
		this.audios[this.poolIndex].play();
	}
	getAudio() {
		return this.audios[this.poolIndex];
	}
}

// AudioPlayer.addAudio("Coin", "audio/smb_coin.wav", 5);
// AudioPlayer.play("Coin");
class AudioPlayer {
	static getMap() {
		return (AudioPlayer.map == null) ? AudioPlayer.map = new Map() : AudioPlayer.map;
	}

	static play(audioName) {
		AudioPlayer.getMap().get(audioName).play();
	}

	static getAudioObj(audioName) {
		return AudioPlayer.getMap().get(audioName).getAudio();
	}

	static addAudio(audioName, audioFile, poolNumber = 1) {
		AudioPlayer.getMap().set(audioName, new AudioObj(audioName, audioFile, poolNumber));
	}
}


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


// 16:9 aspect ratio is what is needed for standard high def televsion
var BASE_WIDTH = 608; // 16*38 = 608
var BASE_HEIGHT = 342;  // 9*38 = 342
var pressedDown = false;
var touchStartX = 0;
var touchStartY = 0;
var touchLength = 0;

AudioPlayer.addAudio("Coin", "audio/smb_coin.wav", 5);
AudioPlayer.addAudio("Jump", "audio/smb_jump-small.wav");
AudioPlayer.addAudio("audioThemeMusic", "audio/themeMusic.mp3");

AudioPlayer.getAudioObj("audioThemeMusic").addEventListener("ended", function () {
	AllScreens.getInstance().getScreen("Run").themeMusicPlaying = false;
	console.log("Replaying music");
});

class BackgroundSprite extends Sprite {
	constructor(options) {
		super(options);
	}
	update(speed) {
		this.x = this.x - speed;
		this.speed = speed;
		Sprite.prototype.update.call(this);
	}
}

var groundImage = new Image();
groundImage.src = "images/Ground.jpg";

var coinImage = new Image();
coinImage.src = "images/coin-sprite-animation.png";

var runningImage = new Image();
runningImage.src = "images/Running animation test (1).png"

var baseLevelY = RunScreen.GROUND_LEVEL;
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

function createCoins(coords) {

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

runningMan = new Sprite({
	context: canvas.getContext("2d"),
	width: 27,
	height: 40,
	image: runningImage,
	numberOfFrames: 9,
	ticksPerFrame: 0,
	x: 70,
	y: RunScreen.GROUND_LEVEL,
	imageWidth: 90,
	imageHeight: 20
});

// Event Listeners

window.addEventListener('keyup', function (e) {
	AllScreens.getInstance().currentScreen().onKeyUp(e);
}, false);

function setTouches(e) {
	if (e.touches != null) {
		touchLength = e.touches.length;
		if (touchLength > 0) {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			e.x = touchStartX;
			e.y = touchStartY;
		}
	}
}

window.addEventListener('touchstart', function (e) {
	window.scrollTo(0, 0);
	e.preventDefault();
	e.stopPropagation();
	setTouches(e);
	AllScreens.getInstance().currentScreen().onTouchStart(e);
	pressedDown = true;
	console.log("Touch Start " + e.touches.length);
}, false);

window.addEventListener('touchend', function (e) {
	window.scrollTo(0, 0);
	e.preventDefault();
	e.stopPropagation();
	setTouches(e);
	AllScreens.getInstance().currentScreen().onTouchEnd(e);
	pressedDown = false;
	console.log("Touch End " + e.touches.length);
}, false);


window.addEventListener("scroll", function (e) {
	window.scrollTo(0, 0);
	e.preventDefault();
	e.stopPropagation();
}, false)

window.addEventListener('touchmove', function (e) {
	window.scrollTo(0, 0);
	e.preventDefault();
	e.stopPropagation();
	setTouches(e);
	AllScreens.getInstance().currentScreen().onTouchMove(e);
	console.log("Touch Move " + e.touches.length);
}, false);

window.addEventListener('mousedown', function (e) {
	AllScreens.getInstance().currentScreen().onTouchStart(e);
	pressedDown = true;
	setTouches(e);
}, false);

window.addEventListener('mouseup', function (e) {
	AllScreens.getInstance().currentScreen().onTouchEnd(e);
	pressedDown = false;
}, false);

window.addEventListener('mousemove', function (e) {
	AllScreens.getInstance().currentScreen().onTouchMove(e);
}, false);


var splashScreen = new GameScreen("Splash Screen 1.0");
var menuScreen = new GameScreen("Menu Screen");
var runScreen = new RunScreen("Run");
var gameOverScreen = new GameOverScreen("Game Over");
splashScreen.nextScreen = "Menu Screen";
menuScreen.nextScreen = "Run";
AllScreens.getInstance().setScreenTo("Splash Screen 1.0");

// Main Loop

function gameLoop() {
	setCanvasSize();
	AllScreens.getInstance().currentScreen().renderScreen();
	window.requestAnimationFrame(gameLoop);
};

gameLoop();