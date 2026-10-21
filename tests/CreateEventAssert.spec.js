const {test, expect} = require('../utils/EventFixtures.js');

test("Event Creation Assert", async ({ autheticatedPage,createEvent }) => {

    await autheticatedPage.goto('https://eventhub.rahulshettyacademy.com/events');
    await expect(autheticatedPage.getByText(createEvent.title)).toBeVisible();
    
})