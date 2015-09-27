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
        }
    }

module PowerUp
    {
    var ALL = [ damage, speed, sideWeapon ];


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