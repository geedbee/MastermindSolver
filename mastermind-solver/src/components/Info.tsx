export default function Info() {
    return (
        <div>
            <h1>Info</h1>
            <p>This website uses the 5-Guess Algorithm proposed by Donald Knuth in 1977.</p>
            <p>The way this works is:</p>
            <ol>
                <li>
                    Create the set of all possible permutations. In a standard 6-color 4-length code with
                    repetitions, this is 1296 codes.
                </li>
                <li>
                    To be guaranteed a solve in minimum 5 guesses, start with guess "1122" (or any "two pair")
                </li>
                <li>
                    Record the feedback (B/W). If 4B/0W, you win! If not, remove the guess from the set of guesses you
                    can make. Filter out the guesses that are no longer possible given the feedback.
                </li>
                <li>
                    Use minimax algorithm to find the next best possible guess. Repeat from Step 3 until the next best
                    guess is the solution.
                </li>
            </ol>
            <p>Sounds pretty straightforward. So how does this minimax algorithm work?</p>
            <p>We keep track of two main pieces of information. One, the set of possible guesses still left,
                which is only changed when the user makes a new guess. For instance, if we guess "RRYY", "RRYY" will
                be taken out. Two, the set of guesses that are still feasible given the feedback we have received.
                For instance, if our prior guess "RRYY" had the feedback "BBWW", then a guess such as "GGBB" is
                simply impossible. In this explanation, I will refer to them as possible_guesses and feasible_guesses,
                respectively.
            </p>
            <p>For the standard 6-color 4-length repetitions-allowed game, these are all the possible combinations of
                feedback that you can receive (B,W) where B is correct position and color, and W is wrong position, correct color: <br/>
                (0,0)<br/>
                (0,1)<br/>
                (0,2)<br/>
                (0,3)<br/>
                (0,4)<br/>
                (1,0)<br/>
                (1,1)<br/>
                (1,2)<br/>
                (1,3)<br/>
                (2,0)<br/>
                (2,1)<br/>
                (2,2)<br/>
                (3,0)<br/>
                (4,0)<br/>
            </p>
            <p>When you make a guess, only one of these feedbacks are possible.
                So what counts as a good guess? A good guess eliminates the most amount guesses that are still feasible.</p>
            <p>Given an possible guess p, we iterate through all feasible guesses remaining as if each of them were the solution and
                for each instance of feedback, increase a counter.<br/>
                (0,0) 0<br/>
                (0,1) 24<br/>
                (0,2) 78<br/>
                (0,3) 30<br/>
                (0,4) 0<br/>
                (1,0) 8<br/>
                (1,1) 56<br/>
                (1,2) 28<br/>
                (1,3) 0<br/>
                (2,0) 18<br/>
                (2,1) 10<br/>
                (2,2) 0<br/>
                (3,0) 4<br/>
                (4,0) 0
            </p>
            <p>What does this imply? Well it means that, for example, if we guess p and our feedback is (3,0), then only
                4 feasible_guesses remain in the set. However, if our feedback is (0,2), than 78 feasible_guesses still
                remain for us to choose from. You can see how the lower the number, the closer we get to finding the
                solution.</p>
            <p>However, we do not know what feedback we are going to get from the guess. For every possible guess, all
                we have is this chart. Minimax works by preparing for the worst case. For our example guess above, the
                worst case is feedback (0,2), with 78 feasible guesses remaining.
            </p>
            <p>For ALL possible guesses, we make this chart by iterating through feasible guesses and find the worst case. Then, we go through all worst cases
                and find the best worst case (the maximum with the MINIMUM value. hence minimax). For instance, if guess p'
                had a worst case of 75, which is 3 less than p's worst case of 78, it is more favorable.
            </p>
            <p>
                Then, from the set of guesses with the minimum value (as there can be multiple with the same minimum max),
                we choose:
                <ol>
                    <li>The first one that appears in feasible_guesses</li>
                    <li>If none appear in feasible_guesses, the first one in the set</li>
                </ol>
            </p>
            <p>
                Doing this is guaranteed to get the answer in 5 guesses!
            </p>
        </div>
    )
}

