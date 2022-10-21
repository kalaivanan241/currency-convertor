import React from "react";
import "./App.css";

const Convertor = React.lazy(() => import("./components/Convertor"));
const Header = React.lazy(() => import("./components/Header"));

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Convertor />
    </div>
  );
};

export default App;
