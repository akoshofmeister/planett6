import Game from '@>/components/game/objects/Game';
import ImageLoader from '@>/components/game/imageLoader';
import Bullet from '@>/components/game/objects/Bullet';
import Player from '@>/components/game/objects/Player';

describe('Bullet.js', () => {
  let bullet;

  const myCanvas = document.createElement('canvas');
  myCanvas.height = 888;
  myCanvas.width = 1473;
  const myCtx = myCanvas.getContext('2d');
  const game = new Game(1473, 888, myCtx);
  game.imageLoader = new ImageLoader(game);
  game.imageLoader.loadAll();
  game.create(true);
  const player = new Player(game, true);

  it('should initialize a bullet', () => {
    bullet = new Bullet(game, 90, 500, 1, player);
    expect(bullet.x).to.equal(90);
    expect(bullet.y).to.equal(500);
    expect(bullet.direction).to.equal(1);
    expect(bullet.destroyed).to.equal(false);
    expect(bullet.movesToLive).to.equal(50);
    expect(bullet.game).to.equal(game);
  });

  it('check getMove function', () => {
    bullet = new Bullet(game, 90, 500, 1, player);
    const result = bullet.getMove();
    expect(result.x).to.equal(90);
    expect(result.y).to.equal(500);
    expect(result.destroyed).to.equal(false);
  });
});
