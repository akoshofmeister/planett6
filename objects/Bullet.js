function Bullet(x, y, direction, player2) {
    var Bullet = {
        x : x,
        y : y,
        direction : direction,
        destroyed: false,
        velocity: { x: 30 },
        movesToLive: 50, 
        currentImage: { index: 0, image: undefined },
        player2: player2
    };

    Bullet.move = function() {
        if(--this.movesToLive >= 0 && !this.destroyed) {
            if(!this.currentImage.image) {
                this.currentImage.image = GAME.imageLoader.get("bullet", [(this.direction == 1 ? "forward" : "backward"), 0]);
            }

            let whatson = GAME.whatIsOn(this.x + (GAME.sizes.blockWidth / (this.direction == 1 ? 1.4 : 3)), this.y + GAME.sizes.blockHeight / 2 + 5, true);
    
            if(whatson) {
                if(whatson.type == "player" && whatson.player2 != this.player2) {
                    console.log("friendlyfire");
                    this.destroyed = true;
                    whatson.hit && whatson.hit();
                } else if(whatson.type == "npc") {
                    console.log("npchit");
                    this.destroyed = true;
                    whatson.hit && whatson.hit();
                } else if(whatson.type == "ground") {
                    console.log("ground");
                    this.destroyed = true;
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

    Bullet.getMove = function() {

        if(this.destroyed && ++this.currentImage.index <= 4) {
            this.currentImage.image = GAME.imageLoader.get("bullet", [(this.direction == 1 ? "forward" : "backward"), this.currentImage.index]);
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