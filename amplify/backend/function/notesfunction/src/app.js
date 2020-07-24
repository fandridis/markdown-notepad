/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	AUTH_MARKDOWNNOTEPADBA9D5D4E_USERPOOLID
	STORAGE_NOTES_ARN
	STORAGE_NOTES_NAME
Amplify Params - DO NOT EDIT */

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");

// DynamoDB configuration
const region = process.env.REGION;
const ddb_table_name = process.env.STORAGE_NOTES_NAME;
const docClient = new AWS.DynamoDB.DocumentClient({ region });

async function canPerformAction(event) {
  return new Promise(async (resolve, reject) => {
    if (!event.requestContext.identity.cognitoAuthenticationProvider) {
      return reject();
    } else {
      return resolve();
    }
  });
}

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/**********************
 * Example get method *
 **********************/

app.get("/notes", async function (req, res) {
  try {
    const data = await getNotes();
    res.json({ data: data });
  } catch (err) {
    res.json({ error: err });
  }
});

async function getNotes() {
  var params = { TableName: ddb_table_name };
  try {
    const data = await docClient.scan(params).promise();
    return data;
  } catch (err) {
    return err;
  }
}

app.get("/notes/*", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

/****************************
 * Example post method *
 ****************************/

app.post("/notes", async function (req, res) {
  const { body } = req;
  const { event } = req.apiGateway;
  try {
    await canPerformAction(event);
    const input = { ...body, id: uuid() };
    var params = {
      TableName: ddb_table_name,
      Item: input,
    };

    await docClient.put(params).promise();
    res.json({ success: "note saved to database.." });
  } catch (err) {
    res.json({ error: err });
  }
});

app.post("/notes/*", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example put method *
 ****************************/

app.put("/notes", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/notes/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/notes", async function (req, res) {
  const { event } = req.apiGateway;
  try {
    await canPerformAction(event);
    var params = {
      TableName: ddb_table_name,
      Key: { id: req.body.id },
    };
    await docClient.delete(params).promise();
    res.json({ success: "successfully deleted the note" });
  } catch (err) {
    res.json({ error: err });
  }
});

app.delete("/notes/*", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
