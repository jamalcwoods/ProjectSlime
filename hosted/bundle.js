"use strict";

var handleSlime = function handleSlime(e) {
  e.preventDefault();
  $("#slimeMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#slimeName").val() == '' || $("#slimeResidue").val() == '') {
    handleError("All fields are required!");
    return false;
  }

  sendAjax('POST', $("#slimeForm").attr("action"), $("#slimeForm").serialize(), function () {
    loadSlimesFromServer();
    loadPlayerStats();
  });
  return false;
};

var addPlayerSlimeResidue = function addPlayerSlimeResidue(e){
  e.preventDefault();
  sendAjax('POST', $("#addResidueForm").attr("action"), $("#addResidueForm").serialize(), function () {
    loadPlayerStats();
  });
  return false;
}

var summonEnemy = function summonEnemy(e){
  e.preventDefault();
  sendAjax('POST', $("#summonEnemyForm").attr("action"), $("#summonEnemyForm").serialize(), function () {
    loadEnemyStats();
  });
  return false;
}

var EnemyStats = function EnemyStats(props){
  let enemy = props.enemy
  if (enemy == null) {
    return /*#__PURE__*/React.createElement("div", {
      className: "enemyStats"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyEnemy"
    }, "No Enemy Challenged"));
  }

  return /*#__PURE__*/React.createElement("div",{
    id: "enemyStats"
  }, /*#__PURE__*/React.createElement("h3",{
    id: "enemyName"  
  }, "Name: ", enemy.name, " "), /*#__PURE__*/React.createElement("h3",{
    id: "enemyAttack"  
  }, "Enemy Attack: ", enemy.attack, " "), /*#__PURE__*/React.createElement("h3",{
    id: "enemyHealth"  
  }, "Enemy Health: ", enemy.health, "/", enemy.max_health))
}

var PlayerStats = function PlayerStats(props){
  let player = props.player
  return /*#__PURE__*/React.createElement("div",{
    id: "playerStats"
  }, /*#__PURE__*/React.createElement("h3",{
    id: "playerGold"  
  }, "Gold: ", player.gold, " "), /*#__PURE__*/React.createElement("h3",{
    id: "playerResidue"  
  }, "Slime Residue: ", player.slimeResidue, " "))
}

var SlimeForm = function SlimeForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "slimeForm",
    name: "slimeForm",
    onSubmit: handleSlime,
    action: "/maker",
    method: "POST",
    className: "slimeForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "slimeName",
    type: "text",
    name: "name",
    placeholder: "New Slime Name Here"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Residue Input: "), /*#__PURE__*/React.createElement("input", {
    id: "slimeResidue",
    type: "number",
    name: "residue",
    placeholder: "Amount Residue To Use"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeSlimeSubmit",
    type: "submit",
    value: "Make Slime"
  }));
};

// var UpdateForm = function UpdateForm(props) {
//   return /*#__PURE__*/React.createElement("form", {
//     id: "updateForm",
//     name: "updateForm",
//     onSubmit: handleUpdate,
//     action: "/update",
//     method: "POST",
//     className: "updateForm"
//   }, /*#__PURE__*/React.createElement("label", {
//     htmlFor: "name"
//   }, "Name: "), /*#__PURE__*/React.createElement("input", {
//     id: "updateName",
//     type: "text",
//     name: "name",
//     placeholder: "Slime Name"
//   }), /*#__PURE__*/React.createElement("input", {
//     type: "hidden",
//     name: "_csrf",
//     value: props.csrf
//   }), /*#__PURE__*/React.createElement("input", {
//     className: "updateSlimeSubmit",
//     type: "submit",
//     value: "Level Slime Up!"
//   }));
// };

// var UpdateForm2 = function UpdateForm2(props) {
//   return /*#__PURE__*/React.createElement("form", {
//     id: "updateForm2",
//     name: "updateForm2",
//     onSubmit: handleUpdate2,
//     action: "/update2",
//     method: "POST",
//     className: "updateForm"
//   }, /*#__PURE__*/React.createElement("label", {
//     htmlFor: "name"
//   }, "Name: "), /*#__PURE__*/React.createElement("input", {
//     id: "updateName1",
//     type: "text",
//     name: "name1",
//     placeholder: "Slime 1 Name"
//   }), /*#__PURE__*/React.createElement("label", {
//     htmlFor: "name"
//   }, "Name: "), /*#__PURE__*/React.createElement("input", {
//     id: "updateName2",
//     type: "text",
//     name: "name2",
//     placeholder: "Slime 2 Name"
//   }), /*#__PURE__*/React.createElement("input", {
//     type: "hidden",
//     name: "_csrf",
//     value: props.csrf
//   }), /*#__PURE__*/React.createElement("input", {
//     className: "updateSlimeSubmit",
//     type: "submit",
//     value: "Make Slimes Play Together"
//   }));
// };

var PlayerControls = function PlayerControls(props) {
  return/*#__PURE__*/React.createElement("div", {
    className: "playerControls"
  },/*#__PURE__*/React.createElement("form", {
    id: "summonEnemyForm",
    name: "summonEnemyForm",
    onSubmit: summonEnemy,
    action: "/summonEnemy",
    method: "POST",
    className: "summonEnemyForm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    name: "wager",
    type: "number",
    value: 0,
    placeholder: "Amount Gold To Wager"
  }), /*#__PURE__*/React.createElement("input", {
    onSubmit: addPlayerSlimeResidue,
    type: "submit",
    value: "Wager Gold To Summon an enemy!"
  })),/*#__PURE__*/React.createElement("form", {
    id: "addResidueForm",
    name: "addResidueForm",
    onSubmit: addPlayerSlimeResidue,
    action: "/addResidue",
    method: "POST",
    className: "addResidueForm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    onSubmit: addPlayerSlimeResidue,
    type: "submit",
    value: "Click here to get more slime residue!"
  })))
}

var SlimeList = function SlimeList(props) {
  if (props.slimes.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "slimeList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptySlime"
    }, "No Slimes Yet"));
  }

  var slimeNodes = props.slimes.map(function (slime) {
    return /*#__PURE__*/React.createElement("div", {
      key: slime._id,
      className: "slime"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/slimeface.jpeg",
      alt: "slime face",
      className: "slimeFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "slimeName"
    }, " Name: ", slime.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "slimeAge"
    }, " Level: ", slime.level, " "), /*#__PURE__*/React.createElement("h3", {
      className: "slimeHealth"
    }, " Health: ", slime.health, "/", slime.max_health), /*#__PURE__*/React.createElement("h3", {
      className: "slimeAttack"
    }, " Attack: ", slime.attack, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "slimeList"
  }, slimeNodes);
};

var loadSlimesFromServer = function loadSlimesFromServer() {
  sendAjax('GET', '/getSlimes', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(SlimeList, {
      slimes: data.slimes
    }), document.querySelector("#slimes"));
  });
};

var loadPlayerStats = function loadPlayerStats(){
  sendAjax('GET', '/getPlayer', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PlayerStats, {
      player: data.player
    }), document.querySelector("#playerStats"));
  });
}

var loadEnemyStats = function loadEnemyStats(){
  sendAjax('GET', '/getEnemy', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(EnemyStats, {
      enemy: data.enemy
    }), document.querySelector("#enemyStats"));
  });
}

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(EnemyStats, {
    enemy: {}
  }), document.querySelector("#enemyStats"));
  ReactDOM.render( /*#__PURE__*/React.createElement(SlimeForm, {
    csrf: csrf
  }), document.querySelector("#makeSlime"));

  ReactDOM.render( /*#__PURE__*/React.createElement(PlayerStats, {
    player: {}
  }), document.querySelector("#playerStats"));

  // ReactDOM.render( /*#__PURE__*/React.createElement(UpdateForm, {
  //   csrf: csrf
  // }), document.querySelector("#updateSlime"));
  
  // ReactDOM.render( /*#__PURE__*/React.createElement(UpdateForm2, {
  //   csrf: csrf
  // }), document.querySelector("#updateSlime2"));

  ReactDOM.render( /*#__PURE__*/React.createElement(PlayerControls, {
    csrf: csrf
  }), document.querySelector("#playerControls"));

  ReactDOM.render( /*#__PURE__*/React.createElement(SlimeList, {
    slimes: []
  }), document.querySelector("#slimes"));
  loadSlimesFromServer();
  loadPlayerStats();
  loadEnemyStats();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#slimeMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#slimeMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};