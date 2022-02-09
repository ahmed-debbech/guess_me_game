module.exports = {
    checkWord,
    issueJWT,
    parseJwt
};
var atob = require('atob');
const jsonwebtoken = require('jsonwebtoken');

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

function issueJWT(user) {
  const _id = user.email;

  const expiresIn = '100d';

  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, 'secret', { expiresIn: expiresIn });

  return {
    token: signedToken,
    expires: expiresIn
  }
}

function checkWord(clientWord, wordy){
    let colors = new Array(wordy.length) // 3 green 2 orange 1 grey

    for(var i =0; i<=clientWord.length-1; i++){
        if(clientWord[i] ==wordy[i]){
          colors[i] = 3;
        }
      }
      for(var i=0; i<=wordy.length-1; i++){
        if(colors[i] != 3){
          for(var j=0; j<=clientWord.length-1; j++){
            if(j != i && colors[j] != 3 && clientWord[j] == wordy[i]){
              colors[j] = 2;
            }
          }
        }
      }
      for(var i=0; i<=colors.length-1; i++){
        if(colors[i] != 3 && colors[i] != 2){
          colors[i] = 1;
        }
      }
      return colors;
}