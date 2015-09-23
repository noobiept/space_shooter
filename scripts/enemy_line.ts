
class EnemyLine extends Enemy
    {
    constructor( args: EnemyArgs )
        {
        args.imageId = 'enemy1';
        args.movementSpeed = 100;

        super( args );

        this.moveTo( args.x, Main.CANVAS_HEIGHT + this._half_height );
        }
    }