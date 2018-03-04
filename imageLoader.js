function imageLoader() {
    var imageLoader = {
    };

    var urls = [
        "./images/background.png",
        "./images/npc.png",
        "./images/ground.png",
        "./images/groundTp.png",
        "./images/bullet.png",
        "./images/player.png",
        "./images/player2.png"
    ];

    var images = {};

    var regexToCaptureName = /(^.*[\\\/])(.+)(.{4}$)/;
    var loadImage = function(url) {
        return new Promise(function(resolve, reject) {
            try {
                var tmp = new Image();
                tmp.src = url;

                tmp.onload = function() {
                    images[url.replace(regexToCaptureName, "$2")] = tmp;
                    resolve();
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
                return groundLoader(details);
            case "player":
                return playerLoader(details);
            case "player2":
                return playerLoader(details, true)
            case "npc":
                return npcLoader(details);
            case "bullet":
                return bulletLoader(details);
            case "background":
                return backgroundLoader(details);
            case "navigation":
                return navigationLoader(details);
        }

        return {x:0, y:0, image: null};
    }

    let npcLoader = function(details) {
        let rO = {};
        rO.x = 0;
        rO.y = 0;
        rO.image = images.npc;
        
        switch(details[1]) {
            case "walk":
                rO.x = (details[2] || 0) * GAME.sizes.blockWidth;
                rO.y = (details[0] == "forward" ? 1 : 2) * GAME.sizes.blockHeight;
                break;
            case "climbUp":
                rO.x = (details[2] || 0) * GAME.sizes.blockWidth;
                rO.x = rO.x == 0 ? 0 : rO.x + details[2] * GAME.sizes.blockWidth;
                rO.y = (details[0] == "forward" ? 7 : 5) * GAME.sizes.blockHeight;
                rO.height = 2 * GAME.sizes.blockHeight;
                rO.width = 2 * GAME.sizes.blockWidth;
                break;
            break;
            case "climbDown":
                rO.x = (details[2] || 0) * GAME.sizes.blockWidth;
                rO.x = rO.x == 0 ? 0 : rO.x + details[2] * GAME.sizes.blockWidth;
                rO.y = (details[0] == "forward" ? 11 : 9) * GAME.sizes.blockHeight;
                rO.height = 2 * GAME.sizes.blockHeight;
                rO.width = 2 * GAME.sizes.blockWidth;
                break;
            break;
            case "die":
                rO.x = (details[2] || 0) * GAME.sizes.blockWidth;
                rO.y = (details[0] == "forward" ? 4 : 3) * GAME.sizes.blockHeight;
                break;
            break;
            default:
                rO.x = (details[0] == "forward" ? 1 : 0) * GAME.sizes.blockWidth;
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
                rO.y = 6 * GAME.sizes.blockHeight;
                rO.x = (details[0] == "forward" ? 0 : 1) * GAME.sizes.blockWidth;
                break;
            case "die":
                rO.y = 1 * GAME.sizes.blockHeight,
                rO.x = (details[0] == "forward" ? 0 : 1) * GAME.sizes.blockWidth;
                break;
            case "stand":
                rO.x = (details[2] || 0) * GAME.sizes.blockWidth;
                rO.y = (details[0] == "forward" ? 2 : 3) * GAME.sizes.blockHeight;
                break;
            case "walk":
                rO.x = (details[2] || 0) * GAME.sizes.blockWidth;
                rO.y = (details[0] == "forward" ? 4 : 5) * GAME.sizes.blockHeight;
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