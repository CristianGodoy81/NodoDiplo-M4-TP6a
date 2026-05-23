import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    isKid: {
      type: Boolean,
      default: false,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;