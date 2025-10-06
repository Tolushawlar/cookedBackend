import express from 'express';
import mongoose from 'mongoose';
import { IdeaModel, VoteModel, CreateIdeaRequest } from '../models/Idea';

const router = express.Router();

// GET /api/ideas - Get all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await IdeaModel.find().sort({ votes: -1, createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

// Middleware to check database connection
const checkDbConnection = (req: any, res: any, next: any) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  next();
};

// POST /api/ideas - Create new idea
router.post('/', checkDbConnection, async (req, res) => {
  try {
    console.log('Received create idea request:', req.body);
    const { title, description, tag }: CreateIdeaRequest = req.body;

    if (!title || !description || !tag) {
      console.log('Missing required fields:', { title, description, tag });
      return res.status(400).json({ error: 'Title, description, and tag are required' });
    }

    if (description.length > 140) {
      return res.status(400).json({ error: 'Description must be 140 characters or less' });
    }

    const idea = new IdeaModel({
      title,
      description,
      tag,
      votes: 0,
      comments: 0
    });

    console.log('Saving idea to database...');
    const savedIdea = await idea.save();
    console.log('Idea saved successfully:', savedIdea._id);
    res.status(201).json(savedIdea);
  } catch (error) {
    console.error('Error creating idea:', error);
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

// POST /api/ideas/:id/vote - Vote on an idea
router.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;

    if (!voteType || !['up', 'down'].includes(voteType)) {
      return res.status(400).json({ error: 'Valid voteType (up/down) is required' });
    }

    const idea = await IdeaModel.findById(id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Record the vote
    const vote = new VoteModel({
      idea_id: id,
      vote_type: voteType
    });

    await vote.save();

    // Update vote count
    const voteChange = voteType === 'up' ? 1 : -1;
    idea.votes += voteChange;
    await idea.save();

    res.json({ success: true, message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error processing vote:', error);
    res.status(500).json({ error: 'Failed to process vote' });
  }
});

// GET /api/ideas/:id - Get specific idea
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idea = await IdeaModel.findById(id);

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    res.json(idea);
  } catch (error) {
    console.error('Error fetching idea:', error);
    res.status(500).json({ error: 'Failed to fetch idea' });
  }
});

export default router;