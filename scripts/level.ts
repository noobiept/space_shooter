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
                x: Game.Utilities.getRandomInt( 0, Main.CANVAS_WIDTH ),
                y: 0
            });
        Main.addUnit( enemy );
        }
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
            //HERE
            clear();
            }

        else
            {
            NEXT_SPAWN = INFO.spawn[ SPAWN_POSITION ];
            }
        }
    }
}