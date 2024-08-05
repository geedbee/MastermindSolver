import React from 'react'

export default function Guess(props) {
    const colors = props.colors;
    const guess = props.guess;
    const guessArr = guess.split("");
    const feedback = props.feedback;
    const feedbackArr = feedback.split("/");
    let feedbackArrColors =[];
    for (let i = 0; i < feedbackArr[0]; i++){
        feedbackArrColors.push("black");
    }
    for (let i = 0; i < feedbackArr[1]; i++){
        feedbackArrColors.push("white");
    }

    return (
        <div>
            {guessArr.map((x:number,i:number) => <button key={i}
                title="Press me"
                style={{"backgroundColor": colors[x-1]}}
                className="pegboard-button"
            />)}

            {feedbackArrColors.map((x:string,i:number) =>
                <button key={i}
                        style={{"backgroundColor": x}}
                        className="pegboard-peg"
                />
            )}
        </div>
    )
}
