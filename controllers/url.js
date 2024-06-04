const shortid = require("shortid");
const URL = require("../model/url"); // Assuming URL is your Mongoose model

async function handlegenerateNewshorturl(req, res) {
  try {
    const body = req.body;
    // Check if request body exists and contains a 'url' property
    if (!body || !body.url) {
      return res.status(400).json({ error: "URL is required in the request body" });
    }

    // If the request body contains 'url', proceed to generate short URL
    const shortId = shortid(); // Using shortid.generate() to generate unique IDs
    await URL.create({
      shortId: shortId,
      redirectURL: body.url,
      visithistory: [],
      createdby: req.user._id, // Changed to visithistory for consistency
    });
    return res.render("home", {
      id: shortId,
    });
  } catch (error) {
    console.error("Error generating short URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


async function handlegetanylatics(req, res) {
  try {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.json({
      totalclicks: result.visithistory.length,
      analytics: result.visithistory,
    });
  } catch (error) {
    console.error("Error retrieving analytics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  handlegenerateNewshorturl,
  handlegetanylatics,
};
