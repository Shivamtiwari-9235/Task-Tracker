const { validationResult } = require('express-validator');
const Task = require('../models/Task');

function parsePagination(query) {
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.max(Math.min(parseInt(query.limit || '10', 10), 50), 1);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function buildSort(sortBy, sortDir) {
  const dir = sortDir === 'asc' ? 1 : -1;
  switch (sortBy) {
    case 'dueDate':
      return { dueDate: dir };
    case 'createdAt':
      return { createdAt: dir };
    case 'priority':
      // Map to numeric ranking for consistent sort.
      // High > Medium > Low
      return { priorityRank: dir };
    default:
      return { createdAt: -1 };
  }
}

function priorityRankAggregation() {
  // High: 3, Medium: 2, Low: 1
  return {
    $addFields: {
      priorityRank: {
        $switch: {
          branches: [
            { case: { $eq: ['$priority', 'High'] }, then: 3 },
            { case: { $eq: ['$priority', 'Medium'] }, then: 2 }
          ],
          default: 1
        }
      }
    }
  };
}

exports.createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate || undefined
    });

    return res.status(201).json(task);
  } catch (err) {
    return next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { page, limit, skip } = parsePagination(req.query);

    const match = {};
    if (req.query.status) match.status = req.query.status;
    if (req.query.priority) match.priority = req.query.priority;

    const search = (req.query.search || '').trim();
    const sortBy = req.query.sortBy || 'createdAt';
    const sortDir = req.query.sortDir || 'desc';

    const pipeline = [];
    if (Object.keys(match).length) {
      pipeline.push({ $match: match });
    }

    if (search) {
      pipeline.push({
        $match: {
          $text: { $search: search }
        }
      });
    }

    pipeline.push(priorityRankAggregation());

    // stable sort even when dueDate is null
    pipeline.push({ $sort: { ...buildSort(sortBy, sortDir), _id: -1 } });

    pipeline.push({
      $facet: {
        items: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              priorityRank: 0
            }
          }
        ],
        totalCount: [
          { $count: 'count' }
        ]
      }
    });

    const result = await Task.aggregate(pipeline);
    const facet = result[0] || { items: [], totalCount: [] };

    const totalCount = facet.totalCount[0]?.count || 0;
    const tasks = facet.items;

    return res.status(200).json({
      items: tasks,
      page,
      limit,
      totalCount,
      totalPages: Math.max(Math.ceil(totalCount / limit), 1)
    });
  } catch (err) {
    return next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Allow updates: title/description/status/priority/dueDate.
    const update = {};
    if (req.body.title !== undefined) update.title = req.body.title;
    if (req.body.description !== undefined) update.description = req.body.description;
    if (req.body.status !== undefined) update.status = req.body.status;
    if (req.body.priority !== undefined) update.priority = req.body.priority;
    if (req.body.dueDate !== undefined) update.dueDate = req.body.dueDate || undefined;

    task.set(update);
    await task.save();

    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    return next(err);
  }
};

