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
        { id: 'power_up_health', path: 'png/power-ups/shield_gold.png' },
        { id: 'laser_sound', path: 'sounds/sfx_laser1.ogg' },
        { id: 'music', path: 'sounds/walk_in_the_sky_2.ogg' }
    ];
var info = [
        { id: 'level0', path: 'level0.json' },
        { id: 'game_info', path: 'game_info.json' }
    ];


    // need to initialize the sound now, otherwise the preloaded sounds won't be decoded
Game.Sound.init();

    // add a loading message with the current progress of the assets pre-loading
var loading = document.createElement( 'div' );
loading.id = 'Loading';
loading.innerHTML = 'Loading..';

document.body.appendChild( loading );


preload.addEventListener( 'progress', function( progress )
    {
    loading.innerHTML = 'Loading.. ' + progress + '%';
    });
preload.addEventListener( 'complete', function()
    {
    document.body.removeChild( loading );

    Main.init();
    });
preload.loadManifest( assetsManifest, '../assets/' );
preload.loadManifest( info, '../info/' );
});


interface WeaponArgs extends Game.WeaponArgs
    {
    imageId: string;
    }

interface GameInfo
    {
    enemies: { [className: string]: EnemyInfo };
    weapons: { [className: string]: WeaponInfo };
    }

interface WeaponInfo
    {
    bulletSpeed: number;
    }

interface EnemyInfo
    {
    movementSpeed: number;
    damage: number;
    health: number;
    }


module Main
{
export const CANVAS_WIDTH = 768;
export const CANVAS_HEIGHT = 700;

var UNITS: Game.Container;
var BULLETS: Game.Container;
var POWER_UPS: Game.Container;

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
    var collision = new Game.CollisionDetection.SpatialPartition({
            canvasWidth: CANVAS_WIDTH,
            canvasHeight: CANVAS_HEIGHT,
            partitions: 7
        });

    Game.init( document.body, CANVAS_WIDTH, CANVAS_HEIGHT, collision );
    HighScore.init();
    Input.init();
    GameMenu.init();
    initGameInfo();

    var background = new Game.ScrollingBitmap({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            image: Game.Preload.get( 'background' ),
            direction: Game.ScrollingBitmapArgs.Direction.bottom,
            step: 1,
        interval: 0.1
        });


        // will contain all the units/bullets/etc
    UNITS = new Game.Container();
    BULLETS = new Game.Container();
    POWER_UPS = new Game.Container();

    Game.addElement( background );
    Game.addElement( POWER_UPS );
    Game.addElement( BULLETS );
    Game.addElement( UNITS );
    Game.addElement( HighScore.getTextElement() );

    var sourceNode = Game.Sound.play( Game.Preload.get( 'music' ) );
    sourceNode.loop = true;

    start();
    }


export function start()
    {
    PLAYER = new Player({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - 100
        });
    PLAYER.addEventListener( 'collision', playerCollisions );
    PLAYER.addEventListener( 'health_change', GameMenu.updateStatusBar );
    PLAYER.addEventListener( 'damage_change', GameMenu.updateStatusBar );
    PLAYER.addEventListener( 'speed_change', GameMenu.updateStatusBar );

    Main.addUnit( PLAYER );

    Level.start( 0 );
    GameMenu.updateStatusBar( PLAYER );
    }


function playerCollisions( data )
    {
    var player = data.element;
    var collidedWith = data.collidedWith;
    var bullet = data.bullet;
    var survived;

        // collided with a power up
    if ( collidedWith instanceof PowerUp )
        {
            // can't pick up power up with bullets
        if ( !bullet )
            {
            player.addPowerUp( collidedWith.power_up );
            collidedWith.remove();

            HighScore.addToScore( HighScore.SCORE_VALUE.pickedPowerUp );
            }
        }

        // collided with an enemy bullet
    else if ( collidedWith instanceof Game.Bullet )
        {
            // hit with a bullet
            // just remove both bullets
        if ( bullet )
            {
            collidedWith.remove();
            bullet.remove();
            }

            // take damage from enemy bullet
        else
            {
            survived = player.tookDamage( collidedWith.damage );
            collidedWith.remove();

            HighScore.addToScore( HighScore.SCORE_VALUE.bulletDamage );

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
            data.bullet.remove();
            survived = collidedWith.tookDamage( player.damage );

            if ( !survived )
                {
                spawnPowerUp( collidedWith.x, collidedWith.y );

                HighScore.addToScore( HighScore.SCORE_VALUE.enemyKill );
                }
            }

            // collision with the enemy element
        else
            {
                // takes double damage if collided directly with the enemy
            survived = PLAYER.tookDamage( collidedWith.damage * 2 );

            spawnPowerUp( collidedWith.x, collidedWith.y );

                // enemy is removed regardless of what health he may have
            collidedWith.remove();

            HighScore.addToScore( HighScore.SCORE_VALUE.enemyDamage );

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

    HighScore.setScore( 0 );

    UNITS.removeAllChildren();
    BULLETS.removeAllChildren();
    POWER_UPS.removeAllChildren();
    }


/**
 * Will update the enemies movement speed/damage/etc to be used in the game.
 * The values are added as a static property of the class constructor.
 * For example `EnemyRandom.damage = 10;`.
 */
function initGameInfo()
    {
    var info: GameInfo = Game.Preload.get( 'game_info' );

    var applyValues = function( infoDictionary )
        {
        for (var weaponClassName in infoDictionary)
            {
            if ( infoDictionary.hasOwnProperty( weaponClassName ) )
                {
                var classInfo = infoDictionary[ weaponClassName ];
                var classFunc = window[ weaponClassName ];

                for (var propertyName in classInfo)
                    {
                    if ( classInfo.hasOwnProperty( propertyName ) )
                        {
                        classFunc[ propertyName ] = classInfo[ propertyName ];
                        }
                    }
                }
            }
        };

    applyValues( info.enemies );
    applyValues( info.weapons );
    }


export function addUnit( element: Game.Element )
    {
    UNITS.addChild( element );
    }


export function getBulletContainer()
    {
    return BULLETS;
    }


export function getPlayer()
    {
    return PLAYER;
    }


export function restart()
    {
    clear();
    start();
    }


function gameOver()
    {
    var message = new Game.Message({
            body: 'Game Over!',
            container: Game.getCanvasContainer(),
            timeout: 2
        });
    HighScore.addCurrentScore();

    restart();
    }
}
