import React, { useState, useEffect } from "react";
import GMIApi from "../../src/api/GMIApi";

import { UserTile } from "./UserTile";
import { SearchBar } from "../commons/SearchBar";

const sortingId = 
{
  "default": 0,
  "name": 1,
  "game_count": 2,
  "top_game_count": 3,
  "judge_count": 4,
}
export default function UserList(props)
{
  /**@type {[User[], (User)=> any]} */
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>();
  const [search, setSearch] = useState("");
  const [sorting, setSort] = useState({sortingId: sortingId.default, sort:{[sortingId.default]: true}});
  const [userList, setUserList] = useState<React.ReactNode[]>([]);


  useEffect(()=>
  {
    GMIApi.getInstance().getUsers((data) =>
    {
      if(!data.success)
        setError(data.error || "invalid results");
      else 
      {
        for(let i=data.users.length-1; i>-1; i--)
        {
          let user = data.users[i]

          if(user.game_count == "0" && user.judge_count == "0")
            data.users.splice(i, 1)
        }
        setUsers(data.users);
      }
    });
  }, []);


  const isLoading = users == undefined;

  /**@type {(a: User, b: User)=> number} */
  const sortingFunction = (a, b)=>
  {
    if(sorting.sortingId == sortingId.default)
    {
      let aGame = parseInt(a.game_count)*1;
      let aTop = parseInt(a.top_game_count)* 2;
      let aJudge = parseInt(a.judge_count)*1;

      let bGame = parseInt(b.game_count)*1;
      let bTop = parseInt(b.top_game_count)*2;
      let bJudge = parseInt(b.judge_count)*1;

      if(sorting.sort[sorting.sortingId])
        return  (bGame + bTop + bJudge) - (aGame + aTop + aJudge)
      else
        return (aGame + aTop + aJudge) - (bGame + bTop + bJudge)
    }
    if(sorting.sortingId == sortingId.name)
    {
      if(sorting.sort[sorting.sortingId])
        return a.name.localeCompare(b.name)
      else
         return b.name.localeCompare(a.name)
    }
    if(sorting.sortingId == sortingId.game_count)
    {
      if(sorting.sort[sorting.sortingId])
        return parseInt(a.game_count) - parseInt(b.game_count)
      else
        return parseInt(b.game_count) - parseInt(a.game_count)
    }
    if(sorting.sortingId == sortingId.top_game_count)
    {
      if(sorting.sort[sorting.sortingId])
        return parseInt(a.top_game_count) - parseInt(b.top_game_count)
      else
        return parseInt(b.top_game_count) - parseInt(a.top_game_count)
    }
    if(sorting.sortingId == sortingId.judge_count)
    {
      if(sorting.sort[sorting.sortingId])
        return parseInt(a.judge_count) - parseInt(b.judge_count)
      else
        return parseInt(b.judge_count) - parseInt(a.judge_count)
    }

    if(sorting.sortingId == null)
      return parseInt(a.id) - parseInt(b.id)
  }

  useEffect(()=>
  {
    if(users)
    {
      let elements = users.slice();

      if(search != "")
        elements = elements.filter(o=> o.name.toLowerCase().includes(search.toLowerCase()))

      if(sorting.sortingId != null)
        elements = elements.sort(sortingFunction)
      else
        elements = elements.sort(sortingFunction)

      setUserList(elements.map((user, i) =>
      (
        <UserTile
         key={i}
         user={user}
         position={i + 1}
         isEven={i % 2 === 0}
        />
      )))
    }
  }, [users, sorting,  search])


  const updateSort = function(index)
  {
    const newDir = sorting.sortingId === index ? !sorting.sort[index] : true;
    setSort({sortingId: index, sort: {[index]: newDir}})
  }

  return (
    <div className="flex flex-col gap-3">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Cerca partecipanti..."
        ariaLabel="Cerca partecipanti"
      />
    
    <div className="grid gap-y-2">
      {/* Mobile Header */}
      <div className="lg:hidden grid grid-cols-[40px_1fr_120px] items-center gap-x-3 px-3 py-1 text-content-muted text-[10px] uppercase font-semibold tracking-wider select-none">
        <div className="cursor-pointer hover:text-content transition-colors" onClick={()=> updateSort(sortingId.default)}>
            Pos{sorting.sortingId === sortingId.default && (sorting.sort[sortingId.default] ? " ↑" : " ↓")}
          </div>
        <div className="cursor-pointer" onClick={()=> updateSort(sortingId.name)}>
          Utente{sorting.sortingId === sortingId.name && (sorting.sort[sortingId.name] ? " ↑" : " ↓")}
        </div>
        <div className="grid grid-cols-3 gap-0">
          <div className="text-center cursor-pointer hover:text-content transition-colors" title="Partecipazioni" onClick={()=> updateSort(sortingId.game_count)}>Giochi{sorting.sortingId === sortingId.game_count && (sorting.sort[sortingId.game_count] ? " ↑" : " ↓")}</div>
          <div className="text-center cursor-pointer hover:text-content transition-colors" title="Vittorie" onClick={()=> updateSort(sortingId.top_game_count)}>Vitt.{sorting.sortingId === sortingId.top_game_count && (sorting.sort[sortingId.top_game_count] ? " ↑" : " ↓")}</div>
          <div className="text-center cursor-pointer hover:text-content transition-colors" title="Giudizi" onClick={()=> updateSort(sortingId.judge_count)}>Giud.{sorting.sortingId === sortingId.judge_count && (sorting.sort[sortingId.judge_count] ? " ↑" : " ↓")}</div>
        </div>
      </div>
      
      {/* Desktop Header */}
      <div className="hidden lg:grid grid-cols-[48px_1fr_100px_80px_80px] items-center gap-x-4 px-2 py-1 text-content-muted text-sm select-none">
        <div className="font-semibold text-center cursor-pointer hover:text-content transition-colors" onClick={()=> updateSort(sortingId.default)}>
          Pos{sorting.sortingId === sortingId.default && (sorting.sort[sortingId.default] ? " ↑" : " ↓")}
        </div>

        <div className="font-semibold cursor-pointer" onClick={()=> updateSort(sortingId.name)}>
          Utente{sorting.sortingId === sortingId.name && (sorting.sort[sortingId.name] ? " ↑" : " ↓")}
        </div>

        <div className="font-semibold cursor-pointer text-center" onClick={()=> updateSort(sortingId.game_count)}>
          Partecipazioni{sorting.sortingId === sortingId.game_count && (sorting.sort[sortingId.game_count] ? " ↑" : " ↓")}
        </div>

        <div className="font-semibold cursor-pointer text-center" onClick={()=> updateSort(sortingId.top_game_count)}>
          Vittorie{sorting.sortingId === sortingId.top_game_count && (sorting.sort[sortingId.top_game_count] ? " ↑" : " ↓")}
        </div>

        <div className="font-semibold cursor-pointer text-center" onClick={()=> updateSort(sortingId.judge_count)}>
          Giudizi{sorting.sortingId === sortingId.judge_count && (sorting.sort[sortingId.judge_count] ? " ↑" : " ↓")}
        </div>
      </div>
    </div>
    <div className="grid gap-y-2 my-2">
        {isLoading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-surface border border-default" />
              ))}
            </div>
          ) : userList}
      </div>
    </div>
  );
}
