import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: { type: String, required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  file: { type: String },
  status: {
    type: String,
    enum: ["accepted", "rejected", "awaiting"],
    default: "awaiting",
  },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

export { Assignment };
