function Player() {
    var Player = {
        currentImage: { index: { walk: 0, stand: 1 }, image: GAME.imageLoader.get("player", ["Fw","Stnd","0"]) },
        x: 111,
        y: 555,
        direction: 1,
        maxSpeed: { x: 500, y: 8 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 700, y: 0 },
        moved: false
    };

    var prev = 0;
    Player.move = function (time, keys) {
        if(keys.forward || keys.backward) {
            this.direction = keys.forward ? 1 : -1;
        }

        if (time) {

            if(keys.up && this.velocity.y == 0) {
                this.velocity.y = -this.maxSpeed.y;
            }

            if (keys.forward) {
                if (this.velocity.x < this.maxSpeed.x) {
                    this.velocity.x = Math.min(this.velocity.x + this.acceleration.x * (this.velocity.x < 0 ? 2 : 1) * time, this.maxSpeed.x);
                }
                this.moved = true;
            } else if (keys.backward) {
                if (this.velocity.x > -this.maxSpeed.x) {
                    this.velocity.x = Math.max(this.velocity.x - this.acceleration.x * (this.velocity.x > 0 ? 2 : 1) * time, -this.maxSpeed.x);
                }
                this.moved = true;
            } else {
                if (this.velocity.x > 0) {
                    this.velocity.x -= this.acceleration.x * 3 * time;

                    if(this.velocity.x < 0) {
                        this.velocity.x = 0;
                    }
                } else if(this.velocity.x < 0) {
                    this.velocity.x += this.acceleration.x * 3 * time;

                    if(this.velocity.x > 0) {
                        this.velocity.x = 0;
                    }
                }
            }

            if(this.velocity.y) {
                this.velocity.y += GAME.gravity;
            }
            
            if(this.velocity.y < 0 && this.velocity.y.toFixed(0) > -this.maxSpeed.y*0.15) {
                this.velocity.y *= -1;
            } else if (this.velocity.y > 0 && this.y > 555) {
                this.y = 555;
                this.velocity.y = 0;
            }

            this.y += this.velocity.y;
            this.x += this.velocity.x * time;
        }
    }

    Player.getMove = function (time) {
        if (GAME.updateImageFrame()) {
            if(this.y != 555) {
                this.currentImage.index.walk = -1;
                this.currentImage.index.stand = -1;
                this.currentImage.image = GAME.imageLoader.get("player", [(this.direction == 1 ? "Fw" : "Bw"), "Jmp"]);
            } else {
                if (this.moved) {
                    this.moved = false;
                    this.currentImage.index.stand = -1;
    
                    if (++this.currentImage.index.walk > 3) {
                        this.currentImage.index.walk = 0;
                    }
    
                    this.currentImage.image = GAME.imageLoader.get("player", [(this.direction == 1 ? "Fw" : "Bw"), "Wlk", this.currentImage.index.walk+""]);
                } else {
                    this.currentImage.index.walk = -1;
    
                    if (++this.currentImage.index.stand > 3) {
                        this.currentImage.index.stand = 0;
                    }
    
                    this.currentImage.image = GAME.imageLoader.get("player", [(this.direction == 1 ? "Fw" : "Bw"), "Stnd", this.currentImage.index.stand+""]);;
                }
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