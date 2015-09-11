/// <reference path="../libraries/game_engine.d.ts" />


interface PlayerArgs
    {
    x: number;
    y: number;
    }


class Player extends Game.Bitmap
    {
    movement_speed: number;

        // used for the diagonal directions
        // Math.cos() has the same value as Math.sin()
    static _trig_pi_4 = Math.cos( Math.PI / 4 );


    constructor( args: PlayerArgs )
        {
        super({
                x: args.x,
                y: args.y,
                image: Game.Preload.get( 'player' )
            });

        this._has_logic = true;
        this.movement_speed = 100;
        }


    fire()
        {
        var bulletShape = new Game.Bitmap({
                image: Game.Preload.get( 'laser1' )
            });
        var bullet = new Game.Bullet({
                x: this.x,
                y: this.y,
                angleOrTarget: -Math.PI / 2,
                movement_speed: 100,
                angleOffset: -Math.PI / 2
            });
        bullet.addChild( bulletShape );

        Game.addElement( bullet );
        }


    logic( deltaTime: number )
        {
        this._movement_logic( deltaTime );
        this._fire_logic( deltaTime );
        }


    _fire_logic( deltaTime: number )
        {
        var keysHeld = Input.KEYS_HELD;

        if ( keysHeld.space )
            {
            this.fire();
            }
        }


    _movement_logic( deltaTime: number )
        {
        var keysHeld = Input.KEYS_HELD;
        var move;

        if ( keysHeld.leftArrow )
            {
            if ( keysHeld.upArrow )
                {
                move = this.movement_speed * deltaTime * Player._trig_pi_4;

                this.x -= move;
                this.y -= move;
                }

            else if ( keysHeld.downArrow )
                {
                move = this.movement_speed * deltaTime * Player._trig_pi_4;

                this.x -= move;
                this.y += move;
                }

            else
                {
                this.x -= this.movement_speed * deltaTime;
                }
            }

        else if ( keysHeld.rightArrow )
            {
            if ( keysHeld.upArrow )
                {
                move = this.movement_speed * deltaTime * Player._trig_pi_4;

                this.x += move;
                this.y -= move;
                }

            else if ( keysHeld.downArrow )
                {
                move = this.movement_speed * deltaTime * Player._trig_pi_4;

                this.x += move;
                this.y += move;
                }

            else
                {
                this.x += this.movement_speed * deltaTime;
                }
            }

        else if ( keysHeld.upArrow )
            {
            this.y -= this.movement_speed * deltaTime;
            }

        else if ( keysHeld.downArrow )
            {
            this.y += this.movement_speed * deltaTime;
            }
        }
    }