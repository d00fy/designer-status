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


// const genHtml = (name, url) => {
//   const title = Math.floor(Math.random() * 11);
//   const html = `<!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="utf-8">
//         <title>デザイナーステータス${title}</title>
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:site" content="@uchibashi" />
//         <meta property="og:url" content="https://designer-status.firebaseapp.com/" />
//         <meta property="og:title" content="${name}の結果" />
//         <meta property="og:description"${name}の結果" />
//         <meta property="og:image" content=${url} />
//       </head>
//       <body>
//         <div>診断結果</div>
//         <p><img src=${url} alt="サンプル画像"></p>
//         <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false">Tweet</a>
//         <script>
//         location.href='${test}';
//       </script>
// <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
//       </body>
//     </html>`;
//   return html;
// }

// exports.result = functions.https.onRequest((request, response) => {
//     if (request.params[0] !== undefined) {
//         let param = request.params[0].slice(1)
//         const paramName = param.substring(7);
//         // const path = param.substring(7)
//         const bucketName = 'designer-status.appspot.com';
//         const filePath = `ogp/${paramName}`;
//         const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`;

//         const html = genHtml(paramName, publicUrl)
//         response.status(200).send(html)
//     } else {
//         response.status(200).send("Hello World")
//     }
// })



///----expressわからん
app.use(express.static('public'))


app.get('/result/:uid', function (req, res) {
  const uid = req.params.uid;
  const bucketName = 'designer-status.appspot.com';
  const filePath = `ogp/${uid}`;
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`;

  //ここでfirestoreから、ドキュメントを取得、、uidを使って？！
  let radarVals = "test";

  const usersRef = fireStore.collection('users').doc(uid);
  console.log(usersRef);
  usersRef.get()
    .then(doc => {
      if (!doc.exists) {
        //  response.send('No such document!')
        radarVals = "no such"
      } else {
        radarVals = doc.data()
        res.render('index.ejs', { uid: uid, url: publicUrl, radarVals: doc.data() })
      }
    })
    .catch(err => {
      // response.send('not found')
      radarVals = "no funcd"
    })

  // res.send(radarVals)

  // res.render('index.ejs', { uid: uid, url: publicUrl, radarVals: radarVals })
});
exports.result = functions.https.onRequest(app)

//--------------------------

//裏技？
// const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`