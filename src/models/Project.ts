import mongoose, {Schema, Document, Model, Types} from "mongoose";

export interface ProjectObject extends Document {
    owner_id: Types.ObjectId,
    name: string,
    description?: string,
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema: Schema<ProjectObject> = new Schema<ProjectObject>(
    {
        owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true},
        name: { type: String, required: true, trim: true},
        description: { type: String, trim: true}
    },
    { timestamps: true }
);

export const Project: Model<ProjectObject> = mongoose.model<ProjectObject>("Project", ProjectSchema);