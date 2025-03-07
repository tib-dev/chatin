import express from "express";
import router from './routes'
const app = express();

app.use(router);


app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
