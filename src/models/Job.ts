import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
    title: string;
    description: string;
    company: string;
    location: {
        type: {
            type: String;
            enum: ['Point'];
        };
        coordinates: [number];
    };
}

const jobSchema = new Schema<IJob>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: {
        type: { type: String, required: true, enum: ['Point'] },
        coordinates: { type: [Number], required: true },
    },
});

jobSchema.index({ location: '2dsphere' });

export default mongoose.model<IJob>('Job', jobSchema);

