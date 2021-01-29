const db = require('../util/database');

module.exports = class User {
    constructor(id, email, userName, firstName, lastName, password, vkey, age, gender, bio) {
        this.id = id;
        this.email = email;
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.vkey = vkey;
        this.age = age;
        this.gender = gender;
        this.bio = bio;
    }
    
    save() {
        return db.execute('INSERT INTO users(email, userName, firstName, lastName, password, vkey, age, gender, bio) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)'
        , [this.email, this.userName, this.firstName, this.lastName, this.password, this.vkey, this.age, this.gender, this.bio]);
    };
    
    static oauthRegister(oauth, email, userName, firstName, lastName, password, vkey, gender, bio)
    {
        return db.execute('INSERT INTO users(oauth_id, email, userName, firstName, lastName, password, vkey, gender, bio) VALUES (?, ? ,?, ?, ? ,? ,?, ?, ?)'
        , [oauth, email, userName, firstName, lastName, password, vkey, gender, bio]);
    }
    static oauthFindUser(oauth_id){
     return db.execute('SELECT oauth_id FROM users WHERE users.oauth_id = ? limit 1', [oauth_id]);
    }

    static fetchAll(cb) {
        return db.execute('SELECT * FROM users');
    };
    
    static loginModel(user, pass) {
        return db.execute('SELECT * FROM users WHERE users.userName = ? AND users.password = ?', [user, pass]);
    };

    static UserIdModel(id) {
        return db.execute('SELECT * FROM users WHERE id = ? limit 1', [id]);
    };

    static UserNameModel(user) {
        return db.execute('SELECT * FROM users WHERE users.userName = ? limit 1', [user]);
    };

    static UserEmailModel(email) {
        return db.execute('SELECT * FROM users WHERE users.email = ? limit 1', [email]);
    };
    
    static UserForgetPassword(password, vkey) {
        // need to pass vkey to compare with in db. after updating table vkey
        return db.execute('UPDATE users SET password = ? WHERE vkey = ?', [password, vkey.toString()]);
    };

    static UserForgetPassword_(password, id) {
        // need to pass vkey to compare with in db. after updating table vkey
        return db.execute('UPDATE users SET password = ? WHERE id = ?', [password, id]);
    };

    static vkeyGetUser(vkey){
        return db.execute('SELECT * FROM users WHERE vkey = ?', [vkey]);
    }

    static vkeyValidate(vkey){
        return db.execute('SELECT vkey FROM users WHERE vkey = ?', [vkey]);
    }

    static validateUser(vkey){
        return db.execute('UPDATE users SET verify = 1 WHERE vkey = ?', [vkey]);
    }

    static UpdateOldVkey(vkey, email){
        return db.execute('UPDATE users SET vkey = ? WHERE email = ?', [vkey, email]);
    }

    // filling profil

    static fillProfilUpdate(data){
        return db.execute(
          'UPDATE users SET age = ?, gender = ?, type = ?, bio = ? WHERE id = ?',
          [data.age, data.gender, data.type, data.bio, data.id]
        )
    }


    // static fillProfilById(id){
        // return db.execute('UPDATE users SET verify = 1 WHERE vkey = ?', [id]);
    // }

    static delete(id){
        return db.execute('DELETE FROM products WHERE products.id = ?', [id]);
    }

    static UpdateFirstInfo(data){
        return db.execute(
          "UPDATE users SET email = ?, userName = ?, firstName= ?, lastName= ? WHERE id = ?",
          [data.email, data.userName, data.firstName, data.lastName, data.id]
        );
    }

    static UpdateProfilInfo(data){
        return db.execute(
          'UPDATE users SET userName = ?, email = ?, firstName= ?, lastName= ?, bio= ? WHERE id = ?',
          [data.userName, data.email, data.firstName, data.lastName, data.bio, data.id]
        )
    }

    static CheckIfE(id){
        return db.execute(
          'SELECT * from users WHERE age IS NULL AND gender IS NULL AND type IS NULL AND bio IS NULL AND id = ?',[id]
        )
    }

    static getDataMatch(id){
        return db.execute('SELECT * FROM users WHERE id = ?', [id]);       
    }
}