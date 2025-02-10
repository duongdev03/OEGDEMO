import { Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePages/home";
import AssetManagement from "./Components/assetManagement/assetManagement";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AssetManagement" element={<AssetManagement />} />
      </Routes>
    </div>
  );
}

export default App;
