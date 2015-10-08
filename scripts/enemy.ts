/// <reference path="../libraries/game_engine.d.ts" />

interface EnemyArgs
    {
    x: number;
    y: number;
    imageId: string;
    }

class Enemy extends Game.Bitmap
    {
        // these will be set in the initialization part of the game, and are set independently per derived class (see the 'initGameInfo()' function)
        // only declaring them here for documentation purposes
    static movementSpeed: number;
    static health: number;
    static damage: number;

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

        var constructor = <any>this.constructor;

        this.movement = new Game.Movement({
                element: this,
                movementSpeed: constructor.movementSpeed
            });
        this.weapon = null;
        this._has_logic = true;
        this.health = constructor.health;
        this.damage = constructor.damage;
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
            this.remove();
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
            this.remove();
            }
        }


    remove()
        {
        super.remove();

        Main.enemyRemoved();
        }
    }