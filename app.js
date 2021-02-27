// API Key : 3b762292d086f883b1b63dce46915441-us1
// List ID : d267d29b20

const express = require("express");
const https = require("https");
const mailChimp = require("@mailchimp/mailchimp_marketing");

const app = express();

mailChimp.setConfig({
  apiKey: "3b762292d086f883b1b63dce46915441-us1",
  server: "us1",
});

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", (req, res)=>{
    res.redirect("/");
// res.sendFile(__dirname+"/signup.html");
});


app.post("/", function (req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const em = req.body.email;

  const listId = "d267d29b20";

  const subscribingUser = {
    firstName: fName,
    lastName: lName,
    email: em,
  };

  async function run() {
    const response = await mailChimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });

    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
    res.sendFile(__dirname + "/success.html");
  }

  run();
  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});

app.listen(process.env.PORT||3000, function () {
  console.log("Server is running on port 3000");
});
