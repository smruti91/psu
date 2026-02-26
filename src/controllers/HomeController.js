const AuthController = require('./AuthController');

exports.index = async (req, res) => {
  console.log('HomeController.index called');
  // Delegate to AuthController.showLogin to show login with CAPTCHA
  await AuthController.showLogin(req, res);
};
