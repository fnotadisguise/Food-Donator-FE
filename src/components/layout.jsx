import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "../core/protected-routes";
import Footer from "./footer";
import Header from "./header";
import AuthComponent from "./pages/auth";
import DonationsComponent from "./pages/donation/donations";
import DonationsListComponent from "./pages/donation/donations-list";
import FoodBankComponent from "./pages/food-bank/foodbank";
import FoodBankListComponent from "./pages/food-bank/foodbank-list";
import DonationLocatorComponent from "./pages/food-bank/foodbank-locator";
import HomeComponent from "./pages/home";
import LogoutComponent from "./pages/logout";
import AdminPortal from "./pages/adminPortal/adminPort";
import { useState } from "react";

const LayoutComponent = () => {
  const [role, setData] = useState("");
  const handleDataChange = (newData) => {
    setData(newData);
  };
  return (
    <div className="layout">
      <div>
        <Header data={role} />
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<HomeComponent />} />
            <Route path="/adminPortal" element={<AdminPortal />} />
            <Route path="/foodbank-locator" element={<DonationLocatorComponent />} />
            <Route path="/add-foodbank" element={<FoodBankComponent />} />
            <Route path="/edit-foodbank/:id" element={<FoodBankComponent />} />
            <Route path="/view-foodbank/:id" element={<FoodBankComponent />} />
            <Route path="/foodbank" element={<FoodBankListComponent />} />
            <Route path="/donations" element={<DonationsListComponent />} />
            <Route path="/add-donation" element={<DonationsComponent />} />
            <Route path="/edit-donation/:id" element={<DonationsComponent />} />
            <Route path="/logout" element={<LogoutComponent onDataUpdate={handleDataChange} />} />
          </Route>
          <Route path="/auth" element={<AuthComponent onDataUpdate={handleDataChange} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default LayoutComponent;
