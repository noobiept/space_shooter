class EnemyAround extends Enemy
    {
    angle: number;
    angle_change: number;
    left_limit: number;     // how far the angle can go to the left
    right_limit: number;    // how far the angle can go to the right
    direction_clockwise: boolean; // if the angle is going clockwise or anti-clockwise
    movement_speed: number;


    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy4';
        args.movementSpeed = 50;
        args.damage = 10;
        args.health = 20;

        super( args );

        this.weapon = new WeaponAround({
                element: this,
                bulletContainer: Main.getBulletContainer(),
                imageId: 'laser3-red'
            });
        this.weapon.forceFire( 0, 1, 1 );

        this.movement_speed = args.movementSpeed;

        this.left_limit = 3 / 4 * Math.PI;
        this.right_limit = Math.PI / 4;
        this.angle = this.right_limit;
        this.direction_clockwise = true;
        this.angle_change = Math.PI / 4;
        }


    logic( deltaTime: number )
        {
        super.logic( deltaTime );

        if ( this.direction_clockwise )
            {
            this.angle += this.angle_change * deltaTime;

            if ( this.angle >= this.left_limit )
                {
                this.direction_clockwise = false;
                }
            }

        else
            {
            this.angle -= this.angle_change * deltaTime;

            if ( this.angle <= this.right_limit )
                {
                this.direction_clockwise = true;
                }
            }


        var x = this.movement_speed * deltaTime * 4 * Math.cos( this.angle );
        var y = this.movement_speed * deltaTime;
        this.rotation = this.angle;

        this.addToPosition( x, y );
        }
    }