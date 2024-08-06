import {useEffect, useState} from 'react'
import PegBoard from "./game-components/PegBoard.tsx";
import Guess from "./game-components/Guess.tsx";

const N = 6; //number of colors
const M = 4; //length of code
const R = true; //repetitions allowed?
const colors = ["red", "yellow", "green", "blue", "black", "white"];
const feedbackColors = ["black", "white"];

let total_codes: string[] = getTotalCodes(N,M,R);
let knuth_codes: string[] = [...total_codes];
let possible_codes: string[] = [...total_codes];

//TODO: Add R support
function getTotalCodes(N : number, M: number, R: boolean): string[]{
    let total_codes : number[] = [];
    let possible_numbers = [];
    for (let i = 1; i <= N; i++) {
        possible_numbers.push(i);
    }
    total_codes = generatePermutations(possible_numbers, M);
    return total_codes.map((x) => stringifyCode(x));
}

function generateSolution(total_codes: string[]): string{
    const randInt: number = Math.floor(Math.random() * total_codes.length);
    return total_codes[randInt];
}

function stringifyBW(BW: number[]): string{
    return BW[0] + "/" + BW[1];
}

function stringifyCode(code: number[]): string{
    let codeStr = "";
    for (let i = 0; i < code.length; i++){
        codeStr += code[i].toString();
    }
    return codeStr;
}

function unstringifyCode(codeStr: string):number[]{
    const split_codeStr = codeStr.split("");
    let codes: number[] = [];
    split_codeStr.map((x) => codes.push(parseInt(x)));
    return codes;
}

function generatePermutations(list, size=list.length) {
    if (size > list.length) return [];
    else if (size == 1) return list.map(d=>[d]);
    return list.flatMap(d => generatePermutations(list, size - 1).map(item => [d, ...item]));
}

function guessCode(code_guess: string, code: string): number[]{
    let num_blacks = 0;
    let num_whites = 0;
    const guess_arr:number[] = unstringifyCode(code_guess);
    const code_arr:number[] = unstringifyCode(code);
    //check number of blacks
    for (let i = 0; i < guess_arr.length; i++){
        if (guess_arr[i] === code_arr[i]){
            num_blacks++;
            //set to -1 to ignore it when counting whites
            guess_arr[i] = -1;
            code_arr[i] = -1;
        }
    }
    //check number of whites
    for (let i = 0; i < guess_arr.length; i++){
        if (guess_arr[i] != -1){
            for (let j = 0; j < code_arr.length; j++){
                if (guess_arr[i] === code_arr[j]) {
                    num_whites++;
                    guess_arr[i] = -1;
                    code_arr[j] = -1;
                    break;
                }
            }
        }
    }
    return [num_blacks, num_whites];
}

function getCode(knuth_codes: string[], possible_codes: string[]): string{
    let guess_codes: string[] = miniMax(knuth_codes, possible_codes);
    return getGuessCodeFromList(knuth_codes, guess_codes);
}

function miniMax(knuth_codes: string[], possible_codes: string[]): string[]{
    const counts = new Map();
    //For each possible code, find the worst case amount of knuth_codes it can eliminate
    for (let i =0; i < possible_codes.length; i++){
        const times_found = new Map();
        let maxCount = 0;
        for (let j = 0; j < knuth_codes.length; j++){
            const feedback = guessCode(knuth_codes[j], possible_codes[i]);
            let ref = times_found.get(stringifyBW(feedback));
            if (!ref){
                times_found.set(stringifyBW(feedback),1);
            }
            else {
                times_found.set(stringifyBW(feedback),++ref);
                if (ref > maxCount){
                    maxCount = ref;
                }
            }
        }
        counts.set(possible_codes[i], maxCount);
    }
    //For the map of counts, find the minimum value
    let min_val: number = 100000;
    for (let count of counts.values()) {
        if (count < min_val){
            min_val = count;
        }
    }
    //Return all guesses that have that minimum value
    let guess_codes: string[] = [];
    for (let [key, value] of counts) {
        if (value === min_val){
            guess_codes.push(key);
        }
    }
    return guess_codes;
}

function getGuessCodeFromList(knuth_codes: string[], guess_codes:string[]){
    for (let i = 0; i < guess_codes.length; i++){
        for (let j = 0; j < knuth_codes.length; j++) {
            if (guess_codes[i] === knuth_codes[j]) {
                return guess_codes[i];
            }
        }
    }
    return guess_codes[0];
}

function pruneList(guess:string, feedback:string, knuth_nodes:string[]){
    //console.log(guess);
    //console.log(feedback);
    for (let i=0; i < knuth_nodes.length; i++){
        const new_feedback = stringifyBW(guessCode(knuth_nodes[i], guess));
        //console.log(knuth_nodes[i]);
        //console.log(new_feedback);
        if (new_feedback !== feedback){
            knuth_nodes.splice(i, 1);
            i--;
        }
    }
}


export default function Solve() {
    //REACT GAMEPLAY FUNCTIONS------------------------------------------------------------------------------------------
    const [currGuess, setCurrGuess] = useState<string>("");
    const [numGuess, setNumGuess] = useState<number>(0);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [feedbacks, setFeedbacks] = useState<string[]>([]);
    const [bestGuess, setBestGuess] = useState<string>("1122");
    const [currFeedback, setCurrFeedback] = useState<string>("");

    function undoGuess(){
        setCurrGuess(currGuess.slice(0,currGuess.length-1));
    }

    function makeNewGuess() {
        //valid checks
        if (currGuess.length != 4){
            return;
        }
        if (!containsOnlyDigits(currGuess)){
            return;
        }
        setGuesses(() => [...guesses, currGuess]);
        setFeedbacks(() => [...feedbacks, stringifyBW(guessCode(currGuess, solution))]);
        setNumGuess((n) => n+=1);

        pruneList(currGuess, stringifyBW(guessCode(currGuess, solution)), knuth_codes);
        const i = possible_codes.indexOf(currGuess);
        possible_codes.splice(i, 1);
        setBestGuess(getCode(knuth_codes, possible_codes));

        setCurrGuess("");
    }

    function updateFeedback(i){
        setCurrFeedback(currFeedback + (i+1).toString());
    }
    function makeNewFeedback(){

    }


    //Credit: https://www.geeksforgeeks.org/how-to-check-if-string-contains-only-digits-in-javascript/
    function containsOnlyDigits(str: string) {
        return /^\d+$/.test(str);
    }

    function updateGuess(i:number){
        if (currGuess.length < 4){
            setCurrGuess(currGuess + (i+1).toString());
        }
    }


    function resetGame(){
        total_codes = getTotalCodes(N,M,R);
        knuth_codes = [...total_codes];
        possible_codes = [...total_codes];
        setCurrGuess("");
        setNumGuess(0);
        setGuesses([]);
        setFeedbacks([]);
        setBestGuess("1122");
    }


    return (
        <>
            <h1>Solve Mastermind</h1>
            <div className="play-board">
                <PegBoard colors={colors} currGuess={currGuess} setCurrGuess={setCurrGuess} guesses={guesses}
                          feedbacks={feedbacks}></PegBoard>
            </div>
            <div className="buttons">
                {colors.map((x: string, i: number) => <button key={i}
                                                              title="Press me"
                                                              style={{"backgroundColor": x}}
                                                              className="pegboard-button"
                                                              onClick={() => updateGuess(i)}
                    />
                )}

                {feedbackColors.map((x: string, i: number) => <button key={i}
                                                                      title="Press me"
                                                                      style={{"backgroundColor": x}}
                                                                      className="pegboard-button"
                                                                      onClick={() => updateFeedback(i)}
                    />
                )}
                <button className="enter-button" title="submit" onClick={makeNewGuess}>Enter</button>
                <button className="enter-button" title="undo" onClick={undoGuess}>Undo</button>
            </div>
        </>
    )
}
