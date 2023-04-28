const Feedback = require('../models/feedback');
const User = require('../models/user');


module.exports.submitFeedback = async function (req, res) {
    try {
        const feedbackGiver = req.user;
        const { feedbackRecieverId, feedback, rating } = req.body;

        if (!feedbackRecieverId || !feedback || !rating) {
            return res.status(401).json({
                message: 'Empty field revcieved',
                status: 'failure',
                data: []
            });
        }

        const feedbackReciever = await User.findById(feedbackRecieverId);

        if(!feedbackReciever){
            return res.status(404).json({
                message: 'unable to find reciever || invalide reciever',
                status: 'failure',
                data: []
            })
        }

        const isAuthorized = feedbackGiver.pendingFeedbacks.includes(feedbackRecieverId);

        if(!isAuthorized){
            return res.status(401).json({
                message: 'Unauthorized request recieved',
                status: 'failure',
                data: []
            });
        }


        const createdFeedback = await Feedback.create({
            ratedBy: req.user.id,
            ratedTo: feedbackRecieverId,
            rating: rating,
            feedback: feedback
        });

        if(!createdFeedback){
            throw new Error('Unable to create feedback :: submitFeedback');
        }

        // removing id from pending feedbacks from the feedback giver
        await User.findByIdAndUpdate(feedbackGiver.id, {pendingFeedbacks: {$pull: feedbackRecieverId}});
        
        // finding out new rating is ((previousrating * numofRaters) + current rating) / total rating user
        let newRating = ((feedbackReciever.rating * feedbackReciever.ratedBy) + rating) / (feedbackReciever.ratedBy + 1);
        let newRatedBy = feedbackReciever.ratedBy + 1;
        await User.findByIdAndUpdate(feedbackRecieverId, {rating: newRating, ratedBy: newRatedBy});


        return res.status(200).json({
            message: 'feedack created successfully',
            status: 'successful',
            data: []
        });


    } catch (error) {
        console.log("Error: submitFeedback: ", error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 'failure',
            data: []
        });
    }
}