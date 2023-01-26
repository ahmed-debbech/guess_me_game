// module.js
//const axios = (...args) => import('axios').then(({default: axios}) => fetch(...args));
const axios = require("axios");
const db = require("../knex/knex.js");
require('dotenv').config()

async function update(){
    return await db("word").where({solvedOn: "-"}).update({solvedOn : Date.now().toString()})
}
async function add(word){
    await update()
    let ww = {name: word[0], solvedOn : "-"}
    return await db("word").insert(ww);
}

async function getCurrent(){
    return await db("word").where({solvedOn: "-"}).select();
}
function getById(id){
    return db("word").where({id: id}).select();
}
var name = "0000000000";
async function newWord(){
    const options = {
    method: 'GET',
    url: process.env.WORDS_GENERATOR
    };
    options.url = options.url + Math.round(Math.random() * (10 - 3) + 3);
    axios.request(options).then(function (response) {
        console.log(response.data);
        add(response.data).then(word => {
            console.log("new word has been generated!!");
        })
    }).catch(function (error) {
        console.log("words generator is not responding or responded with error");
    });
    return null;
}  
// export it
exports.word = {name, newWord, getCurrent, getById}