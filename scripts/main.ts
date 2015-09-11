/// <reference path="../libraries/game_engine.d.ts" />


window.addEventListener( 'load', function()
{
var preload = new Game.Preload({
        save_global: true
    });
var assets = '../assets/';

var manifest = [
        { id: 'background', path: 'backgrounds/darkPurple.png' },
        { id: 'player', path: 'png/playerShip1_blue.png' },
        { id: 'laser1', path: 'png/lasers/laserBlue01.png' }
    ];
preload.addEventListener( 'complete', start );
preload.loadManifest( manifest, assets );
});


function start()
{
Game.init( document.body, 400, 400 );
Input.init();

var background = new Game.ScrollingBitmap({
        x: 200,
        y: 200,
        image: Game.Preload.get( 'background' ),
        direction: Game.ScrollingBitmapArgs.Direction.top,
        step: 1,
       interval: 0.3
    });
Game.addElement( background );


var player = new Player({
        x: 200,
        y: 200
    });
Game.addElement( player );
}