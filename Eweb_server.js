
/****    output the sample text in the web server   ****/

const express = require ('express'); // get thje express library
const app = express ()
const path = require  ('path') // get the path
const PORT = process.env.PORT || 3500 ; // choosing the port

app.get('/',(req,res) =>{
    res.send('This is a test api') // this will be shown in the screen
})

app.listen(PORT,() => console.log(`server is running on port ${PORT}`)); // this will print in the console