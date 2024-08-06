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
            <div className="pegboard">
                {guesses.map((x:string, i:number) => <Guess key={i} guess={x} colors={colors} feedback={feedbacks[i]}></Guess>)}
                <Guess guess={currGuess} colors={colors}></Guess>
            </div>
        </div>
    )
}
