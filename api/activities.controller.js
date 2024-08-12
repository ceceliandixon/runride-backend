import activitiesDAO from "../dao/activitiesDAO.js";

export default class activitiesController {
    static async apiGetActivities(req, res, next) {
        try {
            const { activitiesList, totalNumActivities } = await activitiesDAO.getActivities();
            res.json({ activities: activitiesList, totalResults: totalNumActivities });
        } catch (error) {
            console.error('Error fetching activities:', error);
            next(error);
        }
    }

    static async apiPostActivity(req, res, next) {
        try {
            const { userName, userId, description, distance, activityType } = req.body;
            const picturePath = req.file ? `/assets/${req.file.filename}` : null; // Handle picturePath if an image was uploaded

            const date = new Date();

            const activityResponse = await activitiesDAO.addActivity(
                userName,
                userId,
                description,
                distance,
                activityType,
                picturePath,    // Handle picturePath
                date
            );

            var { error } = activityResponse;

            if (error) {
                res.status(500).json({ error: "Unable to post activity." });
            } else {
                res.json({
                    status: "success",
                    response: activityResponse
                });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateActivity(req, res, next) {
        try {
            const activityId = req.body.activity_id;
            const text = req.body.text;

            const date = new Date();

            const activityResponse = await activitiesDAO.updateActivity(
                activityId,
                req.body.user_id,
                text,
                date
            );

            var { error } = activityResponse;
            if (error) {
                res.status(500).json({ error });
            }

            if (activityResponse.modifiedCount == 0) {
                throw new Error("Unable to update activity.");
            }
            res.json({ status: "success " });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteActivity(req, res, next) {
        try {
            const activityId = req.body.activity_id;
            const userId = req.body.user_id;
            const activityResponse = await activitiesDAO.deleteActivity(
                activityId,
                userId,
            );

            var { error } = activityResponse;
            if (error) {
                res.status(500).json({ error });
            } else {
                res.json({ status: "success" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetActivityById(req, res, next) {
        try {
            let id = req.params.id || {};
            let activity = await activitiesDAO.getActivityById(id);
            if (!activity) {
                res.status(404).json({ error: "not found" });
                return;
            }
            res.json(activity);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetActivitiesByUserId(req, res, next) {
        try {
            const { userId } = req.params; // Extract userId from the request parameters
            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            const activities = await activitiesDAO.getActivitiesByUserId(userId); // Fetch activities by user ID
            if (!activities || activities.length === 0) {
                res.status(404).json({ error: 'No activities found for this user' });
                return;
            }

            res.json(activities);
        } catch (e) {
            console.error(`API Error: ${e}`);
            res.status(500).json({ error: e.message });
        }
    }

    // add other api methods here as needed
}