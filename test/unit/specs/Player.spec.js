import Game from '@>/components/game/objects/Game';
import ImageLoader from '@>/components/game/imageLoader';
import Player from '@>/components/game/objects/Player';

describe('Player.js', () => {
  let player;

  const myCanvas = document.createElement('canvas');
  myCanvas.height = 888;
  myCanvas.width = 1473;
  const myCtx = myCanvas.getContext('2d');
  const game = new Game(1473, 888, myCtx);
  game.imageLoader = new ImageLoader(game);
  game.imageLoader.loadAll();
  game.create(true);

  it('should initialize a player', () => {
    player = new Player(game, true);
    expect(player.type).to.equal('player');
    expect(player.x).to.equal(111);
    expect(player.y).to.equal(333);
    expect(player.direction).to.equal(1);
    expect(player.maxSpeed).to.deep.equal({ x: 500, y: 8 });
    expect(player.velocity).to.deep.equal({ x: 0, y: 0 });
    expect(player.acceleration).to.deep.equal({ x: 700, y: 0 });
    expect(player.moved).to.equal(false);
    expect(player.player2).to.equal(false);
    expect(player.canShoot).to.equal(true);
    expect(player.health).to.equal(5);
    expect(player.dead).to.equal(false);
    expect(player.game).to.equal(game);
  });

  it('should shoot', () => {
    player.shoot();
    expect(game.bullets.length).to.equal(1);
  });
});
