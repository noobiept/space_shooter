module Level
{
export interface LevelInfo
    {
    spawnCount: number;
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

var COUNT = 0;          // count the time passed (in seconds) since the level started, useful to know when to spawn the next enemies/etc
var FINISHED_SPAWNING = false;
var ENEMIES_COUNT = 0;  // keeps track of the number of enemies in the game
var LEVEL_ENDED = false;
var CURRENT_LEVEL = 0;
var SPAWN_COUNT = 0;    // how many enemies it spawns each time


export function start( level: number )
    {
    var info: LevelInfo = Game.Preload.get( 'level' + level );

    if ( !info )
        {
        throw new Error( "Invalid level number." );
        }

    Main.showMessage( 'Level ' + (level + 1) );

    SPAWN_COUNT = info.spawnCount;
    CURRENT_LEVEL = level;
    INFO = info;
    COUNT = 0;
    SPAWN_POSITION = 0;
    FINISHED_SPAWNING = false;
    ENEMIES_COUNT = 0;
    LEVEL_ENDED = false;
    NEXT_SPAWN = info.spawn[ SPAWN_POSITION ];

        // update every second
    Game.addToGameLoop( update, 1 );
    }


export function clear()
    {
    Game.removeFromGameLoop( update );
    }


function spawnEnemy( info: SpawnInfo )
    {
        // get the class constructor/function
    var classFunc = window[ info.className ];

    for (var a = 0 ; a < SPAWN_COUNT ; a++)
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


/**
 * Says if the level has finished spawning all the enemies.
 */
export function isDone()
    {
    return FINISHED_SPAWNING;
    }


function update()
    {
    COUNT++;

        // time to spawn some new element
    if ( COUNT >= NEXT_SPAWN.time )
        {
        spawnEnemy( NEXT_SPAWN );

        SPAWN_POSITION++;

            // no more elements to spawn
            // need to wait until there's no more enemies alive
        if ( SPAWN_POSITION >= INFO.spawn.length )
            {
            FINISHED_SPAWNING = true;
            clear();
            }

        else
            {
            NEXT_SPAWN = INFO.spawn[ SPAWN_POSITION ];
            }
        }
    }
}