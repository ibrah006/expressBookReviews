
const axios = require("axios");

async function getBooks(callback) {
    const response = await axios.get("https://ibrahimmn006-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");

    callback(JSON.stringify(response.data));
}

getBooks((storeBooks)=> {
    console.log(`Books available: ${storeBooks}`)
});