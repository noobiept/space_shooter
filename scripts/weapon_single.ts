class WeaponSingle extends Game.Weapon
    {
    constructor( args: WeaponArgs )
        {
        super( args );

        var constructor = <any>this.constructor;

            // add other bullet shapes
        var bulletShape = new Game.Bitmap({
                image: Game.Preload.get( args.imageId )
            });
        var bullet = new Game.Bullet({
                children: bulletShape,
                angleOrTarget: -Math.PI / 2,
                movementSpeed: constructor.bulletSpeed
            });
        this.addBulletType( bullet );
        }


    firingPattern( angle: number )
        {
        return this._fire( angle, 1 );
        }
    }