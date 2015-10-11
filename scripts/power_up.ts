enum PowerUpType
    {
    damage, speed, health,
    sideWeapon, aroundWeapon, semiCircleWeapon, randomWeapon
    }

interface PowerUpInfo
    {
    type: PowerUpType;
    imageId: string;        // image used by the power up element
    duration?: number;      // duration of the power up in seconds
    speed?: number;         // speed increase
    health?: number;        // health increase
    damage?: number;        // damage increase
    weaponClass?: new (args:WeaponArgs) => Game.Weapon;   // extra weapon
    weaponArgs?: WeaponArgs;
    }

interface PowerUpArgs
    {
    x: number;
    y: number;
    powerUp: PowerUpInfo;
    }


class PowerUp extends Game.Bitmap
    {
    movement: Game.Movement;
    power_up: PowerUpInfo;
    _rotate_count: number;
    _rotate_interval: number;   // rotate the element in this interval
    _duration_count: number;
    _duration: number;          // remove the element after this duration has passed
    _blink_count: number;
    _blink_interval: number;     // blink the shape in the last seconds (to tell its close to being removed)


    constructor( args: PowerUpArgs )
        {
        super({
                x: args.x,
                y: args.y,
                image: Game.Preload.get( args.powerUp.imageId ),
                category: Main.CATEGORIES.powerUp
            });

        this.movement = new Game.Movement({
                element: this,
                movementSpeed: 50
            });

        this._has_logic = true;
        this.power_up = args.powerUp;
        this._rotate_count = 0;
        this._rotate_interval = 0.8;
        this._duration_count = 0;
        this._duration = 10;
        this._blink_count = 0;
        this._blink_interval = 0.5;

        this.movement.moveTo( args.x, Main.CANVAS_HEIGHT + this.half_height );
        }


    /**
     * Moves downward, until it reaches the bottom of the canvas, rotating around itself.
     * Has a duration before it is removed. It blinks in the last 3 seconds.
     */
    logic( deltaTime: number )
        {
        super.logic( deltaTime );

        this.movement.logic( deltaTime );

        this._rotate_count += deltaTime;
        this._duration_count += deltaTime;

        if ( this._rotate_count >= this._rotate_interval )
            {
            this._rotate_count = 0;
            this.rotation += Math.PI / 24;
            }

            // blink the shape in the last 3 seconds
        if ( this._duration_count >= this._duration - 3 )
            {
            this._blink_count += deltaTime;

            if ( this._blink_count >= this._blink_interval )
                {
                this._blink_count = 0;

                if ( this.opacity === 1 )
                    {
                    this.opacity = 0.5;
                    }

                else
                    {
                    this.opacity = 1;
                    }
                }
            }

        if ( this._duration_count >= this._duration )
            {
            this.remove();
            }
        }
    }


module PowerUp
    {
    var ALL_STATS = [ damage, speed, health ];
    var ALL_WEAPONS = [ sideWeapon, aroundWeapon, semiCircleWeapon, randomWeapon ];


    export function createRandom( x: number, y: number, statsPowerUp: boolean )
        {
        var all;

        if ( statsPowerUp )
            {
            all = ALL_STATS;
            }

        else
            {
            all = ALL_WEAPONS;
            }

        var index = Game.Utilities.getRandomInt( 0, all.length - 1 );
        var powerUp = all[ index ]();

        return new PowerUp({
                x: x,
                y: y,
                powerUp: powerUp
            });
        }

    function damage(): PowerUpInfo
        {
        return {
                type: PowerUpType.damage,
                imageId: 'power_up_damage',
                duration: 10,
                damage: 10
            };
        }

    function speed(): PowerUpInfo
        {
        return {
                type: PowerUpType.speed,
                imageId: 'power_up_speed',
                duration: 10,
                speed: 100
            };
        }

    function health(): PowerUpInfo
        {
        return {
                type: PowerUpType.health,
                imageId: 'power_up_health',
                health: 30
            };
        }

    function sideWeapon(): PowerUpInfo
        {
        return {
                type: PowerUpType.sideWeapon,
                imageId: 'power_up_weapon',
                duration: 10,
                weaponClass: WeaponSide,
                weaponArgs: {
                    element: null,
                    bulletContainer: Main.getBulletContainer(),
                    fireInterval: 0.5,
                    imageId: 'laser1-blue'
                }
            };
        }

    function aroundWeapon(): PowerUpInfo
        {
        return {
                type: PowerUpType.aroundWeapon,
                imageId: 'power_up_weapon',
                duration: 10,
                weaponClass: WeaponAround,
                weaponArgs: {
                    element: null,
                    bulletContainer: Main.getBulletContainer(),
                    fireInterval: 2,
                    imageId: 'laser3-blue'
                }
            };
        }

    function semiCircleWeapon(): PowerUpInfo
        {
        return {
                type: PowerUpType.semiCircleWeapon,
                imageId: 'power_up_weapon',
                duration: 10,
                weaponClass: WeaponSemiCircle,
                weaponArgs: {
                    element: null,
                    bulletContainer: Main.getBulletContainer(),
                    fireInterval: 2.5,
                    imageId: 'laser2-blue'
                }
            };
        }

    function randomWeapon(): PowerUpInfo
        {
        return {
                type: PowerUpType.randomWeapon,
                imageId: 'power_up_weapon',
                duration: 10,
                weaponClass: WeaponRandom,
                weaponArgs: {
                    element: null,
                    bulletContainer: Main.getBulletContainer(),
                    fireInterval: 1.5,
                    imageId: 'laser3-blue'
                }
            };
        }
    }