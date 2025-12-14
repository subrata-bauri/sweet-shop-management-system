import { useState, useContext } from "react";
import { loginUser } from "../services/authService";
import AuthContext from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await loginUser({ email, password });

      login(response.token);

      setMessage("Login successful");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-semibold text-center mb-6">
      Login to your account
    </h2>

    {message && <p className="text-green-600 mb-3">{message}</p>}
    {error && <p className="text-red-600 mb-3">{error}</p>}

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
      >
        Login
      </button>
    </form>
  </div>
);

}

export default Login;
