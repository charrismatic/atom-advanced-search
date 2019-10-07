// TODO:const
// Searching packages
//
// GET /api/packages/search
// Parameters:
//
// q (required) - Search query
// page (optional)
// sort (optional) - One of downloads, created_at, updated_at, stars. Defaults to the relevance of the search query.
// direction (optional) - asc or desc. Defaults to desc.
// Returns results in the same format as listing packages.
module.exports = ((query, options) => {
  const https = require('https');
  //page=X
  https.get(`https://www.atom.io/api/packages/search?sort=${options.sort}&q=${query}`, (res) => {
    //console.log('statusCode:', res.statusCode);
    //console.log('headers:', res.headers);
    res.on('data', (d) => {
      process.stdout.write(d);
    });

  }).on('error', (e) => {
    console.error(e);
  });


//
// fetch("https://www.atom.io/api/packages/search?page=1&sort=stars&q=react", {
//   "credentials":"include",
//   "headers": {
//     "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
// //       "accept-language":"en-US,en;q=0.9",
// //       "if-modified-since":"Tue, 11 Sep 2018 16:24:49 GMT",
// //       "if-none-match":"\"13809a9f5b6379251bdaf47b2ffb81f1\"",
// //       "upgrade-insecure-requests":"1"
//    },
// //      "referrer":"https://developer.spotify.com/console/artists/",
// //      "referrerPolicy":"no-referrer-when-downgrade",
//   "body":null,
//   "method":"GET",
//   "mode":"cors"
// })
// .then(response => response.json())
// .catch(logError);
//
//



}
