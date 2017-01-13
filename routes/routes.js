var request = require('request');
var config = require('../config/config');

var appRouter = function (app) {

    app.get("/", function (req, res) {
        res.send("Hello World");
    });

    app.get("/next", function (req, res) {
//{"callback":"jQuery1710788273485301669_1484132044759","session":3733,"signature":425157057,"step":0,"answer":1,"_":1484132212970}
        req.query

        var queryString = req.url.substr(req.url.indexOf("?")+1)+"&_="+new Date().getTime();

        var hostAddress = config.host,
            route = config.next,
            url = hostAddress + route+queryString;
        request({
            url: url,
            method: "GET",
            json: true
        }, function optionalCallback(err, response) {
            if (err) {
                res.json({success: false, err: err});

            } else if (response) {

                //callback=jQuery1710788273485301669_1484132044759&session=3733&signature=425157057&step=0&answer=1&_=1484132212970
                console.log(response.body.toString());
                //{"callback":"jQuery1710788273485301669_1484132044759","session":3733,"signature":425157057,"step":0,"answer":1,"_":1484132212970}
                var objJson = JSON.parse(response.body.toString().substr(response.body.toString().indexOf("(") + 1, response.body.toString().length - response.body.toString().indexOf("(") - 2));
                var jQueryVal = response.body.toString().substr(0, response.body.toString().indexOf("("))
                var data = {};
                data["jsonCode"] = getNextCode(jQueryVal);
               // data["session"] = objJson.parameters.identification.session;
               // data["signature"] = objJson.parameters.identification.signature;
                data["question"] = objJson.parameters.question;
                data["step"] = parseInt(objJson.parameters.step) + 1;


                res.json(data);
            }

        });


    });


    app.get("/begin", function (req, res) {


        //console.info('[restartVideoBroadCastingServer][call]');
        var hostAddress = config.host,
            route = config.begin,
            url = hostAddress + route;
        request({
            url: url,
            method: "GET",
            json: true
        }, function optionalCallback(err, response) {
            if (err) {
                res.json({success: false, err: err});

            } else if (response) {
                console.log(response.body.toString());
                var objJson = JSON.parse(response.body.toString().substr(response.body.toString().indexOf("(") + 1, response.body.toString().length - response.body.toString().indexOf("(") - 2));
                var jQueryVal = response.body.toString().substr(0, response.body.toString().indexOf("("))
                var data = {};
                data["jsonCode"] = getNextCode(jQueryVal);
                data["session"] = objJson.parameters.identification.session;
                data["signature"] = objJson.parameters.identification.signature;
                data["question"] = objJson.parameters.step_information.question;
                data["step"] = parseInt(objJson.parameters.step_information.step) + 1;


                res.json(data);
            }
            //console.log(response.toString());
            /*if (err) {
             console.error('**************[restartVideoBroadCastingServer][Request][Fail]*****************', err);
             res.json({success: false, msg: 'Video BroadCasting restart request failed', data: err});
             } else {
             var dataObj = (response && response.body) ? response.body.data : undefined;
             console.info('*************************[videoBroadCastingControls][createRoom][Request][Success]**********************');
             res.json({success: true, msg: 'Video BroadCasting Server Restarted', data: ''});
             }*/
        });


    });


    app.post("/account", function (req, res) {
        if (!req.body.username || !req.body.password || !req.body.twitter) {
            return res.send({"status": "error", "message": "missing a parameter"});
        } else {
            return res.send(req.body);
        }
    });


}


function getNextCode(code) {
    var parts = code.split("_");
    var nextCode = "";
    if (parts.length == 2) {
        nextCode = parts[0] + "_" + (parseInt(parts[1]) + 1);
    }

    return nextCode;

}
module.exports = appRouter;