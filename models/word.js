// module.js
//const axios = (...args) => import('axios').then(({default: axios}) => fetch(...args));
const axios = require("axios");
const db = require("../knex/knex.js");

async function update(){
    return await db("word").where({solvedOn: "-"}).update({solvedOn : Date.now().toString()})
}
async function add(word){
    update();
    let ww = {name: word[0], solvedOn : "-"}
    return await db("word").insert(ww);
}

function getCurrent(){
    return db("word").where({solvedOn: "-"}).select();
}
function getById(id){
    return db("word").where({id: id}).select();
}
var name = "0000000000";
function newWord(){
    console.log("enters");
    const options = {
    method: 'GET',
    url: process.env.WORDS_GENERATOR
    };
    
    axios.request(options).then(function (response) {
        console.log(response.data);
        add(response.data).then(word => {
            console.log("add new word");
        })
    }).catch(function (error) {
        console.error(error);
    });
}  
// export it
exports.word = {name, newWord, getCurrent, getById}