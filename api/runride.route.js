import express from 'express';
import activitiesController from './activities.controller.js';
import commentsController from './comments.controller.js';

const router = express.Router(); // get access to express router

router
    .route('/')
    .get(activitiesController.apiGetActivities)
    .post(activitiesController.apiPostActivity)
    .put(activitiesController.apiUpdateActivity)
    .delete(activitiesController.apiDeleteActivity);

router.route('/id/:id').get(activitiesController.apiGetActivityById);
// other methods associated with activities add here (athletes/participants maybe)

router
    .route('/comment')
    .post(commentsController.apiPostComment)
    .put(commentsController.apiUpdateComment)
    .delete(commentsController.apiDeleteComment);

export default router;