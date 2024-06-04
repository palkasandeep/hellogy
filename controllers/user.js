//this is for generating the cookies
const { v4: uuidv4 } = require("uuid");
const User = require("../model/user");
const { setUser } = require("../service/auth");
async function handleusersingnup(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });
  // Redirect to the homepage after signing up
  return res.redirect("/");
}

async function handleuserlogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.render("login", {
      error: "Invalid username or password",
    });
  }
  //okavela navi anni coorect aythey session id generate aythadi
  // simple ga ippudu manaku set user anevadu oka token isthadu 
  const token = setUser(user);
  res.cookie("uid", token);
  // Redirect to the homepage after logging in
  return res.redirect("/");
}

module.exports = {
  handleusersingnup,
  handleuserlogin,
};
