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
    assert(bullet.x === 90);
    assert(bullet.y === 500);
    assert(bullet.direction === 1);
    assert(bullet.destroyed === false);
    assert(bullet.movesToLive === 50);
    assert(bullet.player2 === player);
    assert(bullet.game === game);
  });

  describe('check move function', () => {
    it('should destroyed', () => {
      bullet.move();
      expect(bullet.destroyed).to.equal(true);
    });

    it('shouldn\'t destroyed', () => {
      const tmpBullet = new Bullet(game, 222, 555, 1, player);
      tmpBullet.move();
      expect(tmpBullet.destroyed).to.equal(false);
    });
  });

  it('check getMove function', () => {
    const result = bullet.getMove();
    expect(result.x).to.equal(90);
    expect(result.y).to.equal(500);
    expect(result.destroyed).to.equal(false);
  });
});
