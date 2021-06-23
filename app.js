import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import wechatRouter from "./routes/wechatRouter.js";
dotenv.config();

const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.text());
app.use(express.raw());

app.use((err, req, res, next) => {
  if (err) {
    if (err.type === "entity.parse.failed") {
      res.status(400).send({ error: true, msg: err.type, body: err.body });
    }
    console.error(err);
  } else {
    next();
  }
});

app.use("/wechat", wechatRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Running on PORT ${process.env.PORT}`);
});
