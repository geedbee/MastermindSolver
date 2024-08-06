import Guess from "./Guess.tsx";

export default function PegBoard(props: any) {
    const colors = props.colors;
    const feedbackColors = props.feedbackColors;

    const currGuess = props.currGuess;
    const guesses = props.guesses;

    const feedbacks= props.feedbacks;
    const currFeedback = props.currFeedback;

    return (
        <div>
            <div className="pegboard">
                {feedbacks && guesses.map((x:string, i:number) => <Guess key={i} guess={x} colors={colors} currFeedback={feedbacks[i]} feedbackColors={feedbackColors}></Guess>)}
                <Guess colors={colors} guess={currGuess} feedbackColors={feedbackColors} currFeedback={[]}/>
            </div>
        </div>
    )
}

