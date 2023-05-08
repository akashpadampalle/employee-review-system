const Company = require('../models/company');
const Feedback = require('../models/feedback');
const User = require('../models/user');



module.exports.createEmployee = async function (req, res) {
    try {

        const { name, email, password, cpassword, company } = req.body;

        if (!name || !email || !password || !company) {
            return res.status(404).json({
                message: 'Empty field recieved',
                status: 'failure',
                data: []
            });
        }

        if (password != cpassword) {
            return res.status(401).json({
                message: 'password and confirm password are not matching',
                status: 'failure',
                data: []
            });
        }

        const isUserPresent = await User.findOne({ 'email': email });

        if (isUserPresent) {
            return res.status(401).json({
                message: 'User is already present with same email',
                status: 'failure',
                data: []
            });
        }

        const existingCompany = await Company.findOne({ 'name': company });

        if (!existingCompany) {
            return res.status(404).json({
                message: `${company} company is not registered`,
                status: 'failure',
                data: []
            });
        }

        // create and store use inside db
        const user = await User.create({
            'name': name,
            'email': email,
            'password': password,
            'type': 'employee',
            'company': existingCompany._id
        });


        if (!user) {
            throw new Error('unale to create user :: unknown error');
        }

        // adding user entry inside company
        await Company.findByIdAndUpdate(existingCompany._id, { $push: { 'employees': user._id } });


        return res.status(200).json({
            message: `successfully create employee and added into ${company} company`,
            status: 'successful',
            data: [{
                uid: user.id,
                cid: existingCompany.id
            }]
        });

    } catch (error) {
        console.log('Error: creating user', error);
        return res.status(500).json({
            message: 'Internal server error',
            status: 'failure',
            data: []
        });
    }
}


module.exports.createCompany = async function (req, res) {

    try {
        const { name, email, password, cpassword, companyName, companyDescription } = req.body;

        if (!name || !email || !password || !companyName || !companyDescription) {
            return res.status(404).json({
                message: 'Empaty field recieved',
                status: 'failure',
                data: []
            });
        }

        if (password != cpassword) {
            return res.status(400).json({
                message: 'password and confirm password are not matching',
                status: 'failure',
                data: []
            });
        }

        const existingCompany = await Company.findOne({ 'name': companyName });

        if (existingCompany) {
            return res.status(401).json({
                message: `${companyName} company is already registered`,
                status: 'failure',
                data: []
            });
        }

        const isUserPresent = await User.findOne({ 'email': email });

        if (isUserPresent) {
            return res.status(401).json({
                message: 'User is already present with same email',
                status: 'failure',
                data: []
            });
        }

        const company = await Company.create({
            'name': companyName,
            'description': companyDescription
        });

        if (!company) {
            throw new Error('unable to create company :: unknown error');
        }

        // create and store use inside db
        const user = await User.create({
            'name': name,
            'email': email,
            'password': password,
            'type': 'admin',
            'adminRank': 1,
            'company': company.id
        });

        if (!user) {
            throw new Error('unable to create user (create company) :: unknown error');
        }

        await Company.findByIdAndUpdate(company._id, { $push: { 'employees': user.id } });

        return res.status(200).json({
            message: 'user created successfully',
            status: 'successful',
            data: [{
                uid: user._id,
                cid: company._id
            }]
        })

    } catch (error) {
        console.log('Error: creating company', error);
        return res.status(500).json({
            message: 'Internal server error',
            status: 'failure',
            data: []
        });
    }


}


module.exports.singout = function (req, res) {
    req.logout((err) => {
        if (err)
            console.log(err);
    });
    res.redirect('/signin');
}


module.exports.adminPanel = async function (req, res) {

    if (req.user.type == 'employee') {
        return res.redirect('/user/employee');
    }

    const company = req.user.company;

    const com = await Company.findById(company).populate('employees');
    let employees = com.employees;

    employees = employees.filter((employee) => {
        employee.password = undefined;
        return req.user.adminRank < employee.adminRank
    })

    return res.render('admin_panel', { 'title': 'ERS | Admin Panel', 'employeesArr': employees, 'employee': true })

}

module.exports.employeeView = async function (req, res) {

    await res.locals.user.populate({ path: 'company', select: 'name' });
    await res.locals.user.populate({ path: 'feedbackPending', select: 'name _id' })


    if (req.user.type == 'admin') {
        res.locals.admin = true;
    }

    res.render('employee_view', { 'title': 'ERS | Employee view' })
}

module.exports.makeAdmin = async function (req, res) {
    try {

        const user = req.user;
        const { employeeId } = req.body;

        const employee = await User.findById(employeeId).select('-password');

        if (!employee) {
            return res.status(404).json({
                message: 'Unable to find employee',
                status: 'failure',
                data: []
            });
        }

        if (user.type != 'admin' || user.adminRank >= employee.adminRank) {
            return res.status(401).json({
                message: 'Unauthorized request',
                status: 'failure',
                data: []
            });
        }

        await User.findByIdAndUpdate(employeeId, { 'type': 'admin', 'adminRank': user.adminRank + 1 });

        return res.status(200).json({
            message: `${employee.name} promoted to admin`,
            status: 'successful',
            data: []
        });

    } catch (error) {
        console.log('Error: Make Admin', error);
        res.status(500).json({
            message: 'Internal Server Error',
            status: 'failure',
            data: []
        });
    }
}


module.exports.makeEmployee = async function (req, res) {
    try {

        const user = req.user;
        const { employeeId } = req.body;

        const employee = await User.findById(employeeId).select('-password');

        if (!employee) {
            return res.status(404).json({
                message: 'Unable to find employee',
                status: 'failure',
                data: []
            });
        }

        if (user.type != 'admin' || user.adminRank >= employee.adminRank) {
            return res.status(401).json({
                message: 'Unauthorized request',
                status: 'failure',
                data: []
            });
        }

        await User.findByIdAndUpdate(employeeId, { 'type': 'employee', 'adminRank': Number.MAX_VALUE });

        return res.status(200).json({
            message: `${employee.name} demoted to employee`,
            status: 'successful',
            data: []
        });

    } catch (error) {
        console.log('Error: Make Employee', error);
        res.status(500).json({
            message: 'Internal Server Error',
            status: 'failure',
            data: []
        });
    }
}


module.exports.employeeReview = async function (req, res) {
    try {

        const user = req.user;

        const employeeId = req.params.id;

        const employee = await User.findById(employeeId)
            .select('-password').populate({ path: 'company', populate: { path: 'employees' } })
            .populate({ path: 'feedbackRecieved', populate: { path: 'sender', select: 'name' } });


        if (!employee) {
            return res.status(404).json({
                message: 'Unable to find employee',
                status: 'failure',
                data: []
            });
        }

        if (user.type != 'admin' || user.adminRank >= employee.adminRank || user.company != employee.company.id) {
            return res.status(401).json({
                message: 'Unauthorized request',
                status: 'failure',
                data: []
            });
        }


        employee.company.employees = employee.company.employees.filter((emp) => {
            emp.password = undefined;

            if (emp.id == employeeId) {
                return false;
            }

            return user.adminRank < emp.adminRank;
        })


        res.render('employee_review', {
            'title': 'ERS | Employee Review',
            'employee': true,
            'admin': true,
            'empDetail': employee
        })

    } catch (error) {
        console.log('Error: Employee Review', error);
        res.status(500).json({
            message: 'Internal Server Error',
            status: 'failure',
            data: []
        });
    }
}



// Feedbacks

module.exports.askFeedback = async function (req, res) {
    try {
        const user = req.user;
        const { recieverId, giverId } = req.body;

        if (!recieverId || !giverId) {
            return res.status(404).json({
                message: 'Empaty field recieved',
                status: 'failure',
                data: []
            });
        }

        const reciever = await User.findById(recieverId);
        const giver = await User.findById(giverId);

        if (!reciever || !giver || !reciever.company.equals(user.company) || !giver.company.equals(user.company) || reciever.adminRank < user.adminRank || giver.adminRank < user.adminRank) {


            return res.status(401).json({
                message: 'UnAuthorized request',
                status: 'failure',
                data: []
            });
        }

        await User.findByIdAndUpdate(giverId, { $push: { feedbackPending: recieverId } });

        return res.status(200).json({
            message: 'feedback asked successfully',
            status: 'successful',
            data: []
        });


    } catch (error) {
        console.log('Error: Ask feedback', error);
        res.status(500).json({
            message: 'Internal Server Error',
            status: 'failure',
            data: []
        });
    }
}

module.exports.cancelFeedback = async function (req, res) {
    try {
        const user = req.user;
        const { recieverId, giverId } = req.body;

        if (!recieverId || !giverId) {
            return res.status(404).json({
                message: 'Empaty field recieved',
                status: 'failure',
                data: []
            });
        }

        const reciever = await User.findById(recieverId);
        const giver = await User.findById(giverId);

        if (!reciever || !giver || !reciever.company.equals(user.company) || !giver.company.equals(user.company) || reciever.adminRank < user.adminRank || giver.adminRank < user.adminRank) {
            return res.status(401).json({
                message: 'UnAuthorized request',
                status: 'failure',
                data: []
            });
        }

        await User.findByIdAndUpdate(giverId, { $pull: { feedbackPending: recieverId } });

        return res.status(200).json({
            message: 'feedback cancel successfully',
            status: 'successful',
            data: []
        });


    } catch (error) {
        console.log('Error: Cancel feedback', error);
        res.status(500).json({
            message: 'Internal Server Error',
            status: 'failure',
            data: []
        });
    }
}

module.exports.submitFeedback = async function (req, res) {
    try {

        const { recieverId, log } = req.body;
        let { rating } = req.body;

        if (!recieverId || !log || !rating) {
            return res.status(404).json({
                message: 'Empaty field recieved',
                status: 'failure',
                data: []
            });
        }

        const reciever = await User.findById(recieverId);

        if (!reciever) {
            return res.status(404).json({
                message: 'Invalid reciever',
                status: "failure",
                data: []
            });
        }

        // checking if user is allowed to give feedback
        if (!req.user.feedbackPending.includes(recieverId)) {
            return res.status(401).json({
                message: 'User is not Authorized',
                status: 'failure',
                data: []
            });
        }

        if (rating < 0) { rating = 0; }
        else if (rating > 5) { rating = 5; }

        // creating feedback
        const feedback = await Feedback.create({
            'reciever': recieverId,
            'sender': req.user.id,
            'log': log,
            'rating': rating
        })

        // removing pending feedback id from sender
        const user = await User.findByIdAndUpdate(req.user.id, { $pull: { 'feedbackPending': recieverId } });

        // updating recievers rating and append feedback id to it
        console.log('reciever.rating  - ', reciever.rating, '\nreciever.feedbackRecieved.length - ', reciever.feedbackRecieved.length, '\nrating - ', rating);
        const newRating = ((reciever.rating * reciever.feedbackRecieved.length) + parseInt(rating)) / (reciever.feedbackRecieved.length + 1);
        await User.findByIdAndUpdate(recieverId, { 'rating': newRating, $push: { 'feedbackRecieved': feedback.id } })

        return res.status(200).json({
            message: 'feedback submited successfully',
            status: 'successful',
            data: []
        });

    } catch (error) {
        console.log('Error: submit feedback', error);
        res.status(500).json({
            message: 'Internal Server Error',
            status: 'failure',
            data: []
        });
    }
}


module.exports.deleteEmployee = async function (req, res) {

    try {



        const { employeeId } = req.body;


        if (!employeeId) {
            return res.status(404).json({
                message: 'Empty employee id',
                status: 'failure',
                data: []
            });
        }

        const employee = await User.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                message: 'Invalide employee id',
                status: 'failure',
                data: []
            });
        }


        if (!employee.company.equals(req.user.company) || employee.adminRank <= req.user.adminRank) {
            return res.status(404).json({
                message: 'Unauthorized access',
                status: 'failure',
                data: []
            });
        }

        // deleting recieved feedbacks
        await Feedback.deleteMany({ _id: { $in: employee.feedbackRecieved } });

        // delete submited feedbacks
        const submitedFeedbacks = await Feedback.find({ 'sender': employeeId });

        for (let index = 0; index < submitedFeedbacks.length; index++) {

            const sFeedback = await Feedback.findById(submitedFeedbacks[index]);
            let recievedEmployee = await User.findById(sFeedback.reciever);
            let newRating = undefined;

            if (recievedEmployee.feedbackRecieved.length == 1) {
                newRating = 0;
            } else {
                newRating = ((recievedEmployee.rating * recievedEmployee.feedbackRecieved.length) - parseInt(sFeedback.rating)) / (recievedEmployee.feedbackRecieved.length - 1);
            }


            recievedEmployee.rating = newRating;
            recievedEmployee.feedbackRecieved.pull(sFeedback._id);

            await recievedEmployee.save();

            await Feedback.findByIdAndDelete(sFeedback.id);

        }

        await User.findByIdAndDelete(employeeId);

        return res.status(200).json({
            message: 'employee deleted successfully',
            status: 'successful',
            data: []
        });

    } catch (error) {
        console.log('Error: DELETE EMPLOYEE ', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 'failure',
            data: []
        });
    }


}


