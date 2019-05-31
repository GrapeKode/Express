// const mongoose = require('mongoose')
// const config = require('../config')
// const fs = require('fs')
// const test = require('assert')
// const crypto = require('crypto')
// const path = requite('path')
// const db = mongoose.createConnection(
//   config.mongoURI + '/imageTest', 
//   { useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true }
// )
// const Schema = mongoose.Schema

// const imageSchema = new Schema({
//   image: {
//     type: Buffer
//   },
//   filename: {
//     type: String
//   },
//   size: {
//     type: Number
//   },
//   uploadDate: {
//     type: Date
//   },
//   contentType: {
//     type: String
//   }
// })

// const Image = mongoose.model('imageTest', imageSchema)

// let imgPath = './public/img/profile-img.jpg'

// db.on('connected', async (err) => {
//   if( err ) return console.log( err.stack )
//   Image.remove(err => {
//     if( err ) return console.log( err.stack )
//     crypto.randomBytes(16, (err, buf) => {
//       if( err ) return console.log( err.stack )
//       let img = new Image
//       img.image = fs.readFileSync(imgPath)
//       img.contentType = 'image/jpg'
//       img.filename = buf.toString('hex') + path.extname('default.jpg')
//       img.size = 
//       img.uploadDate = Date.now()
//     })
//   })
// })

// module.exports = Image

// // Deleting a file from GridFS

// var MongoClient = require('mongodb').MongoClient,
//   test = require('assert');
// MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
//   var bucket = new GridFSBucket(db, { bucketName: 'gridfsdownload' });
//   var CHUNKS_COLL = 'gridfsdownload.chunks';
//   var FILES_COLL = 'gridfsdownload.files';
//   var readStream = fs.createReadStream('./LICENSE');

//   var uploadStream = bucket.openUploadStream('test.dat');

//   var license = fs.readFileSync('./LICENSE');
//   var id = uploadStream.id;

//   uploadStream.once('finish', function() {
//     bucket.delete(id, function(error) {
//       test.equal(error, null);

//       var chunksQuery = db.collection(CHUNKS_COLL).find({ files_id: id });
//       chunksQuery.toArray(function(error, docs) {
//         test.equal(error, null);
//         test.equal(docs.length, 0);

//         var filesQuery = db.collection(FILES_COLL).find({ _id: id });
//         filesQuery.toArray(function(error, docs) {
//           test.equal(error, null);
//           test.equal(docs.length, 0);

//         });
//       });
//     });
//   });

//   readStream.pipe(uploadStream);
// });