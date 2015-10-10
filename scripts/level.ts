module Level
{
export interface LevelInfo
    {
    spawnCount: number;
    powerUpInterval: number;
    spawn: SpawnInfo[];
    }

export interface SpawnInfo
    {
    className: string;
    time: number;
    }


var INFO: LevelInfo;    // information about the level (what enemies spawn, and at what time, etc)
var SPAWN_POSITION = 0; // the info on the 'spawn' array is ordered by time, this tell us what is the next position to look for
var NEXT_SPAWN: SpawnInfo;  // has the next info

var SPAWN_COUNT = 0;          // count the time passed (in seconds) since the level started, useful to know when to spawn the next enemies/etc
var FINISHED_SPAWNING = false;
var ENEMIES_COUNT = 0;  // keeps track of the number of enemies in the game
var LEVEL_ENDED = false;
var CURRENT_LEVEL = 0;
var POWER_UP_COUNT = 0;
var DELTA_TIME = 1;     // time between each update
var STATS_POWER_UP = true;      // whether to spawn a stats power-up or a weapon power-up


export function init()
    {
    Game.addToGameLoop( update, DELTA_TIME );
    }


export function start( level: number )
    {
    var info: LevelInfo = Game.Preload.get( 'level' + level );

    if ( !info )
        {
        throw new Error( "Invalid level number." );
        }

    Main.showMessage( 'Level ' + (level + 1) );

    CURRENT_LEVEL = level;
    INFO = info;
    SPAWN_COUNT = 0;
    POWER_UP_COUNT = 0;
    SPAWN_POSITION = 0;
    FINISHED_SPAWNING = false;
    ENEMIES_COUNT = 0;
    LEVEL_ENDED = false;
    NEXT_SPAWN = info.spawn[ SPAWN_POSITION ];
    STATS_POWER_UP = true;
    }


export function clear()
    {
    Game.removeFromGameLoop( update );
    }


function spawnEnemy( info: SpawnInfo )
    {
        // get the class constructor/function
    var classFunc = window[ info.className ];

    for (var a = 0 ; a < INFO.spawnCount ; a++)
        {
            // add the unit to the game
        var enemy = new classFunc({
                x: Game.Utilities.getRandomInt( Main.GAME_START_X, Main.GAME_END_X ),
                y: 0
            });
        Main.addEnemy( enemy );
        ENEMIES_COUNT++;
        }
    }


/**
 * Spawns a power-up in a random position in the upper part of the canvas.
 * Alternates between spawning a stats power-up, or a weapon power-up.
 */
function spawnPowerUp()
    {
    var x = Game.Utilities.getRandomInt( Main.GAME_START_X, Main.GAME_END_X );
    var y = Game.Utilities.getRandomInt( Main.GAME_START_Y, Main.GAME_END_Y / 2 );

    STATS_POWER_UP = !STATS_POWER_UP;

    var powerUp = PowerUp.createRandom( x, y, STATS_POWER_UP );
    Main.addPowerUp( powerUp );
    }


export function enemyRemoved()
    {
    ENEMIES_COUNT--;

    if ( FINISHED_SPAWNING && ENEMIES_COUNT === 0 )
        {
        getNextLevel();
        }
    }


function getNextLevel()
    {
    if ( LEVEL_ENDED )
        {
        return;
        }

    LEVEL_ENDED = true;

    try {
        start( CURRENT_LEVEL + 1 );
        }

        // no more levels
    catch( error )
        {
        gameOver( 'You Won!', 2 );
        }
    }


export function gameLost()
    {
    if ( LEVEL_ENDED )
        {
        return;
        }

    LEVEL_ENDED = true;

    gameOver( 'You Lost!' );
    }


/**
 * Only add the score at the end (to let time to count all the score from enemy kills and power-up pickups).
 */
function addScoreAndRestart()
    {
    HighScore.addCurrentScore();
    Main.restart();
    }


function gameOver( text: string, restartDelay?: number )
    {
    Main.showMessage( text );

    if ( typeof restartDelay === 'undefined' )
        {
        restartDelay = 0;
        }

    Game.addToGameLoop( addScoreAndRestart, restartDelay, false );
    }


function update()
    {
    if ( !FINISHED_SPAWNING )
        {
            // spawn of power-ups
        POWER_UP_COUNT += DELTA_TIME;

        if ( POWER_UP_COUNT >= INFO.powerUpInterval )
            {
            POWER_UP_COUNT = 0;

            spawnPowerUp();
            }


            // spawn of enemies
        SPAWN_COUNT += DELTA_TIME;

            // time to spawn some new element
        if ( SPAWN_COUNT >= NEXT_SPAWN.time )
            {
            spawnEnemy( NEXT_SPAWN );

            SPAWN_POSITION++;

                // no more elements to spawn
                // need to wait until there's no more enemies alive
            if ( SPAWN_POSITION >= INFO.spawn.length )
                {
                FINISHED_SPAWNING = true;
                }

            else
                {
                NEXT_SPAWN = INFO.spawn[ SPAWN_POSITION ];
                }
            }
        }
    }
}