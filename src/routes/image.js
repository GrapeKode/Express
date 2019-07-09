const express = require('express')
const router = express.Router()
const config = require('../config')
const mongoose = require('mongoose')
const cache = require('memory-cache')
const crypto = require('crypto');
const path = require('path');
const passport = require('passport')
mongoose.connect(
  config.mongoURI + '/user', 
  { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }
)
const conn = mongoose.connection
// Files requirements
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')

// Models
const User = require('../models/user')

let gfs

// Setting up the storage element
conn.on('error', err => {
  console.log("MongoDB collection IMAGE error:", err)
})
conn.once('open', () => {
  // Init stream
  console.log('MongoDB collection IMAGE running...')
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('images')
})

const storage = new GridFsStorage({
  url: config.mongoURI + '/user',
  options: {
    useNewUrlParser: true
  },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        // Check if image
        let extImg = ['jpeg', 'jpg', 'png']
        let ext = file.originalname.split('.')
        extImg.forEach(extFile => {
          if( ext[ext.length - 1] === extFile ) {
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'images'
            };
            resolve(fileInfo);
          }
        })
        reject({ status: 404, message: 'Doar imagini sunt acceptate' })
      });
    });
  }
});
const upload = multer({ storage });

//  GET limited images
router.get('/image', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if( req.query.limit ) {
    let filesData = [],
        count = 0;
    gfs.files.find({}).toArray((err, files) => {
      if( err ) return next( err )
      if( !files || files.length === 0 ) return next({ status: 404, message: 'Nu s-au gasit imagini.' })
      for(let file of files) {
        // console.log('----------- File[', count ,'] ---------\n', file)
        if( count === parseInt(req.query.limit) ) break;
        filesData.push({ 
          filename: file.filename,
          contentType: file.contentType,
          uploadDate: file.uploadDate
        })
        count++;
      }
      return res.json( filesData )
    })
  } else {
    return next({ status: 404, message: 'Nu exista informatii suficiente pentru aceasta cerere' })
  }
})

// GET image By User ID
router.get('/image/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if( req.params.id.length !== 24 ) 
    return next({ status: 404, message: `Id-ul ${req.params.id} este incorect` })

  if( req.params.id ) {
    gfs.files.find({}).toArray((err, files) => {
      if( err ) return next( err )
      if( !files || files.length === 0 )
        return next({ status: 404, message: `Imaginea cu id-ul ${req.params.id} n-a fost gasita` })
      for(let file of files) {
        if( file._id == req.params.id ) {
          return res.json(file)
        }
      }
      return next({ status: 404, message: `Imaginea cu id-ul ${req.params.id} n-a fost gasita` })
    })
  } else {
    return next({ status: 404, message: 'Nu exista informatii suficiente pentru aceasta cerere' })
  }
})

// GET image By FileName
router.get('/image/full/:filename', (req, res, next) => {
  if( req.params.filename ) {
    gfs.files.find({}).toArray((err, files) => {
      if( err ) return next( err )
      if( !files || files.length === 0 )
        return next({ status: 404, message: `Imaginea n-a fost gasita` })
      for(let file of files) {
        if( file.filename == req.params.filename ) {
          // Create read stream
          let readstream = gfs.createReadStream({
              filename: file.filename,
              root: "images"
          });
          // Set the proper content type 
          res.set('Content-Type', file.contentType)
          return readstream.pipe(res);
        }
      }
      return next({ status: 404, message: `Imaginea n-a fost gasita` })
    })
  } else {
    return next({ status: 404, message: 'Nu exista informatii suficiente pentru aceasta cerere' })
  }
})

// GET image By ID
router.get('/image/show/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if( req.params.id.length !== 24 ) 
    return next({ status: 404, message: `Id-ul ${req.params.id} este incorect` })

  if( req.params.id ) {
    gfs.files.find({}).toArray((err, files) => {
      if( err ) return next( err )
      if( !files || files.length === 0 )
        return next({ status: 404, message: `Imaginea cu id-ul ${req.params.id} n-a fost gasita` })
      for(let file of files) {
        if( file._id == req.params.id ) {
          // Create read stream
          let readstream = gfs.createReadStream({
              filename: file.filename,
              root: "images"
          });
          // Set the proper content type 
          res.set('Content-Type', file.contentType)
          return readstream.pipe(res);
        }
      }
      return next({ status: 404, message: `Imaginea cu id-ul ${req.params.id} n-a fost gasita` })
    })
  } else {
    return next({ status: 404, message: 'Nu exista informatii suficiente pentru aceasta cerere' })
  }
})

// POST new image
router.post('/image', passport.authenticate('jwt', { session: false }), upload.single('profile'), (req, res, next) => {
  // console.log('REQ_file:', req.file)
  if( req.file === undefined )
    return next({ message: 'No file has been received' })
  
  User.findOneAndUpdate({ _id: req.user._id }, { imageID: req.file.id }, { returnNewDocument: true })
    .exec((err, doc) => {
      if( err) return next( err )
      if( !doc ) 
        return next({ message: `Nu s-a putut face update utilizatorului cu id-ul ${req.params.id}` })
      return res.json({ file: req.file, message: 'Imaginea a fost incarcata cu succes' })
    })
})

// DELETE image By ID
router.delete('/image/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if( req.params.id.length !== 24 ) 
    return next({ status: 404, message: `Id-ul ${req.params.id} este incorect` })

  if( req.params.id ) {
    gfs.exist({ _id: req.params.id, root: 'images' }, async (err, found) => {
      if( err ) return next( err )
      if( !found ) return next({ status: 404, message: `Imaginea cu id-ul ${req.params.id} n-a fost gasita` })
      await gfs.files.find({}).toArray(async (err, files) => {
        if( err ) return next( err )
        for(let file of files) {
          if( file._id == req.params.id ) {
            if( file.metadata == 'default' ) {
              return next({ status: 404, message: 'Nu poti sterge imaginea default' })
            }

            await gfs.remove({ _id: req.params.id, root: 'images' }, async err => {
              if( err ) {
                console.log(err.stack)
                return next( err )
              }
              await gfs.files.find({}).toArray(async (err, files) => {
                if( err ) return next( err )
                if( files[0] ) {
                  const id = files[0]._id
                  // const batch = conn.collection('user').initializeUnorderedBulkOp()
                  // console.log(batch)
                  // batch.find({ imageID: req.params.id }).update({ $set: { imageID: id } })
                  // await batch.execute(async (err, doc) => {
                  //   if( err ) {
                  //     return next( err )
                  //   }
                  //   console.log('nModified:', doc.nModified)
                  // })
                  User.updateMany({ imageID: req.params.id }, { $set: { imageID: id } }, { multi: true }, (err, doc) => {
                    if( err ) return console.log( err.stack )
                    // return res.json(doc)
                  })
                }
              })
              
              return res.json({ message: 'Imaginea a fost stearsa cu succes' })
            })
            break;
          } 
        }
      })
    })
  } else {
    return next({ status: 404, message: 'Nu exista informatii suficiente pentru aceasta cerere' })
  }
})

module.exports = router