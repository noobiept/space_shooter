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
        { id: 'laser1', path: 'png/lasers/laserBlue01.png' },
        { id: 'enemy1', path: 'png/enemies/enemyRed1.png' },
        { id: 'enemy2', path: 'png/enemies/enemyRed2.png' },
        { id: 'enemy3', path: 'png/enemies/enemyRed3.png' },
        { id: 'enemy4', path: 'png/enemies/enemyRed4.png' },
        { id: 'enemy5', path: 'png/enemies/enemyRed5.png' }
    ];
preload.addEventListener( 'complete', Main.start );
preload.loadManifest( manifest, assets );
});


module Main
{
export const CANVAS_WIDTH = 768;
export const CANVAS_HEIGHT = 700;


var UNITS: Game.Container;
var BULLETS: Game.Container;


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


        // will contain all the units/bullets
    UNITS = new Game.Container();
    BULLETS = new Game.Container();

    Game.addElement( BULLETS );
    Game.addElement( UNITS );


    Player.collidesWith = [ <any>Enemy ];

    var player = new Player({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - 100
        });

    var singleWeapon = new WeaponSingle({
            bulletContainer: BULLETS,
            fireInterval: 0.5
        });
    var sideWeapon = new WeaponSide({
            bulletContainer: BULLETS,
            fireInterval: 0.5
        });

    player.addWeapon( singleWeapon );
    player.addWeapon( sideWeapon );


    player.addEventListener( 'collision', function( data )
        {
            // hit an enemy with a bullet
        if ( data.bullet )
            {
            data.collidedWith.remove();
            console.log( 'Hit!' );
            }

        else
            {
            console.log( 'Got hit!' );
            }
        });
    Main.addUnit( player );

    var enemy = new Enemy({
            x: CANVAS_WIDTH / 2,
            y: 40
        });
    Main.addUnit( enemy );
    }


export function addUnit( element: Game.Element )
    {
    UNITS.addChild( element );
    }


export function addBullet( bullet: Game.Bullet )
    {
    BULLETS.addChild( bullet );
    }


export function getBulletContainer()
    {
    return BULLETS;
    }
}
