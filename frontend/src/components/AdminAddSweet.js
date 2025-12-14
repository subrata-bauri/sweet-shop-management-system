import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { addSweet } from "../services/sweetService";

function AdminAddSweet({ onSweetAdded }) {
  const { token } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await addSweet(
        {
          name,
          category,
          price: Number(price),
          quantity: Number(quantity)
        },
        token
      );

      setMessage("Sweet added successfully");
      setName("");
      setCategory("");
      setPrice("");
      setQuantity("");

      onSweetAdded(); // 🔄 refresh dashboard list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <div className="bg-white rounded-xl shadow p-6 mb-8">
    
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Add New Sweet
    </h3>

    {message && (
      <p className="mb-3 text-sm text-green-600">
        {message}
      </p>
    )}
    {error && (
      <p className="mb-3 text-sm text-red-600">
        {error}
      </p>
    )}

    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sweet Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rasgulla"
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Milk-based / Dry / Fried"
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price (₹)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
          required
        />
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-md transition"
        >
          Add Sweet
        </button>
      </div>
    </form>
  </div>
);
}

export default AdminAddSweet;
