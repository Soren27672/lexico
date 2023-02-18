import React, { useContext, useEffect, useState } from "react";
import { globalContext } from "../globalContext";
import Rank from "./Rank";

function LeaderboardPage() {
    const { userData } = useContext(globalContext);
    const [rankingData, setRankingData] = useState(null);
    const [formName, setFormName] = useState('');

    function getRankings() {
        console.log('get rankings ran');
        fetch('http://localhost:3000/rankings')
        .then(r => r.json())
        .then(rankings => {
            rankings.sort((a,b) => b.points - a.points);
            setRankingData(rankings);
        });
    }

    useEffect(getRankings,[])

    function postScore(name, points, time, e) {
        e.preventDefault();

        if (name === '') {
            console.log('Enter a name');
            return;
        }

        if (points === 0) {
            console.log('Complete a game');
            return;
        }

        if (time === 0) {
            console.log('Complete a game');
            return;
        }

        const userObj = JSON.stringify({
            name: name,
            points: points,
            time: time
        })

        console.log(JSON.stringify(userObj))

        fetch('http://localhost:3000/rankings', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: userObj
        })
        .then(r => r.json())
        .then(rank => getRankings());
    }

    console.log(rankingData)

    if (rankingData === null) return <p>Loading!</p>

    const rankings = [];

    for (let i = 0; i < Math.min(rankingData.length, 50); ++i) {
        rankings.push(<Rank userObj={rankingData[i]} key={i} />)
    }


    return (
        <div id="leaderboard-page">
            <div id="rankings-div">
                {rankings}
            </div>
            <div id="your-rank-div">
                { userData.time > 0 ? <Rank userObj={{ name: 'You', points: userData.points.gross, time: userData.time}} /> : <p>Complete a puzzle to see your stats</p> } 
            </div>
            <form onSubmit={(e) => postScore(formName,userData.points.gross,userData.time,e)}>
                <input type="text" placeholder="enter a name" onChange={(e) => setFormName(e.target.value)} value={formName}/>
                <input type="submit" value="Submit Your Score!" />
            </form>
            
        </div>
    )
}

export default LeaderboardPage;