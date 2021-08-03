import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import clienteAxios from "../config/axios";
import { CRMContext } from "../context/CRMContext";

const NuevoCliente = ({ history }) => {
  const [auth, setAuth] = useContext(CRMContext);

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });

  const actualizarState = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const validarCliente = (e) => {
    const { nombre, apellido, email, empresa, telefono } = cliente;
    let valido =
      !nombre.length ||
      !apellido.length ||
      !email.length ||
      !empresa.length ||
      !telefono.length;

    return valido;
  };

  const agregarCliente = (e) => {
    e.preventDefault();

    clienteAxios.post("/clientes", cliente).then((res) => {
      if (res.data.code === 11000) {
        console.log("Error de duplicado de mongo");
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: "Ese cliente ya está registrado",
        });
      } else {
        console.log(res.data);
        Swal.fire("Se agregó el Cliente", res.data.mensaje, "success");
      }
      history.push("/");
    });
  };

  // verificar si el usuario no esta autenticado
  if (!auth.auth && localStorage.getItem("token") === auth.token) {
    history.push("/iniciar-sesion");
  }

  return (
    <>
      <h2>Nuevo Cliente</h2>

      <form onSubmit={agregarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="Teléfono Cliente"
            name="telefono"
            onChange={actualizarState}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Cliente"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </>
  );
};

export default withRouter(NuevoCliente);
