//import
import Chart from 'chart.js'


//DOM取得
const ctx = document.getElementById("radarChart");
ctx.width = window.innerWidth * 0.1;
ctx.height = window.innerHeight * 0.1;

const elem = document.getElementById('range');

const elems = document.getElementsByClassName('range');

//state設定
const radarVals = [5, 3, 5, 3, 5, 3]

//asset設定
const data = {
    labels: ['Eye', 'Hand', 'Head', 'Mouth', 'Leg', 'Heart'],
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
            fontSize: 8
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
//-----------------うな１０
window.onload = () => {
    //baseに画像を描画
    drawBase();

    //radarChartを描画 ここどうするかよな。
    // drawImage2();

    // 「+」ボタンを押したら合成
    document.getElementById("create").addEventListener("click", () => {
        concatCanvas("fusion", ["base", "radarChart"]);
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
async function concatCanvas(base, asset) {
    const canvas = document.getElementById(base);
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < asset.length; i++) {
        const image1 = await getImagefromCanvas(asset[i]);
        ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
    }
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

//-----スライダー制御関数
window.rangeValue = function (value, name) {
    const id = Number(name);
    radarVals[id] = value
    const myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: options,
    });
}
// elem.addEventListener('input', rangeValue(elem));

//------テスト関数定義



//---------

// elems[0].map((elem) => {
//     target = elems[i].getElementsByTagName('div');
//     bar = elem.getElementsByTagName('input');
//     bar.addEventListener('input', rangeValues(bar, target));
// })


//---------------