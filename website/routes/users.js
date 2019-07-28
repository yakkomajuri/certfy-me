var express = require('express');
var router = express.Router();
var multer = require('multer');
var bcrypt = require('bcryptjs');
var upload = multer({ dest: './uploads' });
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var CustomStrategy = require('passport-custom').Strategy;
var alert = require('alert-node');
var ExpressBrute = require('express-brute');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var fs = require('fs-extra');

// Gets API keys and other sensitive data from config file -- Ignored by git
var Keys = require('../config/config')

var cloudconvert = new (require('cloudconvert'))(Keys["Cloudconvert"]);
var cryptojs = require('crypto-js');

var multer = require('multer')
// var upload = multer({ dest: 'templates/' })

// var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'templates/');
  },
  filename: function (req, file, callback) {
    callback(null, String(cryptojs.SHA3(Math.random() + file.fieldname + '-' + Date.now())));
  }
});
var upload = multer({ storage: storage });



// ExpressBrute prevents brute force attacks on passwords
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);

// Gets UserSchema from /models/user.js
var User = require('../models/user');

// START: pages that DO NOT need authentication to be accessed --------------
router.get('/', function (req, res, next) {
  res.send('/home');
});

router.get('/test', function (req, res, next) {
  console.log('nothing here for the time being');
});

router.get('/home', function (req, res, next) {
  res.render('home', { title: 'Home' });
});

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login' });
});


router.get('/forgot', function (req, res, next) {
  res.render('forgot', { title: 'Forgot Password' });
});

// END -----------------------------------------------------


// START: pages that NEED authentication to be accessed --------------

router.get('/register-new', function (req, res, next) {
  var authenticated = false;


  if (req.user) {
    authenticated = true;
  }

  if (authenticated === true) {
    //user is already authenticated
    res.render('registernew', { title: 'Register New', pageData: { name: [req.user.name], username: [req.user.username], eth: [req.user.eth], signee: '' } });
  } else {
    //redirect to login
    res.redirect('/users/login');
  }
});

router.get('/settings', function (req, res, next) {
  var authenticated = false;


  if (req.user) {
    authenticated = true;
  }

  if (authenticated === true) {
    //user is already authenticated
    res.render('settings', { title: 'Settings', pageData: { name: [req.user.name], username: [req.user.username], eth: [req.user.eth], signee: '' } });
  } else {
    //redirect to login
    res.redirect('/users/login');
  }
});

router.get('/sign', async function (req, res, next) {
  var authenticated = false;
  var toSign;


  if (req.user) {
    authenticated = true;
  }

  if (authenticated === true) {
    // Pulls documents that are pending signature for the user
    await User.findOne({ username: req.user.username }, function (err, user) {
      if (err) { throw err; }
      if (user) {
        toSign = user.toSign;
      }
    });
    res.render('sign', { title: 'Sign Document', pageData: { name: [req.user.name], username: [req.user.username], eth: [req.user.eth], toSign: toSign } });
  } else {
    res.redirect('/users/login');
  }
});


router.get('/wallet', async function (req, res, next) {
  var authenticated = false;
  var toSign;


  if (req.user) {
    authenticated = true;
  }

  if (authenticated === true) {
    // Pulls documents that are pending signature for the user
    await User.findOne({ username: req.user.username }, function (err, user) {
      if (err) { throw err; }
      if (user) {
        toSign = user.toSign;
      }
    });
    res.render('tokens', { title: 'My Wallet', pageData: { name: [req.user.name], username: [req.user.username], eth: [req.user.eth], toSign: toSign } });
  } else {
    res.redirect('/users/login');
  }
});

router.get('/templates', async function (req, res, next) {
  var authenticated = false;
  var toSign;


  if (req.user) {
    authenticated = true;
  }

  if (authenticated === true) {
    // Pulls documents that are pending signature for the user
    await User.findOne({ username: req.user.username }, function (err, user) {
      if (err) { throw err; }
      if (user) {
        toSign = user.toSign;
      }
    });
    res.render('templates', { title: 'Templates', pageData: { name: [req.user.name], username: [req.user.username], eth: [req.user.eth], toSign: toSign } });
  } else {
    res.redirect('/users/login');
  }
});

router.get('/multisig', async function (req, res, next) {

  var authenticated = false;
  var ethAddress;


  if (req.user) {
    authenticated = true;
  }

  if (authenticated === true) {
    // Redirects to /register-new but with the selected friend's address
    await User.findOne({ username: req.body.signee }, function (err, user) {
      if (err) { res.redirect('/users/friends'); }
      if (user) {
        ethAddress = user.eth;
      }
    });
    res.render('registernew', { title: 'Register New', pageData: { name: [req.user.name], username: [req.user.username], eth: [req.user.eth], signee: [ethAddress] } });
  } else {
    res.redirect('/users/login');
  }
});


router.post('/multisig', async function (req, res, next) {
  var authenticated = false;
  var ethAddress;

  // Adds a multisig document to db
  await User.findOne({ username: req.body.signee }, function (err, user) {
    if (err) { res.redirect('/users/friends'); }
    if (user) {
      ethAddress = user.eth;
      res.render('registernew', { title: 'Register New', pageData: { name: [req.user.name], username: [req.user.username], eth: [req.user.eth], signee: [ethAddress] } });
    }
  });
});


// Deletes a pending document
router.post('/deletesig', async function (req, res, next) {
  var nameId = req.body.selector;
  await User.deleteToSign({ username: req.user.username }, nameId, function (err, result) {
    if (err) {
      throw err;
    }
    if (result) {
      res.redirect('/users/sign');
    }
  });
});


router.get('/verify', function (req, res, next) {

  var authenticated = false;


  if (req.user) {
    authenticated = true;
  }

  if (authenticated === true) {
    //user is already authenticated
    res.render('verify', { title: 'Verify', pageData: { name: [req.user.name], username: [req.user.username], eth: [req.user.eth] } });
  } else {
    //redirect to login
    res.redirect('/users/login');
  }
});



router.get('/query', async function (req, res, next) {

  var authenticated = false;


  if (req.user) {
    authenticated = true;
  }

  if (authenticated === true) {
    // Loads all document references a user has stored on the db
    await User.findOne({ username: req.user.username }, function (err, user) {
      if (err) { throw err; }
      if (user) {
        myDocs = user.myDocs;
      }
    });
    res.render('query', { title: 'Query', pageData: { name: [req.user.name], username: [req.user.username], eth: [req.user.eth], myDocs: myDocs } });
  } else {
    //redirect to login
    res.redirect('/users/login');
  }
});



router.get('/dashboard', async function (req, res, next) {

  var friends, friendRequests;
  var authenticated = false;
  var toSign;


  if (req.user) {
    authenticated = true;
  }

  if (authenticated === true) {
    //user is already authenticated

    // Loads ducuments pending signature
    await User.findOne({ username: req.user.username }, function (err, user) {
      if (err) { throw err; }
      if (user) {
        toSign = user.toSign;
      }
    });

    // Load friend requests
    await User.findFriends({ username: req.user.username }, function (err, user) {
      if (err) { throw err; }
      if (user) {
      }
      friends = user.friends;
      friendRequests = user.friendRequests;
      res.render('dashboard', {
        title: 'Dashboard', pageData: {
          name: [req.user.name],
          username: [req.user.username],
          friends: [friends],
          eth: [req.user.eth],
          friendRequests: [friendRequests],
          toSign: toSign
        }
      });
    })

  } else {
    //redirect to login
    res.redirect('/users/login');
  }
});

// Accepts friend request
router.post('/accept', async function (req, res, next) {
  var friend = req.body.request;
  var query = { username: req.user.username };
  await User.acceptFriendRequest(req.user.username, query, friend, function (err, added) {
    if (err) {
      throw err;
    }
    else {
      res.redirect('/users/dashboard');
    }
  });
});

// Rejects friend request
router.post('/reject', async function (req, res, next) {
  var friend = req.body.requested;
  var query = { username: req.user.username };
  await User.removeRequest(req.user.username, query, friend, function (err, removed) {
    if (err) {
      throw err;
    }
    else {
      res.redirect('/users/dashboard');
    }
  });
});

// Adds a multi-sig document to db + notifies secondary signee via email
router.post('/multi', async function (req, res, next) {
  var nameIndex = req.body.title + '(' + req.body.index + ')';
  var query = { eth: req.body.address };
  var emailBool = req.body.emailBool;
  console.log(emailBool);
  var receiver;
  if (emailBool) {
    await User.findOne(query, function (err, user) {
      if (!user) {
        console.log('cannot find eth');
      }
      else {
        // Sends email to secondary signee
        receiver = user.email;
        var smtpTransport = nodemailer.createTransport("smtps://certfy.me@gmail.com:" + encodeURIComponent('77a32798493568660127088d43ef9f3fbe1b1873e030e05eb2177d09800d521f') + "@smtp.gmail.com:465");
        var mailOptions = {
          to: receiver,
          from: 'certfy.me@gmail.com',
          subject: 'You have documents awaiting your signature',
          text: 'Hello ' + req.user.name + ',\n\n' + 'We are contacting you to inform that a document has been registered on our platform, and the user has requested that we' +
            ' inform you of this event so you can proceed to sign the document. \n\n' + 'If you are not expecting any documents, you can ignore this message. Otherwise, please login using the link below' +
            ' to see the registration.\n\n' + 'https://certfy.me/users/login' + '\n\n' + 'Regards,' + '\n\n' + 'Certfy.me Team'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log('email sent');
          done(err, 'done');
        });
      }
    });

  }
  await User.addDocToSign(query, nameIndex, function (err, updated) {
    if (err) {
      throw err;
    }
    if (updated) {
      res.redirect('/users/register-new');
    }
  });
});

// Adds a one-user (standard) document to the db
router.post('/std', async function (req, res, next) {
  var nameIndex = req.body.title + '(' + req.body.index + ')';
  var query = { username: req.user.username };
  await User.addToMyDocs(query, nameIndex, function (err, updated) {
    if (err) {
      throw err;
    }
    if (updated) {
      res.redirect('/users/docs');
    }
  });
});

// Sign a multi-sig document
router.post('/sig', async function (req, res, next) {
  var nameIndex = req.body.title + '(' + req.body.index + ')';
  var query = { username: req.user.username };
  var query2 = { eth: req.body.registrant };
  console.log(query2);
  await User.addToOurDocs(query, query2, nameIndex, function (err, updated) {
    if (err) {
      console.log("error" + err);
      throw err;
    }
    if (updated) {
      console.log('docs baby')
      res.redirect('/users/docs');
    }
  });
});

// Loads User Documents page
router.get('/docs', function (req, res, next) {

  var authenticated = false;


  if (req.user) {
    authenticated = true;
  }

  if (authenticated === true) {
    //user is already authenticated
    res.render('docs', { title: 'Documents', pageData: { name: [req.user.name], username: [req.user.username], eth: [req.user.eth] } });
  } else {
    //redirect to login
    res.redirect('/users/login');
  }
});

// Loads User Profile
router.get('/profile', function (req, res, next) {

  var authenticated = false;


  if (req.user) {
    authenticated = true;
  }

  if (authenticated === true) {
    //user is already authenticated
    res.render('profile', {
      title: 'Profile', pageData: {
        name: [req.user.name], username: [req.user.username],
        eth: [req.user.eth], email: [req.user.email]
      }
    });
  } else {
    //redirect to login
    res.redirect('/users/login');
  }
});

// Loads user's friends - BAD CODE! MUST FIX!
router.get('/friends', async function (req, res, next) {

  var authenticated = false;


  if (req.user) {
    authenticated = true;
  }

  if (authenticated === true) {
    await User.findFriends({ username: req.user.username }, function (err, user) {
      if (err) { throw err; }
      if (user) {
      }
      friends = user.friends;
    })
    sleep(200);
    res.render('friends', { title: 'Friends', pageData: { name: [req.user.name], username: [req.user.username], friends: [friends], eth: [req.user.eth] } });
  } else {
    //redirect to login
    res.redirect('/users/login');
  }
});

// Should not be used lol
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mechanism for sending friend requests
router.post('/friends', async function (req, res, next) {
  var friend = req.body.friend;
  var query = { username: req.user.username };
  User.addFriend(req.user.username, query, friend, function (err, friend) {
    if (err) {
      throw err;
    }
  });
  res.redirect('/users/friends');
});

// Login mechanism - Prevent bruteforce attacks, authenticate, send to dashboard
// Uses both local and custom strategies - Either will work
router.post('/login',
  bruteforce.prevent,
  passport.authenticate(['local', 'custom'], { failureRedirect: '/users/login' }),
  function (req, res) {
    res.redirect('/users/dashboard');
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

// Passport traditional strategy for authentication: username + password
passport.use(new LocalStrategy(function (username, password, done) {
  User.getUserByUsername(username, function (err, user) {
    if (err) throw err;
    if (!user) {
      return done(null, false, { message: 'Unknown User' });
    }

    User.comparePassword(password, user.password, function (err, isMatch) {
      if (err) return done(err);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid Password' });
      }
    });
  });
}));

// Certfy's very own authentication strategy: eth address + password
passport.use('custom', new CustomStrategy(function (req, done) {
  User.getUserByAddress(req.body.eth, function (err, user) {
    if (err) throw err;
    if (!user) {
      return done(null, false, { message: 'Unknown User' });
    }

    User.comparePassword(req.body.password, user.password, function (err, isMatch) {
      if (err) return done(err);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid Password' });
      }
    });
  });
}));


// Delete's a user's account
router.post('/delete', async function (req, res, next) {
  User.deleteAccount({ username: req.user.username }, function (err, deleted) {
    if (err) { throw err; }
    else {
      res.redirect('/');
    }
  })
});


// Register's a new user
router.post('/register', async function (req, res, next) {
  var allGood = true;
  var last = (req.body.username).length - 1;
  var usr = req.body.username;
  if (req.body.username[last] == ' ') {
    usr = (req.body.username).substring(0, last);
  }
  await User.findOne({ username: usr }, function (err, user) {
    if (err) { res.redirect('/users/register'); }
    if (user) {
      res.redirect('/users/register');
      alert("Username alredy registered.");
      allGood = false;
    }
  });

  await User.findOne({ eth: req.body.eth }, function (err, user) {
    if (err) { res.redirect('/users/register'); }
    if (user) {
      res.redirect('/users/register');
      alert("Ethereum address alredy registered.");
      allGood = false;
    }
  });

  await User.findOne({ email: req.body.email }, function (err, user) {
    if (err) { res.redirect('/users/register'); }
    if (user) {
      res.redirect('/users/register');
      alert("Email alredy registered.");
      allGood = false;
    }
  });

  if (allGood) {
    var name = req.body.name;
    var email = req.body.email;
    var eth = req.body.eth;
    var username = usr;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Form Validator
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(password);

    // Check Errors
    var errors = req.validationErrors();

    if (errors) {
      res.render('register', {
        errors: errors
      });
    } else {
      var newUser = new User({
        name: name,
        email: email,
        eth: eth,
        username: username,
        password: password,
        friends: [],
        toSign: []
      });

      User.createUser(newUser, function (err, user) {
        if (err) throw err;
      });

      //req.flash('success', 'You are now registered');

      res.location('/users/login');
      res.redirect('/users/login');
    }
  }
  else {
    return;
  }
});

router.get('/reset', function (req, res) {
  var tok = req.query.token || " ";
  if (tok == " ") {
    res.render('reset', { title: "Reset Password", token: tok, username: " " });
  }
  else {
    User.findOne({ resetPasswordToken: tok, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
      if (!user) {
        alert('Password reset token is invalid or has expired.');
        return res.redirect('/users/forgot');
      }
      console.log(tok);
      res.render('reset', { title: "Reset Password", token: tok, username: user.username });
    });
  }
})

router.post('/forgot', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      if (req.body.choice == "Email") {
        User.findOne({ email: req.body.info }, function (err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      }
      else if (req.body.choice == "Username") {
        User.findOne({ username: req.body.info }, function (err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      }
      else {
        User.findOne({ eth: req.body.info }, function (err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      }
    },
    function (token, user, done) {
      receiver = user.email;
      var name = user.name;
      var smtpTransport = nodemailer.createTransport(Keys["Mail"][0] + Keys["Mail"][1] + Keys["Mail"][2]);
      var mailOptions = {
        to: receiver,
        from: 'certfy.me@gmail.com',
        subject: 'Certfy.me Password Reset',
        text: 'Hello ' + name + ',\n\n' + 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/users/reset?token=' + token + '\n\n' +
          'You can also copy your authentication token (' + token + ') and use it to change your password on the following link: http://certfy.me/users/reset.\n If you did not request this, please ignore this email and your password will remain unchanged.\n' + 'Regards,' + '\n\n' + 'Certfy.me Team'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        console.log('email sent');
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/users/reset');
  });
});


router.post('/reset', function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        User.resetPassword(user, req.body.password, function (err) {
          if (err) throw err;
          else {
            done(err, user);
          }
        })
      });
    },
    function (user, done) {
      receiver = user.email;
      var name = user.name;
      var smtpTransport = nodemailer.createTransport(Keys["Mail"][0] + Keys["Mail"][1] + Keys["Mail"][2]);
      var mailOptions = {
        to: receiver,
        from: 'certfy.me@gmail.com',
        subject: 'Certfy.me - Your password has been changed',
        text: 'Hello ' + name + ',\n\n' +
          'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        alert('Success! Your password has been changed.');
        done(err, 'done');
      });
    }
  ], function (err) {
    res.redirect('/users/login');
  });
});

router.post('/change', function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({ username: req.body.username }, function (err, user) {
        if (!user) {
          console.log('error', 'Username does not exist in database', usr);
          return res.redirect('back');
        }
        User.comparePassword(req.body.currentPassword, user.password, function (err, isMatch) {
          if (err) return done(err);
          if (!isMatch) {
            return done(null, false, { message: 'Invalid Password' });
          }
          User.changePassword(user, req.body.newPassword, function (err) {
            if (err) throw err;
            else {
              done(err, user);
            }
          })
        });
      });
    },
    function (user, done) {
      receiver = user.email;
      var name = user.name;
      var smtpTransport = nodemailer.createTransport(Keys["Mail"][0] + Keys["Mail"][1] + Keys["Mail"][2]);
      var mailOptions = {
        to: receiver,
        from: 'certfy.me@gmail.com',
        subject: 'Certfy.me - Your password has been changed',
        text: 'Hello ' + name + ',\n\n' +
          'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        alert('Success! Your password has been changed.');
        done(err, 'done');
      });
    }
  ], function (err) {
    res.redirect('/users/dashboard');
  });
});

// Logs user out
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/users/home');
});

// TEMPLATES --------------------------------------------

router.get('/upload', function (req, res) {
  var authenticated = false;
  if (req.user) {
    authenticated = true;
  }
  if (authenticated === true) {
    res.render('upload', { title: 'Upload Template', username: req.user.username });
  } else {
    res.redirect('/users/login');
  }
});


router.post('/upload/template', upload.single('userTemplate'), function (req, res) {
  User.findOne({ username: req.query.usr }, function (err, user) {
    if (!user) {
      console.log(err);
      return res.redirect('back');
    }

    var pdfDest = String(req.file.destination + req.file.filename + '.pdf');
    var htmlDest = String(req.file.destination + req.file.filename + '.html');
    fs.createReadStream(pdfDest)
      .pipe(cloudconvert.convert({
        inputformat: 'pdf',
        outputformat: 'html'
      }))
      .pipe(fs.createWriteStream(htmlDest))
      .on('finish', function () {
        console.log('Done!');
        removeAmbiguity(fs.readFileSync(htmlDest).toString('latin1'));
      });

  });




  var docVariables = [];


  function removeAmbiguity(data) {
    var newData = "";
    for (var i = 0; i < data.length; i++) {
      if (data[i] == "'") {
        newData += '"';
      }
      else {
        newData += data[i];
      }
    }
    //console.log(String(newData));
    getVariables(String(newData));
  }

  function getVariables(dt) {
    var newVar = '';
    var inside = false;
    for (var i = 0; i < dt.length; i++) {
      if (dt[i] == '*' && dt[i - 1] == '*') {
        if (inside) {
          docVariables.push(newVar);
          newVar = " ";
          inside = false;
        }
        else {
          inside = true;
        }
      }
      else if (inside && dt[i] != '*') {
        newVar += dt[i];
      }
      else {
        continue;
      }
    }
    // switchVariables(dt);
    makeNew(dt);
  }


  function makeNew(d) {
    const buffer = new Buffer.from(d, 'ascii');
    fs.writeFile(htmlDest, buffer);
    fs.unlink(pdfDest, (err) => {
      if (err) throw err;
      console.log('original pdf was deleted');
    });
    console.log(docVariables);
    encrypt();
  }

  function switchVariables(dt) {
    var arr = dt.split('**');
    makeNew(arr.join(''));
    // console.log(arr);
  }

  function encrypt() {
    var dataFile = fs.readFileSync(htmlDest),
      dataBinary = dataFile.toString('binary'),
      encryptFile = cryptojs.AES.encrypt(dataBinary, user.password),
      buffer = new Buffer.from(encryptFile.toString(), 'binary');

    fs.writeFileSync(String(req.file.destination + req.file.filename), buffer);
  }
});



module.exports = router;


/*
passport.use('custom', new CustomStrategy(
  function(req, done) {
    User.getUserByAddress({
      eth: req.body.eth
    }, function (err, user) {
      done(err, user);
    });

    User.comparePassword(req.body.password, password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid Password'});
      }
    });
  }
));

*/
/*
passport.use('custom', new CustomStrategy(function(eth, password, done) {
  User.getUserByAddress(eth, function(err, eth){
    console.log("eth is: " + eth);
    if(err) throw err;
    if(!eth){
      return done(null, false, {message: 'Unknown Address'});
    }

    User.comparePassword(password, eth.password, function(err, isMatch){
      console.log(password + "=" + eth.password);
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid Password'});
      }
    });
  });
}));
*/

/*
router.post('/dashboard',  async function(req, res, next) {
  var friend = req.body.friend;
  var query = {username: req.user.username};
  console.log(query);
  User.acceptFriendRequest(req.user.username, query, friend, function(err, friend){
      if(err) {
        throw err;
      }
  });
});
*/

/*

passport.use(new LocalStrategy(function(eth, username, password, done) {
  User.getUserByUsername(eth, username, function(err, user){
    console.log("username is: " + username);
    console.log("eth is: " + eth);
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }


    User.comparePassword(password, user.password, function(err, isMatch){
      console.log(password + "=" + user.password);
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid Password'});
      }
    });
  });
}));

*/

