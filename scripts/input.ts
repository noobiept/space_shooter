module Input
{
export var KEYS_HELD = {
    leftArrow: false,
    rightArrow: false,
    upArrow: false,
    downArrow: false
};


export function init()
    {
    window.addEventListener( 'keydown', function( event )
        {
        var keyCode = Game.Utilities.KEY_CODE;

        switch( event.keyCode )
            {
            case keyCode.leftArrow:
                KEYS_HELD.leftArrow = true;
                break;

            case keyCode.rightArrow:
                KEYS_HELD.rightArrow = true;
                break;

            case keyCode.upArrow:
                KEYS_HELD.upArrow = true;
                break;

            case keyCode.downArrow:
                KEYS_HELD.downArrow = true;
                break;
            }
        });
    window.addEventListener( 'keyup', function( event )
        {
        var keyCode = Game.Utilities.KEY_CODE;

        switch( event.keyCode )
            {
            case keyCode.leftArrow:
                KEYS_HELD.leftArrow = false;
                break;

            case keyCode.rightArrow:
                KEYS_HELD.rightArrow = false;
                break;

            case keyCode.upArrow:
                KEYS_HELD.upArrow = false;
                break;

            case keyCode.downArrow:
                KEYS_HELD.downArrow = false;
                break;
            }
        });
    }
}