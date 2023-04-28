const User = require('../models/user');
const Company = require('../models/company');


module.exports.createCompany = async function (req, res) {

    try {
        const { name, email, password, cpassword, position, company, description } = req.body;

        if (!name || !email || !password || !company) {
            return res.status(400).json({
                message: 'Empty field recieved',
                status: 'failure',
                data: []
            });
        }

        if (password != cpassword) {
            return res.status(400).json({
                message: 'Password and Confirm password must be same',
                status: "failure",
                data: []
            });
        }

        const user = await User.findOne({ "email": email });

        if (user) {
            return res.status(401).json({
                message: 'User is already registered',
                status: 'failure',
                data: []
            });
        }


        const com = await Company.findOne({ 'name': company });

        if (com) {
            return res.status(401).json({
                message: 'Company is already exist with same name try using different name',
                status: 'failure',
                data: []
            });
        }


        const newCompany = await Company.create({ 'name': company, 'description': description });

        if (!newCompany) {
            throw new Error('unable to create company :: create company');
        }

        const newUser = await User.create({
            'name': name,
            'email': email,
            'password': password,
            'type': 'admin',
            'company': newCompany.id,
            'position': position,
            'adminRank': 1
        });


        if (!newUser) {
            throw new Error('unable to create user :: create admin');
        }

        await Company.findByIdAndUpdate(newCompany.id, { $push: { 'users': newUser.id } });

        res.status(200).json({
            message: 'company / admin created successfully',
            status: 'successful',
            data: [{
                'uid': newUser.id,
                'uname': newUser.name,
                'uemail': newUser.email,
                'cid': newCompany.id,
                'cname': newCompany.name
            }]
        });

    } catch (error) {
        console.log('Error: createCompany', error);

        return res.status(500).json({
            message: 'Internal Server Error',
            status: 'faluire',
            data: []
        });
    }


}



module.exports.createEmployee = async function (req, res) {
    try {

        const { name, email, password, cpassword, position, company } = req.body;


        if (!name || !email || !password || !company) {
            return res.status(400).json({
                message: 'Empty field recieved',
                status: 'failure',
                data: []
            });
        }

        if (password != cpassword) {
            return res.status(400).json({
                message: 'Password and Confirm password must be same',
                status: "failure",
                data: []
            });
        }

        const com = await Company.findOne({ 'name': company });

        if (!com) {
            return res.status(401).json({
                message: `unable to find company with name ${company}`,
                status: 'failure',
                data: []
            });
        }

        const user = await User.findOne({ "email": email });

        if (user) {
            return res.status(401).json({
                message: 'User is already registered',
                status: 'failure',
                data: []
            });
        }

        const newUser = await User.create({
            'name': name,
            'email': email,
            'password': password,
            'type': 'employee',
            'company': com.id,
            'position': position,
        });

        if (!newUser) {
            throw new Error('unable to create new user');
        }

        newUser.password = undefined;

        res.status(200).json({
            message: 'user created successfully',
            status: 'successful',
            data: [newUser]
        });

    } catch (error) {
        console.log('Error: createEmployee', error);

        return res.status(500).json({
            message: 'Internal Server Error',
            status: 'faluire',
            data: []
        });
    }
}


module.exports.getUser = async function (req, res) {
    console.log(req.user);
    res.status(200).json(req.user);
}

/**
 * changing user name only admin rank grater than user or user himself is authorized to do that
 * take new Name and userId
 */
module.exports.changeName = async function (req, res) {

    try {

        const { userId, newName } = req.body;

        if (!userId || !newName) {
            return res.status(401).json({
                message: 'empty field recieved',
                status: 'failure',
                data: []
            });
        }

        const userToChange = await User.findById(userId);

        if (!userToChange) {
            return res.status(401).json({
                message: 'invalid user',
                status: 'failure',
                data: []
            });
        }

        if (req.user.id == userId || (req.user.adminRank < userToChange.adminRank && req.user.company == userToChange.company)) {

            const user = await User.findByIdAndUpdate(userId, { name: newName });
            user.password = undefined;

            return res.status(200).json({
                message: 'name of user change successfully',
                status: 'successful',
                data: [user]
            });

        } else {
            return res.status(401).json({
                message: 'unauthorized request',
                status: 'failure',
                data: []
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Internal Server Error',
            status: 'failure',
            data: []
        });
    }


}

/**
 * only user himself or admin of same company having grater rank can change the position
 * takes user id and new position
 */

module.exports.changePosition = async function (req, res) {

    try {

        const { userId, newPositon } = req.body;

        if (!userId || !newPositon) {
            return res.status(401).json({
                message: 'empty field recieved',
                status: 'failure',
                data: []
            });
        }

        const userToChange = await User.findById(userId);

        if (!userToChange) {
            return res.status(401).json({
                message: 'Invalid user',
                status: 'failure',
                data: []
            });
        }

        if (req.user.id == userId || (req.user.adminRank < userToChange.adminRank && req.user.company == userToChange.company)) {

            const user = await User.findByIdAndUpdate(userId, { position: newPositon });
            user.password = undefined;

            return res.status(200).json({
                message: 'name of user change successfully',
                status: 'successful',
                data: [user]
            });

        } else {
            return res.status(401).json({
                message: 'unauthorized request',
                status: 'failure',
                data: []
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Internal Server Error',
            status: 'failure',
            data: []
        });
    }


}


module.exports.assignFeedback = async function (req, res) {
    const { feedbackGiverId, feedbackRecieverId } = req.body;

    if (!feedbackGiverId || !feedbackRecieverId) {
        return res.status(401).json({
            message: 'empty field recieved',
            status: 'failure',
            data: []
        });
    }

    const feedbackGiver = await User.findById(feedbackGiverId);

    if (!feedbackGiver) {
        return res.status(404).json({
            message: 'invalid feedback giver',
            status: 'failure',
            data: []
        });
    }

    const feedbackReciever = await User.findById(feedbackRecieverId);

    if (!feedbackReciever) {
        return res.status(404).json({
            message: 'invalid feedback reciever',
            status: 'failure',
            data: []
        });
    }

    if (req.user.adminRank >= feedbackGiver.adminRank || req.user.adminRank >= feedbackReciever.adminRank) {
        return res.status(404).json({
            message: 'unauthorized reques recived',
            status: 'failure',
            data: []
        });
    }

    
    const updatedUser = await User.findByIdAndUpdate(feedbackGiverId, {$push: {pendingFeedbacks: feedbackRecieverId}});

    if(!updatedUser){
        throw new Error('unable to assign feedback');
    }


    return res.status(200).json({
        message: 'successfully assign feedback',
        status: 'successful',
        data: []
    });

}

module.exports.employeeView = function (req, res) {
    res.render('employee_view', { 'title': 'employee view' });
}

