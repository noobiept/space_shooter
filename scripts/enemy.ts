/// <reference path="../libraries/game_engine.d.ts" />

interface EnemyArgs
    {
    x: number;
    y: number;
    }

class Enemy extends Game.Unit
    {
    constructor( args: EnemyArgs )
        {
        var shape = new Game.Bitmap({
                image: Game.Preload.get( 'enemy1' )
            });

        super({
                x: args.x,
                y: args.y,
                children: shape
            });

        this.movement_speed = 100;
        this.moveTo( args.x, Main.CANVAS_HEIGHT + this._half_height );
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