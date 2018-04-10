/* eslint-disable */
import Bullet from './Bullet';
import Block from './Block';
import NPC from './Npc';
import Player from './Player';
import Other from './Other';
import imageLoader from '../imageLoader';

export default function (width, height, ctx) {
    var GAME = {
        keys: [
            {
                key: 27,
                fnDown: () => { GAME.isPaused ? GAME.start() : GAME.stop(); }
            }, {
                key: 39,
                fnUp: () => { GAME.navigator.player.forward = false; },
                fnDown: () => { GAME.navigator.player.forward = true; }
            }, {
                key: 37,
                fnUp: () => { GAME.navigator.player.backward = false; },
                fnDown: () => { GAME.navigator.player.backward = true; }
            }, {
                key: 38,
                fnUp: () => { GAME.navigator.player.up = false; },
                fnDown: () => { GAME.navigator.player.up = true; }
            }, {
                key: 68,
                fnUp: () => { GAME.navigator.player2.forward = false; },
                fnDown: () => { GAME.navigator.player2.forward = true; }
            }, {
                key: 65,
                fnUp: () => { GAME.navigator.player2.backward = false; },
                fnDown: () => { GAME.navigator.player2.backward = true; }
            }, {
                key: 87,
                fnUp: () => { GAME.navigator.player2.up = false; },
                fnDown: () => { GAME.navigator.player2.up = true; }
            }, {
                key: 16,
                fnDown: () => { GAME.navigator.player.shoot = true; },
                fnUp: () => { GAME.navigator.player.shoot = false; }
            }, {
                key: 32,
                fnDown: () => { GAME.navigator.player2.shoot = true; },
                fnUp: () => { GAME.navigator.player2.shoot = false; }
            }
        ],
        width,
        height,
        ctx,
        draw: {from: 20, diff: 0, to: 34},
        isPaused: false,

        imageLodar: null,
        navigator: { "lastUpdate": Date.now(), "player": { forward: false, backward: false, up: false }, "player2": { forward: false, backward: false, up: false } },
        sizes: { blockWidth: 111, blockHeight: 111, tableWidth: 30, tableHeight: 8 },
        blockTypes: { air: "air", ground: "ground" },
        movement: { lastUpdate: new Date(), period: 60, block: {minX: 0, maxX: 1000} },
        gravity: 0.2,

        players: [],
        blocks: [],
        npcs: [],
        bullets: [],
        others: [],

        fps: 28
    }

    GAME.addBullet = function (player) {
        this.bullets.push(new Bullet(this, player.x, player.y, player.direction, player));
    }

    GAME.whatIsOn = function (x, y, doNormalization, player) {

        for (let npc of GAME.npcs.filter(npc => { return player ? true : !npc.dead; })) {
            if ((player ? npc.x : (npc.x + 25)) <= x && x <= (player ? npc.x + 111 : (npc.x + 75)) && npc.y <= y && y <= (npc.y + GAME.sizes.blockHeight)) {
                return npc;
            }
        }

        if(player) {
            for (let stuff of GAME.others) {
                if (stuff.x <= x && x <= stuff.x + 111 && stuff.y <= y && y <= stuff.y + GAME.sizes.blockHeight) {
                    return stuff;
                }
            }
        }

        for (let player of GAME.players) {
            if ((player.x + 10) <= x && x <= (player.x + 101) && player.y <= y && y <= (player.y + GAME.sizes.blockHeight)) {
                return player;
            }
        }

        if (doNormalization) {
            x = GAME.normalizeX(x);
            y = GAME.normalizeX(y);
        }

        return GAME.blocks[x * GAME.sizes.tableHeight + y];
    }

    GAME.isWrongPosition = function (x, y) {
        let x2 = this.normalizeX(x + this.sizes.blockWidth);
        x = this.normalizeX(x);
        y = this.normalizeY(y);

        if (
            x != x2 &&
            this.validPos(x, y) &&
            this.validPos(x2, y) &&
            this.blocks[x * this.sizes.tableHeight + y].type !=
            this.blocks[x2 * this.sizes.tableHeight + y].type
        ) {
            if (this.blocks[x * this.sizes.tableHeight + y].type == this.blockTypes.air) {
                return -1;
            } else {
                return 1;
            }
        }

        return 0;
    }

    GAME.getGoodPosition = function (x, y) {
        let isWrongPosition = this.isWrongPosition(x, y);

        if (isWrongPosition == 1) {
            return (this.normalizeX(x) + 1) * this.sizes.blockWidth;
        } else if (isWrongPosition == -1) {
            return this.normalizeX(x) * this.sizes.blockWidth;
        }
    }

    GAME.validPos = function (x, y, doNormalization) {
        let blockingCondition;

        if (doNormalization) {
            blockingCondition = this.movement.block.minX <= x && this.movement.block.maxX >= x;
            x = this.normalizeX(x);
            y = this.normalizeX(y);
        } else {
            blockingCondition = this.movement.block.minX <= x*GAME.sizes.blockWidth && this.movement.block.maxX >= x*GAME.sizes.blockWidth;
        }

        return y < this.sizes.tableHeight && !!this.blocks[x * this.sizes.tableHeight + y] && blockingCondition;
    }

    GAME.canFall = function (x, y, doNormalization) {

        if (doNormalization) {
            x += this.sizes.blockWidth / 2;
            x = this.normalizeX(x);
            y = this.normalizeX(y);
        }

        return this.blocks[x * this.sizes.tableHeight + y + 1].type == this.blockTypes.air;
    }

    GAME.canGo = function (x, y, forward, doNormalization) {
        y += this.sizes.blockHeight / 2;

        if (doNormalization) {
            x = this.normalizeX(x);
            y = this.normalizeX(y);
        }

        if (forward) {
            x++;
        }

        return !!this.blocks[x * this.sizes.tableHeight + y] && this.blocks[x * this.sizes.tableHeight + y].type == this.blockTypes.air;
    }

    GAME.canClimb = function (x, y, forward, doNormalization) {

        if (doNormalization) {
            x = this.normalizeX(x);
            y = this.normalizeX(y);
        }

        if (forward) {
            x++;
        }

        if (!!this.blocks[x * this.sizes.tableHeight + y] && this.blocks[x * this.sizes.tableHeight + y].type == this.blockTypes.ground &&
            !!this.blocks[x * this.sizes.tableHeight + y + 1] && this.blocks[x * this.sizes.tableHeight + y - 1].type == this.blockTypes.air) {
            return 1;
        }

        if (!!this.blocks[x * this.sizes.tableHeight + y] && this.blocks[x * this.sizes.tableHeight + y].type == this.blockTypes.air &&
            !!this.blocks[x * this.sizes.tableHeight + y + 1] && this.blocks[x * this.sizes.tableHeight + y + 1].type == this.blockTypes.air &&
            !!this.blocks[x * this.sizes.tableHeight + y + 2] && this.blocks[x * this.sizes.tableHeight + y + 2].type == this.blockTypes.ground) {
            return -1;
        }

        return 0;
    }

    GAME.getGround = function (x, doNormalization) {
        x += this.sizes.blockWidth / 2;

        if (doNormalization) {
            x = this.normalizeX(x);
        }

        var blocks = this.blocks.slice(x * this.sizes.tableHeight, x * this.sizes.tableHeight + this.sizes.tableHeight);

        for (var i in blocks) {
            //TODO groundTop
            if (blocks[i].type == this.blockTypes.ground) {
                return blocks[i - 1];
            }
        }
    }

    GAME.updateImageFrame = function (reset) {
        var now = new Date();

        if (now - this.movement.lastUpdate >= this.movement.period) {
            reset && (this.movement.lastUpdate = now);
            return true;
        }

        return false;
    }

    let convertNumber = function(number) {
        let images = [];

        (number+"").split("").forEach(digit => images.push(GAME.imageLoader.get(digit).image))
 
        return images;
    }

    let calcViewport = function() {

        let filteredPlayers = GAME.players.filter(player => !player.dead);

        if(filteredPlayers.length) {
            let minPlayer = {x: Infinity};
            let maxPlayer = {x: -Infinity};
            filteredPlayers.forEach(player => {
                if(player.x < minPlayer.x) {
                    minPlayer = player;
                }

                if(player.x > maxPlayer.x) {
                    maxPlayer = player;
                }
            })

            let avg = (maxPlayer.x + minPlayer.x) / 2;
            let dist = maxPlayer.x - minPlayer.x;

            if(dist <= 10*GAME.sizes.blockWidth) {
                GAME.movement.block.minX = Math.max(avg - 5*GAME.sizes.blockWidth, 0);
                GAME.movement.block.maxX = Math.min(avg + 5*GAME.sizes.blockWidth, GAME.sizes.tableWidth * GAME.sizes.blockWidth);
            } else {
                avg = (GAME.movement.block.minX + GAME.movement.block.maxX) / 2;
            }

            GAME.draw.from = Math.min(Math.max(GAME.normalizeX(avg) - 8, 0), GAME.sizes.tableWidth - 14);
            GAME.draw.to = Math.min(GAME.normalizeX(avg) + 9, GAME.sizes.tableWidth);

            if(GAME.draw.from == 0) {
                GAME.draw.to += 8 - GAME.normalizeX(avg);
            }

            GAME.draw.diff = GAME.sizes.tableWidth - 14 == GAME.draw.from ? 0 : Math.max(avg - 8*(GAME.sizes.blockWidth) - GAME.draw.from * GAME.sizes.blockWidth, 0);
        
        }
    }

    GAME.draw = function () {
        GAME.ctx.canvas.width = GAME.ctx.canvas.width;
        GAME.ctx.drawImage(GAME.imageLoader.get("background").image, 0, 0);

        calcViewport();
        for(let i = GAME.draw.from * GAME.sizes.tableHeight; i < GAME.draw.to * GAME.sizes.tableHeight; ++i) {
            let block = GAME.blocks[i];
            if (block.getImage().image) {
                GAME.ctx.drawImage(block.getImage().image, block.getX() - GAME.draw.from * GAME.sizes.blockWidth - GAME.draw.diff, block.getY());
            }
        }

        let c = 0;
        this.players.filter(player => !player.dead || GAME.normalizeY(player.y) < GAME.sizes.tableHeight).forEach((player) => {
            var play = player.getMove();

            GAME.ctx.fillStyle="white";
            GAME.ctx.font="17.5px Courier New";

            let marginLeft = c++ * (GAME.ctx.canvas.width - 5 * 42);

            GAME.ctx.fillText(player.name, (player.x - GAME.draw.from * GAME.sizes.blockWidth - GAME.draw.diff) + (GAME.sizes.blockWidth - GAME.ctx.measureText(player.name).width) / 2 , player.y - 10);

            GAME.ctx.drawImage(play.image.image,
                play.image.x, play.image.y,
                GAME.sizes.blockWidth,
                GAME.sizes.blockHeight,
                play.x - GAME.draw.from * GAME.sizes.blockWidth - GAME.draw.diff,
                play.y,
                GAME.sizes.blockWidth,
                GAME.sizes.blockHeight);
        })

        c = 0;
        this.players.forEach(player => {
            let marginLeft = c++ * (GAME.ctx.canvas.width - 5 * 42);
            GAME.ctx.font="20px Courier New";
            GAME.ctx.fillText(player.name, marginLeft + 5 , GAME.ctx.canvas.height - 80);
            
            let i = 0;
            for(; i < player.health; ++i) {
                GAME.ctx.drawImage(GAME.imageLoader.get("heart").image, 0, 0, 75, 55, marginLeft + i * 40, GAME.ctx.canvas.height - 40, 40, 29);
            }

            for(; i < 5; ++i) {
                GAME.ctx.drawImage(GAME.imageLoader.get("brokenheart").image, 0, 0, 75, 55, marginLeft + i * 42, GAME.ctx.canvas.height - 35, 40, 29);
            }

            let numbers = convertNumber(player.killCounter);

            for(i = 0; i < numbers.length; ++i) {
                GAME.ctx.drawImage(numbers[i], 0, 0, 39, 57, marginLeft + 5 + i * 20, GAME.ctx.canvas.height - 75, 20, 29);                
            }
        })

        let inViewPort = function(x) {
            return GAME.draw.from * GAME.sizes.blockWidth <= x && x <= GAME.draw.to * GAME.sizes.blockWidth;
        }

        this.npcs.filter(npc => inViewPort(npc.x)).forEach((npc) => {
            npc = npc.getMove();
            GAME.ctx.drawImage(npc.image.image,
                npc.image.x, npc.image.y,
                npc.image.width || GAME.sizes.blockWidth,
                npc.image.height || GAME.sizes.blockHeight,
                npc.x - GAME.draw.from * GAME.sizes.blockWidth - GAME.draw.diff,
                npc.y,
                npc.image.width || GAME.sizes.blockWidth,
                npc.image.height || GAME.sizes.blockHeight);
        })

        let bulletsToDelete = [];

        for (let i = 0; i < this.bullets.length; ++i) {
            let bullet = this.bullets[i].getMove();

            if (!bullet.destroyed) {
                if(inViewPort(bullet.x)) {
                    GAME.ctx.drawImage(bullet.image.image,
                        bullet.image.x, bullet.image.y,
                        bullet.image.width || GAME.sizes.blockWidth,
                        bullet.image.height || GAME.sizes.blockHeight,
                        bullet.x - GAME.draw.from * GAME.sizes.blockWidth - GAME.draw.diff,
                        bullet.y,
                        bullet.image.width || GAME.sizes.blockWidth,
                        bullet.image.height || GAME.sizes.blockHeight);
                }
            } else {
                bulletsToDelete.push(i);
            }
        }

        bulletsToDelete.forEach((bullet) => {
            GAME.bullets.splice(bullet, 1);
        })

        this.others.forEach(other => {
            other = other.getMove();
            GAME.ctx.drawImage(other.image.image,
                other.image.x, other.image.y,
                other.image.width || GAME.sizes.blockWidth,
                other.image.height || GAME.sizes.blockHeight,
                other.x - GAME.draw.from * GAME.sizes.blockWidth - GAME.draw.diff,
                other.y,
                other.image.width || GAME.sizes.blockWidth,
                other.image.height || GAME.sizes.blockHeight);
        })

        GAME.updateImageFrame(true);
    };

    GAME.round = function () {
        let now = Date.now();
        let diff = (now - GAME.navigator.lastUpdate) / 1000;

        GAME.players.forEach(player => 
            player.move(diff, GAME.navigator[player.player2 ? "player2" : "player"]));

        GAME.npcs.forEach(npc => 
            npc.move(diff));

        GAME.bullets.forEach(bullet => 
            bullet.move(diff));

        GAME.navigator.lastUpdate = now;

        if (GAME.updateImageFrame()) {
            GAME.draw();
        }

    };

    GAME.normalizeX = function (x) {
        return Math.floor(x / GAME.sizes.blockWidth);
    }

    GAME.normalizeY = function (y) {
        return Math.floor(y / GAME.sizes.blockHeight);
    }

    var interval;

    GAME.start = function () {
        GAME.isPaused = false;
        interval = setInterval(GAME.round, 1000 / GAME.fps);
    };

    GAME.stop = function () {
        if (interval) {
            clearInterval(interval);
            GAME.isPaused = true;
        }
    };

    let blockUp = function() {
        if(prevType != "fire" && prevType != "spike" && currentLevel < 1) {
            currentLevel++;
            prevType = "up";
            return "ground";
        }

        return false;
    }

    let prevType;
    let currentLevel = 0;

    let blockDown = function() {
        if(currentLevel != 0 && prevType != "spike" && prevType != "fire" && currentLevel > 0) {
            --currentLevel;
            prevType = "down";
            return "air";
        }

        return false;
    }

    let addFire = function() {
        if(prevType != "spike" && prevType != "fire") {
            prevType = "fire";
            return "air";
        }
        return false;
    }

    let addSpike = function() {
        if(currentLevel > 0 && prevType != "spike" && prevType != "fire") {
            currentLevel--;
            prevType = "spike";
            return "air";
        }

        return false;
    }

    let blockPlain = function() {
        if(prevType == "spike") {
            currentLevel++;
        }

        prevType = "ground";
        return "ground";
    }

    let getType = function(i, j) {
        return (types[i] && types[i][j]) || GAME.blockTypes.air;
    }

    let types = {};

    let levels = {
        "0": blockUp,
        "1": blockDown,
        "2": addFire,
        "3": addSpike,
        "4": blockPlain
    }

    let createRandom = function(from, to) {
        for(let i = from; i < to; ++i) {
            if(i > 3) {
                for(let j = 0; j < GAME.sizes.tableHeight; ++j) {
                    let current = GAME.sizes.tableHeight - 3 - currentLevel;
                    if(current == j) {
                        let level = levels[Math.floor(Math.random()*10 % 5)];
                        let type;
                        while(!(type = level(i, j))) {
                            level = levels[Math.floor(Math.random()*10 % 5)];
                        }

                        if(!types[i]) {
                            types[i] = {};
                        }

                        types[i][j] = type;

                        if(prevType == "fire" || prevType == "spike") {
                            GAME.others.push(new Other(GAME, i * GAME.sizes.blockWidth, (GAME.sizes.tableHeight - 3 - currentLevel) * GAME.sizes.blockHeight, prevType));
                        }
                    } else if (current < j) {
                        if(!types[i]) {
                            types[i] = {};
                        }

                        types[i][j] = "ground";
                    }
                }
            }
        }
    }

    var createBlocks = function () {
        createRandom(0, GAME.sizes.tableWidth)

        for (var i = 0; i < GAME.sizes.tableWidth; ++i) {
            for (var j = 0; j < GAME.sizes.tableHeight; ++j) {
                var type = j > 5 ? GAME.blockTypes.ground : getType(i, j);

                GAME.blocks.push(new Block(GAME, type, GAME.imageLoader.get(type), i * GAME.sizes.blockWidth, j * GAME.sizes.blockHeight));
            }
        }
    }

    var addPlayer = function () {
        GAME.players.push(new Player(GAME));
        GAME.players.push(new Player(GAME));
    }

    let addNPCs = function () {
        /* GAME.npcs.push(new NPC(GAME, 555, 555));
        GAME.npcs.push(new NPC(GAME, 444, 555));
        GAME.npcs.push(new NPC(GAME, 666, 555)); */
        //GAME.npcs.push(new NPC(GAME, 888, 555, -1));
    }

    let addOthers = function() {
        /* GAME.others.push(new Other(GAME, 222, 555, "fire"));
        GAME.others.push(new Other(GAME, 666, 555, "spike")); */
    }

    let createKeyListeners = function () {
        document.addEventListener("keydown", (e) => {
            for (let keyEvent of GAME.keys) {

                if (keyEvent.key == e.keyCode && keyEvent.fnDown && (keyEvent.condition ? keyEvent.condition(e) : true)) {
                    keyEvent.fnDown();
                    break;
                }
            }
        })

        document.addEventListener("keyup", (e) => {
            for (let keyEvent of GAME.keys) {
                if (keyEvent.key == e.keyCode && keyEvent.fnUp && (keyEvent.condition ? keyEvent.condition(e) : true)) {
                    keyEvent.fnUp();
                    break;
                }
            }
        })
    }

    GAME.create = function () {
        return new Promise((resolve, reject) => {
            try {
                GAME.imageLoader = new imageLoader(GAME);
                GAME.imageLoader.loadAll()
                    .then(() => {

                        createBlocks();
                        addPlayer();
                        addNPCs();
                        addOthers();
                        createKeyListeners();
                        resolve();
                    })
            } catch (err) {
                reject(err);
            }
        });
    }

    return GAME;
};