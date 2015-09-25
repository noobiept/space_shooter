class EnemyFollow extends Enemy
    {
    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy2';
        args.movementSpeed = 80;
        args.damage = 10;

        super( args );

        this.follow( Main.getPlayer() );
        }
    }