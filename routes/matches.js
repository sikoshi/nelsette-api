var express   = require('express');
var router    = express.Router();

var request = require('request');
var cheerio = require('cheerio');
//

/* GET matches array. */
router.get('/', function(req, res, next) {
    
    // TODO: accept params via GET

    // state
    var state = 'upcoming';
    if (typeof(req.param('state')) != 'undefined')
    {
        state = req.param('state');
    }

    // currency

    var currency = 'KZT';
    if (typeof(req.param('currency')) != 'undefined')
    {
        currency = req.param('currency');
    }

    // stating price
    var starting_price = 0;
    if (typeof(req.param('starting_price')) != 'undefined')
    {
        starting_price = req.param('starting_price');
    }

    // ending price
    var ending_price = 374220;
    if (typeof(req.param('ending_price')) != 'undefined')
    {
        ending_price = req.param('ending_price');
    }

    // order
    var order = 0;

    if (typeof(req.param('order')) != 'undefined')
    {
        order = req.param('order');
    }

    // city
    var city = '1526384';

    if (typeof(req.param('city')) != 'undefined')
    {
        city = req.param('city');
    }

    // Url to request
    var nelsette_url = 'http://nelsette.com/qm/upcoming?state=' + state + '&currency=' + currency + '&sp=' + starting_price + '&ep=' + ending_price + '&ord=' + order + '&city=' + city;

    // Requesting matches page
    request({ encoding: null, method: "GET", uri: nelsette_url}, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            $ = cheerio.load(body);

            var matches = [];
            var i       = 0;

            // Processing each matches' div
            $('.qm_wrapper').each(function(i, elem) {

                var match = cheerio.load($(this).html());

                // Fetching match time
                var kickoff_time = '';
                var ending_time  = '';

                match('.qm_time label span').each(function(i, elem) {
                    var time = match('.qm_time label').html();

                    if ($(this).hasClass('start'))
                    {
                        kickoff_time = $(this).html();
                    }
                    else
                    {
                        ending_time = $(this).html();
                    }
                });

                // Match date
                var match_date = match('.qm_date').text();

                // Pitch
                var pitch = match('.qm_pf span').attr('title').trim();

                // Free spots
                var free_spots = match('.spots').text();

                // Fee
                var price = match('.qm_price .f_11').text();

                // Link to match
                var link = match('a.qm_right_side').attr('href');

                // organizer
                var organizer = match('a.profile_avatar').attr('title');


                matches[i] = {};


                matches[i]['link']          =  link;
                matches[i]['organizer']     =  organizer;
                matches[i]['free_spots']    =  free_spots;
                matches[i]['price']         =  price;
                matches[i]['kickoff_time']  =  kickoff_time;
                matches[i]['ending_time']   =  ending_time;
                matches[i]['match_date']    =  ending_time;
                matches[i]['pitch']         =  pitch;

                i += 1;
            });

            var data = {};

            data['matches']     = matches;
            data['status_code'] = response.statusCode;

            res.json(data);
        }
        else
        {
            data = {};

            if (typeof(response) != 'undefined')
            {
                data['status_code'] = response.statusCode;
            }

            res.json(data);
        }
    });
});

module.exports = router;