const axios = require('axios').default;
const DocumentClient = require('aws-sdk/clients/dynamodb').DocumentClient;
const crypto = require('crypto');

const dynamoDb = new DocumentClient();

exports.handler = async (event) => {
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
        return {
            statusCode: 301,
            headers: {
                Location: 'https://datadoghq.dev/serverless-dash-2022-create-github-app/success.html',
            }
        }
    } catch(e) {
        console.error(e);
        return {
            statusCode: 500,
            body: `error: ${e.message}`
        }
    }
};