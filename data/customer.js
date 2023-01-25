require("dotenv").config();
const {
    DynamoDBClient,
    QueryCommand,
    PutItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

// Declare DynamoDB service object here so it can be reused in subsequent calls
let dynamoDbclient;

const initDynamoDBClient = () => {
    // Initialize DynamoDB client if existing one is not available for reuse
    if (!dynamoDbclient) {
        dynamoDbclient = new DynamoDBClient({ region: process.env.AWS_REGION });
    };
};

exports.createCustomer = async (id,name) => {
    // Initialize DynamoDB client if existing one is not available for reuse
    initDynamoDBClient();
    // Set the input parameters
    const input = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        // Create user record
        Item: marshall({
            "PK": `CUSTOMER#${id}`,
            "SK": `CUSTOMER#${id}`,
            "type": 'Customer', // Hard-coded type for "user" entity
            "id": id,
            "name": name,
            "GSI1PK": 'CUSTOMER',
            "GSI1SK": `CUSTOMER#${id}`,
            "createdAt": new Date().toISOString(),
            "updatedAt": new Date().toISOString()
        })
    };
    return await dynamoDbclient.send(new PutItemCommand(input));
}

exports.getCustomerList = async () => {
    // Initialize DynamoDB client if existing one is not available for reuse
    initDynamoDBClient();

    // Set the input parameters
    const input = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        IndexName: "GSI1PK-GSI1SK-index",
        ScanIndexForward: true,
        KeyConditionExpression: "#GSI1PK = :GSI1PK ",
        ExpressionAttributeNames: {
            "#GSI1PK": "GSI1PK",
        },
        ExpressionAttributeValues: marshall({
            ":GSI1PK": `CUSTOMER`,
        })
    };
    // Retrieve the items from DynamoDB
    const result = await dynamoDbclient.send(new QueryCommand(input));
    if (result && result.Items?.length > 0) {
        return result.Items.map(Item => unmarshall(Item));
    };
};