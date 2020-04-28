const functions = require('firebase-functions');

const express = require('express')
const app = express()

const genHtml = () => {
    const title = Math.floor(Math.random() * 11);
    const html = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body>
        <div>飛んだ</div>
      </body>
    </html>`;
    return html;
}

app.get('/:id', async (req, res) => {
    const html = genHtml()
    res.send(html);
})
exports.s = functions.https.onRequest(app)

//試せること。
//s/をリンクで行ってみる。headとogpの部分をランダムにしてみる。ブラウザとvalidatorで確認する・





// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
