class EnemyRandom extends Enemy
    {
    angle: number;
    angle_change: number;


    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy5';

        super( args );

        this.weapon = new WeaponRandom({
                element: this,
                bulletContainer: Main.getBulletContainer(),
                imageId: 'laser3-red'
            });
        this.weapon.damage = this.damage;
        this.weapon.forceFire( 0, 1, 0.5 );

        this.angle = Math.PI / 2;

            // how much its movement is changed
            // positive means its going from right to left
        this.angle_change = Math.PI / 32;

            // move from left to right
        if ( args.x < Main.CANVAS_WIDTH / 2 )
            {
            this.angle_change *= -1;
            }
        }


    logic( deltaTime: number )
        {
        super.logic( deltaTime );

        this.angle += this.angle_change * deltaTime;

        var x = this.movement.movement_speed * deltaTime * Math.cos( this.angle );
        var y = this.movement.movement_speed * deltaTime * Math.sin( this.angle );

        this.rotation = this.angle;
        this.addToPosition( x, y );
        }
    }