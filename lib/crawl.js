var Crawler = require('crawler');


function getLinks($elem, $, baseURL) {
    let links = [];
    $elem.find('a').each(function() {
        var linkURL = $(this).attr('href');
        if(typeof linkURL === 'string' && !linkURL.startsWith('#')) {
            if (linkURL.indexOf('http') <0) {
                linkURL = `${baseURL}${linkURL}`;
                links.push(linkURL);
            } else {
                links.push(linkURL);
            }
        }
    });
    return links;
}

var c = new Crawler({
    maxConnections : 10,
});

module.exports = function(baseURL, url, depthLevel, searchKeyword) {
    return new Promise((resolve) => {
        c.queue([{
            uri: url,
            callback: function (error, res, done) {
                let links;
                var doesContainSearchKeyword = false;
                if(error){
                    console.log(error);
                }else{
                    var $ = res.$;
                    const $body = $('body');
                    doesContainSearchKeyword = $body.text().indexOf(searchKeyword);
                    links = getLinks($body, $, baseURL);
                }
                resolve({
                    links: links,
                    doesContainSearchKeyword,
                    depthLevel
                });
                done();
            }
        }]);
    })
}