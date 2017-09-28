'use strict';
const http = require('https');

const slack_error = (message) => `/api/chat.postMessage?token=${process.env.SLACK_TOKEN}&channel=system-status&text=${message}&icon_emoji=:bangbang:&username=system`;
function request(opts){
  return new Promise((resolve, reject) => {
    console.log("requesting", opts);
		let body = '';
    const req = http.request(opts, res=>{
        console.log("request has been made");
				 if (res.statusCode < 200 || res.statusCode >= 300) {
					console.log("bad status code", res.statusCode);
					reject(new Error('statusCode=' + res.statusCode));
					return;
        }
				console.log("status check passed");
				res.on('data', function(d) {
					console.log("receiving data");
					body+=d;
        });
				res.on('end', function() {
					console.log("response complete");
					resolve(body);
        });
    });
    req.on('error', reject);
    req.end();
  })
}

exports.handler = (event, context, callback) => {
  const req = request({
    hostname: process.env.HOSTNAME,
    port: process.env.PORT||443,
    path: process.env.REQUEST_PATH,
    method: 'GET',
  })
  .then(r => {
		console.log("response", r);
		callback(null, "success")
	})
  .catch(e => {
		console.log("error");
    return request({
      hostname: "slack.com",
      port: 443,
      path: slack_error(encodeURI(`There was a problem connecting to ${process.env.HOSTNAME}${process.env.REQUEST_PATH}`)),
      method: 'POST',
    })
		.then((r)=> { console.log(r); callback(e) });
  })
}
