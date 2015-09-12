class WeaponSide extends Weapon
    {
    fire( player: Player )
        {
        if ( this._is_ready )
            {
            this._fire_count = 0;
            this._is_ready = false;

            var bulletShape = new Game.Bitmap({
                    image: Game.Preload.get( 'laser1' )
                });
            var bullet1 = new Game.Bullet({
                    x: player.x,
                    y: player.y,
                    children: bulletShape,
                    angleOrTarget: -Math.PI / 4,
                    movement_speed: 150,
                    angleOffset: -Math.PI / 2
                });
            var bullet2 = new Game.Bullet({
                    x: player.x,
                    y: player.y,
                    children: bulletShape,
                    angleOrTarget: -3 * Math.PI / 4,
                    movement_speed: 150,
                    angleOffset: -Math.PI / 2
                });
            Main.addBullet( bullet1 );
            Main.addBullet( bullet2 );
            }
        }
    }