var express   = require('express');
var router    = express.Router();

var request = require('request');
var cheerio = require('cheerio');
//
var nelsette_url = 'http://nelsette.com/qm/upcoming?state=upcoming&currency=KZT&sp=0&ep=374220&ord=0&city=1526384';

var options = { encoding: null, method: "GET", uri: nelsette_url};

/* GET users listing. */
router.get('/', function(req, res, next) {

    // Requesting matches page
    request(options, function (error, response, body) {
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
                var pitch = match('.qm_pf span').attr('title')

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