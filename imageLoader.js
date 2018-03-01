function imageLoader() {
    var imageLoader = {
    };

    var urls = [
        "./images/background.png",
        /* "./images/npc.png", */
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

    var groundLoader = function(details) {
        var rO = {};
        rO.x = 0;
        rO.y = 0;
        if(details[0] == "Tp") {
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
            case "Jmp":
                rO.y = 6 * GAME.sizes.blockHeight;
                rO.x = (details[0] == "Fw" ? 0 : 1) * GAME.sizes.blockWidth;
                break;
            case "death":
                rO.y = 1 * GAME.sizes.blockHeight,
                rO.x = (details[0] == "Fw" ? 0 : 1) * GAME.sizes.blockWidth;
                break;
            case "Stnd":
                rO.x = (details[2] || 0) * GAME.sizes.blockWidth;
                rO.y = (details[0] == "Fw" ? 2 : 3) * GAME.sizes.blockHeight;
                break;
            case "Wlk":
                rO.x = (details[2] || 0) * GAME.sizes.blockWidth;
                rO.y = (details[0] == "Fw" ? 4 : 5) * GAME.sizes.blockHeight;
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