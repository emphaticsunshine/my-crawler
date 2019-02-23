var processInput = require('./processInput');
var crawl = require('./crawl');
const maxDepthLevel = 2; // this can be configured to be entered through cli

if (process.argv.length < 4) {
    console.error('Please enter valid input');
    process.exit();
}

const { baseURL, searchKeyword } = processInput(process.argv);


const incrementKeyword = (() => {
    var counter = 0;
    return () => {
        counter++;
        return counter;
    }
})();
const incrementPageCount = (() => {
    var counter = 0;
    return () => {
        counter++;
        return counter;
    }
})();

const crawlDeep = (url, depthLevel = 0) => {
    if (depthLevel <= maxDepthLevel) {
        crawl(baseURL, url, depthLevel, searchKeyword).then((response) => {
            const { links, doesContainSearchKeyword, depthLevel } = response;
            const pageVisits = incrementPageCount();
            if (doesContainSearchKeyword >= 0) {
                console.log('keyword found:', incrementKeyword());
                console.log('total pages searched:', pageVisits);
            }
            if(depthLevel <= maxDepthLevel) {
                links.forEach(link => {
                    crawlDeep(link, depthLevel+1)
                });
            }
        })
    }
};

crawlDeep(baseURL);

// crawl(url, 1, searchKeyword).then((response) => {
//     const { links, doesContainSearchKeyword, depthLevel } = response;
//     doesContainSearchKeyword >=0 && incrementCount();
//     while(depthLevel <= 2) {

//     }
// })


