import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import clienteAxios from "../config/axios";
// context
import { CRMContext } from "../context/CRMContext";

const Login = ({ history }) => {
  const [auth, setAuth] = useContext(CRMContext);

  const [credenciales, setCredenciales] = useState({});

  const leerDatos = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value,
    });
  };
  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await clienteAxios.post(
        "/iniciar-sesion",
        credenciales
      );

      //   extraer el token y colocarlo en localStorage
      const { token } = respuesta.data;
      localStorage.setItem("token", token);
      //   guardar en el context
      setAuth({
        token,
        auth: true,
      });

      Swal.fire("Login", "Has iniciado Sesión", "success");
      history.push("/");
    } catch (error) {
      if (error.response) {
        // error del usuario, login
        Swal.fire("Hubo un error", error.response.data.mensaje, "error");
      } else {
        // Errors de cors
        Swal.fire("Hubo un error", "Hubo un error", "error");
      }
    }
  };

  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>
      <div className="contenedor-formulario">
        <form onSubmit={iniciarSesion}>
          <div className="campo">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email para Iniciar Sesión"
              required
              onChange={leerDatos}
            />
          </div>
          <div className="campo">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password para Iniciar Sesión"
              required
              onChange={leerDatos}
            />
          </div>
          <input
            type="submit"
            value="Iniciar Sesión"
            className="btn btn-verde btn-block"
          />
        </form>
      </div>
    </div>
  );
};

export default withRouter(Login);
