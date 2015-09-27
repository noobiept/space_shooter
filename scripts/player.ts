/// <reference path="../libraries/game_engine.d.ts" />


interface PlayerPowerUp
    {
    duration: number;       // duration of the power up in seconds
    count?: number;         // count until the duration
    speed?: number;         // speed increase
    damage?: number;        // damage increase
    weapon?: Game.Weapon;   // extra weapon
    }


interface PlayerArgs
    {
    x: number;
    y: number;
    health: number;
    }


class Player extends Game.Unit
    {
        // used for the diagonal directions
        // Math.cos() has the same value as Math.sin()
    static _trig_pi_4 = Math.cos( Math.PI / 4 );
    _power_ups: PlayerPowerUp[];
    damage: number;


    constructor( args: PlayerArgs )
        {
        var shape = new Game.Bitmap({
            image: Game.Preload.get( 'player' )
        });

        super({
                x: args.x,
                y: args.y,
                health: args.health,
                children: shape,
                movementSpeed: 200
            });
        this.rotation = -Math.PI / 2;
        this._power_ups = [];

        var singleWeapon = new WeaponSingle({
                bulletContainer: Main.getBulletContainer(),
                fireInterval: 0.5
            });
        this.addWeapon( singleWeapon );

        this.setDamage( 10 );
        }


    /**
     * Update the player's health based on the damage taken.
     * Return whether the player survived the damage or not.
     */
    tookDamage( damage: number )
        {
        this.health -= damage;

        if ( this.health > 0 )
            {
            return true;
            }

        return false;
        }


    setDamage( damage: number )
        {
        this.damage = damage;

        for (var a = this._weapons.length - 1 ; a >= 0 ; a--)
            {
            this._weapons[ a ].damage = damage;
            }
        }


    logic( deltaTime: number )
        {
        super.logic( deltaTime );

        this._movement_logic( deltaTime );
        this._fire_logic( deltaTime );
        this._power_up_logic( deltaTime );
        }


    _fire_logic( deltaTime: number )
        {
        var keysHeld = Input.KEYS_HELD;

        if ( keysHeld.space )
            {
            var weapons = this.getAllWeapons();

            for (var a = weapons.length - 1 ; a >= 0 ; a--)
                {
                weapons[ a ].fire( -Math.PI / 2 );
                }
            }
        }


    _movement_logic( deltaTime: number )
        {
        var keysHeld = Input.KEYS_HELD;
        var move;
        var nextX = this.x;
        var nextY = this.y;


        if ( keysHeld.leftArrow )
            {
            if ( keysHeld.upArrow )
                {
                move = this.movement_speed * deltaTime * Player._trig_pi_4;

                nextX -= move;
                nextY -= move;
                }

            else if ( keysHeld.downArrow )
                {
                move = this.movement_speed * deltaTime * Player._trig_pi_4;

                nextX -= move;
                nextY += move;
                }

            else
                {
                nextX -= this.movement_speed * deltaTime;
                }
            }

        else if ( keysHeld.rightArrow )
            {
            if ( keysHeld.upArrow )
                {
                move = this.movement_speed * deltaTime * Player._trig_pi_4;

                nextX += move;
                nextY -= move;
                }

            else if ( keysHeld.downArrow )
                {
                move = this.movement_speed * deltaTime * Player._trig_pi_4;

                nextX += move;
                nextY += move;
                }

            else
                {
                nextX += this.movement_speed * deltaTime;
                }
            }

        else if ( keysHeld.upArrow )
            {
            nextY -= this.movement_speed * deltaTime;
            }

        else if ( keysHeld.downArrow )
            {
            nextY += this.movement_speed * deltaTime;
            }


            // make sure the player doesn't get out of the canvas bounds
        if ( nextX - this._half_width < 0 )
            {
            nextX = this._half_width;
            }

        else if ( nextX + this._half_width > Main.CANVAS_WIDTH )
            {
            nextX = Main.CANVAS_WIDTH - this._half_width;
            }

        if ( nextY - this._half_height < 0 )
            {
            nextY = this._half_height;
            }

        else if ( nextY + this._half_height > Main.CANVAS_HEIGHT )
            {
            nextY = Main.CANVAS_HEIGHT - this._half_height;
            }

        this.x = nextX;
        this.y = nextY;
        }


    _power_up_logic( deltaTime: number )
        {
        for (var a = this._power_ups.length - 1 ; a >= 0 ; a--)
            {
            var powerUp = this._power_ups[ a ];

            powerUp.count += deltaTime;

            if ( powerUp.count >= powerUp.duration )
                {
                this.removePowerUp( powerUp );
                }
            }
        }


    addPowerUp( powerUp: PlayerPowerUp )
        {
        powerUp.count = 0;

        if ( powerUp.damage )
            {
            this.setDamage( this.damage + powerUp.damage );
            }

        if ( powerUp.speed )
            {
            this.movement_speed += powerUp.speed;
            }

        if ( powerUp.weapon )
            {
            this.addWeapon( powerUp.weapon );
            }

        this._power_ups.push( powerUp );
        }


    removePowerUp( powerUp: PlayerPowerUp )
        {
        if ( powerUp.damage )
            {
            this.setDamage( this.damage - powerUp.damage );
            }

        if ( powerUp.speed )
            {
            this.movement_speed -= powerUp.speed;
            }

        if ( powerUp.weapon )
            {
            var weapon = this.removeWeapon( powerUp.weapon );
            weapon.remove();
            }

        var index = this._power_ups.indexOf( powerUp );

        this._power_ups.splice( index, 1 );
        }
    }