// Event Listeners

window.addEventListener('keyup', function (e) {
    AllScreens.currentScreen().onKeyUp(e);
}, false);

function setTouches(e) {
    if (e.touches != null) {
        var touchLength = e.touches.length;
        if (touchLength > 0) {
            var touchStartX = e.touches[0].clientX;
            var touchStartY = e.touches[0].clientY;
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
    AllScreens.currentScreen().onTouchStart(e);
    AllScreens.currentScreen().mouseIsDown = true;
    console.log("Touch Start " + e.touches.length);
}, false);

window.addEventListener('touchend', function (e) {
    window.scrollTo(0, 0);
    e.preventDefault();
    e.stopPropagation();
    setTouches(e);
    AllScreens.currentScreen().onTouchEnd(e);
    AllScreens.currentScreen().mouseIsDown = false;
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
    AllScreens.currentScreen().onTouchMove(e);
    console.log("Touch Move " + e.touches.length);
}, false);

window.addEventListener('mousedown', function (e) {
    AllScreens.currentScreen().onTouchStart(e);
    AllScreens.currentScreen().mouseIsDown = true;
}, false);

window.addEventListener('mouseup', function (e) {
    AllScreens.currentScreen().onTouchEnd(e);
    AllScreens.currentScreen().mouseIsDown = false
}, false);

window.addEventListener('mousemove', function (e) {
    AllScreens.currentScreen().onTouchMove(e);
}, false);


var TO_RADIANS = Math.PI / 180;


class RotateScreen extends GameScreen {
    constructor (screenName) {
        super(screenName);
        var smileyImage = new Image();
		smileyImage.src = "images/SmileyFace.jpg"
        this.image = smileyImage;
    }

    drawRotatedImage(image, x, y, angle) {
        var context = this.context;
        // save the current co-ordinate system 
        // before we screw with it
        context.save();

        // move to the middle of where we want to draw our image
        context.translate(x, y);

        // rotate around that point, converting our 
        // angle from degrees to radians 
        context.rotate(angle * TO_RADIANS);

        // the x and y here need to be negative half the height and width to make it rotate around the center
        context.drawImage(image,-50,-50, 100, 100);  

        // and restore the co-ords to how they were when we began
        context.restore();
    }

    renderScreen() {
        this.drawRotatedImage(this.image, 100, 100, 0)
        this.drawRotatedImage(this.image, 100, 100, 90)
        this.drawRotatedImage(this.image, 100, 100, 180)
        this.drawRotatedImage(this.image, 100, 100, 270)
        this.drawRotatedImage(this.image, 100, 100, 45)
    }
}

function drawRotatedImage(image, x, y, angle) {
    // save the current co-ordinate system 
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    context.rotate(angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image 
    context.drawImage(image, -(image.width / 2), -(image.height / 2));

    // and restore the co-ords to how they were when we began
    context.restore();
}

AllScreens.getInstance().setCanvas("myCanvas");
var splashScreen = new GameScreen("Example Screen 1.0");
var menuScreen = new RotateScreen("Example Menu Screen");
splashScreen.nextScreen = "Example Menu Screen";
menuScreen.nextScreen = "Example Screen 1.0";
AllScreens.getInstance().setScreenTo("Example Screen 1.0");

// Main Loop

function gameLoop() {
    AllScreens.getInstance().easel.setCanvasSize();
    AllScreens.currentScreen().renderScreen();
    window.requestAnimationFrame(gameLoop);
};

gameLoop();