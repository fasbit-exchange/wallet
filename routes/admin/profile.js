
let router = require('express').Router();
let pController = require('../../controllers/admin/profile');
router.get('/', pController.getProfile);
router.post('/', pController.updateProfile);
module.exports = router;