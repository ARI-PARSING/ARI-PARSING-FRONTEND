import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import theme from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>

          <Toaster position="top-right" />
          <CssBaseline />
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}
export default App;