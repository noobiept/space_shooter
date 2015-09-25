/// <reference path="../libraries/game_engine.d.ts" />

interface EnemyArgs
    {
    x: number;
    y: number;
    movementSpeed: number;
    imageId: string;
    damage: number;
    }

class Enemy extends Game.Unit
    {
    damage: number;

    constructor( args: EnemyArgs )
        {
        var shape = new Game.Bitmap({
                image: Game.Preload.get( args.imageId )
            });

        super({
                x: args.x,
                y: args.y,
                children: shape
            });

        this.damage = args.damage;
        this.movement_speed = args.movementSpeed;
        this.rotation = Math.PI / 2;
        }


    logic( deltaTime: number )
        {
        super.logic( deltaTime );

            // check if the unit is out of bounds
            // if it is, then we'll remove the unit
        if ( !Game.getCanvas().isInCanvas( this.x, this.y ) )
            {
            this.remove();
            }
        }
    }