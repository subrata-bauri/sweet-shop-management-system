import API_BASE_URL from "./api";

export const fetchSweets = async (token) => {
  const response = await fetch(`${API_BASE_URL}/sweets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch sweets");
  }

  return data;
};

export const purchaseSweet = async (sweetId, token) => {
  const response = await fetch(
    `${API_BASE_URL}/sweets/${sweetId}/purchase`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Purchase failed");
  }

  return data;
};

export const addSweet = async (sweetData, token) => {
  const response = await fetch(`${API_BASE_URL}/sweets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(sweetData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add sweet");
  }

  return data;
};

export const updateSweet = async (sweetId, updates, token) => {
  const response = await fetch(`${API_BASE_URL}/sweets/${sweetId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update sweet");
  }

  return data;
};

export const deleteSweet = async (sweetId, token) => {
  const response = await fetch(`${API_BASE_URL}/sweets/${sweetId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete sweet");
  }

  return data;
};
