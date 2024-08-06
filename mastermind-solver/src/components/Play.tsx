import {useState} from 'react'
import PegBoard from "./game-components/PegBoard.tsx";
import Guess from "./game-components/Guess.tsx";

//GAME CONFIGURATIONS---------------------------------------------------------------------------------------------------
const N = 6; //number of colors
const M = 4; //length of code
const R = true; //repetitions allowed?
const COLORS = ["red", "yellow", "green", "blue", "black", "white"];
const FEEDBACK_COLORS = ["black", "white"];

//GAME FUNCTIONALITY VARIABLES------------------------------------------------------------------------------------------
let total_codes: string[] = getTotalCodes(N,M,R);
let knuth_codes: string[] = [...total_codes];
let possible_codes: string[] = [...total_codes];
let solution: string = generateSolution(total_codes);

//GAME FUNCTIONS--------------------------------------------------------------------------------------------------------
//Function: Creates a list of all the possible codes that can be made in a game
//Input: N, M, R
//Output: All total codes, stringified
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
//Function: Generate a solution, choosing a random code from total codes
//Input: Total codes
//Output: One random code in total codes
function generateSolution(total_codes: string[]): string{
    const randInt: number = Math.floor(Math.random() * total_codes.length);
    return total_codes[randInt];
}

//UTILITY FUNCTIONS-----------------------------------------------------------------------------------------------------
//Function: Utility function that takes an array of two numbers and turns it into a string
//Input: [b..b',w..w']
//Output: "x/y"
function stringifyBW(BW: number[]): string{
    let countB = 0;
    let countW = 0;
    for (let i =0; i < BW.length; i++){
        if (BW[i] === 0){
            countB++;
        }
        else if (BW[i] === 1){
            countW++;
        }
    }
    return countB.toString() + "/" + countW.toString();
}
//Function: Utility function to unstringify BW
function unstringifyBW(BW: string): number[]{
    const numB:number = parseInt(BW[0]);
    const numW:number = parseInt(BW[2]);
    let res = [];
    for (let i = 0; i < numB; i++){
        res.push(0);
    }
    for (let i = 0; i < numW; i++){
        res.push(1);
    }
    return res;
}
//Function: Utility function that takes an array of N numbers and turns it into a string
//Input: [i, i+1, ...n-1]
//Output: "i" + "i+1" + ... + "n-1"
function stringifyCode(code: number[]): string{
    let codeStr = "";
    for (let i = 0; i < code.length; i++){
        codeStr += code[i].toString();
    }
    return codeStr;
}
//Function: Utility function, opposite of stringifyCode()
//Input: "i" + "i+1" + ... + "n-1"
//Output: [i, i+1, ...n-1]
function unstringifyCode(codeStr: string):number[]{
    const split_codeStr = codeStr.split("");
    let codes: number[] = [];
    split_codeStr.map((x) => codes.push(parseInt(x)));
    return codes;
}
//Function: Create all permutations of input array
//Input: An array of numbers
//Output: A list of permutations of numbers
//Credit: https://stackoverflow.com/questions/9960908/permutations-in-javascript, Andrew Richesson
//EDITED TO INCLUDE PERMUTATIONS WITH REPETITION
function generatePermutations(list, size=list.length) {
    if (size > list.length) return [];
    else if (size == 1) return list.map(d=>[d]);
    return list.flatMap(d => generatePermutations(list, size - 1).map(item => [d, ...item]));
}
//Function: Compare two codes and return the [blacks, whites]
//Input: Two codes (strings)
//Output: [blacks, whites]
function guessCode(code_guess: string, code: string): number[]{
    const guess_arr:number[] = unstringifyCode(code_guess);
    const code_arr:number[] = unstringifyCode(code);
    let feedback = [];
    //check number of blacks
    for (let i = 0; i < guess_arr.length; i++){
        if (guess_arr[i] === code_arr[i]){
            feedback.push(0);
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
                    feedback.push(1);
                    guess_arr[i] = -1;
                    code_arr[j] = -1;
                    break;
                }
            }
        }
    }
    return feedback;
}
//MINIMAX FUNCTIONS-----------------------------------------------------------------------------------------------------
//Function: Get the best possible guess, using the minimax algorithm
//Input: Knuth codes, possible codes
//Output: One code
function getCode(knuth_codes: string[], possible_codes: string[]): string{
    let guess_codes: string[] = miniMax(knuth_codes, possible_codes);
    return getGuessCodeFromList(knuth_codes, guess_codes);
}
//Function: Implement minimax to find the best possible guesses
//Input: Knuth codes, possible codes
//Output: Array of best guesses
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
//Function: Return the first knuth code we can find in guess codes OR the first code in guess codes if no knuth code
//Input: Knuth codes, guess codes
//Output: One code
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
//Function: Manage knuth_codes, removing codes that are no longer possible
//Input: last_guess, feedback, knuth_nodes
//Output: none
function pruneList(guess:string, feedback:string, knuth_nodes:string[]){
    for (let i=0; i < knuth_nodes.length; i++){
        const new_feedback = stringifyBW(guessCode(knuth_nodes[i], guess));
        if (new_feedback !== feedback){
            knuth_nodes.splice(i, 1);
            i--;
        }
    }
}

//REACT FUNCTIONAL COMPONENT--------------------------------------------------------------------------------------------
export default function Play() {
    //REACT GAMEPLAY VARIABLES------------------------------------------------------------------------------------------
    const [currGuess, setCurrGuess] = useState<string>("");
    const [numGuess, setNumGuess] = useState<number>(0);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [feedbacks, setFeedbacks] = useState<number[][]>([]);
    const [solved, setSolved] = useState<boolean>(false);
    const [bestGuess, setBestGuess] = useState<string>("1122");
    const [isHintEnabled, setIsHintEnabled] = useState<boolean>(false);

    //REACT GAMEPLAY FUNCTIONS------------------------------------------------------------------------------------------
    //Function: Add to currGuess by pressing button
    //Input: Index of button
    //Output: None
    function updateGuess(i:number){
        if (currGuess.length < 4){
            setCurrGuess(currGuess + (i+1).toString());
        }
    }
    //Function: Remove 1 from currGuess by pressing button
    //Input: None
    //Output: None
    function undoGuess(){
        setCurrGuess(currGuess.slice(0,currGuess.length-1));
    }
    //Function: Make new guess from curr guess
    //Input: None
    //Output: None
    function makeNewGuess() {
        if (currGuess === solution){
            setSolved(true);
        }
        //Gameplay functions
        setGuesses(() => [...guesses, currGuess]);
        setFeedbacks(() => [...feedbacks, guessCode(currGuess, solution)]);
        setNumGuess((n) => n+=1);
        //Minimax maintenance
        pruneList(currGuess, stringifyBW(guessCode(currGuess, solution)), knuth_codes);
        const i = possible_codes.indexOf(currGuess);
        possible_codes.splice(i, 1);
        setBestGuess(getCode(knuth_codes, possible_codes));
        //Reset currGuess
        setCurrGuess("");
    }
    //Function: Toggle the hint box
    //Input: None
    //Output: None
    function toggleHints(){
        setIsHintEnabled(!isHintEnabled);
    }
    //Function: Reset the game upon completion
    //Input: None
    //Output: None
    function resetGame(){
        total_codes = getTotalCodes(N,M,R);
        knuth_codes = [...total_codes];
        possible_codes = [...total_codes];
        solution = generateSolution(total_codes);
        setCurrGuess("");
        setNumGuess(0);
        setGuesses([]);
        setFeedbacks([]);
        setSolved(false);
        setBestGuess("1122");
        setIsHintEnabled(false);
    }
    //REACT COMPONENT---------------------------------------------------------------------------------------------------
    return (
        <>
            <h1>Play Mastermind</h1>
            <div className="play-board">
                <PegBoard colors={COLORS} feedbackColors={FEEDBACK_COLORS} currGuess={currGuess} guesses={guesses}
                          feedbacks={feedbacks} currFeedback={[]}></PegBoard>
                {!solved && <div className="hint-box">
                    <button className="enter-button" title="hints" onClick={toggleHints}>Hint?</button>
                    {isHintEnabled && <Guess colors={COLORS} guess={bestGuess} feedbackColors={FEEDBACK_COLORS} currFeedback={[]}></Guess>}
                </div>}
            </div>
            <div className="buttons">
                {COLORS.map((x: string, i: number) => <button key={i}
                                                              title="Press me"
                                                              style={{"backgroundColor": x}}
                                                              className="pegboard-button"
                                                              onClick={() => updateGuess(i)}
                    />
                )}
                <button className="enter-button" title="submit" onClick={makeNewGuess}>Enter</button>
                <button className="enter-button" title="undo" onClick={undoGuess}>Undo</button>
                {solved && <button className="enter-button" title="reset" onClick={resetGame}>Reset</button>}
            </div>
        </>
    )
}
