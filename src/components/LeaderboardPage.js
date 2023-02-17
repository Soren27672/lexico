import React, { useContext, useEffect, useState } from "react";
import { globalContext } from "../globalContext";
import Rank from "./Rank";

function LeaderboardPage() {
    const { userData } = useContext(globalContext);
    const [rankingData, setRankingData] = useState(null)

    useEffect(() => {
        fetch('http://localhost:3000/rankings')
        .then(r => r.json())
        .then(rankings => setRankingData(rankings));
    },[])

    console.log(rankingData)

    if (rankingData === null) return <p>Loading!</p>

    const rankings = [<p>rank</p>];

    for (let i = 0; i < Math.min(rankingData.length, 50); ++i) {
        rankings.push(<Rank userObj={rankingData[i]} key={i} />)
    }


    return (
        <div id="leaderboard-page">
            <h1>This is the leaderboard, welcome</h1>
            <div id="rankings-div">
                {rankings}
            </div>
            <div id="your-rank-div">
                { userData.time > 0 ? <Rank userObj={{...userData, name: 'You'}} /> : <p>Complete a puzzle to see your stats</p> } 
            </div>
        </div>
    )
}

export default LeaderboardPage;