/* eslint-disable */
export default function (game, name) {
    var imageType = game.players.length == 1 ? "player2" : "player";
    var Player = {
        type: "player",
        currentImage: { index: { walk: 0, stand: 1 }, image: game.imageLoader.get(imageType, ["forward", "stand", "0"]) },
        x: (game.players.length == 1 && 222) || 111,
        y: 333,
        direction: 1,
        maxSpeed: { x: 500, y: 8 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 700, y: 0 },
        moved: false,
        player2: game.players.length == 1,
        canShoot: true,
        health: 5,
        dead: false,
        game: game,
        name: name || "Doe János",
        killCounter: 0,
        hitTimer: new Date()
    };

    Player.npcKilled = function() {
        this.killCounter++;
    }

    var speedUp = function (forward, time) {
        if (forward && this.velocity.x < this.maxSpeed.x) {
            this.velocity.x = Math.min(this.velocity.x + this.acceleration.x * (this.velocity.x < 0 ? 2 : 1) * time, this.maxSpeed.x);
        } else if (!forward && this.velocity.x > -this.maxSpeed.x) {
            this.velocity.x = Math.max(this.velocity.x - this.acceleration.x * (this.velocity.x > 0 ? 2 : 1) * time, -this.maxSpeed.x);
        }
        this.moved = true;

        if (!this.game.validPos(this.x + this.velocity.x * time, this.y, true) || !this.game.canGo(this.x + this.velocity.x * time, this.y, forward, true)) {
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

        if (!this.game.validPos(this.x + this.velocity.x * time, this.y, true) || !this.game.canGo(this.x + this.velocity.x * time, this.y, this.velocity.x > 0, true)) {
            this.velocity.x = 0;
        }
    }

    Player.move = function (time, keys) {
        if(this.dead) {
            if(this.game.normalizeY(this.y) < this.game.sizes.tableHeight) {
                this.velocity.y += 3;
                this.y += this.velocity.y;
            }
            return;
        }

        if(keys.shoot) {
            if(this.canShoot) {
                this.shoot();
                this.canShoot = false;
                
                setTimeout(() => { this.canShoot = true; }, 500);
            }
        }

        if (keys.forward || keys.backward) {
            this.direction = keys.forward ? 1 : -1;
        }

        let whatsOn = this.game.whatIsOn(this.x + 55.5, this.y, true, true);

        if(whatsOn) {
            if((whatsOn.type == "npc"&& whatsOn.dead) || whatsOn.type == "fire") {
                this.hit(true);
            } else if(whatsOn.type == "spike") {
                this.health = 1;
                this.hit();
            } else if(whatsOn.type == "checkpoint") {
                this.game.checkCheckpoint();
            }
        }

        let canFall = this.game.canFall(this.x, this.y, true);

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

            if (this.jumping || canFall) {
                this.velocity.y += 1.7;
            }

            this.y += this.velocity.y;

            if (this.velocity.y > 0 && !canFall) {
                this.y = this.game.getGround(this.x, true).y;
                this.velocity.y = 0;
                this.jumping = false;
            }

            this.x += this.velocity.x * time;

            let wrongPosition = this.game.isWrongPosition(this.x, this.y, true);
            if ((canFall || this.velocity.x == 0) && wrongPosition) {
                let goodPos = this.game.getGoodPosition(this.x, this.y);
                let xToBe = this.x + wrongPosition * this.game.sizes.blockWidth * 0.1;

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

    Player.hit = function(useTimer) {
        if(!useTimer || (Date.now() - this.hitTimer >= 1000)) {
            this.hitTimer = Date.now();
            if(this.health != 0 && --this.health == 0) {
                this.die();
            }
        }
    }

    Player.die = function() {
        this.dead = true;
        this.velocity.y = -30;

    }

    Player.shoot = function() {
        this.game.addBullet(this);
    }

    Player.getMove = function (time) {
        if(this.dead) {
            this.currentImage.index.walk = -1;
            this.currentImage.index.stand = -1;
            this.currentImage.image = this.game.imageLoader.get(imageType, [(this.direction == 1 ? "forward" : "backward"), "die"]);
        } else if (this.game.canFall(this.x, this.y, true)) {
            this.currentImage.index.walk = -1;
            this.currentImage.index.stand = -1;
            this.currentImage.image = this.game.imageLoader.get(imageType, [(this.direction == 1 ? "forward" : "backward"), "jump"]);
        } else {
            if (this.moved) {
                this.moved = false;
                this.currentImage.index.stand = -1;

                if (++this.currentImage.index.walk > 3) {
                    this.currentImage.index.walk = 0;
                }

                this.currentImage.image = this.game.imageLoader.get(imageType, [(this.direction == 1 ? "forward" : "backward"), "walk", this.currentImage.index.walk]);
            } else {
                this.currentImage.index.walk = -1;

                if (++this.currentImage.index.stand > 3) {
                    this.currentImage.index.stand = 0;
                }

                this.currentImage.image = this.game.imageLoader.get(imageType, [(this.direction == 1 ? "forward" : "backward"), "stand", this.currentImage.index.stand]);
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