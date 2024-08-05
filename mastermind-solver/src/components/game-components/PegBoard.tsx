import React from 'react'
import Guess from "./Guess.tsx";

export default function PegBoard(props: any) {
    const colors = props.colors;
    const currGuess = props.currGuess;
    const setCurrGuess = props.setCurrGuess;
    const guesses = props.guesses;
    const feedbacks= props.feedbacks;

    function updateGuess(i:number){
        setCurrGuess(currGuess + (i+1).toString());
    }

    return (
        <div>
            {colors.map((x:string,i:number) => <button key={i}
                title="Press me"
                style={{"backgroundColor":x}}
                className="pegboard-button"
                onClick={() => updateGuess(i)}
            />
            )}

            {guesses.map((x:string, i:number) => <Guess key={i} guess={x} colors={colors} feedback={feedbacks[i]}></Guess>)}
        </div>
    )
}
