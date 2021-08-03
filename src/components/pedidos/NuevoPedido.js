import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../config/axios";
import FormBuscarProducto from "./FormBuscarProducto";
import FormCantidadProducto from "./FormCantidadProducto";

const NuevoPedido = ({ match, history }) => {
  const { id } = match.params;

  const [cliente, setCliente] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const consultarAPI = async () => {
      // consultar el cliente actual
      const resultado = await clienteAxios(`/clientes/${id}`);
      setCliente(resultado.data);
    };
    consultarAPI();
    actualizarTotal();
  }, [productos]);

  const buscarProducto = async (e) => {
    e.preventDefault();
    const resultadoBusqueda = await clienteAxios.post(
      `/productos/busqueda/${busqueda}`
    );

    if (resultadoBusqueda.data[0]) {
      let productoResultado = resultadoBusqueda.data[0];
      // agregar la llave "producto" (copia de id)
      productoResultado.producto = resultadoBusqueda.data[0]._id;
      productoResultado.cantidad = 0;

      setProductos([...productos, productoResultado]);
    } else {
      Swal.fire({
        type: "error",
        title: "No Resultados",
        text: "No hay resultados",
      });
    }
  };

  const leerDatosBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const restarProductos = (index) => {
    const todosProductos = [...productos];

    if (todosProductos[index].cantidad === 0) return;

    todosProductos[index].cantidad--;
    setProductos(todosProductos);
  };
  const aumentarProductos = (index) => {
    const todosProductos = [...productos];
    todosProductos[index].cantidad++;

    setProductos(todosProductos);
  };

  const eliminarProductoPedido = (id) => {
    const todosProductos = productos.filter(
      (producto) => producto.producto !== id
    );
    setProductos(todosProductos);
  };

  const actualizarTotal = () => {
    if (productos.length === 0) {
      setTotal(0);
      return;
    }

    let nuevoTotal = 0;
    productos.map(
      (producto) => (nuevoTotal += producto.cantidad * producto.precio)
    );

    setTotal(nuevoTotal);
  };

  const realizarPedido = async (e) => {
    e.preventDefault();
    const { id } = match.params;

    // construir el objeto
    const pedido = {
      cliente: id,
      pedido: productos,
      total: total,
    };

    // almacenar en BD
    const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido);

    // leer resultado
    if (resultado.status === 200) {
      Swal.fire({
        type: "success",
        title: "Correcto",
        text: resultado.data.mensaje,
      });
    } else {
      Swal.fire({
        type: "error",
        title: "Hubo un Error",
        text: "Vuelve a intentarlo",
      });
    }

    // redireccionar
    history.push("/pedidos");
  };
  return (
    <>
      <h2>Nuevo Pedido</h2>

      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>
          Nombre: {cliente.nombre} {cliente.apellido}
        </p>
        <p>Teléfono: {cliente.telefono}</p>
      </div>

      <FormBuscarProducto
        buscarProducto={buscarProducto}
        leerDatosBusqueda={leerDatosBusqueda}
      />

      <ul className="resumen">
        {productos.map((producto, index) => (
          <FormCantidadProducto
            key={producto.producto}
            producto={producto}
            restarProductos={restarProductos}
            aumentarProductos={aumentarProductos}
            index={index}
            eliminarProductoPedido={eliminarProductoPedido}
          />
        ))}
      </ul>
      <div className="campo">
        <p className="total">
          Total a pagar: <span>$ {total}</span>
        </p>
      </div>
      {total > 0 && (
        <form onSubmit={realizarPedido}>
          <input
            type="submit"
            className="btn btn-verde btn-block"
            value="Realizar Pedido"
          />
        </form>
      )}
    </>
  );
};

export default withRouter(NuevoPedido);
