const functions = require('firebase-functions');

const express = require('express')
const app = express()

//
// const Storage = require('@google-cloud/storage');
// console.log(Storage)

//storageから画像取得
// const firebase = require('../config-firebase');
// const ref = firebase.storage().ref().child(`test.png`);
// const url = ref.getDownloadURL().then((url) => {
//     console.log(url)
//     return url
// });
// //これで一応URLはとれる <- getinitialできん

const genHtml = (name) => {
    const title = Math.floor(Math.random() * 11);
    const html = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@uchibashi" />
        <meta property="og:url" content="https://designer-status.firebaseapp.com/" />
        <meta property="og:title" content="aaa${name}" />
        <meta property="og:description"qq${name}" />
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/designer-status.appspot.com/o/test.png?alt=media&token=7ef6a90d-2922-4162-b9e9-fbbfe9e3db42" />
      </head>
      <body>
        <div>だんよｄｓｆ</div>
        <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false">Tweet</a>
        <script>
        // クローラーにはメタタグを解釈させて、人間は任意のページに飛ばす
        location.href = '../dist/bundle/result.bundle';
      </script>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </body>
    </html>`;
    return html;
}

// app.get('/:name', async (req, res) => {
//     const html = genHtml()
//     res.send(html);
// })
// exports.result = functions.https.onRequest(app)


exports.result = functions.https.onRequest((request, response) => {
    if (request.params[0] !== undefined) {
        let param = request.params[0].slice(1)
        const html = genHtml(param)
        response.status(200).send(html)
    } else {
        response.status(200).send("Hello World")
    }
})

