
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI('127.0.0.1', '5001', {protocol: 'http'}) // leaving out the arguments will default to these values
koaBody = require('koa-body')();

const app = new Koa();
app.use(bodyParser());

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
await next();
});


router.get('/order/:order', async (ctx, next) => {
    var order = ctx.params.order;

    // data should be a buffer
    const data = Buffer.from(order)

    ipfs.pubsub.publish('topic-name-here', data, (err) => {
        if (err) {
            console.error('error publishing: ', err)
        } else {
            console.log('successfully published message')
    }
    })
    ctx.response.body = `<h1>Hello, ${order}!</h1>`;
});

router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>Index</h1>';
});

router.post('/order', async (ctx, next) => {
    var name = ctx.request.body.name || '',
    password = ctx.request.body.password || '';
console.log(`signin with name: ${name}, password: ${password}`);
if (name === 'koa' && password === '12345') {
    ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
} else {
    ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
}
});

// add router middleware:
app.use(router.routes());

app.listen(8888);
console.log('app started at port 8888...');