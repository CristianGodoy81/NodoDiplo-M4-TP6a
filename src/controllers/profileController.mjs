import Profile from "../models/Profile.mjs";

// CREATE PROFILE
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, isKid } = req.body;

    const newProfile = new Profile({
      name,
      isKid,
      user: userId
    });

    await newProfile.save();

    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ message: "Error creating profile", error });
  }
};

// GET ALL PROFILES (del usuario logueado)
export const getProfiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const profiles = await Profile.find({ user: userId });

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profiles", error });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const profile = await Profile.findOne({ _id: id, user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.name = req.body.name ?? profile.name;
    profile.isKid = req.body.isKid ?? profile.isKid;

    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

// DELETE PROFILE
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Profile.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ message: "Profile deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error });
  }
};