var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: req.user.username+" Asv Sunrise" ,owner: req.user.owner });
});

function ensureAuthenticated(req,res, next){
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
