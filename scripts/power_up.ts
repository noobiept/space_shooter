interface PowerUpArgs
    {
    x: number;
    y: number;
    powerUp: PlayerPowerUp;
    imageId: string;
    }

class PowerUp extends Game.Unit
    {
    power_up: PlayerPowerUp;
    _rotate_count: number;
    _rotate_interval: number;   // rotate the element in this interval
    _duration: number;
    _duration_count: number;    // remove the element after this duration has passed

    constructor( args: PowerUpArgs )
        {
        var shape = new Game.Bitmap({
                image: Game.Preload.get( args.imageId )
            });

        super({
                x: args.x,
                y: args.y,
                children: shape
            });

        this.power_up = args.powerUp;
        this._rotate_count = 0;
        this._rotate_interval = 0.8;
        this._duration_count = 0;
        this._duration = 6;
        }

    logic( deltaTime: number )
        {
        this._rotate_count += deltaTime;
        this._duration_count += deltaTime;

        if ( this._rotate_count >= this._rotate_interval )
            {
            this._rotate_count = 0;
            this.rotation += Math.PI / 24;
            }

        if ( this._duration_count >= this._duration )
            {
            this.remove();
            return;
            }

        super.logic( deltaTime );
        }
    }

module PowerUp
    {
    var ALL = [ damage, speed, health, sideWeapon ];


    export function createRandom( x: number, y: number )
        {
        var index = Game.Utilities.getRandomInt( 0, ALL.length - 1 );
        var powerUp = ALL[ index ]();

        return new PowerUp({
                x: x,
                y: y,
                powerUp: <PlayerPowerUp>powerUp,
                imageId: powerUp.imageId
            });
        }

    function damage()
        {
        return {
                imageId: 'power_up_damage',
                duration: 5,
                damage: 10
            };
        }

    function speed()
        {
        return {
                imageId: 'power_up_speed',
                duration: 5,
                speed: 50
            };
        }

    function health()
        {
        return {
                imageId: 'power_up_health',
                health: 25
            };
        }

    function sideWeapon()
        {
        var sideWeapon = new WeaponSide({
                bulletContainer: Main.getBulletContainer(),
                fireInterval: 0.5
            });

        return {
                imageId: 'power_up_weapon',
                duration: 5,
                weapon: sideWeapon
            };
        }
    }