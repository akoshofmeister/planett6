/* eslint-disable */
export default function (game, x, y, direction, player) {
    var Bullet = {
        x : x,
        y : y,
        direction : direction,
        destroyed: false,
        velocity: { x: 30 },
        movesToLive: 50, 
        currentImage: { index: 0, image: undefined },
        game: game,
        player: player
    };

    Bullet.move = function() {
        if(--this.movesToLive >= 0 && !this.destroyed) {
            if(!this.currentImage.image) {
                this.currentImage.image = this.game.imageLoader.get("bullet", [(this.direction == 1 ? "forward" : "backward"), 0]);
            }

            let whatson = this.game.whatIsOn(this.x + (this.game.sizes.blockWidth / (this.direction == 1 ? 1.4 : 3)), this.y + this.game.sizes.blockHeight / 2 + 5, true);
    
            if(whatson) {
                if(whatson.type == "player" && whatson != this.player) {
                    whatson.hit && whatson.hit();
                    destroy.bind(this)();
                } else if(whatson.type == "npc") {
                    whatson.hit && whatson.hit();
                    destroy.bind(this)(whatson.health == 0);
                } else if(whatson.type == "ground") {
                    destroy.bind(this)();
                } else {
                    this.x += this.direction * this.velocity.x;
                }
            } else {
                console.log("outofst");
                this.destroyed = true;
                this.currentImage.index = 5;
            }
        }
    }

    let destroy = function(npcKilled) {
        this.destroyed = true;

        if(npcKilled) {
            this.player.npcKilled();
        }
    }

    Bullet.getMove = function() {

        if(this.destroyed && ++this.currentImage.index <= 4) {
            this.currentImage.image = this.game.imageLoader.get("bullet", [(this.direction == 1 ? "forward" : "backward"), this.currentImage.index]);
        }

        return {
            x: this.x,
            y: this.y,
            image: this.currentImage.image,
            destroyed: this.movesToLive < 0 || (this.destroyed && this.currentImage.index > 4)
        }
    }

    return Bullet;
}