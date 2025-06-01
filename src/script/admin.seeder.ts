import bcrypt from "bcryptjs";
import User from "../models/user";
import connectToDatabase from "../lib/mongodb";

async function seed() {
  await connectToDatabase();

  const existingUser = await User.findOne({ phone: 9998803309 });
  if (existingUser) {
    console.log("User already exists");
    return process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("9998803309", 10);

  const newUser = new User({
    phone: 9998803309,
    name: "Admin",
    password: hashedPassword,
    role: "ADMIN",
  });

  await newUser.save();
  console.log("Admin user created");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
