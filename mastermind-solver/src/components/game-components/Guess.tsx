import React from 'react'

export default function Guess(props) {
    const colors = props.colors;
    const guess = props.guess;
    const guessArr = guess.split("");
    let feedback = "";
    let feedbackArr:number[] = [];
    let feedbackArrColors =[];

    if (props.feedback) {
        feedback = props.feedback;
        feedbackArr = feedback.split("/");
        for (let i = 0; i < feedbackArr[0]; i++){
            feedbackArrColors.push("black");
        }
        for (let i = 0; i < feedbackArr[1]; i++){
            feedbackArrColors.push("white");
        }
    }


    return (
        <div className="pegboard-row">
            <div className="pegboard-colors">
                {guessArr.map((x:number,i:number) => <div key={i}
                  style={{"backgroundColor": colors[x-1]}}
                  className="pegboard-color"
                ></div>)}
            </div>
            <div className="pegboard-pegs">
                {feedbackArrColors.map((x:string,i:number) =>
                    <div key={i}
                         style={{"backgroundColor": x}}
                         className="pegboard-peg"
                    ></div>
                )}
            </div>
        </div>
    )
}
