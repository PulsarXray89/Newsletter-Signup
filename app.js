//jshint esversion: 6

const express = require("express")
const bodyParser = require("body-parser")
const https = require("https")

const app = express()

app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true }))



app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {
    // save informaion provided by client
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // construct data object for mailchimp
    const data = {
        members: [
            {
                email_address: email
                , status: "subscribed"
                , merge_fields: {
                    FNAME: firstName
                    , LNAME: lastName
                }
            }
        ]
    }

    // compact data object
    const jsonData = JSON.stringify(data);

    // construct url for mailchimp post request
    const url = "https://us9.api.mailchimp.com/3.0/lists/2fec05ac2f"

    // construct post request options
    const options = {
        method: "POST"
        , auth: "pulsarxray:48244f0799ac5ee390148ceb0aa65920-us9"
    }

    // store post request to mailchimp in a constant
    const request = https.request(url, options, (response) => {

        // check if response is valid or not
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
    })

    // execute post request to mailchimp
    request.write(jsonData)
    // end execution of post request
    request.end()
})

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("App running on port 3000.")
})