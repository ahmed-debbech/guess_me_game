// module.js
var name = "fkc%2_p#s1";
function newWord(){
    console.log("enters");
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-}]{[';:?/.><,\|\"~";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}  
// export it
exports.word = {name, newWord}