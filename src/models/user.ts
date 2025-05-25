import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  phone: number;
  password?: String;
  role: string;
  id: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["ADMIN", "SALESMAN"],
    default: "SALESMAN",
    required: true,
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
