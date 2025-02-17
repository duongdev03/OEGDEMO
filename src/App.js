import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Home";
import AssetManagement from "./Pages/AssetManagement";
import AssetDetail from "./Pages/AssetDetail";
import AddCollateral from "./Pages/AddCollateral";
import DynamicTitle from "./Pages/DynamicTitle";

function App() {
  return (
    <div>
      <DynamicTitle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AssetManagement" element={<AssetManagement />} />
        <Route path="/AssetDetail/:code" element={<AssetDetail />} />
        <Route path="/AddCollateral" element={<AddCollateral />} />
      </Routes>
    </div>
  );
}

export default App;
