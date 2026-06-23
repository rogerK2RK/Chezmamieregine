const router = require('express').Router();
const multer = require('multer');
const { adminProtect, requireRole } = require('../middleware/adminAuth');
const adminAuth = require('../controllers/adminAuthController');
const plat = require('../controllers/platController');
const category = require('../controllers/categoryController');
const comment = require('../controllers/commentController');
const contact = require('../controllers/contactController');
const uploadCtrl = require('../controllers/uploadController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// --- Auth admin (public) ---
router.post('/login', adminAuth.loginAdmin);

// --- Tout le reste est protégé ---
router.use(adminProtect);

// Profil courant
router.get('/me', (req, res) => res.json(req.admin));

// Upload d'image (GridFS)
router.post('/uploads', upload.single('image'), uploadCtrl.upload);

// Admins (gestion réservée owner/superAdmin)
router.get('/users', requireRole('owner', 'superAdmin'), adminAuth.listAdmins);
router.post('/users', requireRole('owner', 'superAdmin'), adminAuth.createAdmin);

// Plats
router.post('/plats', plat.create);
router.put('/plats/:id', plat.update);
router.delete('/plats/:id', plat.remove);

// Catégories
router.post('/categories', category.create);
router.put('/categories/:id', category.update);
router.delete('/categories/:id', category.remove);

// Commentaires
router.get('/comments', comment.listAll);
router.patch('/comments/:id/hide', comment.setHidden(true));
router.patch('/comments/:id/unhide', comment.setHidden(false));
router.delete('/comments/:id', comment.remove);

// Contacts
router.get('/contacts', contact.list);
router.delete('/contacts/:id', contact.remove);

module.exports = router;
