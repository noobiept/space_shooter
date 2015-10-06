/// <reference path="../libraries/game_engine.d.ts" />


window.addEventListener( 'load', function()
{
var preload = new Game.Preload({
        saveGlobal: true
    });

var assetsManifest = [
        { id: 'background', path: 'backgrounds/darkPurple.png' },
        { id: 'player', path: 'png/playerShip1_blue.png' },
        { id: 'laser1-blue', path: 'png/lasers/laserBlue01.png' },
        { id: 'laser2-blue', path: 'png/lasers/laserBlue02.png' },
        { id: 'laser3-blue', path: 'png/lasers/laserBlue03.png' },
        { id: 'laser1-red', path: 'png/lasers/laserRed01.png' },
        { id: 'laser2-red', path: 'png/lasers/laserRed02.png' },
        { id: 'laser3-red', path: 'png/lasers/laserRed03.png' },
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
        { id: 'power_up_weapon', path: 'png/power-ups/star_gold.png' },
        { id: 'power_up_health', path: 'png/power-ups/shield_gold.png' }
    ];
var levelsManifest = [
        { id: 'level0', path: 'level0.json' }
    ];


preload.addEventListener( 'complete', Main.init );
preload.loadManifest( assetsManifest, '../assets/' );
preload.loadManifest( levelsManifest, '../levels/' );
});


interface WeaponArgs extends Game.WeaponArgs
    {
    imageId: string;
    }


module Main
{
export const CANVAS_WIDTH = 768;
export const CANVAS_HEIGHT = 700;

var UNITS: Game.Container;
var BULLETS: Game.Container;
var POWER_UPS: Game.Container;

var HEALTH_MENU: Game.Html.Value;
var DAMAGE_MENU: Game.Html.Value;
var SPEED_MENU: Game.Html.Value;

var PLAYER: Player;
var POWER_UP_SPAWN_COUNT = 0;
var POWER_UP_SPAWN_RATE = 1;    // spawn a power up for every 'value' enemy kills

export const CATEGORIES = {
    player: 1,
    enemy: 2,
    powerUp: 4
};


export function init()
    {
    Game.init( document.body, CANVAS_WIDTH, CANVAS_HEIGHT );
    Input.init();
    initMenu();

    var background = new Game.ScrollingBitmap({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            image: Game.Preload.get( 'background' ),
            direction: Game.ScrollingBitmapArgs.Direction.bottom,
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

    start();
    }


export function start()
    {
    PLAYER = new Player({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - 100
        });
    PLAYER.addEventListener( 'collision', playerCollisions );
    PLAYER.addEventListener( 'health_change', updateStatusBar );
    PLAYER.addEventListener( 'damage_change', updateStatusBar );
    PLAYER.addEventListener( 'speed_change', updateStatusBar );

    Main.addUnit( PLAYER );

    Level.start( 0 );
    updateStatusBar();
    }


function playerCollisions( data )
    {
    var player = data.element;
    var element = data.collidedWith;
    var bullet = data.bullet;
    var survived;

        // collided with a power up
    if ( element instanceof PowerUp )
        {
            // can't pick up power up with bullets
        if ( !bullet )
            {
            player.addPowerUp( element.power_up );
            Game.safeRemove( element );
            }
        }

        // collided with an enemy bullet
    else if ( element instanceof Game.Bullet )
        {
            // hit with a bullet
            // just remove both bullets
        if ( data.bullet )
            {
            Game.safeRemove( element );
            Game.safeRemove( data.bullet );
            }

            // take damage from enemy bullet
        else
            {
            survived = player.tookDamage( 1 ); //HERE need the damage from the bullet

            if ( !survived )
                {
                gameOver();
                }
            }
        }

        // its an enemy
    else
        {
            // hit an enemy with a bullet
        if ( data.bullet )
            {
            Game.safeRemove( data.bullet );
            survived = element.tookDamage( player.damage );

            if ( !survived )
                {
                spawnPowerUp( element.x, element.y );
                }
            }

            // collision with the enemy element
        else
            {
                // takes double damage if collided directly with the enemy
            survived = PLAYER.tookDamage( element.damage * 2 );

            spawnPowerUp( element.x, element.y );

                // enemy is removed regardless of what health he may have
            Game.safeRemove( element );

            if ( !survived )
                {
                gameOver();
                }
            }
        }
    }


/**
 * Add a power-up after a certain number of enemy kills.
 * It spawns where the enemy died.
 */
function spawnPowerUp( x, y )
    {
    POWER_UP_SPAWN_COUNT++;

    if ( POWER_UP_SPAWN_COUNT >= POWER_UP_SPAWN_RATE )
        {
        POWER_UP_SPAWN_COUNT = 0;

        var powerUp = PowerUp.createRandom( x, y );
        POWER_UPS.addChild( powerUp );
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
    DAMAGE_MENU = new Game.Html.Value({
            preText: 'Damage: ',
            value: 0
        });
    SPEED_MENU = new Game.Html.Value({
            preText: 'Speed: ',
            value: 0
        });
    var restartButton = new Game.Html.Button({
            value: 'Restart',
            callback: restart
        });
    menu.addChild( HEALTH_MENU );
    menu.addChild( DAMAGE_MENU );
    menu.addChild( SPEED_MENU );
    menu.addChild( restartButton );

    document.body.appendChild( menu.container );
    }


export function updateStatusBar()
    {
    HEALTH_MENU.setValue( PLAYER.health );
    DAMAGE_MENU.setValue( PLAYER.damage );
    SPEED_MENU.setValue( PLAYER.movement_speed );
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
        // this might get called in the middle of a logic function, so can't start clearing the elements just yet
        // do it at the start of the next game loop
    Game.addToGameLoop( restart, 0, false );
    }
}
