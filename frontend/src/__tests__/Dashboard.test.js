import "@testing-library/jest-dom"; 
import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import AuthContext from "../context/AuthContext";
import { fetchSweets } from "../services/sweetService";

// ✅ MOCK sweetService APIs
jest.mock("../services/sweetService", () => ({
  fetchSweets: jest.fn(),
  purchaseSweet: jest.fn(),
  deleteSweet: jest.fn()
}));


// 🔧 Helper function
const renderDashboard = async (role = "user", sweetsData = []) => {
  fetchSweets.mockResolvedValueOnce(sweetsData);

  render(
    <AuthContext.Provider
      value={{
        token: "fake-token",
        user: { role }
      }}
    >
      <Dashboard />
    </AuthContext.Provider>
  );
};

describe("Dashboard Component", () => {
  test("renders dashboard heading", async () => {
    await renderDashboard();

    expect(
      await screen.findByRole("heading", { name: /dashboard/i })
    ).toBeInTheDocument();
  });

  test("renders sweets list", async () => {
    await renderDashboard("user", [
      {
        _id: "1",
        name: "Rasgulla",
        category: "Milk-based",
        price: 10,
        quantity: 5
      }
    ]);

    expect(
      await screen.findByText("Rasgulla")
    ).toBeInTheDocument();
  });

  test("shows admin add sweet form only for admin", async () => {
    await renderDashboard("admin");

    // ✅ FIX #3 — use heading instead of ambiguous text
    expect(
      await screen.findByRole("heading", { name: /add sweet/i })
    ).toBeInTheDocument();
  });

  test("does not show admin add sweet form for normal user", async () => {
    await renderDashboard("user");

    expect(
      screen.queryByRole("heading", { name: /add sweet/i })
    ).not.toBeInTheDocument();
  });
});
