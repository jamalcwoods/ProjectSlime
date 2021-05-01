const handleSlime=(e)=>{
    e.preventDefault();
    
    $("#slimeMessage").animate({width:'hide'},350);
    
    if($("#slimeName").val()==''||$("#slimeLevel").val()==''){
        handleError("All fields are required!");
        return false;
    }
    
    sendAjax('POST', $("#slimeForm").attr("action"),$("#slimeForm").serialize(), function(){
        loadSlimesFromServer();
    });
    
    return false;
};
    
const handleUpdate=(e)=>{
    e.preventDefault();
    
    $("#slimeMessage").animate({width:'hide'},350);
    
    if($("#updateName").val()==''){
        handleError("Name is required!");
        return false;
    }
    
    sendAjax('POST', $("#updateForm").attr("action"),$("#updateForm").serialize(), function(){
        loadSlimesFromServer();
    });
    
    return false;
};

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
            <input id="slimeName" type="text" name="name" placeholder="Slime Name"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeSlimeSubmit" type="submit" value="Make Slime" />
        </form>
    );
};

const UpdateForm=(props)=>{
    return (
        <form id="updateForm" 
            name="updateForm"
            onSubmit={handleUpdate}
            action="/update"
            method="POST"
            className="updateForm"
            >
            
            <label htmlFor="name">Name: </label>
            <input id="updateName" type="text" name="name" placeholder="Slime Name"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="updateSlimeSubmit" type="submit" value="Level Slime Up!" />
        </form>
    );
};

const SlimeList=function(props){
    if(props.slimes.length===0){
        return(
            <div className="sli meList">
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

const setup=function(csrf){
    ReactDOM.render(
        <SlimeForm csrf={csrf} />, document.querySelector("#makeSlime")
    );
    
    ReactDOM.render(
        <UpdateForm csrf={csrf} />, document.querySelector("#updateSlime")
    );
    
    ReactDOM.render(
        <SlimeList slimes={[]} />, document.querySelector("#slimes")
    );
    
    loadSlimesFromServer();
};

const getToken=()=>{
  sendAjax('GET', '/getToken', null, (result)=>{
      setup(result.csrfToken);
  }); 
};

$(document).ready(function(){
    getToken();
});