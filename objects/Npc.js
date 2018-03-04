function NPC(x, y, direction) {
    let NPC = {
        x: x,
        y: y,
        currentImage: { index: { walk: 0, climb: -1, death: -1 }, image: GAME.imageLoader.get("npc", ["forward", "stand", "0"]) },
        velocity: { x: 0, y: 0 },
        direction: direction || 1,
        moved: false,
        climb: 0,
        fixPosClimb: {x: 0, y: 0}
    };

    var canGoOrClimb = function() {
        let canGo = GAME.canGo(this.x, this.y, this.direction == 1, true);
        let canClimb = GAME.canClimb(this.x, this.y, this.direction == 1, true);

        if(!canGo && canClimb) {
            this.climb = canClimb;
            this.fixPosClimb.y = this.climb == 1 ? this.y - GAME.sizes.blockHeight : this.y;

            this.fixPosClimb.x = this.x;
            return true;
        } else if(canGo) {
            return true;
        }

        return false;
    }
    
    NPC.move = function (time) {
        let c = 0;

        if(this.climb == 0) {
            while(c < 2 && !canGoOrClimb.bind(this)()) {
                this.direction *= -1;
                ++c;
            }
        }

        if(c < 2 && this.climb == 0) {
            this.moved = true;
            this.velocity.x = this.direction * 10;
        } else if(this.climb != 0) {
            this.velocity.x = 0;
            if ((this.currentImage.index.climb += 0.5) > 10) {
                this.currentImage.index.climb = 0;
                this.climb = 0;
            } else if(this.currentImage.index.climb == 5) {
                this.y += -1 * this.climb * GAME.sizes.blockHeight;
                this.x += this.direction * GAME.sizes.blockWidth;
            }
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;

    }

    NPC.die = function () {

    }

    NPC.getMove = function () {
        if (GAME.updateImageFrame()) {
            if (GAME.canFall(this.x, this.y, true) || (!this.moved && !this.climb)) {
                this.currentImage.index.walk = -1;
                this.currentImage.index.climb = -1;
                this.currentImage.image = GAME.imageLoader.get("npc", [(this.direction == 1 ? "forward" : "backward"), "stand"]);
            } else if (this.moved) {
                this.moved = false;
                this.currentImage.index.climb = -1;

                if (++this.currentImage.index.walk > 3) {
                    this.currentImage.index.walk = 0;
                }

                this.currentImage.image = GAME.imageLoader.get("npc", [(this.direction == 1 ? "forward" : "backward"), "walk", this.currentImage.index.walk + ""]);
            } else {
                this.currentImage.index.walk = -1;

                this.currentImage.image = GAME.imageLoader.get("npc", [(this.direction == 1 ? "forward" : "backward"), "climb"+(this.climb == 1 ? "Up" : "Down"), Math.floor(this.currentImage.index.climb) + ""]);
            }
        }

        return {
            x: this.climb == 0 ? this.x : this.fixPosClimb.x,
            y: this.climb == 0 ? this.y : this.fixPosClimb.y,
            image: this.currentImage.image
        }
    }

    return NPC;
}