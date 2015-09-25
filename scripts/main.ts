/// <reference path="../libraries/game_engine.d.ts" />


window.addEventListener( 'load', function()
{
var preload = new Game.Preload({
        saveGlobal: true
    });

var assetsManifest = [
        { id: 'background', path: 'backgrounds/darkPurple.png' },
        { id: 'player', path: 'png/playerShip1_blue.png' },
        { id: 'laser1', path: 'png/lasers/laserBlue01.png' },
        { id: 'enemy1', path: 'png/enemies/enemyRed1.png' },
        { id: 'enemy2', path: 'png/enemies/enemyRed2.png' },
        { id: 'enemy3', path: 'png/enemies/enemyRed3.png' },
        { id: 'enemy4', path: 'png/enemies/enemyRed4.png' },
        { id: 'enemy5', path: 'png/enemies/enemyRed5.png' },
        { id: 'meteor1', path: 'png/meteors/meteorBrown_big1.png' },
        { id: 'meteor2', path: 'png/meteors/meteorBrown_big2.png' },
        { id: 'meteor3', path: 'png/meteors/meteorBrown_big3.png' },
        { id: 'meteor4', path: 'png/meteors/meteorBrown_big4.png' }
    ];
var levelsManifest = [
        { id: 'level0', path: 'level0.json' }
    ];


preload.addEventListener( 'complete', Main.start );
preload.loadManifest( assetsManifest, '../assets/' );
preload.loadManifest( levelsManifest, '../levels/' );
});


module Main
{
export const CANVAS_WIDTH = 768;
export const CANVAS_HEIGHT = 700;


var UNITS: Game.Container;
var BULLETS: Game.Container;


var PLAYER: Player;


var HEALTH_MENU: Game.Html.Value;


export function start()
    {
    Game.init( document.body, CANVAS_WIDTH, CANVAS_HEIGHT );
    Input.init();
    initMenu();


    var background = new Game.ScrollingBitmap({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            image: Game.Preload.get( 'background' ),
            direction: Game.ScrollingBitmapArgs.Direction.top,
            step: 1,
        interval: 0.1
        });
    Game.addElement( background );


        // will contain all the units/bullets
    UNITS = new Game.Container();
    BULLETS = new Game.Container();

    Game.addElement( BULLETS );
    Game.addElement( UNITS );


    Player.collidesWith = [ <any>EnemyLine, <any>EnemyFollow, <any>EnemyMeteor ];

    PLAYER = new Player({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - 100,
            health: 100
        });

    var singleWeapon = new WeaponSingle({
            bulletContainer: BULLETS,
            fireInterval: 0.5
        });
    var sideWeapon = new WeaponSide({
            bulletContainer: BULLETS,
            fireInterval: 0.5
        });

    PLAYER.addWeapon( singleWeapon );
    PLAYER.addWeapon( sideWeapon );

    PLAYER.addEventListener( 'collision', function( data )
        {
            // hit an enemy with a bullet
        if ( data.bullet )
            {
            data.bullet.remove();
            console.log( 'Hit!' );
            }

        else
            {
            var survived = PLAYER.tookDamage( data.collidedWith.damage );
            updateStatusBar();

                // game over
            if ( !survived )
                {
                gameOver();
                }
            }

        data.collidedWith.remove();
        });
    Main.addUnit( PLAYER );


    Level.start( 0 );
    updateStatusBar();
    }


function initMenu()
    {
    var menu = new Game.Html.HtmlContainer({
            cssId: 'Menu'
        });

    HEALTH_MENU = new Game.Html.Value({
            preText: 'Health: ',
            value: 0
        });
    var restart = new Game.Html.Button({
            value: 'Restart',
            callback: restart
        });
    menu.addChild( HEALTH_MENU );
    menu.addChild( restart );

    document.body.appendChild( menu.container );
    }


export function updateStatusBar()
    {
    HEALTH_MENU.setValue( PLAYER.health );
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


export function getPlayer()
    {
    return PLAYER;
    }


function restart()
    {

    }


function gameOver()
    {
    console.log( 'Game Over!' );
    restart();
    }
}
