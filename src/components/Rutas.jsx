import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import GlobalLoading from "./GlobalLoading.jsx";
import Pagina404 from "./Pagina404.jsx";
import Dashboard from "./Dashboard.jsx";
import Login2 from "./Login2.jsx";
import Register from "./Register.jsx";
import BusquedaPeliculas from "./BusquedaPeliculas.jsx";
import GenerarSinopsis from "./IASinopsis.jsx";
const Rutas = () => {
  const isLoading = useSelector((state) => state.loadingSlice.count > 0);

  return (
    <BrowserRouter>
      {isLoading && <GlobalLoading />}

      <Routes>
        <Route path="/login" element={<Login2 />} />
        <Route path="/register" element={<Register />} />  
        <Route path="/" element={<Dashboard />} />
        <Route path="/peliculasApi" element={<BusquedaPeliculas />} />
        <Route path= "/iaSinopsis" element={<GenerarSinopsis />} />
        <Route path="*" element={<Pagina404></Pagina404>}></Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Rutas;
