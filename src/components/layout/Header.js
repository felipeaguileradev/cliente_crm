import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { CRMContext } from "../context/CRMContext";

const Header = ({ history }) => {
  const [auth, setAuth] = useContext(CRMContext);

  const cerrarSesion = () => {
    setAuth({
      token: "",
      auth: false,
    });

    localStorage.setItem("token", "");
    history.push("/iniciar-sesion");
  };
  return (
    <header className="barra">
      <div className="contenedor">
        <div className="contenido-barra">
          <h1>CRM - Administrador de Clientes</h1>
          {auth.auth && (
            <button
              type="button"
              className="btn btn-rojo"
              onClick={cerrarSesion}
            >
              <i className="far fa-times-circle"></i>
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default withRouter(Header);
