/* eslint-disable */
export default function (game, x, y, type) {
    let Other = {
        type: type,
        x: x,
        y: y,
        currentImage: { index: 0, image: game.imageLoader.get(type, 0)},
        game: game
    };

    Other.getMove = function () {
        switch(this.type) {
            case "fire":
                if(++this.currentImage.index > 4) {
                    this.currentImage.index = 0;
                }
                break;
        }

        this.currentImage.image = this.game.imageLoader.get(this.type, this.currentImage.index);        

        return {
            x: this.x,
            y: this.y,
            image: this.currentImage.image
        }
    }

    return Other;
}