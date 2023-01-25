const { ProvisionedThroughputOverrideFilterSensitiveLog, FailureExceptionFilterSensitiveLog } = require('@aws-sdk/client-dynamodb');
const {handler} = require('./handlers/createEventPlayground');

// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });
const user = {
    name:"sam",
    age:12
}

test('check event error without id',async()=>{
    const event = {
        arguments:{
            type: "event",
            name: "Demo Event",
            maxFiles: 20,
            maxLanguages: 10
        }
    }
    try{
    const data = await handler(event);
        }catch(err){
    expect(err).toBe("Customer id not provided please check !")
    }
});

test('check playground error without customerId and customerName',async()=>{
    const event = {
        arguments:{
            type: "playground",
            name: "Demo Event",
            maxFiles: 20,
            maxLanguages: 10
        }
    }
    try{
    const data = await handler(event);
        }catch(err){
    expect(err).toBe("Please enter customer id or name")
    }
});
test('check if event is created with customerId',async()=>{
    const event = {
            arguments:{
                type: "event",
                name: "Demo Event",
                maxFiles: 20,
                customerId:"73c364ac-68e7-4ce5-b4c1-cafa70827cdd",
                maxLanguages: 10
        }
    }
        const data = await handler(event);
        expect(data).toHaveProperty('customerId');
        expect(data).toHaveProperty('eventId');
});
test('check if playground is created with customerId',async()=>{
        const event = {
            arguments:{
                type: "playground",
                name: "Demo Event",
                maxFiles: 20,
                customerId:"73c364ac-68e7-4ce5-b4c1-cafa70827cdd",
                maxLanguages: 10
        }
    };
        const data = await handler(event);
        expect(data).toHaveProperty('customerId');
        expect(data).toHaveProperty('playgroundId');
    
});
test('check if playground is created with customerName',async()=>{
    const event = {
        arguments:{
            type: "playground",
            name: "Demo Event",
            maxFiles: 20,
            customerName:"chola",
            maxLanguages: 10
    }
};
    const data = await handler(event);
    expect(data).toHaveProperty('customerId');
    expect(data).toHaveProperty('playgroundId');

});