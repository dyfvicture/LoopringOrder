const Koa = require('koa');
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
var ipfsAPI = require('ipfs-api')
var Config = require('./config')
var Message = require('./message')

const config = new Config()
console.log("binding ipfs daemon:["+config.ipfsHost()+":"+config.ipfsPort()+"] with topic:["+config.ipfsPubSubTopic()+"]")

var ipfs = ipfsAPI(config.ipfsHost(), config.ipfsPort(), {protocol: 'http'})

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

router.post('/order', async (ctx, next) => {
    let postData = await parsePostData( ctx )
    let order = postData.order
    if(undefined == order || "" == order){
        ctx.body = "{'code':10001, 'msg':'order null'}"
        return
    }
    // data should be a buffer
    const data = Buffer.from(order)
    ipfs.pubsub.publish('topic-name-here', data, (err) => {
        if (err) {
            console.error('error publishing: ', err)
        } else {
            console.log('successfully published message')
        }
    })
    //TODO: publish wait callback state check
    ctx.body = "{'code':0, 'msg':'success'}"
});

// add router middleware:
app.use(router.routes());

app.listen(8888);
console.log('app started at port 8888...');

// 解析上下文里node原生请求的POST参数
function parsePostData( ctx ) {
    return new Promise((resolve, reject) => {
        try {
            let postdata = "";
            ctx.req.addListener('data', (data) => {
                postdata += data
            })
            ctx.req.addListener("end",function(){
                let parseData = parseQueryStr( postdata )
                resolve( parseData )
            })
        } catch ( err ) {
            reject(err)
        }
    })
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr( queryStr ) {
    let queryData = {}
    let queryStrList = queryStr.split('&')
    //console.log( queryStrList )
    for (  let [ index, queryStr ] of queryStrList.entries()  ) {
        let itemList = queryStr.split('=')
        queryData[ itemList[0] ] = decodeURIComponent(itemList[1])
    }
    return queryData
}
