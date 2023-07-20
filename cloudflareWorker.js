
let joinStats = true;  //可选加入统计。 加入统计不会收集任何隐私信息，仅统计访问量。
let webPath = 'https://raw.githubusercontent.com/kaixinyiri/NewBingGoGo-Web/master/src/main/resources'; //web页面地址，可以修改成自己的仓库来自定义前端页面
let serverConfig = {
    "h1": "NewBingGoGo",
    "h2": "简单开始和NewBing聊天",
    "p":"",
    "firstMessages":[
         `请使用创造力模式!!!
        添加企业微信，免费绑定您的微软帐号，送全套实操案例!
        绑定帐号后，单轮会话对话次数从10次升级30次，解锁画图!!!, 
        未绑定账号会经常出现cookie失效的情况，需要不断刷新页面，一直到可用为止,
        绑定后不会出现cookie失效的情况`     
    ],
    "firstProposes":[
        "教我一个新单词",
        "我需要有关家庭作业的帮助",
        "我想学习一项新技能",
        "最深的海洋是哪个?",
        "一年有多少小时?",
        "宇宙是如何开始的?",
        "寻找非虚构作品",
        "火烈鸟为何为粉色?",
        "有什么新闻?",
        "让我大笑",
        "给我看鼓舞人心的名言",
        "世界上最小的哺乳动物是什么?",
        "向我显示食谱",
        "最深的海洋是哪个?",
        "为什么人类需要睡眠?",
        "教我有关登月的信息",
        "我想学习一项新技能",
        "如何创建预算?",
        "给我说个笑话",
        "全息影像的工作原理是什么?",
        "如何设定可实现的目标?",
        "金字塔是如何建成的?",
        "激励我!",
        "宇宙是如何开始的?",
        "如何制作蛋糕?"
    ]
}
let cookies = [
    ""
]


export default {
    async fetch(request, _env) {
        return await handleRequest(request);
    }
}
let serverConfigString = JSON.stringify(serverConfig);
/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  // Get the current date in GMT+8
  let date = new Date();
  date.setUTCHours(date.getUTCHours() + 8);
  // Get the date after four days

let afterFourDays = new Date(2023, 7, 14);
afterFourDays.setDate(afterFourDays.getDate() + 7);
  
  // Check if it is after four days and between 10 and 12
  if (date > afterFourDays && (date.getUTCHours() < 8 || date.getUTCHours() >= 12)) {
    // Return a maintenance page response with the date
    return new Response(
      `非会员功能受限,可用时间段：每天上午8点至12点\n添加企业微信，加入会员，解锁全部时段！\n联系方式：15169593107`,
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      }
    );
  }
  // Otherwise, continue with the original code
    let url = new URL(request.url);
    let path = url.pathname;

    if(path === '/challenge'){//过验证的接口
        let r = url.searchParams.get('redirect');
        if (r){
            return getRedirect(r);
        }
        return new Response(`验证成功`,{
            status: 200,
            statusText: 'ok',
            headers: {
                "content-type": "text/html; charset=utf-8"
            }
        })
    }

    if (path === '/sydney/ChatHub') { //魔法聊天
        return goChatHub(request);
    }
    if (path === "/turing/conversation/create") { //创建聊天
        return goUrl(request, "https://www.bing.com/turing/conversation/create",{
            "referer":"https://www.bing.com/search?q=Bing+AI"
        });
    }

    if(path==="/edgesvc/turing/captcha/create"){//请求验证码图片
        return goUrl(request,"https://edgeservices.bing.com/edgesvc/turing/captcha/create",{
            "referer":"https://edgeservices.bing.com/edgesvc/chat?udsframed=1&form=SHORUN&clientscopes=chat,noheader,channelstable,&shellsig=709707142d65bbf48ac1671757ee0fd1996e2943&setlang=zh-CN&lightschemeovr=1"
        });
    }
    if(path==="/edgesvc/turing/captcha/verify"){//提交验证码
        return goUrl(request,"https://edgeservices.bing.com/edgesvc/turing/captcha/verify?"+ url.search,{
            "referer":"https://edgeservices.bing.com/edgesvc/chat?udsframed=1&form=SHORUN&clientscopes=chat,noheader,channelstable,&shellsig=709707142d65bbf48ac1671757ee0fd1996e2943&setlang=zh-CN&lightschemeovr=1"
        });
    }

    if (path.startsWith('/msrewards/api/v1/enroll')) { //加入候补
        return goUrl(request, "https://www.bing.com/msrewards/api/v1/enroll" + url.search);
    }
    if (path === '/images/create') { //AI画图
        return goUrl(request, "https://www.bing.com/images/create" + url.search, {
            "referer": "https://www.bing.com/search?q=bingAI"
        });
    }
    if (path.startsWith('/images/create/async/results')) { //请求AI画图图片
        url.hostname = "www.bing.com";
        return goUrl(request, url.toString(), {
            "referer": "https://www.bing.com/images/create?partner=sydney&showselective=1&sude=1&kseed=7000"
        });
    }
    if (path.startsWith('/rp')) { //显示AI画图错误提示图片
        url.hostname = "www.bing.com";
        return goUrl(request, url.toString(), {
            "referer": "https://www.bing.com/search?q=bingAI"
        });
    }
    //用于测试
    if (path.startsWith("/test/")) {
        let a = path.replace("/test/",'');
        return goUrl(request, a);
    }
    //请求服务器配置
    if(path==='/web/resource/config.json'){
        return new Response(serverConfigString,{
            status: 200,
            statusText: 'ok',
            headers: {
                "content-type": "application/x-javascript; charset=utf-8",
                "cache-control":"max-age=14400"
            }
        })
    }
    if (path.startsWith("/web/")||path === "/favicon.ico") { //web请求
        if(!joinStats){
            if(path==="/web/js/other/stats.js"){
                return new Response("console.log(\"未加入统计\");",{
                    status: 200,
                    statusText: 'ok',
                    headers: {
                        "content-type": "application/x-javascript; charset=utf-8",
                        "cache-control":"max-age=14400"
                    }
                })
            }
        }
        let a = `${webPath}${path}`;
        return await goWeb(a);
    }
    return getRedirect('/web/NewBingGoGo.html');
}


async function goWeb(path) {
    let res = await fetch(path);
    let mimeType;
    if (path.endsWith(".html")) {
        mimeType = "text/html; charset=utf-8";
    } else if (path.endsWith(".js")) {
        mimeType = "application/x-javascript; charset=utf-8";
    } else if (path.endsWith(".css")) {
        mimeType = "text/css; charset=utf-8";
    } else if (path.endsWith(".png")) {
        mimeType = "image/png";
    } else if (path.endsWith(".ico")) {
        mimeType = "image/png";
    }
    return new Response(res.body, {
        status: 200,
        statusText: 'ok',
        headers: {
            "content-type": mimeType,
            "cache-control":"max-age=14400"
        }
    });
}


async function goChatHub(request){
    let url = new URL(request.url);
    //构建 fetch 参数
    let fp = {
        method: request.method,
        headers: {
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.57",
            "Host":"sydney.bing.com",
            "Origin":"https://www.bing.com"
        }
    }
    //保留头部信息
    let reqHeaders = request.headers;
    let dropHeaders = ["Accept-Language","Accept-Encoding","Connection","Upgrade"];
    for (let h of dropHeaders) {
        if (reqHeaders.has(h)) {
            fp.headers[h] = reqHeaders.get(h);
        }
    }
    let randomAddress = url.searchParams.get("randomAddress");
    if(randomAddress){
        fp.headers["X-forwarded-for"] = randomAddress;
    }
    let res = await fetch("https://sydney.bing.com/sydney/ChatHub", fp);
    return new Response(res.body, res);
}
//请求某地址
async function goUrl(request, url, addHeaders) {
    //构建 fetch 参数
    let fp = {
        method: request.method,
        headers: {}
    }
    //保留头部信息
    let reqHeaders = request.headers;
    let dropHeaders = ["accept", "accept-language","accept-encoding"];
    for (let h of dropHeaders) {
        if (reqHeaders.has(h)) {
            fp.headers[h] = reqHeaders.get(h);
        }
    }


    fp.headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.57"

    //客户端指定的随机地址
    let randomAddress = reqHeaders.get("randomAddress");
    if(!randomAddress){
        randomAddress = "12.24.144.227";
    }
    //添加X-forwarded-for
    fp.headers['x-forwarded-for'] = randomAddress;

    if (addHeaders) {
        //添加头部信息
        for (let h in addHeaders) {
            fp.headers[h] = addHeaders[h];
        }
    }


    let cookieID = 0;
    if(reqHeaders.get('NewBingGoGoWeb')){//如果是web版
        //添加配置的随机cookie
        if (cookies.length === 0) {
            return getReturnError("没有任何可用cookie，请前在第一行代码cookies变量中添加cookie");
        }
        cookieID = Math.floor(Math.random() * cookies.length);
        let userCookieID = reqHeaders.get("cookieID");
        if (userCookieID) {
            if (userCookieID >= 0 && userCookieID <= cookies.length-1) {
                cookieID = userCookieID;
            } else {
                return getReturnError("cookieID不存在，请刷新页面测试！");
            }
        }
        fp.headers["cookie"] = cookies[cookieID];
    }else {//如果是插件版
        fp.headers["cookie"] = reqHeaders.get('cookie');
    }

    let res = await fetch(url, fp);
    let newRes = new Response(res.body,res);
    newRes.headers.set("cookieID",`${cookieID}`);
    return newRes;
}

//获取用于返回的错误信息
function getReturnError(error) {
    return new Response(JSON.stringify({
        value: 'error',
        message: error
    }), {
        status: 200,
        statusText: 'ok',
        headers: {
            "content-type": "application/json",
            "NewBingGoGoError":'true'
        }
    })
}

//返回重定向
function getRedirect(url) {
    return new Response("正在重定向到" + url, {
        status: 302,
        statusText: 'redirect',
        headers: {
            "content-type": "text/html",
            "location": url
        }
    })
}
