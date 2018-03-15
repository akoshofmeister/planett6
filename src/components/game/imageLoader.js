/* eslint-disable */
export default function (game) {
    var imageLoader = {
        game:game
    };

    var urls = [
        require("./images/background.png"),
        require("./images/npc.png"),
        require("./images/ground.png"),
        require("./images/groundTp.png"),
        require("./images/bullet.png"),
        require("./images/player.png"),
        require("./images/player2.png")
    ];

    var images = {};

    var regexToCaptureName = /(^.*[\\\/])([^.]+)(.*)/;
    var loadImage = function(url) {
        return new Promise(function(resolve, reject) {
            try {
                var tmp = new Image();
                tmp.src = url;
                
                tmp.onload = function() {
                    console.log(url.replace(regexToCaptureName, "$2"))
                    images[url.replace(regexToCaptureName, "$2")] = tmp;
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
            Promise.all( 
                urls.reduce(
                    (res, url) => { res.push(loadImage(url)); return res; }
                    , []) 
            )
            .then(function() {
                console.log("loaded")
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
        }

        return {x:0, y:0, image: null};
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