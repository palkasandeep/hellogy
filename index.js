const express = require("express");
const path = require("path");
const cookiesparser = require("cookie-parser");
const { connectToMongodb } = require("./connect");
const urlroute = require("./routes/url");
const { restrictToloogedinuseronly, checkauth } = require("./middleware/auth");
const staticroutes = require("./routes/staticroutes");
const userRoute = require("./routes//user");
const URL = require("./model/url");
const app = express();
const PORT = 8002;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(cookiesparser());
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Routes
app.use("/url", restrictToloogedinuseronly, urlroute); // URL routes
app.use("/user", userRoute);
app.use("/", checkauth, staticroutes); // Static file routes

// Server-side rendering
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visithistory: { timestamp: Date.now() } } },
      { new: true } // Return the modified document instead of the original one
    );

    if (!entry || !entry.redirectURL) {
      // If entry is null or redirectURL property is not defined
      return res.status(404).send("URL not found");
    }

    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Start the server
connectToMongodb("mongodb://127.0.0.1:27017/myurl-1")
  .then(() => {
    console.log("mongo db connected");
    app.listen(PORT, () => console.log(`Server started at port:${PORT}`));
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
