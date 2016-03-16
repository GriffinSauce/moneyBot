var needle = require('needle');
var _ = require('lodash');

var refreshRate = 5 * 60 * 1000; // 5 minutes
var lastAmount;
getData();

// Get data from API
function getData() {
    needle.get('https://api-cache.oneplanetcrowd.com/?json=project_parents/get&cache=60&id=138624&platform=opc&platforms=opc', function(error, response){
        if(error){
            return console.error(error);
        }

        if(response.body && response.body.status === 'ok') {
            var theMoney = _.get(response, 'body.posts[0].goal_amount_total');
            var theGoal = _.get(response, 'body.posts[0].goal_amount');
            theMoney = parseInt(theMoney);
            theGoal = parseInt(theGoal);
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

    console.log('Refreshed:');
    console.log(pricify(theMoney) + ' total, ' + percent + '% complete of public goal!');
    console.log(pricify(newlyAdded) + ' added since last refresh');
    console.log('----------');

    if(newlyAdded > 0) {
        // Post to slack
        needle.post('https://hooks.slack.com/services/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', {
            "text": "Crowdfunding update from Moneybot!",
            "attachments": [
                {
                    "text": ":moneybag: *"+pricify(newlyAdded)+" was added!*\nWe are now at "+pricify(theMoney)+" total, that's "+percent+"% of our public goal\n<https://www.oneplanetcrowd.com/nl/project/138624/description|View campaign on OPC>",
                    "color": "#2CB98C",
                    "mrkdwn_in": ["text", "pretext"]
                }
            ]
        }, {
            json: true
        },function(error, response) {
            if (error) {
                console.log(error);
            }
        });
    }

    setTimeout(getData, refreshRate);
}

function pricify(euros) { //provide any number of arguments. each argument should be price in cents
    euros = ''+numberWithPeriods(euros);
    // put period every 3 chars
    return '€'+euros+',00';
}

function numberWithPeriods(x) {
    var parts = x.toString().split(",");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
}