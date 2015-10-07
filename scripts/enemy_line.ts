class EnemyLine extends Enemy
    {
    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy1';

        super( args );

        this.weapon = new WeaponSingle({
                element: this,
                bulletContainer: Main.getBulletContainer(),
                imageId: 'laser1-red'
            });
        this.weapon.damage = this.damage;
        this.weapon.forceFire( Math.PI / 2, 1, 2 );

        this.movement.moveTo( args.x, Main.CANVAS_HEIGHT + this.half_height );
        }
    }