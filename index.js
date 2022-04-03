const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const hostname= '0.0.0.0'
const port = 3002;

const HashMap = {"email":"sagarkumarn949@gmail.com","password":"sagar1234"};

var admin = require("firebase-admin");
var serviceAccount = require("./shorturl-7919f-firebase-adminsdk-wrgdp-b2976be313.json");
const { response } = require("express");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const static = express.static("public");

const urlsdb = admin.firestore().collection("urldb");
const usersdb = admin.firestore().collection("usersdb");

app.use(static);
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     console.log("We intercepted the req");
//     next();
// })

app.get("/:short", (req, res) => {
    // console.log(req.params);
    const short = req.params.short;

    const doc = urlsdb.doc(short);

    doc.get().then(response => {
        const data = response.data();
        // console.log(data);
        if(data && data.url){
            var url= data.url;
            var count= data.count;
            count=count+1;
            doc.set({url, count});
            res.redirect(301, data.url);
        } else {
            res.redirect(301, "https://google.com");
        }
    })

    // res.send("We will redirect you to " + short)
});

app.post("/admin/urls/", (req, res) => {
    const {email, password, short, url} = req.body;

    // usersdb.doc(email).get().then(response=>{         //creating for calling users db
    //     const user = response.data();
    //     // console.log(user);

        if(HashMap.email == email && HashMap.password == password){
            const doc = urlsdb.doc(short);
            const count=0;
            doc.set({url, count});
            res.send("Done")
        } else {
            res.send(403, "Not possible")
        }
    // })
  
//   res.send("Hello from another!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
