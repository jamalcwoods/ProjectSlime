const handleSlime=(e)=>{
    e.preventDefault();
    
    $("#slimeMessage").animate({width:'hide'},350);
    
    if($("#slimeName").val()==''||$("#slimeResidue").val()==''){
        handleError("All fields are required!");
        return false;
    }
    
    sendAjax('POST', $("#slimeForm").attr("action"),$("#slimeForm").serialize(), function(){
        loadSlimesFromServer();
    });
    
    return false;
};

var addGold = function addGold(e){
    e.preventDefault()
    sendAjax('POST', $(e.target).attr("action"), $("#addResidueForm").serialize(), function () {
      loadPlayerStats();
    });
  }

var addPerk = function addPerk(e){
    e.preventDefault()
    sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize() + "&" + $("#addResidueForm").serialize(), function () {
      loadSlimesFromServer();
      loadPlayerStats();
    });
  } 

var attackEnemy = function attackEnemy(e){
    e.preventDefault()
    sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize() + "&" + $("#addResidueForm").serialize(), function () {
      loadEnemyStats();
      loadSlimesFromServer();
      loadPlayerStats();
    });
  }
    
var addPlayerSlimeResidue=(e)=>{
    e.preventDefault();
    sendAjax('POST', $("#addResidueForm").attr("action"), $("#addResidueForm").serialize(), function () {
      loadPlayerStats();
    });
    return false;
}

var summonEnemy =(e)=>{
    e.preventDefault();
    sendAjax('POST', $("#summonEnemyForm").attr("action"), $("#summonEnemyForm").serialize(), function () {
        loadEnemyStats();
    loadPlayerStats();
    });
    return false;
}

var getPerkMap = function getPerkMap(type){
    switch(type){
      case 0:
        return[
          "This slime has no special perk",
          "This slime will deal damage before recieving damage. If it kills it will remain unharmed",
          "This Slime gains more attack when ever it attacks",
          "This Slime deals double damage but takes 25% of their base attack as damage",
          "This slime does half damage but adds slime residue whenever it attacks"
        ]
        break;
      case 1:
        return[
          "This enemy has no special perk",
          "This enemy will lower a slimes attack after combat",
          "This enemy executes slimes under 25% of their maximum health",
          "This enemy heals to full when it kills a slime",
          "This enemy increases it's attack every time it fights"
        ]
        break;
    }
    
  }

const EnemyStats=(props)=>{
    let enemy = props.enemy
    if(enemy == null){
        return (
            <div className="enemyStats">
                <h3 className="emptyEnemy">No Enemy Challenged</h3>
            </div>
        )
    }

    let srcString = "/assets/img/perks/enemy/" + enemy.perk + ".png"
    let title = getPerkMap(1)[enemy.perk]

    return (
        <div id="enemyStats">
            <h3 id="enemyName">Name: {enemy.name}</h3>
            <h3 id="enemyAttack">Attack: {enemy.attack}</h3>
            <h3 id="enemyHealth">Health: {enemy.health}/{enemy.max_health}</h3>
            <h3 id="enemyReward">Gold Reward: {Math.round(((enemy.max_health + enemy.attack) * 1.5)/3)}</h3>
            <h3 id="enemyRewardEXP">Exp Reward: {Math.ceil((enemy.max_health + enemy.attack) * 1.5)}</h3>
            <img className="enemyperkimage" src={srcString} title={title}></img>
        </div>
    )
}

const PlayerStats=(props)=>{
    let player = props.player
    return (
        <div id="playerStats">
            <h3 id="playerGold">Gold: {player.gold}</h3>
            <h3 id="playerResidue">Slime Residue: {player.slimeResidue}</h3>
            <form id="addGold"  
            name="addGold"
            onSubmit={addGold}
            action="/addGold"
            method="POST"
            className="addGold"
        >
            <input type="submit" value="Spend real money to buy gold!"></input>
        </form>
        </div>
    )
}

const SlimeForm=(props)=>{
    return (
        <form id="slimeForm" 
            name="slimeForm"
            onSubmit={handleSlime}
            action="/maker"
            method="POST"
            className="slimeForm"
            >
            
            <label htmlFor="name">Name: </label>
            <input id="slimeName" type="text" name="name" placeholder="New Slime Name Here"/>
            <label htmlFor="name">Amount Residue To Use: </label>
            <input id="slimeResidue" type="number" name="residue" placeholder="Amount Residue To Use"/>
            <input type="hidden" name="_csrf" value={props.csrf}></input>
            <input className="makeSlimeSubmit" type="submit" value="Make Slime" />
        </form>
    );
};

const PlayerControls=(props)=>{
    return(
        <div className="playerControls">
            <form id="summonEnemyForm"
                name="summonEnemyForm"
                onSubmit={summonEnemy}
                action="/summonEnemy"
                method="POST"
                className="summonEnemyForm"
            >
                <input type="hidden" name="_csrf" value={props.csrf}></input>
                <input name="wager" type="number" defaultValue='0' placeholder="Amount Gold To Wager"></input>
                <input type="submit" value="Wager Gold To Summon an Enemy!"></input>
            </form>
            <form id="addResidueForm"
                name="addResidueForm"
                onSubmit={addPlayerSlimeResidue}
                action="/addResidue"
                method="POST"
                className="addResidueForm"
            >
                <input type="hidden" name="_csrf" value={props.csrf}></input>
                <input type="submit" value="Click Here To Get More Slime Residue!"></input>
            </form>
        </div>
    )
}

const SlimeList=(props)=>{
    if(props.slimes.length===0){
        return(
            <div className="slimeList">
                <h3 className="emptySlime">No Slimes Yet</h3>
            </div>
        );
    }
    
    

    const slimeNodes=props.slimes.map(function(slime){
        let srcString = "/assets/img/perks/slime/" + slime.perk + ".png"
        let title = getPerkMap(0)[slime.perk]

        return (
        <div key={slime._id} className="slime">
            <img src="/assets/img/slimeface.jpeg" alt="slime face" className="slimeFace" />
            <h3 className="slimeName"> Name: {slime.name} </h3>
            <h3 className="slimeLevel"> Level: {slime.level} </h3>
            <h3 className="slimeHealth"> Health: {slime.health}/{slime.max_health} </h3>
            <h3 className="slimeAttack"> Attack: {slime.attack} </h3>
            <h3 className="slimeExp"> Exp: {slime.exp}/{slime.level * 10}</h3>
            <form id="attackEnemyForm"  
                name="attackEnemyForm"
                onSubmit={attackEnemy}
                action="/attackEnemy"
                method="POST"
                className="attackEnemyForm"
            >
                <input type="hidden" name="id" value={slime["_id"]}></input>
                <input type="submit" value="Attack the enemy with this slime!"></input>
            </form>
            <form id="addPerkForm"  
                name="addPerkForm"
                onSubmit={addPerk}
                action="/addPerk"
                method="POST"
                className="addPerkForm"
            >
                <input type="hidden" name="id" value={slime["_id"]}></input>
                <input type="submit" value="Add a random perk to this slime! (20 Gold)!"></input>
            </form>
            <img className="perkimage" src={srcString} title={title}></img>
        </div>
        );
    });
    
    return(
        <div className="slimeList">
        {slimeNodes}
        </div>
    );
};

const loadSlimesFromServer=()=>{
    sendAjax('GET', '/getSlimes', null, (data)=>{
        ReactDOM.render(
            <SlimeList slimes={data.slimes} />, document.querySelector("#slimes")
        );
    });
};

const loadPlayerStats=()=>{
    sendAjax('GET', '/getPlayer', null, function (data) {
        ReactDOM.render(
            <PlayerStats player={data.player} />, document.querySelector("#playerStats")
        );
    });
}

var loadEnemyStats = function loadEnemyStats(){
    sendAjax('GET', '/getEnemy', null, function (data) {
        ReactDOM.render(
            <EnemyStats enemy={data.enemy} />, document.querySelector("#enemyStats")
        );
    });
}

const setup=function(csrf){

    ReactDOM.render(
        <EnemyStats enemy={{}} />, document.querySelector("#enemyStats")
    );

    ReactDOM.render(
        <SlimeForm csrf={csrf} />, document.querySelector("#makeSlime")
    );
    
    ReactDOM.render(
        <PlayerStats player={{}} />, document.querySelector("#playerStats")
    );

    ReactDOM.render(
        <PlayerControls csrf={csrf} />, document.querySelector("#playerControls")
    );
    
    ReactDOM.render(
        <SlimeList slimes={[]} />, document.querySelector("#slimes")
    );
    
    loadSlimesFromServer();
    loadPlayerStats();
    loadEnemyStats()
};

const getToken=()=>{
  sendAjax('GET', '/getToken', null, (result)=>{
      setup(result.csrfToken);
  }); 
};

$(document).ready(function(){
    getToken();
});