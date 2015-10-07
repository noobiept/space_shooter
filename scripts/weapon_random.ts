class WeaponRandom extends Game.Weapon
    {
    constructor( args: WeaponArgs )
        {
        super( args );

        var bulletShape = new Game.Bitmap({
                image: Game.Preload.get( args.imageId )
            });
        var bullet = new Game.Bullet({
                children: bulletShape,
                movementSpeed: 275
            });
        this.addBulletType( bullet );
        this.damage = 10;
        }


    firingPattern( refAngle: number )
        {
        var limit = 5;

        for (var a = 0 ; a < limit ; a++)
            {
            var angle = Game.Utilities.getRandomFloat( 0, 2 * Math.PI );

            this._fire( angle, 1 );
            }

        return true;
        }
    }