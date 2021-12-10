const jwt = require('jsonwebtoken');

function generateToken() {
    if (process.env.NODE_ENV = 'development') {
        const key = `${process.env.JWT_TOKEN}`;
        const token = jwt.sign({
            data: {
                login: 'Admin1',
                role: 'superAdmin'
            }
        }, key);
        console.log(token);
    } else {
        console.log('%cToken można wygenerować tylko w środowisku developerskim', 'color: red');
    }

};

generateToken();