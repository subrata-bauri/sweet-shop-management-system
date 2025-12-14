import { useState } from "react";
import { registerUser } from "../services/authService";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await registerUser({
        name,
        email,
        password,
        role
      });

      setMessage(response.message);
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <div className="min-h-[80vh] flex items-center justify-center">
    <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">
      
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
        Create an Account
      </h2>
      <p className="text-sm text-center text-gray-500 mb-6">
        Register to manage and explore sweets
      </p>

      {message && (
        <p className="mb-4 text-sm text-green-600 text-center">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 text-sm text-red-600 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-md transition"
        >
          Register
        </button>
      </form>

      <p className="text-xs text-center text-gray-500 mt-6">
        Already have an account? Please login from the top menu.
      </p>
    </div>
  </div>
);

}

export default Register;
