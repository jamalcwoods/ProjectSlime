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

// var handleUpdate = function handleUpdate(e) {
//   e.preventDefault();
//   $("#slimeMessage").animate({
//     width: 'hide'
//   }, 350);

//   if ($("#updateName").val() == '') {
//     handleError("Name is required!");
//     return false;
//   }

//   sendAjax('POST', $("#updateForm").attr("action"), $("#updateForm").serialize(), function () {
//     loadSlimesFromServer();
//   });
//   return false;
// };

// var handleUpdate2 = function handleUpdate2(e) {
//   e.preventDefault();
//   $("#slimeMessage").animate({
//     width: 'hide'
//   }, 350);

//   if ($("#updateName1").val() == '' || $("#updateName2").val() == '') {
//     handleError("Both names are required!");
//     return false;
//   }

//   sendAjax('POST', $("#updateForm2").attr("action"), $("#updateForm2").serialize(), function () {
//     loadSlimesFromServer();
//   });
//   return false;
// };

var addPlayerSlimeResidue = function addPlayerSlimeResidue(e){
  e.preventDefault();
  sendAjax('POST', $("#playerControlsForm").attr("action"), $("#playerControlsForm").serialize(), function () {
    loadPlayerStats();
  });
  return false;
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
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
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
  return /*#__PURE__*/React.createElement("form", {
    id: "playerControlsForm",
    name: "playerControlsForm",
    onSubmit: addPlayerSlimeResidue,
    action: "/addResidue",
    method: "POST",
    className: "playerControlsForm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    onSubmit: addPlayerSlimeResidue,
    type: "submit",
    value: "Click here to get more slime residue!"
  }))
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
    }, " Health: ", slime.health, " "));
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

var setup = function setup(csrf) {
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