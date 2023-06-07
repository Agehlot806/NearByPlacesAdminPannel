import express from "express";
import { config} from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
config({
    path:"./config/config.env"
})

//using middlewares
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

app.use("/api/v1", admin);
app.use("/api/v1",stores);
app.use("/api/v1",offer);
app.use("/api/v1",event);
app.use("/api/v1",messages);
app.use("/api/v1",table);
app.use("/api/v1",csvData);
app.use("/api/v1",payment);
app.use("/api/v1",application);
app.use("/api/v1",booking);
app.use("/api/v1",reservation);




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
