const fs = require("fs");
const {handler} = require("../handlers/createEventPlayground");
const testing = async()=>{
    const data = JSON.parse(fs.readFileSync("../samples/sample.json").toString());
    console.log(data)
    let response = await handler(data);
    console.log(response);
}
testing()

module.exports = {testing};

