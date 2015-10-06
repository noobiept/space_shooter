class EnemyRandom extends Enemy
    {
    movement_speed: number;
    angle: number;
    angle_change: number;


    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy5';
        args.movementSpeed = 75;
        args.damage = 10;
        args.health = 30;

        super( args );

        this.weapon = new WeaponRandom({
                element: this,
                bulletContainer: Main.getBulletContainer(),
                imageId: 'laser3-red'
            });
        this.weapon.forceFire( 0, 1, 0.1 );

        this.movement_speed = 100;
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

        var x = this.movement_speed * deltaTime * Math.cos( this.angle );
        var y = this.movement_speed * deltaTime * Math.sin( this.angle );

        this.rotation = this.angle;
        this.addToPosition( x, y );
        }
    }