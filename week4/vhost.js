/**
 * Created by caoyangkaka on 4/11/15.
 */
//1.问题一： 启动了app之后router不能换, 问题二：如何向老师那样造一个url指向localhost
//解答： use在初始化时就会使用，所以subApp(req, res, next);可以避免这个情况，当然这个是在看了答案之后得到的，嘿嘿
//原来*.local.ucdok.com这个泛域名解析自动指向localhost, 腻害！
function vhost (host, subApp) {
    return function(req, res, next) {
        var getHost = stripHostPort(req.headers.host);
        if(host === getHost) {
            //console.log('Host:' + host + ', getHost:' + getHost);
            //app.use(subApp);
            subApp(req, res, next);
        }
        next();
    }
}

// get the host address only
function stripHostPort (host) {
    if (host) host = host.split(':')[0];
    return host;
}
module.exports = vhost;