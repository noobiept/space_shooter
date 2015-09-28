interface WeaponSideArgs extends Game.WeaponArgs
    {
    imageId: string;
    }

class WeaponSide extends Game.Weapon
    {
    constructor( args: WeaponSideArgs )
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
        var fired = this._fire( angle - Math.PI / 4, 1 );

        if ( !fired )
            {
            return fired;
            }

        return this._fire( angle + Math.PI / 4, 1 );
        }
    }