class EnemyFollow extends Enemy
    {
    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy2';

        super( args );

        this.movement.follow( Main.getPlayer() );
        }
    }