import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import clienteAxios from "../config/axios";

const EditarCliente = ({ history, match }) => {
  // obtener el ID
  const { id } = match.params;

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });

  //   cliente.

  //   Query a la API
  useEffect(() => {
    const consultarAPI = async () => {
      const clienteConsulta = await clienteAxios.get(`/clientes/${id}`);
      setCliente(clienteConsulta.data);
    };
    consultarAPI();
  }, [id]);

  const actualizarState = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const actualizarCliente = (e) => {
    e.preventDefault();

    // enviar la petición por axios
    clienteAxios.put(`/clientes/${cliente._id}`, cliente).then((res) => {
      if (res.data.code === 11000) {
        console.log("Error de duplicado de mongo");
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: "Ese cliente ya está registrado",
        });
      } else {
        console.log(res.data);
        Swal.fire("Correcto", "Se actualizó correctamente", "success");
      }
      history.push("/");
    });
  };

  const validarCliente = (e) => {
    const { nombre, apellido, email, empresa, telefono } = cliente;

    let valido =
      (!!nombre && !nombre.length) ||
      (!!apellido && !apellido.length) ||
      (!!email && !email.length) ||
      (!!empresa && !empresa.length) ||
      (!!telefono && !telefono.length);

    return valido;
  };

  return (
    <>
      <h2>Editar Cliente</h2>

      <form onSubmit={actualizarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            onChange={actualizarState}
            value={cliente.nombre}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            onChange={actualizarState}
            value={cliente.apellido}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            onChange={actualizarState}
            value={cliente.empresa}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            onChange={actualizarState}
            value={cliente.email}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="Teléfono Cliente"
            name="telefono"
            onChange={actualizarState}
            value={cliente.telefono}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Guardar Cliente"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </>
  );
};

export default withRouter(EditarCliente);
