import dateFormat, { masks } from "dateformat";
import React, { useContext, useEffect, useState } from "react";
import { globalContext } from "../globalContext";
import Rank from "./Rank";

function LeaderboardPage({ sendMessage }) {
    const { userData } = useContext(globalContext);
    const [rankingData, setRankingData] = useState(null);
    const [formName, setFormName] = useState('');

    masks.date = 'm/d/yy';

    function getRankings() {
        fetch(`${process.env.REACT_APP_URL}/rankings`)
        .then(r => r.json())
        .then(rankings => {
            rankings.sort((a,b) => (b.points / (b.time / 60000)) - (a.points / (a.time / 60000)));
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
            time: time,
            date: dateFormat(new Date(),"date")
        })

        fetch(`${process.env.REACT_APP_URL}/rankings`, {
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
        rankings.push(<Rank userObj={rankingData[i]} key={i} rank={i+1}/>)
    }

    const yourRankObj = {
        name: "you",
        points: userData.points.gross,
        time: userData.time,
        date: dateFormat(new Date(),"date")
    }

    return (
        <div id="leaderboard-page">
            <div id="champion">
                <img src="/Laurel.png" alt="Laurel" className="icon large"/>
                <div className="words">
                    <h1>{rankingData[0].name}</h1>
                    <p>Reigning Lexico champion</p>
                </div>
                <img src="/Laurel.png" alt="Laurel" className="icon large" style={{transform: "scaleX(-1)"}}/>
            </div>
            <div id="rankings-div">
                {rankings}
            </div>
            <div id="your-rank-div">
                { userData.time > 0 ? <Rank userObj={yourRankObj} rank="???"/> : <p>Complete a puzzle to see your stats and submit your score</p> } 
                <form onSubmit={(e) => postScore(formName,userData.points.gross,userData.time,e)}>
                <input type="text" placeholder="enter a name" onChange={(e) => setFormName(e.target.value)} value={formName}/>
                <input type="submit" value="Submit Your Score!" />
            </form>
            </div>
        </div>
    )
}

export default LeaderboardPage;