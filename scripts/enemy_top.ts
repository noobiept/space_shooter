class EnemyTop extends Enemy
    {
    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy3';
        args.movementSpeed = 60;
        args.damage = 10;
        args.health = 20;

        super( args );

        this.weapon = new WeaponSemiCircle({
                element: this,
                bulletContainer: Main.getBulletContainer(),
                imageId: 'laser2-red'
            });
        this.weapon.forceFire( Math.PI / 2, 1, 1.5 );
        this.movement.moveTo( args.x, 100 );
        }
    }