class EnemyTop extends Enemy
    {
    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy3';

        super( args );

        this.weapon = new WeaponSemiCircle({
                element: this,
                bulletContainer: Main.getBulletContainer(),
                imageId: 'laser2-red',
                category: Main.CATEGORIES.enemyBullets
            });
        this.weapon.damage = this.damage;
        this.weapon.forceFire( Math.PI / 2, 1, 2 );
        this.movement.moveTo( args.x, 100 );
        }
    }