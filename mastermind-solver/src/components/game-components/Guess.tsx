export default function Guess(props) {
    const colors = props.colors;
    const guess = props.guess;
    const guessArr = guess.split("");
    const feedbackColors = props.feedbackColors;

    const currFeedback = props.currFeedback;

    return (
        <div className="pegboard-row">
            <div className="pegboard-colors">
                {guessArr.map((x:number,i:number) => <div key={i}
                  style={{"backgroundColor": colors[x-1]}}
                  className="pegboard-color"
                ></div>)}
            </div>
            <div className="pegboard-pegs">
                {currFeedback.map((x:number,i:number) =>
                    <div key={i}
                         style={{"backgroundColor": feedbackColors[x]}}
                         className="pegboard-peg"
                    ></div>
                )}
            </div>
        </div>
    )
}
