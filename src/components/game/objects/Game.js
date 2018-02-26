/* eslint-disable */

export class GAME {
  constructor(width, height, ctx) {
    const GAME = {
      width,
      height,
      ctx,
      blocks: [],
      mobs: [],
      direction: 0,
      player: null,
      drawFrom: 0,
      drawTo: 12,
      space: 7,
      minSpace: 2,
      isPaused: false,
      jump: 0,
      bullets: [],

      imageLodar: null,
      navigator: { lastUpdate: 0, forward: false, backward: false, up: false },
      sizes: { blockWidth: 111, blockHeight: 111, tableWidth: 100, tableHeight: 8 },
      movement: { lastUpdate: new Date(), period: 75 },
      gravity: 0.2,
    };

    let interval;

    const createBlocks = () => {
      for (let i = 0; i < GAME.sizes.tableWidth; ++i) {
        for (let j = 0; j < GAME.sizes.tableHeight; ++j) {
          let type = j > 5 ? 'ground' : 'sky';
          type = j == 6 ? 'groundTp' : type;

          /* if(i == 1) {
                      if(j == 5) {
                          type = "groundTp";
                      } else if(j == 6) {
                          type = "ground";
                      }
                  } */

          GAME.blocks.push(new Block(type, GAME.imageLoader.get(type), i * GAME.sizes.blockWidth, j * GAME.sizes.blockHeight));
        }
      }
    };

    const addPlayer = () => {
      GAME.player = new Player();
    };

    return GAME;
  }

  static updateImageFrame() {
    const now = new Date();

    if (now - this.movement.lastUpdate >= this.movement.period) {
      this.movement.lastUpdate = now;
      return true;
    }

    return false;
  }

  static draw() {
    ctx.clearRect(0, 0, 1473, 888);
    const background = GAME.imageLoader.get('background');
    ctx.drawImage(background.image, 0, 0);

    const blocks = GAME.blocks.slice(GAME.drawFrom * GAME.sizes.tableHeight, (GAME.drawTo + 2) * GAME.sizes.tableHeight - GAME.drawFrom * GAME.sizes.tableHeight);

    blocks.forEach((block) => {
      GAME.ctx.drawImage(block.getImage().image, block.getX() - GAME.drawFrom * GAME.sizes.blockWidth, block.getY());
    });

    const play = GAME.player.getMove();

    GAME.ctx.drawImage(play.image.image,
      play.image.x, play.image.y,
      GAME.sizes.blockWidth,
      GAME.sizes.blockHeight,
      play.x - GAME.drawFrom * GAME.sizes.blockWidth,
      play.y, GAME.sizes.blockWidth,
      GAME.sizes.blockHeight);
  }

  static round() {
    const now = new Date();
    const diff = (now - GAME.navigator.lastUpdate) / 1000;

    GAME.player.move(diff, GAME.navigator);

    GAME.navigator.lastUpdate = now;
    GAME.draw();
  }

  static normalizeX(x) {
    return Math.floor(x / GAME.sizes.blockWidth);
  }

  static normalizeY(y) {
    return Math.floor(y / GAME.sizes.blockHeight);
  }

  static start() {
    GAME.isPaused = false;
    interval = setInterval(GAME.round, 1);
  }

  static stop() {
    if (interval) {
      clearInterval(interval);
      GAME.isPaused = true;
    }
  }

  static create() {
    return new Promise((resolve, reject) => {
      try {
        GAME.imageLoader = new imageLoader();
        GAME.imageLoader.loadAll()
          .then(() => {
            createBlocks();
            addPlayer();
            resolve();
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}
