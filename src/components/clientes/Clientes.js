import React, { useContext, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import clienteAxios from "../config/axios";
import { CRMContext } from "../context/CRMContext";
import Spinner from "../layout/Spinner";
import Cliente from "./Cliente";

const Clientes = ({ history }) => {
  const [clientes, setClientes] = useState([]);

  const [auth, setAuth] = useContext(CRMContext);

  useEffect(() => {
    const consultarAPI = async () => {
      try {
        const clientesConsultas = await clienteAxios.get("/clientes", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setClientes(clientesConsultas.data);
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
  }, [clientes]);

  // if (!auth.auth) history.push("/iniciar-sesion");
  if (!clientes.length) return <Spinner />;

  return (
    <>
      <h2>Clientes</h2>
      <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i>
        Nuevo Cliente
      </Link>

      <ul className="listado-clientes">
        {clientes.map((cliente) => (
          <Cliente key={cliente._id} cliente={cliente} />
        ))}
      </ul>
    </>
  );
};

export default withRouter(Clientes);
