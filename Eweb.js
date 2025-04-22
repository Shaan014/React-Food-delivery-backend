/****    output the  html file in the web server   ****/

const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;

// changing the path for a different html file

/* //( '^/$ | / new')  - this will give output to / and / new
// ^ - starting t, $ - ending , | - or */

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html")); // getting in the directory in the views next html file
});

app.get("/html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

// redirecting a 301 error
app.get("/old-page", (req, res) => {
  res.redirect(301, "index.html");
});

// chaining
app.get(
  ["/hello", "/hello.html"],
  (req, res, next) => {
    console.log("Trying to log hello.html ************");
    next();
  },
  (req, res) => {
    res.send("**** This is a chain response ******");
  }
);

const one =  (req,res,next) =>{
    console.log('one')
    next()
}
const two =(req,res,next) =>{
    console.log('two')
    next()
}

const three = (req,res) =>{
    console.log('three')
   res.send('chaining is completed')
}

// app.get(/^\/chain(\.html)?$/, [one, two, three]); this a is also can work
app.get(['/chain', '/chain.html'], [one, two, three]);


app.get('/api/users', (req, res) => {
    const users = [
      { id: 1, name: 'Yathurshan' },
      { id: 2, name: 'Kumar' },
      { id: 3, name: 'Shan' }
    ];
    res.json(users);
  });



// handling the 404 error using custom 404 html page
// app.all("*", (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
