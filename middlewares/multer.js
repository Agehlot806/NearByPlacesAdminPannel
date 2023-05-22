import multer from "multer";
const storage = multer.memoryStorage();
export const singleUpload = multer({ storage }).single("file");
export const storeUpload = multer({storage}).fields([{name:'storegalleryfiles',maxCount:10},{name:'storephotofiles',maxCount:10}]);
export const categoryUpload = multer({storage}).fields([{name:"categoryimagefile",maxCount:2},{name:"categoryiconfile",maxCount:2}]);



//aws s3 info 
// import AWS from 'aws-sdk';
// import multerS3 from 'multer-s3';
// import path from'path';
// AWS.config.update({
//     accessKeyId:process.env.accessKeyId,
//     secretAccessKey:process.env.secretAccessKey
// });

// const s3 = new AWS.S3();
// export const uploadd = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket:'bookmyplacebucket',
//       acl: 'public-read', // Optional: Set the access control policy for the uploaded file
//       contentType: multerS3.AUTO_CONTENT_TYPE,
//       key: function (req, file, cb) {
//         cb(null, Date.now().toString() + path.extname(file.originalname));
//       }
//     })
//   });
