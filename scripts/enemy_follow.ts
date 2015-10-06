class EnemyFollow extends Enemy
    {
    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy2';
        args.movementSpeed = 80;
        args.damage = 10;
        args.health = 20;

        super( args );

        this.movement.follow( Main.getPlayer() );
        }
    }