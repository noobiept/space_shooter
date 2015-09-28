class EnemyLine extends Enemy
    {
    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy1';
        args.movementSpeed = 100;
        args.damage = 10;
        args.health = 10;

        super( args );

        var weapon = new WeaponSingle({
                bulletContainer: Main.getBulletContainer(),
                imageId: 'laser1-red'
            });
        weapon.forceFire( Math.PI / 2, 0, 2 );

        this.addWeapon( weapon );
        this.addEventListener( 'collision', function( data )
            {
            if ( data.bullet )
                {
                data.collidedWith.tookDamage( data.element.damage );
                data.bullet.remove();
                }
            });
        this.moveTo( args.x, Main.CANVAS_HEIGHT + this._half_height );
        }
    }