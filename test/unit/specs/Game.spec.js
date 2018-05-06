import Game from '@>/components/game/objects/Game';
import Player from '@>/components/game/objects/Player';
import ImageLoader from '@>/components/game/imageLoader';
import { expect } from 'chai';


describe('Game.js', () => {
  const myCanvas = document.createElement('canvas');
  myCanvas.height = 888;
  myCanvas.width = 1473;
  const myCtx = myCanvas.getContext('2d');
  const game = new Game(1473, 888, myCtx);
  game.imageLoader = new ImageLoader(game);
  game.imageLoader.loadAll();

  it('should initialize', () => {
    expect(game.keys.length).to.equal(9);
    expect(game.width).to.equal(1473);
    expect(game.height).to.equal(888);
    expect(game.ctx).to.equal(myCtx);
    expect(game.drawFrom).to.equal(0);
    expect(game.drawTo).to.equal(12);
    expect(game.isPaused).to.equal(false);
    expect(game.sizes).to.deep.equal({
      blockWidth: 111, blockHeight: 111, tableWidth: 100, tableHeight: 8
    });
    expect(game.blockTypes).to.deep.equal({ air: 'air', ground: 'ground' });
    expect(game.gravity).to.equal(0.2);
    expect(game.players).to.deep.equal([]);
    expect(game.blocks).to.deep.equal([]);
    expect(game.npcs).to.deep.equal([]);
    expect(game.bullets).to.deep.equal([]);
    expect(game.fps).to.equal(28);
  });

  it('should create', () => {
    game.create(true);
    expect(game.blocks.length).to.equal(800);
    expect(game.players.length).to.equal(1);
    expect(game.npcs.length).to.equal(2);
    // expect(document.getEventListener("keydown")).is.not(undefined)
    // expect(document.getEventListener("keyup")).is.not(null)
  });

  it('should stop after starting', () => {
    game.create(true);
    game.start();
    expect(game.isPaused).to.equal(false);
    game.stop();
    expect(game.isPaused).to.equal(true);
  });

  it('should add Bullet', () => {
    game.create(true);
    game.addBullet(0, 10, -1, new Player(game, true));
    expect(game.bullets.length).to.equal(1);
  });

  describe('whatIsOn function', () => {
    it('should return air', () => {
      game.create(true);
      expect(game.whatIsOn(0, 0, false).type).to.equal('air');
    });

    it('should return ground', () => {
      game.create(true);
      expect(game.whatIsOn(1, 6, false).type).to.equal('ground');
    });

    it('should return player', () => {
      game.create(true);
      expect(game.whatIsOn(240, 340, false).type).to.equal('player');
    });

    it('should return npc', () => {
      game.create(true);
      expect(game.whatIsOn(590, 590, false).type).to.equal('npc');
    });
  });

  describe('validPos function', () => {
    it('should return true', () => {
      game.create(true);
      expect(game.validPos(0, 0)).to.equal(true);
    });

    it('should return false', () => {
      game.create(true);
      expect(game.validPos(-1, 0)).to.equal(false);
    });
  });

  describe('isWrongPosition function', () => {
    it('should return 0', () => {
      game.create(true);
      expect(game.isWrongPosition(0, 0)).to.equal(0);
    });

    it('should return 1', () => {
      game.create(true);
      expect(game.isWrongPosition(220, 500)).to.equal(1);
    });

    it('should return -1', () => {
      game.create(true);
      expect(game.isWrongPosition(50, 500)).to.equal(-1);
    });
  });

  describe('canFall function', () => {
    it('should return true', () => {
      game.create(true);
      expect(game.canFall(0, 0, false)).to.equal(true);
    });

    it('should return false', () => {
      game.create(true);
      expect(game.canFall(1, 6, false)).to.equal(false);
    });
  });

  describe('canGo function', () => {
    /*
    it('should return true', () => {
      game.create(true);
      expect(game.canGo(1,6,false,false)).to.equal(true);
    });
    */
    it('should return false', () => {
      game.create(true);
      expect(game.canGo(9, 5, false, false)).to.equal(false);
    });
  });

  describe('canClimb function', () => {
    it('should return 1', () => {
      game.create(true);
      expect(game.canClimb(6, 6, true, false)).to.equal(1);
    });

    it('should return -1', () => {
      game.create(true);
      expect(game.canClimb(8, 4, true, false)).to.equal(-1);
    });

    it('should return 0', () => {
      game.create(true);
      expect(game.canClimb(9, 5, true, false)).to.equal(0);
    });
  });

  it('normalize functions', () => {
    game.create(true);
    expect(game.normalizeX(1.2)).to.equal(0);
    expect(game.normalizeX(212)).to.equal(1);
    expect(game.normalizeX(567)).to.equal(5);
    expect(game.normalizeX(730)).to.equal(6);
  });
});
