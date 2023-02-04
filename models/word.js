// module.js
//const axios = (...args) => import('axios').then(({default: axios}) => fetch(...args));
const axios = require("axios");
const db = require("../knex/knex.js");
const {getTheTwoBestDefs} = require("../utils");
require('dotenv').config()

async function update(){
    return await db("word").where({solvedOn: "-"}).update({solvedOn : Date.now().toString()})
}
async function add(word){
    await update()
    let ww = {name: word[0], def1: word.def1, def2: word.def2, solvedOn : "-"}
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
    options.url = options.url + Math.round(Math.random() * (12 - 3) + 3);
    axios.request(options).then(function (response) {
        console.log(response.data);
        let wo = response.data
        const options = {
            method: 'GET',
            url: process.env.WORD_MEANING_URL,
            params: {term: wo[0]},
            headers: {
                'X-RapidAPI-Key': process.env.WORDS_MEANING_KEY,
                'X-RapidAPI-Host': process.env.WORDS_MEANING_HOST
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data); //the meanings
            let def1 = ''
            if(response.data.list.length != 0){
                let def1 = getTheTwoBestDefs(response.data.list, wo[0])
                wo.def1 = def1
            }else{
                wo.def1 = 'null'
            }
            add(wo).then(word => {
                console.log("new word has been generated!!");
            })
        }).catch(function (error) {
            console.error(error);
        });
    }).catch(function (error) {
        console.log("words generator is not responding or responded with error");
    });
    return null;
}  
// export it
exports.word = {name, newWord, getCurrent, getById}