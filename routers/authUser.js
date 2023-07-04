const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user");
const { signupValidator } = require("../utils/authValidation");
const { loginValidation } = require("../utils/authValidation");
const createToken = require("../utils/createToken");
const { sendOTP } = require("../utils/sendEmail");

router.post("/register", signupValidator, async (req, res) => {
  const {
    userName,
    email,
    phone,
    password,
    address,
    graduationYear,
    dateOfBirth,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName,
      email,
      phone,
      password: hashedPassword,
      address,
      dateOfBirth,
      graduationYear,
    });

    const token = createToken(newUser._id);
    res.status(201).json({ data: newUser, token });
  } catch (error) {
    console.error("Error creating user:", error); // Log the error details
    res.status(500).json({ message: "Error creating user", error });
  }
});

router.post("/login", loginValidation, async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!(email && password)) {
    return res.status(400).send("All input is required");
  }
  if (!user) {
    return res.status(400).send("Invalid email!");
  }

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.send("Incorrect email or password").status(401);
  }
  // 3) generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});

router.get("/protected", (req, res) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const tokenWithoutBearer = token.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY);

    res.status(200).json({ message: "Authorized", user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/forgetPassword", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ msg: "user Required" });

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
  // Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your Alumni Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n 😍💗`;
  try {
    await sendOTP({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    res.send("There is an error in sending email");
    console.log(err);
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

router.post("/verifyPassResetCode", async (req, res) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.send("Reset code invalid or expired");
  }
  //  Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});

router.post("/resetPassword", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ msg: "user Required" });

  if (!user.passwordResetVerified) {
    return res.send("Reset code not verified").status(400);
  }

  const newpassword= await bcrypt.hash(req.body.newPassword, 10)
  user.password = newpassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
module.exports = router;
