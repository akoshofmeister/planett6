/* eslint-disable */
export default function (game) {
    var imageLoader = {
        game:game
    };

    var urls = {
        "background": require("./images/background.png"),
        "npc": require("./images/npc.png"),
        "ground": require("./images/ground.png"),
        "groundTp": require("./images/groundTp.png"),
        "bullet": require("./images/bullet.png"),
        "player": require("./images/player.png"),
        "player2": require("./images/player2.png"),
        "heart": require("./images/heart.png"),
        "brokenheart": require("./images/brokenheart.png"),
        "0": require("./images/0.png"),
        "1": require("./images/1.png"),
        "2": require("./images/2.png"),
        "3": require("./images/3.png"),
        "4": require("./images/4.png"),
        "5": require("./images/5.png"),
        "6": require("./images/6.png"),
        "7": require("./images/7.png"),
        "8": require("./images/8.png"),
        "9": require("./images/9.png"),
        "fire0": require("./images/tuz0.png"),
        "fire1": require("./images/tuz1.png"),
        "fire2": require("./images/tuz2.png"),
        "fire3": require("./images/tuz3.png"),
        "fire4": require("./images/tuz4.png"),
        "spike": require("./images/spike.png")
    };

    var images = {};

    var loadImage = function(url, name) {
        return new Promise(function(resolve, reject) {
            try {
                var tmp = new Image();
                tmp.src = url;
                
                tmp.onload = function() {
                    images[name] = tmp;
                    resolve();
                }

                tmp.onerror = function(obj) {
                    console.log("Error while loading "+url, obj)
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    imageLoader.loadAll = function() {
        return new Promise(function(resolve, reject) {
            let getPromises = function() {
                let ret = [];
                for(let name in urls) {
                    ret.push(loadImage(urls[name], name));
                }
                return ret;
            }
            Promise.all( 
                getPromises()
            )
            .then(function() {
                resolve();
            })  
            .catch(function(err) {
                console.log(err);
                reject();
            })
        })
    }

    imageLoader.get = function(what, details) {
        details = details instanceof Array ? details : [details];
        switch(what) {
            case "ground":
                return groundLoader.bind(this)(details);
            case "player":
                return playerLoader.bind(this)(details);
            case "player2":
                return playerLoader.bind(this)(details, true)
            case "npc":
                return npcLoader.bind(this)(details);
            case "bullet":
                return bulletLoader.bind(this)(details);
            case "background":
                return backgroundLoader.bind(this)(details);
            case "navigation":
                return navigationLoader.bind(this)(details);
            case "fire":
                return fireLoader.bind(this)(details);
            case "spike":
                return spikeLoader.bind(this)(details);
            default:
                return {x:0, y: 0, image: images[what]};
        }
    }

    let fireLoader = function(details) {
        return {
            x: 0,
            y: 0,
            image: images["fire"+details]
        };
    }

    let spikeLoader = function(details) {
        return {
            x: 0,
            y: 0,
            image: images.spike
        };
    }

    let bulletLoader = function(details) {
        let rO = {};
        rO.x = (details[1] || 0) * this.game.sizes.blockWidth;
        rO.y = (details[0] == "forward" ? 0 : 1) * this.game.sizes.blockHeight;
        rO.image = images.bullet;

        return rO;
    }

    let npcLoader = function(details) {
        let rO = {};
        rO.x = 0;
        rO.y = 0;
        rO.image = images.npc;
        
        switch(details[1]) {
            case "walk":
                rO.x = (details[2] || 0) * this.game.sizes.blockWidth;
                rO.y = (details[0] == "forward" ? 1 : 2) * this.game.sizes.blockHeight;
                break;
            case "climbUp":
                rO.x = (details[2] || 0) * this.game.sizes.blockWidth;
                rO.x = rO.x == 0 ? 0 : rO.x + details[2] * this.game.sizes.blockWidth;
                rO.y = (details[0] == "forward" ? 7 : 5) * this.game.sizes.blockHeight;
                rO.height = 2 * this.game.sizes.blockHeight;
                rO.width = 2 * this.game.sizes.blockWidth;
                break;
            break;
            case "climbDown":
                rO.x = (details[2] || 0) * this.game.sizes.blockWidth;
                rO.x = rO.x == 0 ? 0 : rO.x + details[2] * this.game.sizes.blockWidth;
                rO.y = (details[0] == "forward" ? 11 : 9) * this.game.sizes.blockHeight;
                rO.height = 2 * this.game.sizes.blockHeight;
                rO.width = 2 * this.game.sizes.blockWidth;
                break;
            break;
            case "die":
                rO.x = (details[2] || 0) * this.game.sizes.blockWidth;
                rO.y = (details[0] == "forward" ? 4 : 3) * this.game.sizes.blockHeight;
                break;
            break;
            default:
                rO.x = (details[0] == "forward" ? 1 : 0) * this.game.sizes.blockWidth;
            break;
        }

        return rO;
    }

    var groundLoader = function(details) {
        var rO = {};
        rO.x = 0;
        rO.y = 0;
        if(details[0] == "top") {
            rO.image = images.groundTp;
        } else {
            rO.image = images.ground;
        }

        return rO;
    }

    var playerLoader = function(details, player2) {
        var rO = {};
        rO.image = player2 ? images.player2 : images.player;
        
        switch(details[1]) {
            case "jump":
                rO.y = 6 * this.game.sizes.blockHeight;
                rO.x = (details[0] == "forward" ? 0 : 1) * this.game.sizes.blockWidth;
                break;
            case "die":
                rO.y = 1 * this.game.sizes.blockHeight,
                rO.x = (details[0] == "forward" ? 0 : 1) * this.game.sizes.blockWidth;
                break;
            case "stand":
                rO.x = (details[2] || 0) * this.game.sizes.blockWidth;
                rO.y = (details[0] == "forward" ? 2 : 3) * this.game.sizes.blockHeight;
                break;
            case "walk":
                rO.x = (details[2] || 0) * this.game.sizes.blockWidth;
                rO.y = (details[0] == "forward" ? 4 : 5) * this.game.sizes.blockHeight;
                break;
        }
        
        return rO;
    }

    var backgroundLoader = function(details) {
        var rO = {};
        rO.x = 0;
        rO.y = 0;
        rO.image = images.background;

        return rO;
    }
    return imageLoader;
}