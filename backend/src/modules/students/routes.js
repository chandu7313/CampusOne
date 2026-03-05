import express from 'express';
import * as studentController from './controllers/student.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'tmp/uploads/' });

// All student management requires Authentication and Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/', studentController.getStudents);
router.post('/admit', studentController.admitStudent);
router.post('/bulk-import', upload.single('file'), studentController.bulkImportStudents);

export default router;
