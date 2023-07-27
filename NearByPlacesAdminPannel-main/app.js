import express from "express";
import { config} from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { ApiConfig } from "./models/ApiConfigModel.js";
const app = express();
config({
    path:"./config/config.env"
})

//using middlewares...
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());


// app.use(bodyParser({
//     urlencoded:true
// }))
app.use(
	cors({
		origin:["https://demo7.progressiveaidata.in","http://localhost:3000"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.get('/favicon.ico', (req, res) => res.status(204));

//importing routes
import admin from "./routes/userRoutes.js";
import stores from "./routes/newStoreRoutes.js";
import offer from "./routes/offerRoutes.js";
import event from "./routes/eventRoutes.js"
import messages from "./routes/messgesRoutes.js"
import table from "./routes/tableRoutes.js"
import csvData from "./routes/csvdataRoutes.js"
import payment from "./routes/paymentRoutes.js"
import application from "./routes/applicationRoutes.js"
import booking from "./routes/bookingRoutes.js";
import reservation from "./routes/reservationRoutes.js";

let baseurl = "/api/v1";

app.use(baseurl, admin);
app.use(baseurl,stores);
app.use(baseurl,offer);
app.use(baseurl,event);
app.use(baseurl,messages);
app.use(baseurl,table);
app.use(baseurl,csvData);
app.use(baseurl,payment);
app.use(baseurl,application);
app.use(baseurl,booking);
app.use(baseurl,reservation);

// let baseurldata = 
// ApiConfig.findOne({}, (err, doc) => {
//   if (err) {
//     console.error("Error retrieving base URL from the database:", err);
//   } else if (doc) {
//     baseUrl = doc.baseUrl;
//     console.log("Base URL retrieved from the database:", baseUrl);
//   }
// });

// app.get('/base-url', (req, res) => {
//   res.json({ baseurl });
// });

// // Endpoint to change the base URL
// app.put('/base-url-update', (req, res) => {
//   const { newBaseUrl } = req.body;
//   baseurl = newBaseUrl;
//   res.json({ message: 'Base URL updated successfully.' });
// });



app.get("/api/v1/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);




export default app;
app.get("/", (req, res) =>
  res.send(
    `<h1>Site is Working. click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
  )
);


app.use(ErrorMiddleware);
