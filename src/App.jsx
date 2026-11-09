import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Description from "./pages/Description";
import Users from "./pages/Users";

const App = () => {
  return (
    <div className="text-slate-900 bg-sky-100 min-h-screen">
      <h1 className="text-center text-4xl py-6">JSONPlaceholder</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/description/:id" element={<Description />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
