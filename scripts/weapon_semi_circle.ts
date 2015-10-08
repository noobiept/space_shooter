class WeaponSemiCircle extends Game.Weapon
    {
    _bullet_queue: { angle: number; count: number; limit: number; }[];


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

        this._bullet_queue = [];
        }


    queueBullet( angle, delay )
        {
        this._bullet_queue.push({
                count: 0,
                limit: delay,
                angle: angle
            });
        }


    /**
     * Fires several bullets per angle, in a semi-circle in front of the element.
     * There's a delay between the bullets that are fired per angle, and between each angle.
     */
    firingPattern( refAngle: number )
        {
        var angle = refAngle - Math.PI / 2;
        var end = refAngle + Math.PI / 2;
        var bulletDelay = 0;
        var angleDelay = 0;
        var bulletInterval = 0.15;
        var angleInterval = 0.2;
        var bulletsPerAngle = 3;

        for ( ; angle <= end ; angle += Math.PI / 8)
            {
            bulletDelay = angleDelay;

            for (var a = 0 ; a < bulletsPerAngle ; a++)
                {
                this.queueBullet( angle, bulletDelay );

                bulletDelay += bulletInterval;
                }

            angleDelay += angleInterval;
            }

        return true;
        }


    logic( deltaTime: number )
        {
        super.logic( deltaTime );

        for (var a = this._bullet_queue.length - 1 ; a >= 0 ; a--)
            {
            var item = this._bullet_queue[ a ];

            item.count += deltaTime;

            if ( item.count >= item.limit )
                {
                this._fire( item.angle, 1 );

                this._bullet_queue.splice( a, 1 );
                }
            }
        }
    }