import { app } from "./src/server";
import { connect } from "./src/db";
import dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config();

const port = process.env.PORT || 3010 as number;
connect();
app.get("/test", (req: Request, res: Response) => {
res.send("Everything ok!");
});
app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
app.on("error", (error) => {
    console.error(error);
});