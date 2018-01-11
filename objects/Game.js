function Game(width, height, ctx) {
    var Game = {
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
        bullets: []
    }

    Game.images = {
        bg: new Image(),
        player: new Image(),
        playerB: new Image(),
        mob: new Image(),
        mobB: new Image(),
        ground: new Image(),
        groundTop: new Image(),
        jump: new Image(),
        jumpB: new Image(),
        walk1: new Image(),
        walk1B: new Image(),
        walk2: new Image(),
        walk2B: new Image(),
        walk3: new Image(),
        walk3B: new Image(),
        walk4: new Image(),
        walk4B: new Image(),
        bullet: new Image(),
        death: new Image(),
        deathB: new Image()
    }

    Game.images.bg.src = "./images/bg.png";
    Game.images.player.src = "./images/Fred.png";
    Game.images.playerB.src = "./images/FredB.png";
    Game.images.mob.src = "./images/mobB.png";
    Game.images.mobB.src = "./images/mob.png";
    Game.images.ground.src = "./images/ground.png";
    Game.images.groundTop.src = "./images/groundTop.png";
    Game.images.jump.src = "./images/jump.png";
    Game.images.jumpB.src = "./images/jumpB.png";
    Game.images.walk1.src = "./images/walk1.png";
    Game.images.walk1B.src = "./images/walk1B.png";
    Game.images.walk2.src = "./images/walk2.png";
    Game.images.walk2B.src = "./images/walk2B.png";
    Game.images.walk3.src = "./images/walk3.png";
    Game.images.walk3B.src = "./images/walk3B.png";
    Game.images.walk4.src = "./images/walk4.png";
    Game.images.walk4B.src = "./images/walk4B.png";
    Game.images.bullet.src = "./images/bullet.png";
    Game.images.death.src = "./images/death.png";
    Game.images.deathB.src = "./images/death.png";

    Game.draw = function () {
        ctx.clearRect(0, 0, 1473, 888);
        ctx.drawImage(Game.images.bg, 0, 0);

        var blocks = _.filter(Game.blocks, function (block) { return block.getRealX() >= Game.drawFrom && block.getRealX() <= Game.drawTo; });
        blocks.forEach((block) => {
            Game.ctx.drawImage(block.getImage(), block.getX() - Game.drawFrom * 111, block.getY());
        });

        Game.ctx.drawImage(Game.player.image, Game.player.x - Game.drawFrom * 111, Game.player.y);

        var mobs = _.filter(Game.mobs, function (mob) { return mob.getRealX() >= Game.drawFrom && mob.getRealX() <= Game.drawTo && !mob.dead; });
        mobs.forEach(function (mob) {
            Game.ctx.drawImage(mob.image, mob.x - Game.drawFrom * 111, mob.y);
        })
    };

    var imageLoopInterval;
    var walkStage;
    var walkingLoop = function () {
        switch (walkStage) {
            case 0:
                Game.player.image = Game.direction == 1 ? Game.images.walk1 : Game.images.walk1B;
                walkStage++;
                break;
            case 1:
                Game.player.image = Game.direction == 1 ? Game.images.walk2 : Game.images.walk2B;
                walkStage++;
                break;
            case 2:
                Game.player.image = Game.direction == 1 ? Game.images.walk3 : Game.images.walk3B;
                walkStage++;
                break;
            case 3:
                Game.player.image = Game.direction == 1 ? Game.images.walk4 : Game.images.walk4B;
                walkStage = 0;
                break;
        }
    }

    var mobMove = 5;

    Game.round = function () {
        if (Game.isDead() && !Game.player.dead) {
            Game.player.image = Game.direction == 1 ? Game.images.death : Game.images.deathB;
            Game.player.dead = true;
            Game.draw();
        }

        if(!Game.player.dead) {

            _.filter(Game.bullets, function(bullet) {return !bullet.gone;}).forEach(function(bullet) {
                var mob = _.find(_.filter(Game.mobs, function(mob) { return !mob.dead; }), function(mob) { console.log(mob.getRealX()  - Game.drawFrom, bullet.getRealX() , mob.getRealY() , bullet.getRealY()); return mob.getRealX() - Game.drawFrom == bullet.getRealX() && mob.getRealY() == bullet.getRealY(); });
                if(mob) {
                    bullet.gone = true;
                    mob.dead = true;
                    mob.x = -500;
                }
            })

            if(mobMove == 0) {
                Game.mobs.forEach(function(mob) {
                    if(mob.getRealX() + (mob.direction) < 1 || mob.getRealX() + (mob.direction) > 98) {
                        mob.direction = mob.direction*-1;
                    }
                    var next = _.find(Game.blocks, function (block) { return block.getRealX() == mob.getRealX() + (mob.direction) && block.getRealY() == mob.getRealY() });
                    
                    if(next && next.type == "sky") {
                        mob.incX(mob.direction);
                    } else {
                        mob.direction = -1*mob.direction;
                        next = _.find(Game.blocks, function (block) { return block.getRealX() == mob.getRealX() + (mob.direction) && block.getRealY() == mob.getRealY() });
                        if(next) {
                            if(next.type == "sky") {
                                mob.incX(mob.direction);
                            }
                        }
                    }


                    mob.image = mob.direction == 1 ? Game.images.mob : Game.images.mobB;
                });
                mobMove = 5;
            } else {
                mobMove--;
            }

            if (Game.canFall() && Game.jump == 0) {
                Game.player.incY(1);
            }
    
            if (Game.direction != 0 && Game.move && Game.canMove()) {
                if (!imageLoopInterval) {
                    walkStage = 0;
                    imageLoopInterval = setInterval(walkingLoop, 50);
                }
    
                if (Game.direction == 1) {
                    if (Game.drawTo == 99) {
                        if (Game.drawTo - Game.player.getRealX() + 1 > Game.minSpace) {
                            Game.player.incX();
                        }
                    } else {
                        Game.player.incX();
                    }
    
                } else {
                    if (Game.drawFrom == 0) {
                        if (Game.player.getRealX() > Game.minSpace) {
                            Game.player.incX(-1);
                        }
                    } else {
                        Game.player.incX(-1);
                    }
                }
            } else {
                clearInterval(imageLoopInterval);
                imageLoopInterval = undefined;
                Game.player.image = Game.direction == 1 ? Game.images.player : Game.images.playerB;
            }
    
            if (Game.jump > 0) {
                if (Game.jump == 3) {
                    Game.player.incY(-1);
                    Game.player.image = Game.direction == 1 || Game.direction == 0 ? Game.images.jump : Game.images.jumpB;
                } else if (Game.jump == 1 && Game.canFall()) {
                    Game.player.incY();
                }
                Game.jump--;
            }
    
            if (Game.direction == 1 && Game.move) {
                if (Game.drawTo - Game.player.getRealX() < Game.space) {
                    Game.drawTo++;
                }
            } else if (Game.direction == -1 && Game.move) {
                if (Game.player.getRealX() - Game.drawFrom < Game.space) {
                    Game.drawTo--;
                }
            }
    
            Game.drawTo = Game.drawTo >= 100 ? 100 - 1 : (Game.drawTo < 12 ? 12 : Game.drawTo);
            Game.drawFrom = Game.drawTo - 13;
            Game.drawFrom = Game.drawFrom < 0 ? 0 : Game.drawFrom;
            Game.draw();
        }
    };

    var interval;

    Game.start = function () {
        Game.isPaused = false;
        interval = setInterval(Game.round, 100);
    };

    Game.stop = function () {
        if (interval) {
            clearInterval(interval);
            Game.isPaused = true;
        }
    };

    Game.canMove = function () {
        var next = _.find(Game.blocks, function (block) { return block.getRealX() == Game.player.getRealX() + (Game.direction) && block.getRealY() == Game.player.getRealY() });

        return next.type == "sky";
    }

    Game.canFall = function () {
        var next = _.find(Game.blocks, function (block) { return block.getRealX() == Game.player.getRealX() && block.getRealY() == Game.player.getRealY() + 1 });

        return next.type == "sky";
    }

    Game.shoot = function () {
        Game.bullets.push(new Bullet(Game.images.bullet, Game.player.x - Game.drawFrom * 111, Game.player.getY(), ctx, Game.direction == -1 ? -1 : 1));
    }

    Game.isDead = function() {
        return !!_.find(Game.mobs, function(mob) { return mob.getRealX() == Game.player.getRealX() && mob.getRealY() == Game.player.getRealY()});
    }

    var createBlocks = function () {

        var hill = 3;
        var prev = 0;

        for (var i = 0; i < 100; ++i) {
            for (var j = 0; j < 8; ++j) {
                var type = j > 5 ? "ground" : "sky";
                type = j == 6 ? "groundTop" : type;
                if (Math.floor(Math.random() * 6) + 1 == 5 && j == 5 && hill && i % j == 4) {
                    type = "groundTop";
                    hill--;
                }
                Game.blocks.push(new Block(type, type == "ground" ? Game.images.ground : (type == "groundTop" ? Game.images.groundTop : new Image()), { x: i * 111, y: j * 111 }));
            }
        }

        for (var i = 0; i < 100; ++i) {
            var mobX = (Math.floor(Math.random() * (80 - 20 + 1)) + 20) * 111;
            var mobY = 5 * 111;

            while(_.find(Game.blocks, function(block) { return block.getRealX() == mobX / 111 && block.getRealY() == 5; }).type != "sky") {
                mobX = (Math.floor(Math.random() * (80 - 20 + 1)) + 20) * 111;
            }

            Game.mobs.push(new Human("mob", Game.images.mob, mobX, mobY));
        }
    }

    var addPlayer = function () {
        Game.player = new Human("player", Game.images.player, 2 * 111, 5 * 111);
    }

    Game.create = function () {
        createBlocks();
        addPlayer();
    }

    return Game;
}