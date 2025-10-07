const express = require('express');
const router = express.Router();
const { clientProtect } = require('../middleware/clientAuth'); // ✅ nouveau nom ici
const ctrl = require('../controllers/commentController');

router.get('/plat/:platId', ctrl.listByPlat);
router.post('/', clientProtect, ctrl.create);
router.delete('/:id', clientProtect, ctrl.removeOwn);

module.exports = router;
