const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))
const port = 3000;

app.post('/', (req, res) => {
    const firstname = req.body.fn;
    const lastname = req.body.ln;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname
            }
        }]
    };

    const JsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/8b939c85c3";
    const options = {
        method: 'POST',
        auth: "tushar:06e870bbdea070281b82ae8215000493-us14"
    };

    const MailchimpRequest = https.request(url, options, (response) => {

        if (response.statusCode === 200)
            res.sendFile(__dirname + '/success.html');
        else
            res.sendFile(__dirname + '/failure.html');

        response.on('data', (d) => {
            console.log(JSON.parse(d));
        })
    })

    MailchimpRequest.write(JsonData);
    MailchimpRequest.end();

})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


app.listen(process.env.PORT || port, () => {
    console.log(`The server is up at port ${port}.`);
})



//Mailchimp API Key - 06e870bbdea070281b82ae8215000493-us14
//Unique Id for audience - 8b939c85c3