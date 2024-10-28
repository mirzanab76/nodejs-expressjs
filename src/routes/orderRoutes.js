const router = require('express').Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', 
  orderController.create
);

// Retrieve all orders
router.get('/',
  orderController.findAll
);

// Retrieve a single order by id
router.get('/:id',
  orderController.findOne
);

// Update an order
router.put('/:id',
  orderController.update
);

// Delete an order
router.delete('/:id',
  orderController.delete
);

module.exports = router;