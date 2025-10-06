import mongoose, { Schema, Document } from 'mongoose';

export interface Idea {
  id: string;
  title: string;
  description: string;
  tag: string;
  votes: number;
  comments: number;
  created_at: string;
  blockchain_hash?: string;
  block_number?: number;
}

export interface CreateIdeaRequest {
  title: string;
  description: string;
  tag: string;
}

export interface Vote {
  id: string;
  idea_id: string;
  vote_type: 'up' | 'down';
  user_id?: string;
  created_at: string;
}

export interface IIdeaDocument extends Document {
  title: string;
  description: string;
  tag: string;
  votes: number;
  comments: number;
  blockchain_hash?: string;
  block_number?: number;
}

export interface IVoteDocument extends Document {
  idea_id: mongoose.Types.ObjectId;
  vote_type: 'up' | 'down';
  user_id?: string;
}

const IdeaSchema = new Schema<IIdeaDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, required: true },
  votes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  blockchain_hash: { type: String },
  block_number: { type: Number }
}, {
  timestamps: true
});

const VoteSchema = new Schema<IVoteDocument>({
  idea_id: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
  vote_type: { type: String, enum: ['up', 'down'], required: true },
  user_id: { type: String }
}, {
  timestamps: true
});

export const IdeaModel = mongoose.model<IIdeaDocument>('Idea', IdeaSchema);
export const VoteModel = mongoose.model<IVoteDocument>('Vote', VoteSchema);