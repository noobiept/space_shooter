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
        var left = angle - Math.PI / 4;
        var right = angle + Math.PI / 4;

        var diff = Math.PI / 16;

        this._fire( left - diff, 1 );
        this._fire( left + diff, 1 );

        this._fire( right - diff, 1 );
        this._fire( right + diff, 1 );

        return true;
        }
    }