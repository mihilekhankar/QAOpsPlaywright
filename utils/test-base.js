const base = require('@playwright/test');

exports.customtest = base.test.extend(
{
    testDataForOrder : {
        username: "mihil@gmail.com",
        password: "Admin@123",
        productName: "ZARA COAT 3"
    }
}
)