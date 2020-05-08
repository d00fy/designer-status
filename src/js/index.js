//import
import Chart from 'chart.js'
// //yarn add firebase & config.js をinitするのみ。
// import firebase from "firebase";
// import { firebaseConfig } from "../../config-firebase";
// firebase.initializeApp(firebaseConfig);
// console.log(firebase.storage())

import firebase from '../../config-firebase';
const db = firebase.firestore();


//DOM取得
const loader = document.getElementById('loader');
const contents = document.getElementById('all-content');
const ctx = document.getElementById("radarChart");
// ctx.width = window.innerWidth * 0.1;
// ctx.height = window.innerHeight * 0.1;

const elem = document.getElementById('range');

const elems = document.getElementsByClassName('range');

const scroll = document.getElementById('scroll');

//state設定
const radarVals = [4, 4, 4, 4, 4, 4];
let name = "";
let uid;
let score = 40.0;

//asset設定
const data = {
    labels: ['目', '手', '頭', '口', '足', '心'],
    datasets: [
        {
            label: 'My Second dataset',
            //pc版(5)と帰る必要あり(iphone10標準)
            borderWidth: 2,
            pointRadius: 0,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: radarVals,
        }
    ]
}

const options = {// maintainAspectRatio: false,
    legend: {
        display: false
    },
    scale: {
        gridLines: {
            color: ['#f5eec1']
        },
        pointLabels: {
            //pc版(16)と帰る必要あり(iphone10標準)
            fontSize: 10
        },
        ticks: {
            beginAtZero: true,
            stepSize: 2,
            max: 10,
            display: false
        },
        gridLines: {         // 補助線（目盛の線）
            display: true,
            color: "#E6E6E7"
        }
    },
    plugins: {
        datalabels: {
            display: false
        }
    }
}
//-----------------うなcanvas
window.onload = () => {
    //baseに画像を描画
    drawBase();

    //radarChartを描画 ここどうするかよな。
    // drawImage2();

    //ボタンを押したら合成、そしてstorageへUP..そして、firestoreにradarvalをいれる。/scoreも?
    document.getElementById("create").addEventListener("click", () => {
        loader.classList.remove("hiddenChange")
        contents.classList.add("hiddenChange")
        clientStore();

        // concatCanvas("fusion", ["radarChart", "base"])
        //     .then(value => {
        //         console.log(value); // => resolve!!
        //         uploadStorage(value);
        //     });
    });

};
//画像描画関数
function drawBase() {
    const img = new Image();
    img.src = "./img/base.png";
    img.onload = () => {
        const canvas = document.getElementById("base");
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

//合成関数
async function concatCanvas(fusion, asset) {
    const canvas = document.getElementById(fusion);
    const ctx = canvas.getContext("2d");
    //--スコア
    ctx.font = "bold 24px Hiragino Kaku Gothic ProN";
    ctx.fillStyle = "#636363";
    ctx.fillText(score, 450, 41)
    //--スコア

    let dx = 0;
    for (let i = 0; i < asset.length; i++) {
        const image1 = await getImagefromCanvas(asset[i]);
        ctx.drawImage(image1, dx, 0, canvas.width, canvas.height);
        dx = dx - 100;
    }
    //onloadとか上でしなくて大丈夫かな?
    const url = ctx.canvas.toDataURL();
    return url;
}

//canvas要素(画像src)取得関数
function getImagefromCanvas(id) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const ctx = document.getElementById(id).getContext("2d");
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(e);
        image.src = ctx.canvas.toDataURL();
    });
}

//-----テキスト制御関数
window.getName = function (value) {
    console.log("Your name is " + value);
    name = value;
    return name;
}

//-----スライダー制御関数
window.rangeValue = function (value, name) {
    const id = Number(name);
    radarVals[id] = Number(value);
    console.log(radarVals)
    score = colscore(radarVals);
    console.log(score)
    const myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: options,
    });
}

//レーダー描画
// document.getElementById("show").onclick = function () {
//     const myRadarChart = new Chart(ctx, {
//         type: 'radar',
//         data: data,
//         options: options,
//     });
// };

//-------スコア関数
function colscore(array) {
    let sum = array.reduce(function (accumulator, currentValue, ) {
        return accumulator + currentValue
    })
    sum = sum * 10 / 6
    let result = sum.toFixed(1);
    if (result == 0) {
        result = "測定不能"
    } else if (result == 100.0) {
        result = "神の領域"
    }
    return result;
}

// //firestore関数
async function clientStore() {
    //つまりこいつは非同期処理で、取得が遅い。awaitかthenチェーンする必要あり。
    uid = await db.collection('users').get().then(snap => {
        // will return the collection size
        return snap.size
    });

    // toString(uid)　なぜかきかない
    console.log(uid += "") //きく
    //usersコレクション作成&代入
    const usersRef = db.collection('users');
    usersRef.doc(uid).set({
        radarVals: radarVals,
        flag: true
    })
        .then(function (docRef) {
            console.log("then等立つ");
            concatCanvas("fusion", ["base", "radarChart"])
                .then(value => {
                    console.log(value); // => resolve!!
                    uploadStorage(value);
                });
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
    return "uid取得できた"
}
// let uid;
// //つまりこいつは非同期処理で、取得が遅い。awaitかthenチェーンする必要あり。
// await db.collection('users').get().then(snap => {
// //     uid = snap.size // will return the collection size
// //     return uid
// // });
// console.log(uid)


//ひとまず、、つまり上記の理屈が正しい場合、.thenの中に、firebaseに関する関数を書けばよい。
async function uploadStorage(url) {
    // let uid;
    // //つまりこいつは非同期処理で、取得が遅い。awaitかthenチェーンする必要あり。
    // await db.collection('users').get().then(snap => {
    //     uid = snap.size // will return the collection size
    //     return uid
    // });
    // console.log(uid)

    const sRef = firebase.storage().ref()
    const fileRef = sRef.child(`ogp/${uid}`)
    url = url.substring(22);
    //多分ここら変が非同期処理。。
    fileRef.putString(url, "base64").then(function (snapshot) {
        fileRef.getDownloadURL().then(function (url) {
            console.log("ok");
        }).then(() => {
            window.location.href = `https://designer-status.firebaseapp.com/result/${uid}`;
        })
    });

}

//---------------