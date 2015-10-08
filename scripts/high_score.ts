module HighScore
{
var SCORE = 0;      // current score
var SCORE_TEXT: Game.Text;

export const SCORE_VALUE = {
    enemyKill: 20,
    pickedPowerUp: 10,
    bulletDamage: -2,
    enemyDamage: -5
};


export function init()
    {
    Game.HighScore.init( 1, 'space_shooter_highscore', false );

    SCORE_TEXT = new Game.Text({
            x: Main.CANVAS_WIDTH,
            y: 0,
            text: 'Score: 0',
            fontFamily: 'monospace',
            fontSize: 20,
            textAlign: 'end',
            textBaseline: 'top',
            color: 'white'
        });
    }


export function getTextElement()
    {
    return SCORE_TEXT;
    }


/**
 * Add the current score to the high-score.
 * The value is compared with a previous score, and is only saved if it happens to be higher.
 */
export function addCurrentScore()
    {
    Game.HighScore.add( 'score', SCORE );

    GameMenu.updateHighScore( getCurrentHighScore() );
    }


/**
 * Get the current high-score.
 */
export function getCurrentHighScore()
    {
    var score = Game.HighScore.get( 'score' );

    if ( score )
        {
        return score[ 0 ];
        }

    return 0;
    }


/**
 * Add to the current score (also updates the text element).
 */
export function addToScore( score: number )
    {
    SCORE += score;
    SCORE_TEXT.text = 'Score: ' + SCORE;
    }


/**
 * Sets the score to the given value.
 */
export function setScore( score: number )
    {
    SCORE = score;
    SCORE_TEXT.text = 'Score: ' + SCORE;
    }
}