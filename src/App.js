import { Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePages/home";
import AssetManagement from "./Components/assetManagement/assetManagement";
import AssetDetail from "./Components/assetManagement/detailAndUpdate";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AssetManagement" element={<AssetManagement />} />
        <Route path="/AssetDetail/:assetCode" element={<AssetDetail />} />
      </Routes>
    </div>
  );
}

export default App;
