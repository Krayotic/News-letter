
const express = require("express");
const bodyParser = require("body-parser"); // Outdated method
// const request = require("request")
const https = require("https");

const mailchimp = require("@mailchimp/mailchimp_marketing");    // install  npm install @mailchimp/mailchimp_marketing
// Mailchimp keys
mailchimp.setConfig({
  apiKey: "6fe987385da2f06ca06c3dd3af5ac6fa",
  server: "us8",
});

const app = express();

const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))  // Outdated method
// app.use(express.urlencoded());  // Parse URL-encoded bodies

app.listen(port, function(){
  console.log("Sever started on port" + port);
});

app.get("/", function(req, res){

  res.sendFile(__dirname + "/signup.html");

})

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }

      }
    ]
  };

  const jsonData = JSON.stringify(data) // turing above data into a string in the form of a JSON (flatpacking it)

  const run = async () => {

    if (res.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    const response = await mailchimp.lists.batchListMembers("4f2bd9d0dd", jsonData);

    console.log(response);
  };
  run();

  // https.request(client, options, function() {

  // })

});

app.post("/failure", function(req, res){
  res.redirect("/")
});


//API key
// 6fe987385da2f06ca06c3dd3af5ac6fa-us8

// List ID 
// 4f2bd9d0dd