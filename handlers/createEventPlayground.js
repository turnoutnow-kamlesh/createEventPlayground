const {createEvent} = require("../data/event");
const {getCustomerList,createCustomer}= require("../data/customer");
const {createPlayground,getPlaygroundInfo} = require("../data/playground");
const { customAlphabet,nanoid }  = require("nanoid");
const customNanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 5);
exports.handler= async(event,context)=>{
    const {type,name,customerId,customerName,maxFiles,maxLanguages} = event.arguments;
    //All event related checks are done here.
    if(type === "event"){
        // no customer id throw error
        if(!customerId || customerId.length == 0){
                 console.error("Inavlid or null customer id");
                    throw("Customer id not provided please check !");
            }else{
                // creating event data
                const id = nanoid();
                try{
                    //passing data to create and event
                    await createEvent(id,name,customerId);
                    return({
                        customerId: customerId,
                        eventId: id
                })
            }catch(err){
                console.error(err);
                throw(err);
            };
        };
    }
    // All Playground related tasks are done here.
    else if(type === "playground"){
        const playgroundId = await checkData();
        let date = new Date();
        date.setDate(date.getDate() + 7);
        let expiresAt = date.toISOString();
        if(!customerId && !customerName){
            console.error("Please enter customer id or name");
            throw("Please enter customer id or name");
            };


    // if customer id is not present but name is present we will create a new customer
        if(!customerId || customerId.length == 0){
            const users = await getCustomerList()
            const customers = users && users.filter((e)=>e.name === customerName);
            // if customer is already present we will make a playground
            if(customers && customers.length){
                let id = customers[0].id;
            try{
                await createPlayground(expiresAt,playgroundId,id,maxFiles,maxLanguages);
                return(
                    {
                        customerId: id,
                        playgroundId: playgroundId
                    }
                );
            }catch(err){
                console.error(err);
                throw(err);
            };
        }else{
                //making new customer from name
            const id = nanoid();
            try{
                await createCustomer(id,customerName);
            }catch(err){
                console.error(err);
                throw(err);
            };
            try{
                await createPlayground(expiresAt,playgroundId,id,maxFiles,maxLanguages);
                return(
                    {
                        customerId: id,
                        playgroundId: playgroundId
                    }
                )
            }catch(err){
                console.error(err);
                throw err;
            };

        };
    }else{
        // customer id and name present so making directly
        try{
            await createPlayground(expiresAt,playgroundId,customerId,maxFiles,maxLanguages);
            return(
                {
                    customerId: customerId,
                    playgroundId: playgroundId
                }
            )
        }catch(err){
            console.error(err);
            throw(err);
        };
    }
    }else{
        console.error("Inavlid or no type provided");
        throw("Invalid or no type provided");
    };   
};


const checkData = async() => {
    let id = customNanoid();
    try{
    const data = await getPlaygroundInfo(id);
    if(data){
        return checkData();
    }else{
        return id;
    }
    }catch(err){
        console.error(err);
        throw(err);
    };
};