module Level
{
export interface LevelInfo
    {
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


export function start( level: number )
    {
    var info = Game.Preload.get( 'level' + level );

    if ( !info )
        {
        throw new Error( "Invalid level number." );
        }

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
    var spawnCount = 2;

    for (var a = 0 ; a < spawnCount ; a++)
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
        gameWon();
        }
    }


function gameWon()
    {
    if ( LEVEL_ENDED )
        {
        return;
        }

    LEVEL_ENDED = true;

    gameOver( 'You Won!', 2 );
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
    new Game.Message({
            body: text,
            container: Game.getCanvasContainer(),
            timeout: 2
        });

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