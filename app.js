var needle = require('needle');
var _ = require('lodash');
var config = require('./config');

if(!config.projectId || !config.slackHookUrl) {
    console.error('******************************************\n\n');
    console.error('Error: Please make sure config is complete and contains the projectId and slackHookUrl properties\n\n');
    console.error('******************************************');
    return;
}

var projectUrl = 'https://www.oneplanetcrowd.com/nl/project/'+config.projectId+'/description';
var refreshRate = 30 * 1000; // 30 seconds
var lastAmount;

postHello();
getData();

// Get data from API
function getData() {
    needle.get('https://api-cache.oneplanetcrowd.com/?json=project_parents/get&cache=60&id='+config.projectId, function(error, response){
        if(error){
            console.error('Error getting data, trying again in 5 minutes', error);
            return setTimeout(getData, (1000*60*5)); // Try again after 5 minutes
        }

        if(response.body && response.body.status === 'ok') {
            var theMoney = parseInt(_.get(response, 'body.posts[0].goal_amount_total'));
            var theGoal = parseInt(_.get(response, 'body.posts[0].goal_amount'));
            output(theMoney, theGoal);
        }
    });
}

// Output to console and post new money to slack
function output(theMoney, theGoal) {
    var percent = Math.round((theMoney/theGoal)*100);

    var newlyAdded = 0;
    if(lastAmount){
        newlyAdded = theMoney-lastAmount;
    }
    lastAmount = theMoney;

    console.log('Refreshed:');
    console.log(pricify(theMoney) + ' total, ' + percent + '% complete of public goal!');
    console.log(pricify(newlyAdded) + ' added since last refresh');
    console.log('----------');

    if(newlyAdded > 0) {
        console.log('Posting to Slack');

        // Post to slack
        var text = ":moneybag: *"+pricify(newlyAdded)+" was added!*\nWe are now at "+pricify(theMoney)+" total, that's "+percent+"% of our public goal\n<"+projectUrl+"|View campaign on OPC>";
        needle.post(config.slackHookUrl, {
            "text": "Crowdfunding update from Moneybot! ",
            "attachments": [
                {
                    "text": text,
                    "color": "#2CB98C",
                    "mrkdwn_in": ["text", "pretext"]
                }
            ]
        }, {
            json: true
        },function(error, response) {
            if (error) {
                console.log('Error posting update:', error);
            }
        });
    }

    setTimeout(getData, refreshRate);
}

function pricify(euros) {

    // put period every 3 chars
    euros = ''+numberWithPeriods(euros);
    return '€'+euros+',00';
}

function numberWithPeriods(x) {
    var parts = x.toString().split(",");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
}

function postHello() {
    needle.post(config.slackHookUrl, {
        "text": "Why hello there, I'm your friendly neighborhood Moneybot!\nI'll give you an update when a crowdfunder pledges to your campaign, good luck funding! :grin:\n<"+projectUrl+"|View campaign on OPC>",
    }, {
        json: true
    },function(error, response) {
        if (error) {
            console.log('Error posting hello:', error);
        }
    });
}