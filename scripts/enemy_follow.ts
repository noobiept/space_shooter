class EnemyFollow extends Enemy
    {
    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy2';
        args.movementSpeed = 80;

        super( args );

        this.follow( Main.getPlayer() );
        }
    }