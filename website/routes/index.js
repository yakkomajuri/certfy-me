var express = require('express');
var router = express.Router();

/* GET home page. */
/* 
// Used in production as a bad mechanism to force https
router.get('/', function(req, res, next) {
  res.redirect('https://certfy.me/home'); 
}); 
*/

// Self-explanatory GET requests 

router.get('/', function(req, res, next) {
  res.render('home', {title:'Home'});
});

router.get('/home', function(req, res, next) {
  res.render('home', {title:'Home'});
});

router.get('/rsk', function(req, res, next) {
  res.render('rsk', {title:'RSK'});
});

router.get('/thunder', function(req, res, next) {
  res.render('thunder', {title:'Thunder'});
});


router.get('/verify', function(req, res, next) {
  res.render('verify', {title:'Verify'});
});

router.get('/verifydoc', function(req, res, next) {
  res.render('verifydoc', {title:'Verify'});
});

router.get('/rsk/verifydoc', function(req, res, next) {
  res.render('rskverify', {title:'Verify'});
});

router.get('/thunder/verifydoc', function(req, res, next) {
  res.render('thunder-verify', {title:'Verify'});
});


router.get('/inforuso', function (req, res) {
  var attendee = req.query.participante;
  var wasThere = true;
  var txt = attendee + " participou do evento Inforuso 2019 no dia 02/10/2019, tendo completado a trilha de blockchain.";
  var attendeesArray = ['Jorge', 'Lucas', 'Gabriel', 'Yakko', 'Sérgio', 'André', 'Victor', 'Harlen'];
  if (attendeesArray.indexOf(attendee) < 0) {
    wasThere = false;
    txt = attendee + " não participou do evento Inforuso 2019.";
  }
  res.render('inforuso', {title: 'Inforuso', attended: wasThere, text: txt });
});


router.get('/inforuso/registro', function (req, res) {
  res.render('inforeg');
});

module.exports = router;

