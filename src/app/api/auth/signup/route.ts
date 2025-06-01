import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
  const { name, email, password, confirmPassword } = await request.json();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[6-9]\d{9}$/;
    return emailRegex.test(email);
  };
  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json({ message: " All fields are required" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Invalid Phone format" }, { status: 400 });
  }
  if (confirmPassword !== password) {
    return NextResponse.json({ message: "Password do not match" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 character long" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ phone: email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exist" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      phone: email,
      name,
      password: hashedPassword,
      role: "SALESMAN",
    });
    await newUser.save();
    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
