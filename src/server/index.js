// 引入 dotenv 和 fetch
const dotenv = require('dotenv');
const fetch = require('node-fetch');

projectData=[];

// API接口 以及 APIKEY
const darkSkyKEY = '8755b770092b4abe92e2f7bf9a4b6ec6';
const darkSkyURL = 'https://api.darksky.net/forecast/';

const pixabayURL = 'https://pixabay.com/api/?key=';
const pixabayKey = '16359303-1ac64d03180c7c9746046ad8f';

const geonamesURL = 'http://api.geonames.org/searchJSON?q=';
const userName = '&username=beata';

// 引入 express 以及 bodyparser 依赖关系
const express = require('express');
const bodyParser = require('body-parser');

// 启动 app 实例
const app = express();

// 中间件 这里使用 use 方法，告诉 body-parser 处理的数据格式，多数情况下都是 json 数据格式
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// 和 body-parser 类似，引入另一个在命令行中安装的包 cors
// cors 能让浏览器和服务器免受安全限制地自由通信
const cors = require('cors');
app.use(cors());


// 使用use将应用指向了一个可以访问的目录
// const path = require('path');
app.use(express.static('./dist'));

// 接口号 3030
const port = 3030;

// 接下来定义一个server的变量。将调用listen方法后的结果赋值给他，该方法有两个参数
// 第一个参数是端口号，它规定了服务器运行的端口，也就是在浏览器中需要键入的端口
// 第二个参数是一个回调函数 listening
app.listen(port, () => console.log(`Server running! Running on localhost: ${port}!`))

app.get('/', function (req, res) {
    res.sendFile('./dist/index.html')
})

// addInfo 简历一个 post 路由接口从客户端拿去数据并获取 API 数据处理保存至服务器
app.post('/addinfo', addInfo)
async function addInfo(req, res){
    // 获取客户端填写的地址信息
    let newInfo = {
        adress:req.body.adress,
        tourtime:req.body.tourtime,
        count:req.body.count,
    }
    // 异步通过 pixabayAPI 获取图片地址
    newInfo.imgadress = await pixabay(newInfo.adress);
    // 异步通过 geonamesAPI 获取地址的经纬度以及所属国家
    let tude = await getAdress(newInfo.adress);
    newInfo.country = tude.geonames[0].countryName;
    newInfo.latitude = tude.geonames[0].lat;
    newInfo.longitude = tude.geonames[0].lng;
    // 异步通过 darkskyAPI 根据上面获得的经纬度获取旅行当日的温度预测
    let Temperature = await darksky(newInfo.latitude, newInfo.longitude);
    newInfo.maxterm = Temperature.daily.data[0].temperatureMax;
    newInfo.minterm = Temperature.daily.data[0].temperatureMin;
    // newInfo.summary = Temperature.daily.data[0].currently.summary;
    // 将数据返回给客户端
    projectData.push(newInfo);
    res.send(projectData);
    console.log(projectData);
}
app.get('/updateui',updateUI);
function updateUI(req,res){
    res.send(projectData)
}

// get temperature form darksky api
// 【输入信息的天气】
const darksky = async (latitude, longitude) =>{
    const resURL = darkSkyURL + darkSkyKEY + '/' + latitude + ',' + longitude;
    console.log(resURL);
    const res = await fetch(resURL);
    let data = {};
    try {
        data = await res.json();
        console.log(data);
        return data;
    } catch(error) {
        console.log("error", error);
    }
    return data;
}
// get image form pixabay api
// 【输入信息的图片】
const pixabay = async (adress) =>{
    const res = await fetch(pixabayURL + pixabayKey + '&q=' + adress +'&image_type=photo');
    let data = {};
    try {
        data = await res.json();
        // console.log(data.hits[0].webformatURL);
        return data.hits[0].webformatURL;
    } catch(error) {
        console.log("error", error);
    }
    return data;
}
// get adress form geonames api 
// 【输入信息的地理位置】
const getAdress = async (adress) => {
    const res = await fetch(geonamesURL + adress + userName + '&maxRows=1')
    let data = {};
    try {
        data = await res.json();
        return data;
    } catch(error) {
        console.log("error", error);
    }
    return data;
}

