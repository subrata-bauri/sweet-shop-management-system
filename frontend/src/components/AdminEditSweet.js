import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { updateSweet } from "../services/sweetService";

function AdminEditSweet({ sweet, onUpdated }) {
  const { token } = useContext(AuthContext);

  const [price, setPrice] = useState(sweet.price);
  const [quantity, setQuantity] = useState(sweet.quantity);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setError("");
    try {
      await updateSweet(
        sweet._id,
        { price: Number(price), quantity: Number(quantity) },
        token
      );
      setEditing(false);
      onUpdated();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!editing) {
    return (
      <button onClick={() => setEditing(true)}>
        Edit
      </button>
    );
  }

  return (
    <span>
      {error && <span style={{ color: "red" }}>{error}</span>}
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ width: "70px" }}
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        style={{ width: "70px" }}
      />
      <button onClick={handleUpdate}>Save</button>
      <button onClick={() => setEditing(false)}>Cancel</button>
    </span>
  );
}

export default AdminEditSweet;
