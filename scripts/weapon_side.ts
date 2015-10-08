class WeaponSide extends Game.Weapon
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


    /**
     * Fire a bullet to each side of the element.
     */
    firingPattern( angle: number )
        {
        var fired = this._fire( angle - Math.PI / 4, 1 );

        if ( !fired )
            {
            return fired;
            }

        return this._fire( angle + Math.PI / 4, 1 );
        }
    }