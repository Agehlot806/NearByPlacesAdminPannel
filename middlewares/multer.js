// import multer from "multer";
const storage = multer.memoryStorage();
export const singleUpload = multer({ storage }).single("file");
// export const storeUpload = multer({storage}).fields([{name:'storegalleryfiles',maxCount:10},{name:'storephotofiles',maxCount:10}]);
export const categoryUpload = multer({storage}).fields([{name:"categoryimagefile",maxCount:2},{name:"categoryiconfile",maxCount:2}]);

import multer from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";

const s3 = new aws.S3({
    accessKeyId:'AKIAXYDPRGJHZY3UQE2N',
    secretAccessKey:'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',
    region:'ap-south-1',
  });
  

const upload = (bucketName) =>
  multer({
    storage: multerS3({
      s3,
      bucket: bucketName,
      acl: 'public-read',
      contentType:multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `image-${Date.now()}.jpeg`);
      },
    }),
  });
  export const uploadsingle = upload("bookmyplaceimagebucket").single("adminavatar");
  export const eventuplaod = upload("bookmyplaceimagebucket").single("eventimage");
  export const storeupload = upload("bookmyplaceimagebucket").fields([
    { name: 'storephoto', maxCount: 1 },
    { name: 'storegallery', maxCount: 1 },
  ]);

const deleteFromS3 = async (url) => {
  const s3 = new aws.S3({
    accessKeyId:'AKIAXYDPRGJHZY3UQE2N',
    secretAccessKey:'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',
    region:'ap-south-1',
  });

  const key = url.substring(url.lastIndexOf('/') + 1);

  const params = {
    Bucket: 'bookmyplaceimagebucket',
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
    console.log('Image deleted from S3:', key);
  } catch (error) {
    console.log('Failed to delete image from S3:', error);
  }
};

export default deleteFromS3;

