class EnemyMeteor extends Enemy
    {
    static ImageIds = [ 'meteor1', 'meteor2', 'meteor3', 'meteor4' ];

    constructor( args: EnemyArgs )
        {
        var randomPosition = Game.Utilities.getRandomInt( 0, EnemyMeteor.ImageIds.length - 1 );

        args.imageId = EnemyMeteor.ImageIds[ randomPosition ];
        args.movementSpeed = 75;
        args.damage = 20;
        args.health = 30;

        super( args );

        var angle = Game.Utilities.getRandomInt( 45, 90 );

        if ( args.x > Main.CANVAS_WIDTH / 2 )
            {
            angle += 45;
            }

        this.moveAngle( angle, true );
        }
    }