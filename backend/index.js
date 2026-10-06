require("node:dns").setServers(["8.8.8.8", "8.8.4.4"])
const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://muruga:123@cluster0.frb3hsc.mongodb.net/passkey?appName=Cluster0").then(function () {
    console.log("Connected to DB")
}).catch(function (err) { console.log("Failed to connect", err.message) })

const credential = mongoose.model("credential", {}, "bulkmail")




app.post("/sendemail", function (req, res) {

    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",

            auth: {
                //TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });

        new Promise(async function (resolve, reject) {
            try {
                for (var i = 0; i < emailList.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "murugananthamsabari86@gmail.com",
                            to: emailList[i],
                            subject: "A message from Bulk Mail App",
                            text: msg
                        },


                    )
                    console.log("Email Sent to " + emailList[i])
                }
                resolve("Success")
            }
            catch (error) {
                reject("Failed")
            }


        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })




    }).catch(function (error) {
        console.log(error)
    })





})


app.listen(5000, function () {
    console.log("Server Started....")
})