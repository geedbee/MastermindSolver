import React, {useState, useTransition} from 'react'

export default function Play() {
    //BASE GAME FUNCTIONS-----------------------------------------------------------------------------------------------
    const N = 6; //number of colors
    const M = 4; //length of code
    const R = true; //repetitions allowed?

    //Function: main function
    //Input: N, M, R
    //Output: Number of guesses
    function mastermind(N: number,M: number,R: boolean) : number{
        let total_codes: string[] = getTotalCodes(N,M,R);
        let knuth_codes: string[] = [...total_codes];
        let possible_codes: string[] = [...total_codes];
        let solution: string = generateSolution(total_codes);
        let num_guesses: number = 0;
        let solved: boolean = false;
        while (!solved){
            let guess = getCode(knuth_codes, possible_codes);
            let feedback = guessCode(solution, guess);
            if (feedback[0] === 4 && feedback[1] === 0){
                solved = true;
            }
            else{
                pruneList(guess, stringifyBW(feedback), knuth_codes);
            }
            num_guesses++;
        }

        return num_guesses;
    }

    //Function: Creates a list of all the possible codes that can be made in a game
    //Input: N, M, R
    //Output: all total codes in the string format
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
    //Output: One code
    function generateSolution(total_codes: string[]): string{
        const randInt: number = Math.floor(Math.random() * total_codes.length);
        return total_codes[randInt];
    }

    //UTILITY FUNCTIONS-------------------------------------------------------------------------------------------------
    //Function: Utility function that takes an array of two numbers and turns it into a string
    //Input: [x,y]
    //Output: "x/y"
    function stringifyBW(BW: number[]): string{
        return BW[0] + "/" + BW[1];
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

    //Function: Opposite of stringifyCode()
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
    function generatePermutations(list, size=list.length) {
        if (size > list.length) return [];
        else if (size == 1) return list.map(d=>[d]);
        return list.flatMap(d => generatePermutations(list.filter(a => a !== d), size - 1).map(item => [d, ...item]));
    }

    //Function: Compare two codes and return the [blacks, whites]
    //Input: Two codes (strings)
    //Output: [blacks, whites]
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
                for (let j = 0; j < code_arr.length; i++){
                    if (code_arr[j] != -1) {
                        if (guess_arr[i] == code_arr[j]) {
                            num_whites++;
                            guess_arr[i] = -1;
                            code_arr[j] = -1;
                            break;
                        }
                    }
                }
            }
        }
        return [num_blacks, num_whites];
    }

    //MINIMAX FUNCTIONS-------------------------------------------------------------------------------------------------
    //Function: Get the best possible guess, using the minimax algorithm
    //Input: Knuth codes, possible codes
    //Output: One code
    function getCode(knuth_codes: string[], possible_codes: string[]): string{
        let guess_codes: string[] = miniMax(knuth_codes, possible_codes);
        let code: string = getGuessCodeFromList(knuth_codes, guess_codes);
        //remove from possible_codes
        const i = possible_codes.indexOf(code);
        possible_codes.splice(i, 1);
        return code;
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
                if (ref === undefined){
                    ref = 0;
                }
                else {
                    ref++;
                    if (ref > maxCount){
                        maxCount = ref;
                    }
                }
            }
            counts.set(possible_codes[i], maxCount);
        }
        //For the map of counts, find the minimum value
        let min_val: number = 0;
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
            const new_feedback = stringifyBW(guessCode(guess, knuth_nodes[i]));
            if (new_feedback !== feedback){
                knuth_nodes.splice(i, 1);
            }
        }
    }

    //REACT GAMEPLAY FUNCTIONS------------------------------------------------------------------------------------------
    const [currGuess, setCurrGuess] = useState("");
    const [numGuess, setNumGuess] = useState(0);
    const [guesses, setGuesses] = useState([]);

    function playMastermind(N: number,M: number,R: boolean){
        let total_codes: string[] = getTotalCodes(N,M,R);
        let knuth_codes: string[] = [...total_codes];
        let possible_codes: string[] = [...total_codes];
        let solution: string = generateSolution(total_codes);
        let solved: boolean = false;

        while (!solved){
            let feedback = guessCode(solution, currGuess);
            if (feedback[0] === 4 && feedback[1] === 0){
                solved = true;
            }
            else{
                pruneList(currGuess, stringifyBW(feedback), knuth_codes);
            }
            setNumGuess((n) => n++);
        }
    }

    function handleGuessChange(e: any){
        setCurrGuess(e.target.value);
    }

    function handleKeyDown(e : any){
        //console.log(e.key);
        if (e.key === "Enter"){
            makeNewGuess();
        }
    }

    function makeNewGuess() {
        setGuesses(() => [...guesses, currGuess]);
    }

    return (
        <>
            <h1>Play Mastermind</h1>
            <input
                type="text"
                placeholder="Enter guess"
                value={currGuess}
                onChange={handleGuessChange}
                onKeyDown={handleKeyDown}
            />
        </>
    )
}
