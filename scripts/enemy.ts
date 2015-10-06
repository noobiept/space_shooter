/// <reference path="../libraries/game_engine.d.ts" />

interface EnemyArgs
    {
    x: number;
    y: number;
    movementSpeed: number;
    imageId: string;
    damage: number;
    health: number;
    }

class Enemy extends Game.Bitmap
    {
    damage: number;
    health: number;
    movement: Game.Movement;
    weapon: Game.Weapon;

    constructor( args: EnemyArgs )
        {
        super({
                x: args.x,
                y: args.y,
                image: Game.Preload.get( args.imageId ),
                category: Main.CATEGORIES.enemy
            });

        this.movement = new Game.Movement({
                element: this,
                movementSpeed: args.movementSpeed
            });
        this.weapon = null;
        this._has_logic = true;
        this.health = args.health;
        this.damage = args.damage;
        this.rotation = Math.PI / 2;
        }


    /**
     * Returns whether the enemy survived the attack or not.
     */
    tookDamage( damage: number )
        {
        this.health -= damage;

        if ( this.health <= 0 )
            {
            Game.safeRemove( this );
            return false;
            }

        return true;
        }

    logic( deltaTime: number )
        {
        super.logic( deltaTime );

        this.movement.logic( deltaTime );

        if ( this.weapon )
            {
            this.weapon.logic( deltaTime );
            }

            // check if the unit is out of bounds
            // if it is, then we'll remove the unit
        if ( !Game.getCanvas().isInCanvas( this.x, this.y ) )
            {
            Game.safeRemove( this );
            }
        }
    }