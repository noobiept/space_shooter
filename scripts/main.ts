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
        { id: 'meteor4', path: 'png/meteors/meteorBrown_big4.png' },
        { id: 'power_up_damage', path: 'png/power-ups/pill_yellow.png' },
        { id: 'power_up_speed', path: 'png/power-ups/bolt_gold.png' },
        { id: 'power_up_weapon', path: 'png/power-ups/star_gold.png' }
    ];
var levelsManifest = [
        { id: 'level0', path: 'level0.json' }
    ];


preload.addEventListener( 'complete', Main.init );
preload.loadManifest( assetsManifest, '../assets/' );
preload.loadManifest( levelsManifest, '../levels/' );
});


module Main
{
export const CANVAS_WIDTH = 768;
export const CANVAS_HEIGHT = 700;

var UNITS: Game.Container;
var BULLETS: Game.Container;
var POWER_UPS: Game.Container;

var HEALTH_MENU: Game.Html.Value;

var PLAYER: Player;
var POWER_UP_SPAWN_COUNT = 0;
var POWER_UP_SPAWN_RATE = 1;    // spawn a power up for every 'value' enemy kills


export function init()
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


        // will contain all the units/bullets/etc
    UNITS = new Game.Container();
    BULLETS = new Game.Container();
    POWER_UPS = new Game.Container();

    Game.addElement( POWER_UPS );
    Game.addElement( BULLETS );
    Game.addElement( UNITS );

    Player.collidesWith = [ <any>EnemyLine, <any>EnemyFollow, <any>EnemyMeteor, <any>PowerUp ];


    start();
    }


export function start()
    {
    PLAYER = new Player({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - 100,
            health: 100
        });
    PLAYER.addEventListener( 'collision', playerCollisions );
    Main.addUnit( PLAYER );


    Level.start( 0 );
    updateStatusBar();
    }


function playerCollisions( data )
    {
    var player = data.element;
    var element = data.collidedWith;
    var bullet = data.bullet;

        // collided with a power up
    if ( element instanceof PowerUp )
        {
            // can't pick up power up with bullets
        if ( !bullet )
            {
            player.addPowerUp( element.power_up );
            element.remove();
            }
        }

        // its an enemy
    else
        {
            // hit an enemy with a bullet
        if ( data.bullet )
            {
            data.bullet.remove();
            console.log( 'Hit!' );
            }

            // collision with the enemy element
        else
            {
            var survived = PLAYER.tookDamage( element.damage );
            updateStatusBar();

            if ( !survived )
                {
                gameOver();
                }
            }

            // add a power-up after a certain number of enemy kills
            // it spawns where the enemy died
        POWER_UP_SPAWN_COUNT++;

        if ( POWER_UP_SPAWN_COUNT >= POWER_UP_SPAWN_RATE )
            {
            POWER_UP_SPAWN_COUNT = 0;

            var powerUp = PowerUp.createRandom( element.x, element.y );
            POWER_UPS.addChild( powerUp );
            }

        element.remove();
        }
    }


function clear()
    {
    Level.clear();

    PLAYER.remove();
    PLAYER = null;

    UNITS.removeAllChildren();
    BULLETS.removeAllChildren();
    POWER_UPS.removeAllChildren();
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
    var restartButton = new Game.Html.Button({
            value: 'Restart',
            callback: restart
        });
    menu.addChild( HEALTH_MENU );
    menu.addChild( restartButton );

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
    clear();
    start();
    }


function gameOver()
    {
    console.log( 'Game Over!' );
    restart();
    }
}
