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
    });
    return false;
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

    return (
        <div id="enemyStats">
            <h3 id="enemyName">Name: {enemy.name}</h3>
            <h3 id="enemyAttack">Name: {enemy.attack}</h3>
            <h3 id="enemyHealth">Name: {enemy.health}/{enemy.max_health}</h3>
        </div>
    )
}

const PlayerStats=(props)=>{
    let player = props.player
    return (
        <div id="playerStats">
            <h3 id="playerGold">Gold: {player.gold}</h3>
            <h3 id="playerResidue">Slime Residue: {player.slimeResidue}</h3>
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
            
            <input className="makeSlimeSubmit" type="submit" value="Make Slime" />
        </form>
    );
};

const PlayerConrols=(props)=>{
    return(
        <div className="playerControls">
            <form id="summonEnemyForm"
                name="summonEnemyForm"
                onSubmit={summonEnemy}
                action="/summonEnemy"
                method="POST"
                className="summonEnemyForm"
            >
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input name="wager" type="number" value="0" placeholder="Amount Gold To Wager"></input>
                <input type="submit">Wager Gold To Summon an Enemy!</input>
            </form>
            <form id="addResidueForm"
                name="addResidueForm"
                onSubmit={addPlayerSlimeResidue}
                action="/addResidue"
                method="POST"
                className="addResidueForm"
            >
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input type="submit">Click Here To Get More Slime Residue!</input>
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
        return (
        <div key={slime._id} className="slime">
            <img src="/assets/img/slimeface.jpeg" alt="slime face" className="slimeFace" />
            <h3 className="slimeName"> Name: {slime.name} </h3>
            <h3 className="slimeLevel"> Level: {slime.level} </h3>
            <h3 className="slimeHealth"> Health: {slime.health}/{slime.max_health} </h3>
            <h3 className="slimeAttack"> Attack: {slime.attack} </h3>
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
            <PlayerStats player={data.player} />, document.querySelector("playerStats")
        );
    });
}

var loadEnemyStats = function loadEnemyStats(){
    sendAjax('GET', '/getEnemy', null, function (data) {
        ReactDOM.render(
            <EnemyStats enemy={data.enemy} />, document.querySelector("enemyStats")
        );
    });
}

const setup=function(csrf){

    ReactDOM.render(
        <EnemyStats enemy={{}} />, document.querySelector("enemyStats")
    );

    ReactDOM.render(
        <SlimeForm csrf={csrf} />, document.querySelector("#makeSlime")
    );
    
    ReactDOM.render(
        <PlayerStats player={{}} />, document.querySelector("playerStats")
    );

    ReactDOM.render(
        <PlayerControls csrf={csrf} />, document.querySelector("playerControls")
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