  // MIDDLEWARE

  // CHECK USER IS AUTHENTICATED
  module.exports.checkAuthenticated = function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    res.redirect("/signin");
  }

    // CHECK USER IS NOT AUTHENTICATED
  module.exports.checkNotAuthenticated =  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    next();
  }