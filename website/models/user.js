var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var alert = require('alert-node');

// Connect to Mongo instance running locally
mongoose.connect('mongodb://127.0.0.1/certfy');

// Sets the db to be used (certfy)
var db = mongoose.connection;

// User Schema: Each user is a new UserSchema "object"
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    eth: {
        type: String
    },
    friends: {
        type: Array
    },
    friendRequests: {
        type: Array
    },
    friendsAsked: {
        type: Array
    },
    toSign: {
        type: Array
    },
    myDocs: {
        type: Array
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    fiatBalance: {
        type: Number
    },
    ipfsHashes: {
        type: Map
    },
    myTemplates: {
        type: Map
    }
});

// Exports schema
var User = module.exports = mongoose.model('User', UserSchema);

// Queries by ID and returns User object 
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

// Queries by username and returns User object 
module.exports.getUserByUsername = function(username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
}

// Queries by Ethereum address and returns User object 
module.exports.getUserByAddress = function(eth, callback) {
    var query = {eth: eth};
    User.findOne(query, callback);
}

// Uses bcrypt package to verify input password hash with db hash
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        callback(null, isMatch);
    });
}

// Creates a new user following UserSchema
module.exports.createUser = function(newUser, callback){
    // bcrypt handles the secure hashing of the password
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

// Resets user password
module.exports.resetPassword = function(user, password, callback) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            user.password = hash;
            user.save(callback);
        });
    });

}

// Changes user password
module.exports.changePassword = function(user, newPassword, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newPassword, salt, function(err, hash) {
            user.password = hash;
            user.save(callback);
        });
    });
}


// Sends a friend request i.e. adds User 1 to User2['friendsAsked'] 
// and User 2 to User1['friendRequests]
module.exports.addFriend = async function(username, query, friend, callback){
    var userExists = false;
    var usr;
    await User.findOne(query, function(err, user){ 
        if(err) {
            throw err;
        } 
        if (user) {
            userExists = true;
            usr = user;
        }
        if(!user) {
            alert('User does not exist');
        }
    });
    if (userExists) {
       var yesSir = usr.friendsAsked.find(function(element){
           return element == friend;
       });
       if(yesSir) {
            alert('Friend request already sent'); return;
       }
       else {
        User.updateOne(query, {$push: { friendsAsked: friend} }, callback);
        User.updateOne({username: friend}, {$push: { friendRequests: username} }, callback);
       }
    }
}

// Adds user to friends list, removes friend request, removes sent friend request
module.exports.acceptFriendRequest = async function(username, query, friend, callback){
   await User.updateOne(query, {$addToSet: { friends: friend} }, function(err, updated){
    if(err) {throw err;}  
});
   await User.updateOne({username: friend}, {$addToSet: { friends: username} }, function(err, updated){
    if(err) {throw err;}
});
await  User.updateOne(query, {$pull: { friendRequests: friend} }, function(err, updated){
    if(err) {throw err;}
});
await User.updateOne({username: friend}, {$pull: { friendsAsked: username} }, callback);
}

// Decline a friend request
module.exports.removeRequest = async function(username, query, friend, callback){
    await  User.updateOne(query, {$pull: { friendRequests: friend} }, function(err, updated){
        if(err) {throw err;}
    });
    await User.updateOne({username: friend}, {$pull: { friendsAsked: username} }, callback);
 }


// Adds a multi-sig document as pending to user who must still sign it
module.exports.addDocToSign = async function(query, nameIndex, callback){
    var usr;
    await  User.findOne(query, function(err, user) {
        if (err) {
            throw err;
        }
        else {
            usr = user.username;
        }
    });
    User.updateOne({username: usr}, {$addToSet: { toSign: nameIndex} }, callback);
}

// Adds a signed document to your docs
module.exports.addToMyDocs = async function(query, nameIndex, callback){
    User.updateOne(query, {$addToSet: { myDocs: nameIndex} }, callback);
}

// Adds a document to both users who signed a multi-sig
module.exports.addToOurDocs = async function(query, query2, nameIndex, callback){
    await User.updateOne(query, {$addToSet: { myDocs: nameIndex} }, function(err, updated){
        if(err) { throw err; }
        if(updated) {
            console.log("I'm past here1")
        }
    });
    await User.updateOne(query2, {$addToSet: { myDocs: nameIndex} }, function(err, updated){
        if(err) { throw err; }
        if(updated) {
            console.log("I'm past here2")
        }
    });
    await User.updateOne(query, {$pull: { toSign: nameIndex} }, function(err, updated){
        if(err) { throw err; }
        if(updated) {
            console.log("I'm past here3")
        }
    });
    User.updateOne(query2, {$pull: { toSign: nameIndex} }, callback);
}

// Removes pending document
module.exports.signDocument = function(query, nameIndex, callback){
    User.updateOne(query, {$pull: { toSign: nameIndex} }, callback);
}

// Return all friends of a given user
module.exports.findFriends = function(query, callback) {
    User.findOne(query, callback);
}

// Delete a document pending signature - by user choice or document was signed
module.exports.deleteToSign = function(query, nameIndex, callback) {
    User.updateOne(query, {$pull: { toSign: nameIndex} }, callback);
}

// Deletes all user data
module.exports.deleteAccount = function(query, callback) {
    User.deleteOne(query, callback);
}

module.exports.addTemplate = function(query, name, arr, callback) {
    User.updateOne(query, { $addToSet: { myTemplates: { name: arr }}}, callback);
}


/*
module.exports.getUserByUsername = function(eth, username, callback) {
    if (username = "") {
        var query = {eth: eth};
    }
    else {
        var query = {username: username};
    }
    console.log("The query is: " + query);
    User.findOne(query, callback);
}

module.exports.getUserByAddress = function(eth, callback) {
    var query = {eth: eth};
    console.log("The query is: " + query);
    User.findOne(query, callback);
}


*/