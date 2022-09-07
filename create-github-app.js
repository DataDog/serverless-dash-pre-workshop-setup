
const axios = require('axios').default;
const DocumentClient = require('aws-sdk/clients/dynamodb').DocumentClient;
const crypto = require('crypto');

const dynamoDb = new DocumentClient();

exports.handler = async (event) => {
    const response = {};
    try {
        const res = await axios.post(`https://api.github.com/app-manifests/${event.queryStringParameters.code}/conversions`);
        const item = {
            uuid: crypto.randomUUID(),
            name: res.data.name,
            owner: res.data.owner.login,
            pem: res.data.pem,
            app_id: res.data.id,
        }
        await dynamoDb
        .put({
            TableName: process.env.TABLE_NAME,
            Item: item,
        })
        .promise();
        response.statusCode = 200;
        response.body = "success ";
    } catch(e) {
        console.error(e);
        response.statusCode = 500;
        response.body = `error: ${e.message}`;
    }
    return response;
};