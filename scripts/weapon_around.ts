interface WeaponAroundArgs extends Game.WeaponArgs
    {
    imageId: string;
    }


class WeaponAround extends Game.Weapon
    {
    constructor( args: WeaponAroundArgs )
        {
        super( args );

        var bulletShape = new Game.Bitmap({
                image: Game.Preload.get( args.imageId )
            });
        var bullet = new Game.Bullet({
                children: bulletShape,
                movementSpeed: 250
            });
        this.addBulletType( bullet );
        }


    firingPattern( refAngle: number )
        {
        var end = 2 * Math.PI;

        for (var angle = 0 ; angle < end ; angle += Math.PI / 4)
            {
            this._fire( angle, 1 );
            }

        return true;
        }
    }