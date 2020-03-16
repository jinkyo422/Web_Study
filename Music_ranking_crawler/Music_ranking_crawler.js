const cheerio = require('cheerio');
const request = require('request');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('utf-8', 'utf-8//translit//ignore');

let url
let date = 20190409

for (let page = 1, p = Promise.resolve(); page <= 4; page++) {
    p = p.then(_ => new Promise(resolve =>
        setTimeout(function () {
            url = `https://www.genie.co.kr/chart/top200?ditc=D&ymd=${date}&hh=01&rtm=Y&pg=${page}`

            request({ url, encoding: null}, (error, response, body) => {
                const htmlDoc = iconv.convert(body).toString()
                const totalResults = []
                const $ = cheerio.load(htmlDoc)
                const colArr = $('.list-wrap > tbody > tr')

                for (let i = 0 ; i < colArr.length ; i++) {

                    const elements = colArr[i].children
                    const artist = elements[9].children[3].children[0].data
                    const song = elements[9].children[1].children[0].data.trim()
                    const ranking = elements[3].children[0].data.trim()

                    totalResults.push(`${ranking}: ${artist} - ${song}`)

                }
                console.log(totalResults)
            })
            resolve();
        }, 1000)
    ));
}
