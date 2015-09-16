class WeaponSingle extends Game.Weapon
    {
    constructor( args )
        {
        super( args );

            // add other bullet shapes
        var bulletShape = new Game.Bitmap({
                image: Game.Preload.get( 'laser1' )
            });
        var bullet = new Game.Bullet({
                children: bulletShape,
                angleOrTarget: -Math.PI / 2,
                movement_speed: 200,
                angleOffset: -Math.PI / 2
            });
        this.addBulletType( bullet );
        }


    firingPattern( angle: number )
        {
        return this._fire( angle, 1 );
        }
    }