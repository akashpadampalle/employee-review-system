const Company = require('../models/company');
const User = require('../models/user');


module.exports.createEmployee = async function (req, res) {
    try {

        const { name, email, password, cpassword, company } = req.body;

        if (!name || !email || !password || !company) {
            return res.json({
                message: 'Empty field recieved',
                status: 'failure',
                data: []
            });
        }

        if (password != cpassword) {
            return res.json({
                message: 'password and confirm password are not matching',
                status: 'failure',
                data: []
            });
        }

        const isUserPresent = await User.findOne({ 'email': email });

        if (isUserPresent) {
            return res.json({
                message: 'User is already present with same email',
                status: 'failure',
                data: []
            });
        }

        const existingCompany = await Company.findOne({ 'name': company });

        if (!existingCompany) {
            return res.json({
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


        return res.json({
            message: `successfully create employee and added into ${company} company`,
            status: 'successful',
            data: [{
                uid: user.id,
                cid: existingCompany.id
            }]
        });

    } catch (error) {
        console.log('Error: creating user', error);
        return res.json({
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