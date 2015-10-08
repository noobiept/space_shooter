/// <reference path="../libraries/game_engine.d.ts" />

interface PlayerArgs
    {
    x: number;
    y: number;
    }

interface PlayerPowerUpInfo extends PowerUpInfo
    {
    count?: number;         // count until the duration
    weapon?: Game.Weapon;   // reference to the weapon object
    }


/**
 * Added events:
 *
 * - `health_change` -- Whenever there's a change to the health of the player.
 * - `damage_change` -- When there's a change to the damage.
 * - `speed_change` -- When there's a change to the movement speed.
 */
class Player extends Game.Bitmap
    {
        // used for the diagonal directions
        // Math.cos() has the same value as Math.sin()
    static _trig_pi_4 = Math.cos( Math.PI / 4 );
    _power_ups: PlayerPowerUpInfo[];
    _weapons: Game.Weapon[];
    damage: number;
    health: number;
    movement_speed: number;

    rotated_half_width: number;
    rotated_half_height: number;

    constructor( args: PlayerArgs )
        {
        super({
                x: args.x,
                y: args.y,
                category: Main.CATEGORIES.player,
                collidesWith: Main.CATEGORIES.enemy | Main.CATEGORIES.powerUp,
                image: Game.Preload.get( 'player' )
            });

        this._has_logic = true;
        this.health = 100;
        this.rotation = -Math.PI / 2;
        this._power_ups = [];
        this._weapons = [];
        this.movement_speed = 200;

        var singleWeapon = new WeaponSingle({
                element: this,
                bulletContainer: Main.getBulletContainer(),
                fireInterval: 0.5,
                imageId: 'laser1-blue'
            });
        this._weapons.push( singleWeapon );

        this.setDamage( 10 );

            // calculate the rotated half width/height
            // since the player won't be rotated later on, we don't need to calculate this after
        this.updateVertices( 0, 0, 1, 1, 0 );

        var rect = this.toAxisAligned();

        this.rotated_half_width = (rect.maxX - rect.minX) / 2;
        this.rotated_half_height = (rect.maxY - rect.minY) / 2;
        }


    /**
     * Update the player's health based on the damage taken.
     * Return whether the player survived the damage or not.
     */
    tookDamage( damage: number )
        {
        this.health -= damage;
        this.dispatchEvent( 'health_change', this );

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

        for (var a = this._weapons.length - 1 ; a >= 0 ; a--)
            {
            this._weapons[ a ].logic( deltaTime );
            }

        this._movement_logic( deltaTime );
        this._fire_logic( deltaTime );
        this._power_up_logic( deltaTime );
        }


    _fire_logic( deltaTime: number )
        {
        var keysHeld = Input.KEYS_HELD;

        if ( keysHeld.space )
            {
            var weapons = this._weapons;
            var fired = false;

            for (var a = weapons.length - 1 ; a >= 0 ; a--)
                {
                if ( weapons[ a ].fire( -Math.PI / 2 ) )
                    {
                    fired = true;
                    }
                }

            if ( fired )
                {
                Game.Sound.play( Game.Preload.get( 'laser_sound' ) );
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
        if ( nextX - this.rotated_half_width < 0 )
            {
            nextX = this.rotated_half_width;
            }

        else if ( nextX + this.rotated_half_width > Main.CANVAS_WIDTH )
            {
            nextX = Main.CANVAS_WIDTH - this.rotated_half_width;
            }

        if ( nextY - this.rotated_half_height < 0 )
            {
            nextY = this.rotated_half_height;
            }

        else if ( nextY + this.rotated_half_height > Main.CANVAS_HEIGHT )
            {
            nextY = Main.CANVAS_HEIGHT - this.rotated_half_height;
            }

        this.setPosition( nextX, nextY );
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


    addPowerUp( powerUp: PlayerPowerUpInfo )
        {
            // check if there's a power-up of the same type already
            // if there is, increase its duration
        var existingPowerUp = this.powerUpExists( powerUp );

        if ( existingPowerUp )
            {
            existingPowerUp.duration += powerUp.duration;
            return;
            }


        if ( powerUp.damage )
            {
            this.setDamage( this.damage + powerUp.damage );
            this.dispatchEvent( 'damage_change', this );
            }

        if ( powerUp.speed )
            {
            this.movement_speed += powerUp.speed;
            this.dispatchEvent( 'speed_change', this );
            }

        if ( powerUp.weaponClass )
            {
            powerUp.weaponArgs.element = this;

            var weapon = new powerUp.weaponClass( powerUp.weaponArgs );
            powerUp.weapon = weapon;
            weapon.damage = this.damage;

            this._weapons.push( weapon );
            }

        if ( powerUp.health )
            {
            this.health += powerUp.health;
            this.dispatchEvent( 'health_change', this );
            }

            // the power up will be removed after the duration has passed
        if ( powerUp.duration )
            {
            powerUp.count = 0;
            this._power_ups.push( powerUp );
            }
        }


    removePowerUp( powerUp: PlayerPowerUpInfo )
        {
        if ( powerUp.damage )
            {
            this.setDamage( this.damage - powerUp.damage );
            this.dispatchEvent( 'damage_change', this );
            }

        if ( powerUp.speed )
            {
            this.movement_speed -= powerUp.speed;
            this.dispatchEvent( 'speed_change', this );
            }

        if ( powerUp.weapon )
            {
            var index = this._weapons.indexOf( powerUp.weapon );

            this._weapons.splice( index, 1 );
            powerUp.weapon.remove();
            }

        var index = this._power_ups.indexOf( powerUp );

        this._power_ups.splice( index, 1 );
        }


    /**
     * Check if there's an power-up of the same type already active.
     * Return it if found.
     */
    powerUpExists( powerUp: PowerUpInfo )
        {
        for (var a = this._power_ups.length - 1 ; a >= 0 ; a--)
            {
            var existingPowerUp = this._power_ups[ a ];

            if ( existingPowerUp.type === powerUp.type )
                {
                return existingPowerUp;
                }
            }

        return null;
        }


    remove()
        {
        super.remove();

        var a;

            // remove all weapons
        for (a = this._weapons.length - 1 ; a >= 0 ; a--)
            {
            this._weapons[ a ].remove();
            }
        this._weapons.length = 0;

            // remove all the power ups
        for (a = this._power_ups.length - 1 ; a >= 0 ; a--)
            {
            var powerUp = this._power_ups[ a ];

            if ( powerUp.weapon )
                {
                powerUp.weapon.remove();
                powerUp.weapon = null;
                }
            }
        this._power_ups.length = 0;
        }
    }