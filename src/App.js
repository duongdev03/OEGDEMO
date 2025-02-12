import { Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePages/home";
import AssetManagement from "./Components/assetManagement/assetManagement";
import AssetDetail from "./Components/assetManagement/detailAndUpdate";
import AddCollateral from "./Components/assetManagement/addCollateral";
import DynamicTitle from "./Components/DynamicTitle";

function App() {
  return (
    <div>
      <DynamicTitle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AssetManagement" element={<AssetManagement />} />
        <Route path="/AssetDetail/:assetCode" element={<AssetDetail />} />
        <Route path="/AddCollateral" element={<AddCollateral />} />
      </Routes>
    </div>
  );
}

export default App;
