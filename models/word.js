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
    let ww = {name: word.word, def1: word.def1, def2: word.def2, solvedOn : "-", synonyms: word.synonyms}
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
    url: process.env.WORDS_GENERATOR,
    headers: {
    'X-Api-Key': process.env.WORDS_GENERATOR_KEY
    },
    };
    axios.request(options).then(function (response) {
        console.log(response.data);
        let wo = {"word" : response.data.word}
        const options1 = {
            method: 'GET',
            url: process.env.WORD_MEANING_URL+wo.word+"?key="+process.env.WORDS_MEANING_KEY,
        };

        axios.request(options1).then(function (response1) {
            console.log(response1.data); //the meanings
            if(response1.data[0].hasOwnProperty('meta')){
                wo.def1 = response1.data[0].shortdef[0]
                wo.synonyms = response1.data[0].meta.syns.toString()
            }else{
                wo.def1 = 'null'
                wo.synonyms = 'null'
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