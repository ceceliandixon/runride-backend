
import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;

let activities;

export default class activitiesDAO {

    static async injectDB(conn) {
        if (activities) {
            return;
        }
        try {
            activities = await conn.db(
                process.env.RUNRIDE_COLLECTION)
                .collection('activities');
        } catch (e) {
            console.error(`Unable to connect to activitiesDAO: ${e}`);
        }
    }

    
    static async addActivity(userName, userId, description, distance, activityType, picture = null, picturePath = null, date) {
        try {
            const activityDoc = {
                userName: userName,
                userId: userId,
                description: description,
                distance: distance,
                activityType: activityType,
                picture: picture || null,       // Default to null if picture is not provided
                picturePath: picturePath || null, // Default to null if picturePath is not provided
                date: date
            };
    
            return await activities.insertOne(activityDoc);
        } catch (e) {
            console.error(`Unable to post activity: ${e}`);
            return { error: e };
        }
    }

    static async updateActivity(activityId, userId, text, date) {
        try {
            const updateResponse= await activities.updateOne( // updateOne is mongoDB method to update one item
                { user_id: userId, _id: new ObjectId(activityId)}, // query criteria makes sure only activity w given id is updated
                { $set: { text: text, date: date } } // actual update content aka text and date
            );
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update activity: ${e}`);
            return { error: e };
        }
    }


    static async deleteActivity(activityId, userId) {
        try {
            const deleteResponse = await activities.deleteOne({
                 _id: new ObjectId(activityId),
                  user_id: userId,
            });
        return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete activity: ${e}`);
            return { error: e };
        }
    }

    static async getActivities({
        filters = null,
        page = 0,
        activitiesPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if ('title' in filters) {
                query = { $text: { $search: filters['title'] } };
            } else if ('rated' in filters) {
                query = { 'rated': { $eq: filters['rated'] } };
            }
        }

        let cursor;
        try {
            cursor = await activities.find(query)
                                .limit(activitiesPerPage)
                                .skip(activitiesPerPage * page);
            const activitiesList = await cursor.toArray();
            const totalNumActivities = await activities.countDocuments(query);
            return { activitiesList, totalNumActivities };
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { activitiesList:[], totalNumActivities: 0 };
        }
    }

    // static async getRatings() {}

    static async getActivityById(id) {
        try {
            return await activities.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'activity_id',
                        as: 'comments',
                    }
                }
            ]).next();
        } catch (e) {
            console.error(`Unable to get activity by ID: ${e}`);
            throw e;
        }
    }
}