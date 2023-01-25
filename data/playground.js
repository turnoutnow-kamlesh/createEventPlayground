const {
    DynamoDBClient,
    PutItemCommand,
    GetItemCommand
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

exports.createPlayground = async (expiresAt,playgroundId,id,maxFiles,maxLanguages) => {
    // Initialize DynamoDB client if existing one is not available for reuse
    initDynamoDBClient();
    // Set the input parameters
    const input = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        // Create playground record
        Item: marshall({
            PK:`PLAYGROUND#${playgroundId}`,
            SK:`PLAYGROUND#${playgroundId}`,
            type:"Playground",
            id:playgroundId,
            maxFiles:maxFiles,
            maxLanguages:maxLanguages,
            expiresAt:expiresAt,
            GSI1PK:"PLAYGROUND",
            GSI1SK:`CUSTOMER#${id}#PLAYGROUND#${playgroundId}`,
            "createdAt":new Date().toISOString(),
            "updatedAt":new Date().toISOString()
        })
    };
    return await dynamoDbclient.send(new PutItemCommand(input));
};
exports.getPlaygroundInfo = async (playgroundId) => {
    // Initialize DynamoDB client if existing one is not available for reuse
    initDynamoDBClient();

    // Set the input parameters
    const input = {
        TableName: "onboarding",
        Key: marshall({
            "PK": `PLAYGROUND#${playgroundId}`,
            "SK": `PLAYGROUND#${playgroundId}`
        })
    };
    // Retrieve the item from DynamoDB
    const result = await dynamoDbclient.send(new GetItemCommand(input));
    if (result && result.Item) {
        return unmarshall(result.Item);
    };
};
