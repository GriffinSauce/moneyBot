### $$$ MoneyBot $$$

The MoneyBot uses OnePlanetCrowd's API to get data on the Crowdfunding campaign and posts a message to slack when funders pledge to your campaign.  

**Note:** since it works by polling an API endpoint (every 30 seconds) some updates will contain pledges from multiple funders. This was simply reverse engineered from OPCs website, feel free to implement a webhook and do a pull request. :)

### Getting started

##### 1. Create an incoming webhook in slack

Inspiration:
- Name: The Moneybot
- Description: Investment updates from crowdfunding
- Channel: #general, if you dare
- Image: ![](/Moneybot_small.jpg?raw=true "The Moneybot #swag") -> [Hires](/Moneybot_large.jpg?raw=true)

##### 2. Add your stuff to `config.js`

Add the webhook url that you just created and your project id to the config.  
Get your project id from the opc url: `https://www.oneplanetcrowd.com/nl/project/<yourProjectId>/`

##### 3. Use `npm run start` to start.  

##### 4. Celebrate when people support you!

### Sidenotes

- The Moneybot posts a welcome message on start, comment out `postHello();` at `app.js:16` if you don't like that.
- When the bot starts it needs one call to get status quo, it will post after one minute
- This was built quickly, dirtily and might crash :)
