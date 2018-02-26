/* eslint-disable */

function imageLoader() {
  const imageLoader = {
  };

  const urls = [
    './images/background.png',
    /* "./images/npc.png", */
    './images/ground.png',
    './images/groundTp.png',
    './images/bullet.png',
    './images/player.png',
  ];

  const images = {};

  const regexToCaptureName = /(^.*[\\\/])(.+)(.{4}$)/;
  const loadImage = function (url) {
    return new Promise(((resolve, reject) => {
      try {
        const tmp = new Image();
        tmp.src = url;

        tmp.onload = function () {
          images[url.replace(regexToCaptureName, '$2')] = tmp;
          resolve();
        };
      } catch (err) {
        reject(err);
      }
    }));
  };

  imageLoader.loadAll = function () {
    return new Promise(((resolve, reject) => {
      Promise.all(_.transform(urls, (result, url) => {
        result.push(loadImage(url));
      }, []))
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    }));
  };

  imageLoader.get = function (what) {
    const details = what.trim().split(/^([a-z]+)([A-Z][a-z]*)?([A-Z][a-z]*)?([0-9]*)$/);
    details.shift();
    details.pop();
    switch (details[0]) {
      case 'ground':
        return groundLoader(details.slice(1));
      case 'player':
        return playerLoader(details.slice(1));
      case 'npc':
        return npcLoader(details.slice(1));
      case 'bullet':
        return bulletLoader(details.slice(1));
      case 'background':
        return backgroundLoader(details.slice(1));
      case 'navigation':
        return navigationLoader(details.slice(1));
    }

    return { x: 0, y: 0, image: new Image() };
  };

  var groundLoader = function (details) {
    const rO = {};
    rO.x = 0;
    rO.y = 0;
    if (details[0] == 'Tp') {
      rO.image = images.groundTp;
    } else {
      rO.image = images.ground;
    }

    return rO;
  };

  var playerLoader = function (details) {
    const rO = {};
    rO.image = images.player;

    switch (details[1]) {
      case 'Jmp':
        rO.y = 6 * GAME.sizes.blockHeight;
        rO.x = (details[0] == 'Fw' ? 0 : 1) * GAME.sizes.blockWidth;
        break;
      case 'death':
        rO.y = 1 * GAME.sizes.blockHeight,
        rO.x = (details[0] == 'Fw' ? 0 : 1) * GAME.sizes.blockWidth;
        break;
      case 'Stnd':
        rO.x = (details[2] || 0) * GAME.sizes.blockWidth;
        rO.y = (details[0] == 'Fw' ? 2 : 3) * GAME.sizes.blockHeight;
        break;
      case 'Wlk':
        rO.x = (details[2] || 0) * GAME.sizes.blockWidth;
        rO.y = (details[0] == 'Fw' ? 4 : 5) * GAME.sizes.blockHeight;
        break;
    }

    return rO;
  };

  var backgroundLoader = function (details) {
    const rO = {};
    rO.x = 0;
    rO.y = 0;
    rO.image = images.background;

    return rO;
  };
  return imageLoader;
}
