import React, { useState, useEffect } from "react";
import clienteAxios from "../config/axios";
import DetallesPedidos from "./DetallesPedidos";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const consultarAPI = async () => {
      const resultado = await clienteAxios.get("/pedidos");
      setPedidos(resultado.data);
    };
    consultarAPI();
  }, [pedidos]);
  return (
    <>
      <h2>Pedidos</h2>

      <ul className="listado-pedidos">
        {pedidos.map((pedido) => (
          <DetallesPedidos key={pedido._id} pedido={pedido} />
        ))}
      </ul>
    </>
  );
};

export default Pedidos;
