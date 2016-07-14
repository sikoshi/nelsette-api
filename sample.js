
//
var request = require('request');
var cheerio = require('cheerio');
var iconv   = require('iconv-lite');

//
var nelsette_url = 'http://nelsette.com/qm/upcoming?state=upcoming&currency=KZT&sp=0&ep=374220&ord=0&city=1526384';


//var options = {'encoding' : 'utf8', url : nelsette_url}
var options = { encoding: null, method: "GET", uri: nelsette_url};



/*request(options, function(error, response, body) {

    var utf8String = iconv.decode(new Buffer(body), "UTF-8");
    var html = iconv.decode(body, 'UTF-8');

    $ = cheerio.load(html);


    console.log($('.qm_wrapper').html());
});

return;*/

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {

        // $ = cheerio.load(iconv.decode(new Buffer(body), "UTF-8"));
        $ = cheerio.load(body);

        var matches = [];

        //$('.qm_wrapper').html();

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

            // Fetching match date

            var match_date = match('.qm_date').text();

            // Fetching pitch

            var pitch = match('.qm_pf span').attr('title')


            var free_spots = match('.spots').text();
            var price = match('.qm_price .f_11').text();
            var link = match('a.qm_right_side').attr('href');

            console.log('-----------');
            console.log(link);
            console.log(free_spots);
            console.log(price);
            console.log(kickoff_time + ' - ' + ending_time + ', ' + match_date);
            console.log(pitch);

        });
    }
});
