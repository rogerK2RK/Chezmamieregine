const router = require('express').Router();
const { getFile } = require('../controllers/uploadController');

// Service public des images stockées en GridFS.
router.get('/:id', getFile);

module.exports = router;
