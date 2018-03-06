function NPC(x, y, direction) {
    let NPC = {
        x: x,
        y: y,
        currentImage: { index: { walk: 0, climb: -1, death: -1 }, image: GAME.imageLoader.get("npc", ["forward", "stand", "0"]), "type": "stand" },
        velocity: { x: 0, y: 0 },
        direction: direction || 1,
        moved: false,
        climb: 0,
        fixPosClimb: { x: 0, y: 0 },
        died: false
    };

    var canGoOrClimb = function () {
        let canGo = GAME.canGo(this.x, this.y, this.direction == 1, true) && !GAME.canFall(GAME.normalizeX(this.x + (this.direction == 1 ? 1 : 0) * GAME.sizes.blockWidth), GAME.normalizeY(this.y), false);
        let canClimb = GAME.canClimb(this.x, this.y, this.direction == 1, true);

        if (!canGo && canClimb) {
            this.fixPosClimb.y = canClimb == 1 ? this.y - GAME.sizes.blockHeight : this.y;

            this.fixPosClimb.x = this.direction == -1 ? this.x - GAME.sizes.blockWidth : this.x;
            this.climb = canClimb;
            return true;
        } else if (canGo) {
            return true;
        }

        return false;
    }

    NPC.move = function (time) {
        if(!this.dead && !this.dying) {
            let c = 0;

            if (this.climb == 0) {
                while (c < 2 && !canGoOrClimb.bind(this)()) {
                    this.direction *= -1;
                    ++c;
                }
            }

            if (c < 2 && this.climb == 0) {
                this.moved = true;
                this.velocity.x = this.direction * 10;
            } else if (this.climb != 0) {
                this.velocity.x = 0;
                if ((this.currentImage.index.climb += 0.5) > 10) {
                    this.currentImage.index.climb = 0;
                    this.climb = 0;
                } else if (this.currentImage.index.climb == 7) {
                    this.y += -1 * this.climb * GAME.sizes.blockHeight;
                    this.x += this.direction * GAME.sizes.blockWidth;
                }
            }

            this.x += this.velocity.x;
            this.y += this.velocity.y;
        } else if(this.dying && ++this.currentImage.index.death > 12) {
            this.dying = false;
            this.dead = true;
        }
    }

    NPC.die = function () {
        if(!this.dead && !this.dying) {
            this.dying = true;
            this.climb = 0;
            this.currentImage.index.walk = -1;
            this.currentImage.index.climb = -1;
            this.currentImage.index.death = 0;
        }
    }

    NPC.getMove = function () {
        if(!this.dead && !this.dying) {
            if (GAME.canFall(this.x, this.y, true) || (!this.moved && !this.climb)) {
                this.currentImage.index.walk = -1;
                this.currentImage.index.climb = -1;
                this.currentImage.image = GAME.imageLoader.get("npc", [(this.direction == 1 ? "forward" : "backward"), "stand"]);
                this.currentImage.type = "stand";
            } else if (this.climb) {
                this.moved = false;
                this.currentImage.index.walk = -1;
                this.currentImage.type = "climb";
                this.currentImage.image = GAME.imageLoader.get("npc", [(this.direction == 1 ? "forward" : "backward"), "climb" + (this.climb == 1 ? "Up" : "Down"), Math.max(Math.floor(this.currentImage.index.climb), 0) + ""]);
            } else if (this.moved) {
                this.moved = false;
                this.currentImage.index.climb = -1;
    
                if (++this.currentImage.index.walk > 3) {
                    this.currentImage.index.walk = 0;
                }
                this.currentImage.type = "move";
                this.currentImage.image = GAME.imageLoader.get("npc", [(this.direction == 1 ? "forward" : "backward"), "walk", this.currentImage.index.walk + ""]);
            }
        } else {
            this.currentImage.image = GAME.imageLoader.get("npc", [(this.direction == 1 ? "forward" : "backward"), "die", this.currentImage.index.death]);
            this.currentImage.type = "die";
        }

        return {
            x: this.climb != 0 && this.currentImage.type == "climb" ? this.fixPosClimb.x : this.x,
            y: this.climb != 0 && this.currentImage.type == "climb" ? this.fixPosClimb.y : this.y,
            image: this.currentImage.image
        }
    }

    return NPC;
}