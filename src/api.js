// No backend needed — auth is handled locally in the app.
// This file mimics the same API shape so LoginPage.jsx works without any changes.

const MOCK_USERS = [
  { id: 1, email: "user@netflix.com", password: "password123", name: "Umesh" },
  { id: 2, email: "admin@netflix.com", password: "admin123", name: "Admin" },
];

const api = {
  post: async (path, body) => {
    if (path === "/auth/login") {
      const { email, password } = body;
      const user = MOCK_USERS.find(
        (u) =>
          u.email === email.toLowerCase().trim() && u.password === password
      );
      if (!user) {
        const error = new Error("Incorrect email or password.");
        error.response = { data: { message: "Incorrect email or password." } };
        throw error;
      }
      return {
        data: {
          message: "Login successful",
          user: { id: user.id, email: user.email, name: user.name },
        },
      };
    }
    throw new Error(`Unknown path: ${path}`);
  },
};

export default api;
