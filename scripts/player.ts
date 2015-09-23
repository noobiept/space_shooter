/// <reference path="../libraries/game_engine.d.ts" />


interface PlayerArgs
    {
    x: number;
    y: number;
    }


class Player extends Game.Unit
    {
        // used for the diagonal directions
        // Math.cos() has the same value as Math.sin()
    static _trig_pi_4 = Math.cos( Math.PI / 4 );


    constructor( args: PlayerArgs )
        {
        var shape = new Game.Bitmap({
            image: Game.Preload.get( 'player' )
        });

        super({
                x: args.x,
                y: args.y,
                children: shape,
                movementSpeed: 200
            });
        this.rotation = -Math.PI / 2;
        }


    logic( deltaTime: number )
        {
        super.logic( deltaTime );

        this._movement_logic( deltaTime );
        this._fire_logic( deltaTime );
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
    }