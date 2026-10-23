import { Config } from "../Constants";
import { store } from "../store";
import { authActions } from "../slices/authSlice";
import GMIApiParent from "./GMIApiParent"
import { MockContest, MockGames, MockPartecipants, MockUsers, MockVideos } from "./MockDatabase";

// Mock token pair
const MOCK_TOKENS = {
  access_token: "mock_access_token_" + Date.now(),
  refresh_token: "mock_refresh_token_" + Date.now(),
};

export default class GMIApiMock extends GMIApiParent
{
  apiURL = "https://gmitalia.altervista.org/competizioni/api/v1/";
  imageURL = "https://gmitalia.altervista.org/competizioni/thumbnails/";
  awardsURL = "https://gmitalia.altervista.org/competizioni/awards/";
  prizesURL = "https://gmitalia.altervista.org/competizioni/prizes/";
  forumProfileURL = "https://gmitalia.altervista.org/forum/memberlist.php?mode=viewprofile&u=";

  /* ───────── Auth ───────── */

  getMe()
  {
    // Simula risposta da get_userinfo.php
    const mockUser = {
      user_id: "16",
      name: "MockUser",
      avatar: null,
      admin: true,
      approved: true,
      forum_id: "1",
      discord_info: {
        id: "16",
        username: "MockUser",
        avatar: null,
        discriminator: "0",
        public_flags: 0,
        flags: 0,
        banner: null,
        accent_color: null,
        global_name: "MockUser",
        avatar_decoration_data: null,
        banner_color: null,
        clan: null,
        primary_guild: null,
        mfa_enabled: false,
        locale: "en",
        premium_type: 0,
      },
    };

    return Promise.resolve({
      success: true,
      user: mockUser,
    });
  }

  openURL(url, params)
  {
    const urlParams = new URLSearchParams(params);
    if(typeof window !== "undefined")
      window.location.href = url + "?" + urlParams.toString();
    else console.error("window is undefined");
  }

  login()
  {
    const redirectUri = Config.getServerUrl() + "/auth/callback";
    this.openURL(this.apiURL + "auth.php",
    {
      action: "login",
      redirect_uri: redirectUri,
    });
  }

  logout()
  {
    return Promise.resolve({ success: true });
  }

  exchangeCode(code)
  {
    // Mock: accetta qualsiasi codice non vuoto
    if (!code) return Promise.resolve({ success: false, error: "Missing code" });
    return Promise.resolve({
      success: true,
      ...MOCK_TOKENS,
      expires_in: 900,
    });
  }

  refreshToken(refreshToken)
  {
    return Promise.resolve({
      success: true,
      access_token: "mock_access_token_" + Date.now(),
      refresh_token: "mock_refresh_token_" + Date.now(),
      expires_in: 900,
    });
  }

  revokeToken(refreshToken)
  {
    return Promise.resolve({ success: true });
  }

  /* ───────── Avatar ───────── */

  getAvatarUrl(discord_info)
  {
    return discord_info?.avatar || "https://cdn.discordapp.com/embed/avatars/0.png";
  }

  getGames(contest, callback)
  {
    const matchingContest = MockContest.find(o => String(o.id) === String(contest));
    const publicResults = matchingContest ? matchingContest.public === "1" : true;
    callback(
    {
      success: true,
      games: MockGames.filter(o=> o.contest_id == contest),
      public_results: publicResults,
    });
  }

  getContest(contestId, callback)
  {
    callback(
    {
      success: true,
      contests: MockContest.filter(o=> o.id == contestId)
    });
  }

  getContests(callback)
  {
    callback(
    {
      success: true,
      contests: MockContest
    });
  }

  getParticipants(contest, onlyMe, callback)
  {
    let userInfo = store.getState().auth.userInfo;

    let inteval = setInterval(()=>
    {
      userInfo = store.getState().auth.userInfo;

      if(userInfo == undefined)
        return;
      else
        clearInterval(inteval)

      if(userInfo.success == false)
      {
        callback(
        {
          success: true,
          participants: [],
        });
      }
      else
      {
        let partecipant = MockPartecipants.filter(o=> o.contest_id == contest);

        if(onlyMe)
          partecipant = partecipant.filter(o=> o.id == userInfo.user.user_id)


        callback(
        {
          success: true,
          participants: partecipant,
        });
      }
    },100)
  }

  getSearchResults(q, callback) {
    callback({
      success: true,
      games: [],
      users: [],
    })
  }

  getUsers(callback)
  {
    callback(
    {
      success: true,
      users: MockUsers.reduce((acc, obj)=>
          {
            if(!acc.some(item => item.id === obj.id))
              acc.push(obj)
            return acc
          }, [])
    });
  }

  getStats(callback)
  {
    callback({
      success: true,
      stats: {
        games_count: 123,
        participants: 456,
        competitions: 78,
      },
    });
  }

  getUserInfo(userId, callback)
  {
    callback(
    {
      success: true,
      users: MockUsers.reduce((acc, obj)=>
          {
            if(!acc.some(item => item.id === obj.id))
              acc.push(obj)
            return acc
          }, []).filter(o=> o.id == userId)
    });
  }

  getParticipation(contest, callback)
  {
    const params = new URLSearchParams(
    {
      contest: contest,
    });

    fetch(this.apiURL + "get_participation_data.php?" + params.toString(),
    {
      credentials: "include",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => callback(data))
      .catch((error) => console.error("GMIApi Error:", error));
  }

  getVotes(contest, game, callback)
  {
    callback(
    {
      success: true,
      votes:
      [
        {
          user_id: "16",
          game_id: "1000",
          created_at: "2023-04-24 12:40:31",
          updated_at: "2023-04-24 12:40:31",
          score: "40",
          comment: "Mock vote",
          pros: '["8"]',
          cons: '["4"]',
          judge_name: "MockJudge",
        },
      ],
    });
  }

  getResults(contest, callback)
  {
    const params = new URLSearchParams(
    {
      contest: contest || 0,
    });
    fetch(this.apiURL + "get_results.php?" + params.toString(),
    {
      credentials: "include",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => callback(data))
      .catch((error) => console.error("GMIApi Error:", error));
  }

  setVote(contest, voteObject, callback)
  {
    const params = new URLSearchParams(
    {
      contest: contest,
      game: voteObject.game_id,
    });

    const url = this.apiURL + "set_vote.php?" + params.toString();
    fetch(url,
    {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(
      {
        vote:
        {
          score: voteObject.score,
          comment: voteObject.comment,
          pros: JSON.stringify(voteObject.pros),
          cons: JSON.stringify(voteObject.cons),
          voted: voteObject.voted,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => callback(data))
      .catch((error) => console.error("GMIApi Error:", error));
  }

  setParticipationData(contest, game, callback)
  {
    const formData = new FormData();
    formData.append("thumbnail", game.thumbnailFile);

    const params = new URLSearchParams(
    {
      contest: contest,
      name: game.name,
      url: game.downloadUrl,
      description: game.description,
      short_description: game.shortDescription,
    });

    fetch(this.apiURL + "set_participation_data.php?" + params.toString(),
    {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => callback(data))
      .catch((error) => console.error("GMIApi Error:", error));
  }

  deleteParticipationData(contest, callback)
  {
    const params = new URLSearchParams(
    {
      contest: contest,
    });
    fetch(this.apiURL + "delete_participation_data.php?" + params.toString(),
    {
      credentials: "include",
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => callback(data))
      .catch((error) => console.error("GMIApi Error:", error));
  }

  getPrizes(contestId, callback)
  {
    const params = contestId ? new URLSearchParams({ id: contestId }) : null;
    const url = this.apiURL + "get_prizes.php" + (params ? "?" + params.toString() : "");
    fetch(url,
    {
      credentials: "include",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => callback(data))
      .catch((error) => console.error("GMIApi Error:", error));
  }

  getVideos(contestId, callback)
  {
    const allVideos = MockVideos || [];
    const filtered = contestId
      ? allVideos.filter(v => String(v.contest_id) === String(contestId))
      : allVideos;

    const sorted = [...filtered].sort((a, b) => {
      if (a.is_highlighted !== b.is_highlighted) {
        return a.is_highlighted ? -1 : 1;
      }
      return a.sort_order - b.sort_order;
    });

    callback({
      success: true,
      videos: sorted
    });
  }

  publishResults(contestId, callback) {
    const contest = MockContest.find(c => String(c.id) === String(contestId));
    if (contest) {
      contest.public = "1";
      contest.is_completed = true;
      callback({ success: true, message: "Results published successfully" });
    } else {
      callback({ success: false, error: "Contest not found" });
    }
  }
}
