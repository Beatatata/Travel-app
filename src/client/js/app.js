let content = {};
let newData = [];

// 使用 Dom 将用户输入的行程地进行保存
function UserAdress(){
    content.adress = document.getElementById('adress').value;
}
function UserTourtime(){
    content.tourtime = document.getElementById('time').value
}

function performAction(){
    UserAdress();
    UserTourtime();
    countdown();
    postData('/addinfo',{
        adress:content.adress,
        tourtime:content.tourtime,
        count:content.count,
    }).then(function(data){
        updateUI(data)
    })
}

// 异步函数，使用 fetch 发送 get 请求从服务器拿数据。
const updateUI = async () => {
    const request = await fetch('/updateui');
    try{
        const allData = await request.json();
        document.querySelector('#information').style.display = "none";
        const resDisplay = document.querySelector('#result');
        resDisplay.style.display = "block";
        console.log('updateUI', allData);
        addInfo(allData);
        //let clickbutton = document.getElementById('savecard');
        //document.onclick = function(event){
            //window.print()
            // event = event || window.event;
            // var target = event.target || event.srcElement;
            // if(target == clickbutton){
            //     newData.push(allData[allData.length-1]);
            // }
        //}
    } catch(error){
        console.log("error",error)
    }
}



/* Function to POST data */
const postData = async ( url = '', data = {})=>{
    // console.log('postData', data)
    const response = await fetch(url, {
      method: 'POST', 
      credentials: 'same-origin', 
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),       
    });
    try {
    const newData = await response.json();
    // console.log('newdata',newData);
    return newData
    }catch(error) {
    console.log("error", error);
    }
}


// 【倒计时】根据用户填写的出发日期进行计算，出发日期-当前日期=距离出发还有 xx 天
function countdown() {
    let nowtime = new Date();
    let endtime = new Date(content.tourtime);
    let lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
    let day = parseInt(lefttime / 86400);
    content.count = day;
}

// 【添加内容】建立往模块内添加内容的函数式
function addInfo(data) {
    let newdata = data[data.length-1];
    console.log('addInfo',newdata);
    document.querySelector('#bourn').insertAdjacentHTML('afterbegin',`<h3>您的目的地为 ${newdata.country}  ${newdata.adress}</h3>`);
    document.querySelector('#bourn').insertAdjacentHTML('beforeend',`<h3>您的出发日期为  ${newdata.tourtime}</h3>`);
    document.querySelector('#countdown').insertAdjacentHTML('afterbegin',`<h3>距离出发时间还有 ${newdata.count} 天</h3>`);
    document.querySelector('#myImg').insertAdjacentHTML('afterbegin',`<img src=${newdata.imgadress} alt="目的地风景照">`);
    document.querySelector('#localInfo').insertAdjacentHTML('beforeend',`<h4>当日当地天气预测</h4> <h5>最高温度: ${newdata.maxterm}° </h5><h5>最低温度: ${newdata.minterm}° </h5>`)
}

// function saveCard(){
//     console.log('saveCard', newData.length);
//     for (i=0; i<=newData.length; i++){
//         document.querySelector('#result').insertAdjacentHTML('afterend',`<div class="card"><h3>您的目的地为 ${newData[i].country}  ${newData[i].adress}</h3><h3>您的出发日期为  ${newData[i].tourtime}</h3><h3>距离出发时间还有 ${newData[i].count} 天</h3><h4>当日当地天气预测</h4> <h5>最高温度: ${newData[i].maxterm}° </h5><h5>最低温度: ${newData[i].minterm}° </h5><h5>${newData[i].summary}° </h5></div>`)
//     }
// }

// 【优化交互】result 判断，如果没有 get 到内容显示错误，返回 index.js 页面


module.exports = {
    performAction
};
