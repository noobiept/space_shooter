class EnemyRandom extends Enemy
    {
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
        }
    }