### $$$ MoneyBot $$$

The MoneyBot uses OnePlanetCrowd's API to get data on the Crowdfunding campaign and posts a message to slack if money is added.  

### Getting started

1. Create an incoming webhook in slack

Inspiration:
- Name: The Moneybot
- Description: Investment updates from crowdfunding
- Channel: #general, if you dare
- Image: 

2. Add your stuff to `config.js`

Add the webhook url that you just created.
Get your project id from the opc url: https://www.oneplanetcrowd.com/nl/project/<id>/

3. Use `npm run start` to start.  
