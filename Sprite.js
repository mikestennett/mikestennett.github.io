
class Sprite {
    static get RUNNING() { return 0; } // Class static constant
    static get JUMPING() { return 1; } // Class static constant

    constructor(options) {
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = options.ticksPerFrame || 0; // Default to 0 waits per frame
        this.numberOfFrames = options.numberOfFrames || 1; // Default to one frame
        this.gameScreen = options.gameScreen || undefined;
        this.width = options.width;
        this.height = options.height;
        this.image = options.image;
        this.x = options.x;
        this.y = options.y;
        this.imageWidth = options.imageWidth;
        this.imageHeight = options.imageHeight;
        // New Properties
        this.moveMode = Sprite.RUNNING; // running
        this.jumpStartY = 50;
        this.jumpIncrements = -30;
        this.jumpIncrement = this.jumpIncrements;
        this.jumpHeight = 130;
    }

    startJumping() {
        if (this.moveMode != Sprite.JUMPING) {
            this.moveMode = Sprite.JUMPING;
            this.jumpStartY = this.y;
            AudioPlayer.play("Jump");
        }
    }

    update() {
        if (this.moveMode === Sprite.JUMPING) {
            //ohStartY -= jumpSpeed;
            this.jumpIncrement += 1;
            var myY = (-1 * (this.jumpHeight / (this.jumpIncrements * this.jumpIncrements)) * (this.jumpIncrement * this.jumpIncrement) + this.jumpHeight);
            this.y = myY + this.jumpStartY;
            //console.log("jumpIncrement " + this.jumpIncrement + " " + myY);
            if (this.jumpIncrement >= Math.abs(this.jumpIncrements)) {
                //jumpSpeed = jumpSpeed * -1;
                this.moveMode = Sprite.RUNNING;
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

    }

    render() {
        // Draw the animation
        this.gameScreen.easel.myDrawImage(
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

    }

}


