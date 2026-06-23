const router = require('express').Router();
const { clientProtect } = require('../middleware/clientAuth');
const c = require('../controllers/clientAuthController');

router.get('/', clientProtect, c.me);
router.patch('/', clientProtect, c.updateMe);

module.exports = router;
