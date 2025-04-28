import express, { Express, urlencoded, json } from "express";
import { errorHandler } from "./errors/errorHandler";
import cors from "cors"
// Routes
import UserRouter from "./routes/users.route";
import AuthentificationRouter from "./routes/authentification.route";
import ProductRouter from "./routes/products.route";
import NotificationRouter from "./routes/notifications.route";
import VerificationRequestRouter from "./routes/verificationRequest.route";

const app: Express = express();

// Middlewares
app.use(json());
app.use(urlencoded({ extended: false }));
app.use("/", express.static(__dirname + "/public"));
app.use(cors({ origin: "*" }));

// Routes
app.use("/", AuthentificationRouter);
app.use("/users", UserRouter);
app.use("/products", ProductRouter);
app.use("/notifs", NotificationRouter);
 app.use("/verificationRequests", VerificationRequestRouter);
app.get("/test", (req, res) => {
  res.json({
    message: "Hello World",
    success: true,
  });
});

// Error handler
app.use(errorHandler);

export default app;
