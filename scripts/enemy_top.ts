class EnemyTop extends Enemy
    {
    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy3';
        args.movementSpeed = 60;
        args.damage = 10;
        args.health = 20;

        super( args );

        var weapon = new WeaponSemiCircle({
                bulletContainer: Main.getBulletContainer(),
                imageId: 'laser2-red'
            });
        weapon.forceFire( Math.PI / 2, 1, 1.5 );

        this.addWeapon( weapon );
        this.addEventListener( 'collision', Main.enemyBulletCollisions );
        this.moveTo( args.x, 100 );
        }
    }