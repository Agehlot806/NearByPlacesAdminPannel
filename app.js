import express from "express";
import { config} from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
import cors from "cors";
const app = express();
config({
    path:"./config/config.env"
})

//using middlewares
app.use(express.json());
// app.use(bodyParser({
//     urlencoded:true
// }))


app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

//importing routes
import admin from "./routes/adminRoutes.js";
import stores from "./routes/newStoreRoutes.js"
app.use("/api/v1", admin);
app.use("/api/v1",stores)



export default app;
app.use(ErrorMiddleware);
