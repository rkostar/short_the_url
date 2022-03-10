const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const hostname= '0.0.0.0'
const port = 3002;

var admin = require("firebase-admin");
var serviceAccount = require("./shorturl-7919f-firebase-adminsdk-wrgdp-b2976be313.json");
const { response } = require("express");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const static = express.static("public");

const urlsdb = admin.firestore().collection("urlsdb");
const usersdb = admin.firestore().collection("usersdb");

app.use(static);
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     console.log("We intercepted the req");
//     next();
// })

app.get("/:short", (req, res) => {
    console.log(req.params);
    const short = req.params.short;

    const doc = urlsdb.doc(short);

    doc.get().then(response => {
        const data = response.data();
        // console.log(data);
        if(data && data.url){
            res.redirect(301, data.url);
        } else {
            res.redirect(301, "https://google.com");
        }
    })

    // res.send("We will redirect you to " + short)
});

app.post("/admin/urls/", (req, res) => {
    const {email, password, short, url} = req.body;

    usersdb.doc(email).get().then(response=>{
        const user = response.data();
        // console.log(user);

        if(user && (user.email == email) && (user.password == password)){
            const doc = urlsdb.doc(short);
            doc.set({url});
            res.send("Done")
        } else {
            res.send(403, "Not possible")
        }
    })
  
//   res.send("Hello from another!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
