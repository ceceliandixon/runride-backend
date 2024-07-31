import activitiesDAO from "../dao/activitiesDAO.js";

export default class activitiesController {

    static async apiGetActivities(req, res, next) {
        // TODO: how many p page? filtering?
        const activitiesPerPage = req.query.activitiesPerPage ?
            parseInt(req.query.activitiesPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        let filters = {}
        if (req.query.rated) {
            filters.rated = req.query.rated;
        } else if (req.query.title) {
            filters.title = req.query.title;
        }

        const { activitiesList, totalNumActivities } = await
            activitiesDAO.getActivities({ page, activitiesPerPage }); // add filtering functionality

        let response = {
            activities: activitiesList,
            page: page,
            filters: filters,
            entries_per_page: activitiesPerPage,
            totalResults: totalNumActivities,
        };
        res.json(response);
    }

    static async apiPostActivity(req, res, next) {
        try {
            const activityType = req.body.activityType;
            const text = req.body.text;
            const distance = req.body.distance;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id,
            }

            const date = new Date();

            const activityResponse = await activitiesDAO.addActivity(
                activityType,
                userInfo,
                text,
                distance,
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
            res.status(500).json({ error: e});
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
            )

            var { error } = activityResponse
            if (error) {
                res.status(500).json({ error });
            }

            if (activityResponse.modifiedCount == 0) {
                throw new Error ("Unable to update activity.")
            }
            res.json({ status: "success " });
        } catch(e) {
            res.status(500).json({ error: e.message })
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
        } catch(e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetActivityById(req, res, next) {
        try {
            let id = req.params.id || {}
            let activity = await activitiesDAO.getActivityById(id);
            if (!activity) {
                res.status(404).json({ error: "not found" });
                return;
            }
            res.json(activity);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error:e });
        }
    }

    // add other api methods here as needed
}