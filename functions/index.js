const functions = require('firebase-functions');

const admin = require('firebase-admin'); //firestoreの3party
admin.initializeApp(functions.config().firebase)
// データベースの参照を作成
const fireStore = admin.firestore()

const express = require('express')
const app = express()

//これで静的ファイルを読み込む。。
// const Storage = require('@google-cloud/storage');




// const storage = new Storage();
// const bucket = storage.bucket('test-20180903');
// const file = bucket.file('sample');
// file.download().then(function (data) {
//     res.status(200).json({ 'result': data.toString('utf-8') });
// });


// let projectId, keyFilename, bucketName

// // Firebaseのproject ID
// projectId = 'designer-status'
// keyFilename = 'privateKey.json'

// // OGPが保存されてるCloudStorageのバケット
// bucketName = '<FILL ME>'


const genHtml = (uid, publicUrl) => {
  const html = `<!DOCTYPE html>
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/ fb# prefix属性: http://ogp.me/ns/ prefix属性#">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>デザイナーステータス</title>
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@uchibashi" />
  <meta property="og:url" content="https://designer-status.firebaseapp.com/result/${uid}" />
  <meta property="og:title" content="デザイナーステータス" />
  <meta property="og:description" content="デザイナー力を自己診断する自己満アプリです。" />
  <meta property="og:image" content="${publicUrl}" />
</head>
      <body>      
        <script>
        location.href='/';
      </script>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </body>
    </html>`;
  return html;
}


//関数 非同期対策よいねー
function updateDocument(db) {
  // [START update_document]
  // let usersRef = db.collection('users').doc(uid);
  // Set the 'capital' field of the city
  // let updateSingle = usersRef.update({ flag: false });
  // [END update_document]

  // return Promise.all([updateSingle]).then(val => {
  // console.log('Update: ', val);
  res.send(db)
  // res.render('index.ejs', { uid: uid, url: publicUrl, radarVals: radarVals })
  // });
}


///----expressわからん
app.use(express.static('public'))


app.get('/result/:uid', function (req, res) {
  //ejsに送る値(URLから取得したもの)
  const uid = req.params.uid;
  const bucketName = 'designer-status.appspot.com';
  const filePath = `ogp/${uid}`;
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`;

  let radarVals = "もしかしたらifで問題が";
  //firestoreからejsに送るもの(radarsVals)
  let usersRef = fireStore.collection('users').doc(uid);
  usersRef.get(uid, publicUrl)
    .then(doc => {
      if (!doc.exists) {
        res.send('no such')
      } else {
        //----------ここからフラグ処理
        //ドキュメントオブジェクト(docRef)のフラッグ
        flag = doc.data().flag
        radarVals = doc.data().radarVals
        if (flag == false) {
          res.send(genHtml(uid, publicUrl)); //これはとぶ。
          // res.render('landing.ejs', { uid: uid, url: publicUrl, }) //なぜこれは。。
        } else if (flag == true) {
          //なぜか関数が通らない
          let usersRef = fireStore.collection('users').doc(uid);
          let updateSingle = usersRef.update({ flag: false });
          //ただ、2回目いったらススメませんでたから。、そして値は渡せてないがとおった。
          res.render('index.ejs', { uid: uid, url: publicUrl, radarVals: radarVals })
        }
      }
    })
    .catch(err => {
      // response.send('not found')
      res.send('エラーやな')
    })

  //なるほど、resは非同期だから、処理が早いほうが優先されるのか。
  // res.render('index.ejs', { uid: uid, url: publicUrl, radarVals: radarVals })
});
exports.result = functions.https.onRequest(app)

//--------------------------
// if (flag == false) {
//   res.send(genHtml());
//res.send("フラッグはfalseなので、ススメません。")
// } else if (flag == true) {
//let updateSingle = usersRef.update({ flag: false })
// res.render('index.ejs', { uid: uid, url: publicUrl, radarVals: radarVals })
// }

//裏技？
// const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`