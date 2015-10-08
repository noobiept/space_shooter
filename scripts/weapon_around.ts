class WeaponAround extends Game.Weapon
    {
    constructor( args: WeaponArgs )
        {
        super( args );

        var constructor = <any>this.constructor;

        var bulletShape = new Game.Bitmap({
                image: Game.Preload.get( args.imageId )
            });
        var bullet = new Game.Bullet({
                children: bulletShape,
                movementSpeed: constructor.bulletSpeed
            });
        this.addBulletType( bullet );
        }


    /**
     * Fire bullets in all directions around the element.
     */
    firingPattern( refAngle: number )
        {
        var end = 2 * Math.PI;

        for (var angle = 0 ; angle < end ; angle += Math.PI / 8)
            {
            this._fire( angle, 1 );
            }

        return true;
        }
    }