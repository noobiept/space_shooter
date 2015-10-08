module GameMenu
{
var HEALTH_MENU: Game.Html.Value;
var DAMAGE_MENU: Game.Html.Value;
var SPEED_MENU: Game.Html.Value;
var HIGH_SCORE_MENU: Game.Html.Value;


export function init()
    {
    var menu = new Game.Html.HtmlContainer({
            cssId: 'Menu'
        });

    HEALTH_MENU = new Game.Html.Value({
            preText: 'Health: ',
            value: 0
        });
    DAMAGE_MENU = new Game.Html.Value({
            preText: 'Damage: ',
            value: 0
        });
    SPEED_MENU = new Game.Html.Value({
            preText: 'Speed: ',
            value: 0
        });
    HIGH_SCORE_MENU = new Game.Html.Value({
            preText: 'High-score: ',
            value: HighScore.getCurrentHighScore()
        });
    var volumeRange = new Game.Html.Range({
            preText: 'Volume: ',
            min: 0,
            max: 1,
            value: Game.Sound.getGlobalGain(),
            step: 0.1,
            onChange: function( button )
                {
                Game.Sound.setGlobalGain( button.getValue() );
                }
        });
    var restartButton = new Game.Html.Button({
            value: 'Restart',
            callback: Main.restart
        });
    menu.addChild( HEALTH_MENU );
    menu.addChild( DAMAGE_MENU );
    menu.addChild( SPEED_MENU );
    menu.addChild( HIGH_SCORE_MENU );
    menu.addChild( volumeRange );
    menu.addChild( restartButton );

    document.body.appendChild( menu.container );
    }


export function updateHighScore( value: number )
    {
    HIGH_SCORE_MENU.setValue( value );
    }


export function updateStatusBar( player: Player )
    {
    HEALTH_MENU.setValue( player.health );
    DAMAGE_MENU.setValue( player.damage );
    SPEED_MENU.setValue( player.movement_speed );
    }
}