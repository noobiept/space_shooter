interface WeaponSingleArgs extends Game.WeaponArgs
    {
    imageId: string;
    }


class WeaponSingle extends Game.Weapon
    {
    constructor( args: WeaponSingleArgs )
        {
        super( args );

            // add other bullet shapes
        var bulletShape = new Game.Bitmap({
                image: Game.Preload.get( args.imageId )
            });
        var bullet = new Game.Bullet({
                children: bulletShape,
                angleOrTarget: -Math.PI / 2,
                movementSpeed: 300
            });
        this.addBulletType( bullet );
        }


    firingPattern( angle: number )
        {
        return this._fire( angle, 1 );
        }
    }