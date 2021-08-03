import React, { useContext, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import clienteAxios from "../config/axios";
import { CRMContext } from "../context/CRMContext";
import Spinner from "../layout/Spinner";
import Producto from "./Producto";

const Productos = ({ history }) => {
  const [auth, setAuth] = useContext(CRMContext);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const consultarAPI = async () => {
      try {
        const productosConsulta = await clienteAxios.get("/productos", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setProductos(productosConsulta.data);
      } catch (error) {
        // error de autorizacion
        if ((error.response.status = 500)) {
          history.push("/iniciar-sesion");
        }
      }
    };

    if (auth.token !== "") {
      consultarAPI();
    } else {
      history.push("/iniciar-sesion");
    }
  }, [productos]);

  if (!auth.auth) history.push("/iniciar-sesion");
  if (!productos.length) return <Spinner />;

  return (
    <>
      <h2>Productos</h2>

      <Link to="/productos/nuevo" className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i>
        Nuevo Producto
      </Link>

      <ul className="listado-productos">
        {productos.map((producto) => (
          <Producto key={producto._id} producto={producto} />
        ))}
      </ul>
    </>
  );
};

export default withRouter(Productos);
