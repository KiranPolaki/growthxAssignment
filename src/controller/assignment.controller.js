const MESSAGES = {
  SERVER_ERROR: "Internale server error!",
  SUCCESS: (role) => `Sucessfully registered as ${role}`,
};

import { isAdmin } from "../middlewares/auth.js";
import { Assignment } from "../models/assignment.model.js";
import { User } from "../models/user.model.js";
import zod, { isValid } from "zod";

const titleSchema = zod.string().min(1, "Title ca'nt be empty");
const descriptionSchema = zod.string().min(1, "Description can't be empty");
const adminSchema = zod.string().min(1, "admin name can't be empty");

const ValidateInputs = async (title, description, admin, res) => {
  const titleCheck = titleSchema.safeParse(title);
  const descriptionCheck = descriptionSchema.safeParse(description);
  const adminCheck = adminSchema.safeParse(admin);
  if (!titleCheck.success || !descriptionCheck.success || !adminCheck.success) {
    return res.json({
      title: titleCheck.error,
      description: descriptionCheck.error,
      admin: adminCheck.error,
    });
  } else if (!titleCheck.success) {
    return res.json({ error: titleCheck.error });
  } else if (!descriptionCheck.success) {
    return res.json({ error: descriptionCheck.error });
  } else if (!adminCheck.success) {
    return res.json({ error: adminCheck.error });
  }
};

const isValidAdmin = async (admin) => {
  try {
    console.log("admin");
    const findAdmin = await User.findOne({
      $and: [{ username: admin }, { role: "admin" }],
    });
    return { adminId: findAdmin._id, status: findAdmin !== null };
  } catch (error) {
    console.error("Error finding admin", error);
    return res.status(500).json(error.message || MESSAGES.SERVER_ERROR);
  }
};

const AcceptOrRejectAssignment = async (req, res, status) => {
  const assignmentId = req.params.id;
  const assignment = await Assignment.findByIdAndUpdate(
    assignmentId,
    {
      status: status,
    },
    { new: true }
  );
  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }
  res
    .status(200)
    .json({ message: `Assignment ${status} successfully`, assignment });
};

const getAssignmentsAssignedToAdmin = async (adminId, res) => {
  try {
    const assignments = await Assignment.find({ assignedTo: adminId });

    return assignments;
  } catch (error) {
    console.log("Error getting the assignments", error);
    return res.status(500).json(`Its on us! ${MESSAGES.SERVER_ERROR}`);
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    const adminsList = admins.map((admin) => admin.username);
    return res
      .status(200)
      .json({ message: "Sucessful getting all the admins!", adminsList });
  } catch (error) {}
};

export const uploadAssignment = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { title, description, admin } = req.body;

    ValidateInputs(title, description, admin, res);

    const isadmin = await isValidAdmin(admin);
    if (!isadmin.status) {
      return res
        .status(400)
        .json({ message: "Admin name is incorrect or not a admin!" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      assignedTo: isadmin.adminId,
      submittedBy: userId,
    });

    return res.status(200).json({
      message: "Assignment uploaded successfully",
      assignmentId: assignment._id,
    });
  } catch (error) {
    console.error("Error uploading the assignment!", error);
  }
};

export const getAssignments = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.json({
        message:
          "You are not an admin and dont have sufficent permissions to access this route!",
      });
    }
    const adminId = req.user?.userId;
    const assignments = await getAssignmentsAssignedToAdmin(adminId, res);
    return res.json({ assignments });
  } catch (error) {
    console.error("Error getting the Assignments", error);
    return res.status(500).json({
      message: `Error getting the assignments! ${MESSAGES.SERVER_ERROR}! please try again`,
    });
  }
};

export const acceptAssignment = async (req, res) => {
  try {
    AcceptOrRejectAssignment(req, res, "accepted");
  } catch (error) {
    console.error("Error accepting assignment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const rejectAssignment = async (req, res) => {
  try {
    AcceptOrRejectAssignment(req, res, "rejected");
  } catch (error) {
    console.error("Error rejecting assignment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
