const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

// helper to  bcrypt password

exports.keyBcypt = (password) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return (hash);
};

// helper to compare password already exsist

exports.cmpBcypt = (password, password1) => {
    const cmp = bcrypt.compareSync(password ,password1)
    return cmp; 
};

// helper to send dynamic email.

exports.sendmail = (data) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hassanseffiani@gmail.com',//replace with your email
            pass: 'Hseffiani1998'//replace with your password
        }
    });
    
    var mailOptions = {
        from: 'hassanseffiani@gmail.com', // sender address
        to: data['email'],
        subject: "Hello ✔",
        text: "Active your account",
        html: data['url']
    };

    transporter.sendMail(mailOptions);

    /// if you want to see result of send....
    
    // , function(error, info){
    //     if (error) {
    //         console.log(error);
    //         res.send('error') // if error occurs send error as response to client
    //     }
    //     else {
    //         console.log('Email sent: ' + info.response);
    //         res.send('Sent Successfully')//if mail is sent successfully send Sent successfully as response
    //     }
    // });

}

// Create a key for validation


exports.keyCrypto = (text) => {
    const crypto = require('crypto');
    const secret = 'thisissecret';
    const algorithm = 'sha256';
    const hash = crypto.createHmac(algorithm, secret).update(text).digest('hex');
    return hash;
}

