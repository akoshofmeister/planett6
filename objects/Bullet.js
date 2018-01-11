function Bullet(image, x, y, ctx, direction) {
    var Bullet = {
        x,
        y,
        image,
        gone: false
    };

    var counter = 5;

    var move = function () {
        if (counter == 0 || Bullet.gone) {
            clearInterval(interval);
            Bullet.x = -500;
            Bullet.gone = true;
        } else {
            counter--;
            Bullet.x = Bullet.x + direction * 111;
        }
        ctx.drawImage(Bullet.image, Bullet.x, Bullet.y);
    }

    var interval = setInterval(move, 75);

    Bullet.getRealX = function() {
        return Bullet.x / 111;
    }

    Bullet.getRealY = function() {
        return Bullet.y / 111;
    }

    return Bullet;
}