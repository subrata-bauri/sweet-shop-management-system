import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { fetchSweets, purchaseSweet, deleteSweet } from "../services/sweetService";
import AdminAddSweet from "../components/AdminAddSweet";
import AdminEditSweet from "../components/AdminEditSweet";

function Dashboard() {
  const { token, user } = useContext(AuthContext);

  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSweets = async () => {
    try {
      const data = await fetchSweets(token);
      setSweets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, [token]);

  const handlePurchase = async (sweetId) => {
    try {
      await purchaseSweet(sweetId, token);
      loadSweets(); // 🔄 refresh list after purchase
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (sweetId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this sweet?"
  );

  if (!confirmDelete) return;

  try {
    await deleteSweet(sweetId, token);
    loadSweets(); // refresh list
  } catch (err) {
    alert(err.message);
  }
};

  if (loading) return <p>Loading sweets...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
  <div>
    {/* Dashboard Header */}
<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
  <div>
    <h2 className="text-2xl font-semibold text-gray-800">
      Dashboard
    </h2>
    <p className="text-sm text-gray-500">
      Manage and explore available sweets
    </p>
  </div>
</div>

    {user?.role === "admin" && (
      <AdminAddSweet onSweetAdded={loadSweets} />
    )}

    <h3>Available Sweets</h3>

    {sweets.length === 0 ? (
  <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
    <p className="text-lg font-medium">No sweets available</p>
    <p className="text-sm mt-1">
      Admins can add sweets using the form above.
    </p>
  </div>
    ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {sweets.map((sweet) => (
    <div
      key={sweet._id}
      className="bg-white rounded-lg shadow p-5 flex flex-col justify-between"
    >
      <div>
        <h3 className="text-lg font-semibold">{sweet.name}</h3>
        <p className="text-sm text-gray-500">{sweet.category}</p>
        <p className="mt-2">₹{sweet.price}</p>
        <p className="text-sm">Stock: {sweet.quantity}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handlePurchase(sweet._id)}
          disabled={sweet.quantity === 0}
          className="flex-1 bg-green-500 text-white py-1 rounded disabled:bg-gray-300"
        >
          Buy
        </button>

        {user?.role === "admin" && (
          <>
            <AdminEditSweet sweet={sweet} onUpdated={loadSweets} />
            <button
              onClick={() => handleDelete(sweet._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  ))}
</div>


    )}
  </div>
);

}

export default Dashboard;
