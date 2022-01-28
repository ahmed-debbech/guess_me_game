module.exports = {
    checkWord
};

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