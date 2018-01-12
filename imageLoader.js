function imageLoader() {
    var imageLoader = {
        images: {},
        urls: [
            "./images/background.png",
            "./images/playerFw.png",
            "./images/playerBw.png",
            "./images/mobFw.png",
            "./images/mobBw.png",
            "./images/ground.png",
            "./images/groundTp.png",
            "./images/playerJmpFw.png",
            "./images/playerJmpBw.png",
            "./images/playerWlkFw1.png",
            "./images/playerWlkBw1.png",
            "./images/playerWlkFw2.png",
            "./images/playerWlkBw2.png",
            "./images/playerWlkFw3.png",
            "./images/playerWlkBw3.png",
            "./images/playerWlkFw4.png",
            "./images/playerWlkBw4.png",
            "./images/bullet.png",
            "./images/playerDthFw.png",
            "./images/playerDthBw.png"
        ]
    };

    var regexToCaptureName = /(^.*[\\\/])(.+)(.{4}$)/;
    var loadImage = function(url) {
        return new Promise(function(resolve, reject) {
            try {
                var tmp = new Image();
                tmp.src = url;

                tmp.onload = function() {
                    imageLoader.images[url.replace(regexToCaptureName, "$2")] = tmp;
                    resolve();
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    imageLoader.loadAll = function() {
        return new Promise(function(resolve, reject) {
            Promise.all(_.transform(imageLoader.urls, function(result, url) {
                result.push(loadImage(url));
            }, []))
            .then(function() {
                console.log(imageLoader.images);
                resolve();
            })  
            .catch(function(err) {
                console.log(err);
                reject();
            })
        })
    }

    return imageLoader;
}