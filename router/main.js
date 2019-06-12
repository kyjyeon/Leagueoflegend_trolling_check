module.exports = function(app){

var request = require("request");
var urlenconde = require('urlencode');
var apikey = ""//api

var profileIconId;  //아이콘 번호
var revisionDate; //수정날짜
var id; //summonerID
var accountId; //accouontId
var name; //summoner name
var summonerLevel;  //summoner level

var startIndex;
var endIndex;
var totalGames;
var matches;  //match status

  app.get('/', function(req, res) {
  	  res.render('main', { title: 'R U TROLL?' });
  });

  app.get('/search/:username/', function(req, res){
    //lol api url
    name = req.params.username;
    var nameUrl = "https://kr.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + urlenconde(name)+"?api_key="+ apikey;
    request(nameUrl,function(error,response,body){
      var info_summoner_json = JSON.parse(body);

      accountId = info_summoner_json["accountId"];
      id = info_summoner_json["id"];
      summoner = info_summoner_json["name"];
      profileIconId = info_summoner_json["profileIconId"];
      summonerLevel = info_summoner_json["summonerLevel"];
      revisionDate = info_summoner_json["revisionDate"];

      var rankedUrl = "https://kr.api.pvp.net/api/lol/kr/v2.5/league/by-summoner/"+ urlenconde(id)+ "?api_key=" + apikey;
      var champUrl = "https://kr.api.pvp.net/api/lol/kr/v1.3/stats/by-summoner/" + urlenconde(id) + "/ranked?api_key=" + apikey;
      request(champUrl,function(error,response,body){
        var info_champ_json = JSON.parse(body);
        var champions = info_champ_json["champions"];
        var champ_point = new Array();
        var champ_id = new Array();
        var champ_name = new Array();
        var champ_pic = new Array();
        var champions_length = Object.keys(champions).length;

        for(var i=0; i < champions_length; i++){
          champ_point[i] = (champions[i]["stats"]["totalSessionsWon"]/champions[i]["stats"]["totalSessionsPlayed"]*200)
          + ((champions[i]["stats"]["totalAssists"]+champions[i]["stats"]["totalChampionKills"])/champions[i]["stats"]["totalDeathsPerSession"]*100)
          + (champions[i]["stats"]["totalSessionsPlayed"]*3);
          champ_id[i] = champions[i]["id"];
        }

        var staticUrl = "https://global.api.pvp.net/api/lol/static-data/kr/v1.2/champion/?api_key=" + apikey;
        request(staticUrl,function(error,response,body){
          var info_static_champ_json = JSON.parse(body);
          var champion = info_static_champ_json["data"];
          for(var i=0; i < champ_id.length; i++){
                for(js in champion){
                  for(j in champion[js]){
                    if(champion[js]["id"] == champ_id[i]){
                      champ_name[i] = champion[js]["key"];
                      champ_pic[i] = "https://opgg-static.akamaized.net/images/lol/champion/"+champ_name[i]+".png?image=c_scale,w_46";
                    }
                  }
                }
          }
          champ_name[champ_name.length] = "total";
          var temp_id;
          var temp_name;
          var temp_point;
          var temp_pic;
          for(var i=0; i < champ_id.length-1; i++){
            for(var j=i+1;j <champ_id.length-1; j++)
            if(champ_point[i] > champ_point[j]){
              temp_id = champ_id[i];
              temp_name = champ_name[i];
              temp_point = champ_point[i];
              temp_pic = champ_pic[i];
              champ_id[i] = champ_id[j]
              champ_name[i] = champ_name[j];
              champ_point[i] = champ_point[j];
              champ_pic[i] = champ_pic[j];
              champ_id[j] = temp_id
              champ_name[j] = temp_name;
              champ_point[j] = temp_point;
              champ_pic[j] = temp_pic;
            }
          }

          res.render('index', { title: req.params.username ,
          c_id: champ_id,
          c_name: champ_name,
          c_point: champ_point,
          c_pic: champ_pic,
          c_summoner: summoner
          });
        });
      });
    });
  });
};
