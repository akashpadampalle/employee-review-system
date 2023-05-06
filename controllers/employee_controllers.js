const Company = require('../models/company');
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
        console.log(employeeId);

        const employee = await User.findById(employeeId)
            .select('-password').populate('company');

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