const {
    DynamoDBClient,
    PutItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

// Declare DynamoDB service object here so it can be reused in subsequent calls
let dynamoDbclient;

const initDynamoDBClient = () => {
    // Initialize DynamoDB client if existing one is not available for reuse
    if (!dynamoDbclient) {
        dynamoDbclient = new DynamoDBClient({ region: process.env.AWS_REGION });
    }
};

exports.createEvent = async (id,name,customerId) => {
    // Initialize DynamoDB client if existing one is not available for reuse
    initDynamoDBClient();
    // Set the input parameters
    const input = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        // Create event record
        Item: marshall({
            "PK":`EVENT#${id}`,
            "SK":`EVENT#${id}`,
            "eventId":id,
            "eventName":name,
            "type":"Event",
            "GSI1PK":"EVENT",
            "GSI1SK":`CUSTOMER#${customerId}#EVENT#${id}`,
            "createdAt": new Date().toISOString(),
            "updatedAt": new Date().toISOString()
        })
    };
    return await dynamoDbclient.send(new PutItemCommand(input));
};
