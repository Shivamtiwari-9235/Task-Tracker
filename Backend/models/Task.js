const mongoose = require('mongoose');

const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];
const VALID_PRIORITIES = ['High', 'Medium', 'Low'];

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [120, 'Title must be at most 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [1, 'Description must be at least 1 character'],
      maxlength: [2000, 'Description must be at most 2000 characters']
    },
    status: {
      type: String,
      enum: VALID_STATUSES,
      default: 'Pending',
      required: true
    },
    priority: {
      type: String,
      enum: VALID_PRIORITIES,
      default: 'Medium',
      required: true
    },
    dueDate: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

// Helpful indexes for filters/search.
TaskSchema.index({ status: 1, priority: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ createdAt: -1 });
TaskSchema.index(
  { title: 'text', description: 'text' },
  { name: 'task_text_search', default_language: 'english' }
);

TaskSchema.statics.VALID_STATUSES = VALID_STATUSES;
TaskSchema.statics.VALID_PRIORITIES = VALID_PRIORITIES;

module.exports = mongoose.model('Task', TaskSchema);

