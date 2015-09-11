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
preload.addEventListener( 'complete', Main.start );
preload.loadManifest( manifest, assets );
});


module Main
{
export const CANVAS_WIDTH = 768;
export const CANVAS_HEIGHT = 700;


export function start()
    {
    Game.init( document.body, CANVAS_WIDTH, CANVAS_HEIGHT );
    Input.init();


    var background = new Game.ScrollingBitmap({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            image: Game.Preload.get( 'background' ),
            direction: Game.ScrollingBitmapArgs.Direction.top,
            step: 1,
        interval: 0.3
        });
    Game.addElement( background );


    var player = new Player({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - 100
        });
    Game.addElement( player );
    }
}


