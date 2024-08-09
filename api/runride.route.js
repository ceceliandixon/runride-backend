import express from 'express';
import activitiesController from './activities.controller.js';
import commentsController from './comments.controller.js';
import usersController from './users.controller.js';

const router = express.Router(); // get access to express router

router
    .route('/')
    .get(activitiesController.apiGetActivities)
    .post(activitiesController.apiPostActivity)
    .put(activitiesController.apiUpdateActivity)
    .delete(activitiesController.apiDeleteActivity);

    router.route('/activities/user/:userId').get(activitiesController.apiGetActivitiesByUserId)

//

router.route('/activity/:id').get(activitiesController.apiGetActivityById);
// other methods associated with activities add here (athletes/participants maybe)


router
    .route('/comment')
    .post(commentsController.apiPostComment)
    .put(commentsController.apiUpdateComment)
    .delete(commentsController.apiDeleteComment);

router.route("/users")
    .post(usersController.apiCreateUser)
    .put(usersController.apiUpdateFriends);

//router.route("/users/:userId/friends").get(usersController.apiGetFriends);

router.route("/users/:userId").get(usersController.apiGetUser);

export default router;