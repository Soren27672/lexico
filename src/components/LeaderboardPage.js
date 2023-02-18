import React, { useContext, useEffect, useState } from "react";
import { globalContext } from "../globalContext";
import Rank from "./Rank";

function LeaderboardPage({ sendMessage }) {
    const { userData } = useContext(globalContext);
    const [rankingData, setRankingData] = useState(null);
    const [formName, setFormName] = useState('');

    function getRankings() {
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
            sendMessage('Please enter a name',3)
            return;
        }

        if (points === 0) {
            sendMessage('Complete a game first',3)
            return;
        }

        if (time === 0) {
            sendMessage('Complete a game first',3)
            return;
        }

        const userObj = JSON.stringify({
            name: name,
            points: points,
            time: time
        })

        fetch('http://localhost:3000/rankings', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: userObj
        })
        .then(r => r.json())
        .then(rank => {
            getRankings();
            sendMessage('Ranked Successfully!',3);
        });
    }

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