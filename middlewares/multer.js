import multer from "multer";
const storage = multer.memoryStorage();
export const singleUpload = multer({ storage }).single("file");
export const storeUpload = multer({storage}).fields([{name:'storegalleryfiles',maxCount:10},{name:'storephotofiles',maxCount:10}]);



