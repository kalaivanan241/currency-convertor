import { createTheme, ThemeProvider } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import React from "react";

import "./App.css";

const Convertor = React.lazy(() => import("./components/Convertor"));
const Header = React.lazy(() => import("./components/Header"));

export const themeOptions = createTheme({
  palette: {
    primary: {
      main: "#212121",
    },
    secondary: {
      main: "#ff9800",
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={themeOptions}>
      <React.Suspense fallback={<LinearProgress />}>
        <div className="App">
          <Header />
          <Convertor />
        </div>
      </React.Suspense>
    </ThemeProvider>
  );
};

export default React.memo(App);
