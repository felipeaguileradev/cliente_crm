import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../config/axios";
import Spinner from "../layout/Spinner";

const EditarProducto = ({ match, history }) => {
  const { id } = match.params;

  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    imagen: "",
  });

  const [archivo, setArchivo] = useState("");

  const leerInformacionProducto = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  const leerArchivo = (e) => {
    setArchivo(e.target.files[0]);
  };

  // consultar la api para traer el producto a editar
  useEffect(() => {
    const consultarAPI = async () => {
      const productoConsulta = await clienteAxios.get(`/productos/${id}`);
      setProducto(productoConsulta.data);
    };
    consultarAPI();
  }, [id]);

  // Extraer los valores del state
  const { nombre, precio, imagen } = producto;
  console.log(nombre);

  const editarProducto = async (e) => {
    e.preventDefault();

    // crear un form-data
    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("precio", producto.precio);
    formData.append("imagen", archivo);

    try {
      const res = await clienteAxios.put(`/productos/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        Swal.fire("Editado Correctamente", res.data.mensaje, "success");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Hubo un error",
        text: "Vuelva a intentarlo",
      });
    }

    //REDIRECCIONAR
    history.push("/productos");
  };

  if (!nombre) return <Spinner />;

  return (
    <>
      <h2>Editar Producto</h2>
      <form onSubmit={editarProducto}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={leerInformacionProducto}
            defaultValue={nombre}
          />
        </div>

        <div className="campo">
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            min="0.00"
            step="0.01"
            placeholder="Precio"
            onChange={leerInformacionProducto}
            defaultValue={precio}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          {imagen && (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`}
              alt="imagen producto"
              width={300}
            />
          )}
          <input type="file" name="imagen" onChange={leerArchivo} />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Editar Producto"
          />
        </div>
      </form>
    </>
  );
};

export default withRouter(EditarProducto);
