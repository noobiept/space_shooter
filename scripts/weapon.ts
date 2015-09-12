class Weapon
    {
    _fire_count: number;
    _is_ready: boolean;
    fire_interval: number;  // time between each bullet fire
    damage: number;


    constructor()
        {
        this._is_ready = true;
        this.fire_interval = 0.5;
        this._fire_count = this.fire_interval;
        this.damage = 10;
        }


    fire( player: Player )
        {
        if ( this._is_ready )
            {
            this._fire_count = 0;
            this._is_ready = false;

            var bulletShape = new Game.Bitmap({
                    image: Game.Preload.get( 'laser1' )
                });
            var bullet = new Game.Bullet({
                    x: player.x,
                    y: player.y,
                    children: bulletShape,
                    angleOrTarget: -Math.PI / 2,
                    movement_speed: 200,
                    angleOffset: -Math.PI / 2
                });
            Main.addBullet( bullet );
            }
        }


    isReady()
        {
        return this._is_ready;
        }


    logic( deltaTime )
        {
        if ( this._fire_count >= this.fire_interval )
            {
            this._is_ready = true;
            }

        else
            {
            this._fire_count += deltaTime;
            }
        }
    }