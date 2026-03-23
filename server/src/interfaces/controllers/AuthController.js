class AuthController {
  constructor(authenticationService) {
    this.authenticationService = authenticationService;
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const token = await this.authenticationService.authenticate(username, password);
      res.json({ token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async getCurrentUser(req, res) {
    try {
      res.json({ user: req.user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;