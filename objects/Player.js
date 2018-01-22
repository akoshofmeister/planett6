function Player() {
    var Player = {
        currentImage: {index: {walk: 0, stand: 1}, image: GAME.imageLoader.get("playerFwStnd0")},
        x: 111,
        y: 555,
        direction: 1,
        speedX: 3 * GAME.sizes.blockWidth,
        speedY: 0,
        moved: false,
        gravity: 0.5
    };

    Player.move = function (time, forward) {
        if(time) {
            var nextX = this.x;
            var nextY = this.y + this.speedY * this.gravity;

            var nextGround;
            for(var i = GAME.normalizeX(nextX) * GAME.sizes.tableHeight; i < GAME.normalizeX(nextX) * GAME.sizes.tableHeight + GAME.sizes.tableHeight - 1; i++) {
                if(GAME.blocks[i].type == "groundTp") {
                    nextGround = GAME.blocks[i-1].y;
                    break;
                }
            }

            if(nextY >= nextGround) {
                nextY = nextGround;
                this.speedY = 0;
                this.jumpHeight = 0;
            } else {
                !this.speedY && (this.speedY = 10);
                this.speedY += this.gravity * time;

                if(this.jumpHeight && nextY < this.jumpHeight) {
                    this.speedY *= -1;
                }
            }

            if(forward) {
                nextX = (this.x + this.direction * time * this.speedX);
                this.moved = true;
            }

            if(GAME.blocks[GAME.normalizeX(nextX) * GAME.sizes.tableHeight] /* && GAME.blocks[GAME.normalizeX(nextX) + this.y].passable */) {
                this.x = nextX;
                this.y = nextY;
            }
        }
    }

    Player.jump = function() {
        if(!this.speedY) {
            this.speedY = -10;
            this.jumpHeight = GAME.normalizeY(this.y) * GAME.sizes.blockHeight - GAME.sizes.blockHeight;
        }
    }

    Player.getMove = function (time) {
        if(GAME.updateImageFrame()) {
            if(this.moved) {
                this.moved = false;
                this.currentImage.index.stand = -1;

                if(++this.currentImage.index.walk > 3) {
                    this.currentImage.index.walk = 0;
                }
    
                this.currentImage.image = GAME.imageLoader.get((this.direction == 1 ? "playerFwWlk" : "playerBwWlk") + this.currentImage.index.walk);
            } else {
                this.currentImage.index.walk = -1;

                if(++this.currentImage.index.stand > 3) {
                    this.currentImage.index.stand = 0;
                }

                this.currentImage.image = GAME.imageLoader.get((this.direction == 1 ? "playerFwStnd" : "playerBwStnd") + this.currentImage.index.stand);
            }
        }

        return {
            x: Player.x,
            y: Player.y,
            image: Player.currentImage.image
        }
    }

    return Player;
}