const express = require('express');
const { body, query, param } = require('express-validator');
const taskController = require('../controllers/taskController');

const router = express.Router();

const validStatus = ['Pending', 'In Progress', 'Completed'];
const validPriority = ['High', 'Medium', 'Low'];

router.post(
  '/',
  [
    body('title').isString().trim().isLength({ min: 1, max: 120 }),
    body('description').isString().trim().isLength({ min: 1, max: 2000 }),
    body('status').isIn(validStatus),
    body('priority').isIn(validPriority),
    body('dueDate').optional({ nullable: true }).isISO8601().toDate()
  ],
  taskController.createTask
);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1, max: 100000 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),

    query('status').optional().isIn(validStatus),
    query('priority').optional().isIn(validPriority),

    query('search').optional().isString().trim().isLength({ max: 200 }),

    query('sortBy').optional().isIn(['dueDate', 'createdAt', 'priority']),
    query('sortDir').optional().isIn(['asc', 'desc'])
  ],
  taskController.getTasks
);

router.get(
  '/:id',
  [
    param('id').isMongoId()
  ],
  taskController.getTaskById
);

router.put(
  '/:id',
  [
    param('id').isMongoId(),

    body('title').optional().isString().trim().isLength({ min: 1, max: 120 }),
    body('description').optional().isString().trim().isLength({ min: 1, max: 2000 }),
    body('status').optional().isIn(validStatus),
    body('priority').optional().isIn(validPriority),
    body('dueDate').optional({ nullable: true }).isISO8601().toDate()
  ],
  taskController.updateTask
);

router.delete(
  '/:id',
  [
    param('id').isMongoId()
  ],
  taskController.deleteTask
);

module.exports = router;

