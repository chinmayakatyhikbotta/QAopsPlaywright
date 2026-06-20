const base = require('@playwright/test');


exports.customtest = base.test.extend(
{
testDataForOrder :    {
    username : "chinmayakarthik76@gmail.com",
    password : "muBLnjw7P!v2RtU",
    productName:"ADIDAS ORIGINAL"
    
    }

}

)




