import mongoose, { Schema, Document, Model } from "mongoose";

export interface TaskObject extends Document {
    title: string,
    description?: string,
    status: string,
    project_id: string,
    owner_id: string,
    assigned_to: string,
    due_date: Date,
    createdAt: Date,
    updatedAt: Date,
}

const TaskSchema: Schema<TaskObject> = new Schema<TaskObject>({
    title: { type: String, required: true},
    description: { type: String, required: true},
    status: { type: String, required: true, default: "Pending", enum: ["Pending", "In progress", "Completed"]},
    project_id: { type: String, required: true},
    owner_id: { type: String, required: true},
    assigned_to: { type: String, required: true},
    due_date: { type: Date, required: true},
}, { timestamps: true })

export const Task: Model<TaskObject> = mongoose.model<TaskObject>("Task", TaskSchema);