const User = require('../models/user');
const Company = require('../models/company');


module.exports.createCompany = async function (req, res){

    try {
        const {name , email, password, cpassword, position, company, description} = req.body;

        if(!name || !email || !password || !company){
            return res.status(400).json({
                message: 'Empty field recieved',
                status: 'failure',
                data: []
            });
        }

        if(password != cpassword){
            return res.status(400).json({
                message: 'Password and Confirm password must be same',
                status: "failure",
                data: []
            });
        }

        const user = await User.findOne({"email": email});

        if(user){
            return res.status(401).json({
                message: 'User is already registered',
                status: 'failure',
                data: []
            });
        }


        const com = await Company.findOne({'name': company});

        if(com){
            return res.status(401).json({
                message: 'Company is already exist with same name try using different name',
                status: 'failure',
                data: []
            });
        }


        const newCompany = await Company.create({'name': company, 'description': description});

        if(!newCompany){
            throw new Error('unable to create company :: create company');
        }

        const newUser = await User.create({
            'name': name,
            'email': email,
            'password': password,
            'type': 'admin',
            'company': newCompany.id,
            'position': position,
            'AdminRank': 1
        });


        if(!newUser){
            throw new Error('unable to create user :: create admin');
        }

        await Company.findByIdAndUpdate(newCompany.id, {$push: {'users': newUser.id}});

        res.status(200).json({
            message: 'company / admin created successfully',
            status: 'successful',
            data:[{
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



module.exports.createEmployee = async function(req, res){
    try {

        const {name , email, password, cpassword, position, company} = req.body;


        if(!name || !email || !password || !company){
            return res.status(400).json({
                message: 'Empty field recieved',
                status: 'failure',
                data: []
            });
        }

        if(password != cpassword){
            return res.status(400).json({
                message: 'Password and Confirm password must be same',
                status: "failure",
                data: []
            });
        }

        const com = await Company.findOne({'name': company});

        if(!com){
            return res.status(401).json({
                message: `unable to find company with name ${company}`,
                status: 'failure',
                data: []
            });
        }

        const user = await User.findOne({"email": email});

        if(user){
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

        if(!newUser){
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


