function Player(player2) {
    var imageType = player2 ? "player2" : "player";
    var Player = {
        currentImage: { index: { walk: 0, stand: 1 }, image: GAME.imageLoader.get(imageType, ["Fw", "Stnd", "0"]) },
        x: (player2 && 222) || 111,
        y: 333,
        direction: 1,
        maxSpeed: { x: 500, y: 8 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 700, y: 0 },
        moved: false,
        player2: !!player2
    };

    var jump = function () {

    }

    var speedUp = function (forward, time) {
        if (forward && this.velocity.x < this.maxSpeed.x) {
            this.velocity.x = Math.min(this.velocity.x + this.acceleration.x * (this.velocity.x < 0 ? 2 : 1) * time, this.maxSpeed.x);
        } else if (!forward && this.velocity.x > -this.maxSpeed.x) {
            this.velocity.x = Math.max(this.velocity.x - this.acceleration.x * (this.velocity.x > 0 ? 2 : 1) * time, -this.maxSpeed.x);
        }
        this.moved = true;

        if (!GAME.validPos(this.x + this.velocity.x * time, this.y, true) || !GAME.canGo(this.x + this.velocity.x * time, this.y, forward, true)) {
            this.velocity.x = 0;
        }
    }

    var slowDown = function (time) {
        if (this.velocity.x > 0) {
            this.velocity.x -= this.acceleration.x * 3 * time;

            if (this.velocity.x < 0) {
                this.velocity.x = 0;
            }
        } else if (this.velocity.x < 0) {
            this.velocity.x += this.acceleration.x * 3 * time;

            if (this.velocity.x > 0) {
                this.velocity.x = 0;
            }
        }

        if (!GAME.validPos(this.x + this.velocity.x * time, this.y, true) || !GAME.canGo(this.x + this.velocity.x * time, this.y, this.velocity.x > 0, true)) {
            this.velocity.x = 0;
        }
    }


    Player.move = function (time, keys) {
        if (keys.forward || keys.backward) {
            this.direction = keys.forward ? 1 : -1;
        }

        if (time) {

            if (keys.up && this.velocity.y == 0) {
                this.velocity.y = -20;
                this.jumping = true;
            }


            if (keys.forward || keys.backward) {
                speedUp.bind(this)(keys.forward, time);
            } else if (this.velocity.x != 0) {
                slowDown.bind(this)(time);
            }

            let canFall = GAME.canFall(this.x, this.y, true);
            if (this.jumping || canFall) {
                this.velocity.y += 1.7;
            }


            this.y += this.velocity.y;

            if (this.velocity.y > 0 && !canFall) {
                this.y = GAME.getGround(this.x, true).y;
                this.velocity.y = 0;
                this.jumping = false;
            }

            this.x += this.velocity.x * time;

            let wrongPosition = GAME.isWrongPosition(this.x, this.y, true);
            if ((canFall || this.velocity.x == 0) && wrongPosition) {
                let goodPos = GAME.getGoodPosition(this.x, this.y);
                let xToBe = this.x + wrongPosition * GAME.sizes.blockWidth * 0.1;

                if (
                    (wrongPosition == 1 && xToBe > goodPos) ||
                    (wrongPosition == -1 && xToBe < goodPos)
                ) {
                    this.x = goodPos;
                } else {
                    this.x = xToBe;
                }
            }
        }
    }
    Player.getMove = function (time) {
        if (GAME.updateImageFrame()) {
            if (GAME.canFall(this.x, this.y, true)) {
                this.currentImage.index.walk = -1;
                this.currentImage.index.stand = -1;
                this.currentImage.image = GAME.imageLoader.get(imageType, [(this.direction == 1 ? "Fw" : "Bw"), "Jmp"]);
            } else {
                if (this.moved) {
                    this.moved = false;
                    this.currentImage.index.stand = -1;

                    if (++this.currentImage.index.walk > 3) {
                        this.currentImage.index.walk = 0;
                    }

                    this.currentImage.image = GAME.imageLoader.get(imageType, [(this.direction == 1 ? "Fw" : "Bw"), "Wlk", this.currentImage.index.walk + ""]);
                } else {
                    this.currentImage.index.walk = -1;

                    if (++this.currentImage.index.stand > 3) {
                        this.currentImage.index.stand = 0;
                    }

                    this.currentImage.image = GAME.imageLoader.get(imageType, [(this.direction == 1 ? "Fw" : "Bw"), "Stnd", this.currentImage.index.stand + ""]);;
                }
            }
        }

        return {
            x: this.x,
            y: this.y,
            image: this.currentImage.image
        }
    }

    return Player;
}