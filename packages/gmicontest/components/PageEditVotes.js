import React, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { getQuery } from "../src/Utils" 
import VoteForm from "./VoteForm";
import GMIApi from "../src/api/GMIApi"; 

import StyledButton from "./commons/StyledButton";

//@todo don't load if not judge
export default function PageEditVotes(props) {
  let router = useRouter()
  let query = getQuery(router)

  let [loaded, setLoaded] = useState(false)
  let [games, setGames] = useState()
  let [votes, setVotes] = useState()
  let [error, setError] = useState()
  
  useEffect(function fetchGames() {
    GMIApi.getInstance().getGames(query.contest, data => setGames(data.games))
  }, [query.contest])//hook dependencies

  
  useEffect( function fetchVotes() {
    if(!games)
      return;

    GMIApi.getInstance().getVotes(query.contest, null, data => {
      if(!data.success){
        setError(data.error);
        console.error(data.error);
        return;
      }
      
      let votes = new Array(games.length);
      for (let index = 0; index < votes.length; index++)
      {
        const gameId = games[index].id;
        const voteIdx = data.votes.findIndex(game => game.game_id === gameId);
        if(voteIdx >= 0)
        {
          let vote = data.votes[voteIdx];
          //parse arrays
          vote.pros = JSON.parse(vote.pros);
          vote.cons = JSON.parse(vote.cons);
          //reset if not array
          if(!Array.isArray(vote.pros)) vote.pros = [];
          if(!Array.isArray(vote.cons)) vote.cons = [];
          
          vote.voted = true;

          votes[index] = vote;
        }
        else
        votes[index] = {
          game_id: games[index].id,
          score: 0,
          comment: "",
          pros: [], 
          cons: [],
          voted: false,
        };
      }
      
      setVotes(votes)
      setLoaded(true)
      console.debug("received games and votes", games, votes);
    })
  }, [games, query.contest]); //triggered when "games" changes (received data from API)

  

  function onVoteUpdate(newVote, index, callback) {
    const newVotes = [...votes];
    newVotes[index] = newVote;
    setVotes(newVotes);

    //todo check if the vote is valid
    sendVote(newVote, callback);
  }

  function sendVote(vote, callback) {
    GMIApi.getInstance().setVote(query.contest, vote, data => {
      callback(data.success);
      if(!data.success)
        setError(data.error);
    })
  }
  let yourLeaderboard = "Loading";
  let content = "Loading";

  if(error) {
    content = error;
    yourLeaderboard = "";
  }

  else if(loaded)
  {

    yourLeaderboard = votes
      .map((vote, index) => {return {
        game: games[index], 
        vote: votes[index]
      }})
      .sort((e1, e2) => parseInt(e2.vote.score) - parseInt(e1.vote.score))
      .map((elem, index) => {
        return <li><b>{elem.vote.score}</b> {elem.game.name}  </li>
      });

    content = games.map((game, index) => {
        
        const vote = votes[index];
        
        let authors = "";
        try{
            authors = Buffer.from(game.authors, 'base64').toString('ascii');
            authors = JSON.parse(authors);
            authors = authors.map((author) =>
                <input type="button" key={author.id} value={author.name} />
            );
        }
        catch(e){ console.error(game.authors, e); }
        

        let img_url = GMIApi.getInstance().imageURL + "/thumbnail.png";    
        if(game.image_url){
            if(game.image_url.indexOf("http") >= 0)
                img_url = game.image_url
            else
                img_url = GMIApi.getInstance().imageURL + game.image_url + "?" + Date.now().toString()
        }
        
        return(
          <div key={game.id} className="shadow border p-3 mb-3">
              <div>
                  <div className="div-image">
                      <img className="image-centered h-60" alt="" src={img_url} layout={'fill'} objectfit={'cover'}/>
                  </div>
                  <div className="">
                  <p>
                      <b>{game.name}</b> <span className="author"> di {authors}</span>
                  </p>
                  <p>{game.short_description}</p>
                  <p><b>Download</b>: <a href={game.download_url}>{game.download_url}</a></p>
                  </div>
                  <VoteForm {...vote} onChange={onVoteUpdate} index={index} />
              </div>
          </div>
        );
      }
    );
  }
  
  return (
    <div  className="shadow border p-3">
     
      <b>Votazione</b>
      {content}
      <br/>
      <hr/>
      <b>La tua classifica</b>
      <ul>
      {yourLeaderboard}
      </ul>
      <br/>
      <StyledButton onClick={()=>router.push("/contest?contest=" + query.contest)}>Indietro</StyledButton>
      
   </div>
  ); 
}
