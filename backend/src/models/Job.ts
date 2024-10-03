import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
    title: string;
    description: string;
    company: string;
    location: {
        type: {
            type: String,
            enum: ['Point'],
        };
        coordinates: [number];
    };
}

const jobSchema = new Schema<IJob>({
    title: { type: String, required: true, text: true },
    description: { type: String, required: true, text: true },
    company: { type: String, required: true },
    location: {
        type: { type: String, required: true, enum: ['Point'] },
        coordinates: { type: [Number], required: true },
    },
});

//cria indices de texto e geoespacial
jobSchema.index({ title: 'text', description: 'text', location: '2dsphere' });

export default mongoose.model<IJob>('Job', jobSchema);