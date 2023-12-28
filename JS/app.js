document.getElementById("btnGuardar").hidden = true;
document.getElementById("btnCancelar").hidden = true;

function validar(nombre,descripcion,estreno,portada){
  todo_correcto = false;
  if (nombre.length >= 2 && descripcion.length >= 5 && nombre != "" && descripcion != "" && estreno !== "" && portada !== ""){
    todo_correcto = true;
  } 
  return todo_correcto;
}

async function agregarPelicula() {
  const datos = await axios.get(
    "https://62c682a22b03e73a58cef3bb.mockapi.io/peliculas"
  );

  let nombre = document.getElementById("nombre").value;
  let descripcion = document.getElementById("descripcion").value;
  let estreno = document.getElementById("estreno").value;
  let portada = document.getElementById("portada").value;

  let esTrue = false;

    if (validar(nombre,descripcion,estreno,portada)) {
      if (datos.data.length === 0) {
        await axios.post(
          "https://62c682a22b03e73a58cef3bb.mockapi.io/peliculas",
          {
            nombre: nombre,
            descripcion: descripcion,
            estreno: estreno,
            portada: portada,
          }
        );

        Swal.fire({
          title: "Registro exitoso",
          text: "La película fue registrada con éxito",
          icon: "success",
        });
       limpiar();

      } else if (datos.data.length >= 1) {
        for (let i = 0; i < datos.data.length; i++) {
          if (datos.data[i].nombre === nombre) {
            esTrue = true;
            break;
          }
        }
        if (!esTrue) {
          await axios.post(
            "https://62c682a22b03e73a58cef3bb.mockapi.io/peliculas",
            {
              nombre: nombre,
              descripcion: descripcion,
              estreno: estreno,
              portada: portada,
            }
          );

          Swal.fire({
            title: "Registro exitoso",
            text: "La película fue registrada con éxito",
            icon: "success",
          });

          limpiar();
          
        } else {
           Swal.fire({
            title: "Película existente",
            text: "La película ingresada ya existe",
            icon: "warning",
          });
        }
      }
     
  } else {
    Swal.fire({
      title: "Datos no ingresados",
      text: "Datos faltantes o no válidos. Por favor, complete todos los campos.",
      icon: "warning",
    });
  }
  mostrar();
}

async function mostrar() {
  const datos = await axios.get(
    "https://62c682a22b03e73a58cef3bb.mockapi.io/peliculas"
  );

  let listado = `
    <table id="table" class="table table-secondary rounded table-hover table-striped table-bordered mt-4">
      <thead class="text-center">
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col" class="d-none d-lg-table-cell">Descripción</th>
          <th scope="col">Estreno</th>
          <th scope="col">Portada</th>
          <th colspan="3">Opciones</th>
        </tr>
      </thead>
      <tbody class="text-md-center align-items-center my-auto">
  `;

  for (let i = 0; i < datos.data.length; i++) {
    listado += `
      <tr class="align-middle">
        <td>${datos.data[i].nombre}</td>
        <td class="d-none d-lg-table-cell">${datos.data[i].descripcion}</td>
        <td class="celdaEstreno">${datos.data[i].estreno}</td>
        <td><img src="${datos.data[i].portada}"></td>
        <td class="d-flex flex-column h-100 gap-2">
          <button class="btn btn-danger" onclick="borrar(${datos.data[i].id})">ELIMINAR</button>
          <button class="btn btn-success" onclick="modificar(${datos.data[i].id})">MODIFICAR</button>
          <button class="btn btn-primary" onclick="verDatos(${datos.data[i].id})">VER</button>
        </td>
      </tr>
    `;
  }

  listado += `</tbody></table>`;
  document.getElementById("lista").innerHTML = listado;
}

async function borrar(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro de eliminar esta película?",
    text: "Una vez eliminada la película no podrás regresar atrás",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    await axios.delete(
      "https://62c682a22b03e73a58cef3bb.mockapi.io/peliculas/" + id
    );

    Swal.fire({
      title: "Película eliminada con éxito",
      text: "La película seleccionada fue eliminada con éxito",
      icon: "success",
    });

    mostrar();
  }
}

async function modificar(id) {
  document.getElementById("btnRegistro").hidden = true;
  document.getElementById("btnGuardar").hidden = false;
  document.getElementById("btnCancelar").hidden = false;

  const dato = await axios.get(
    "https://62c682a22b03e73a58cef3bb.mockapi.io/peliculas/" + id
  );

  document.querySelector("h2").textContent = "Modificación de Película";
  document.getElementById("nombre").value = dato.data.nombre;
  document.getElementById("descripcion").value = dato.data.descripcion;
  document.getElementById("estreno").value = dato.data.estreno;
  document.getElementById("portada").value = dato.data.portada;

  let imgTag = document.getElementById("portada");
  imgTag.src = dato.data.portada;
  imgTag.hidden = false;

  document.getElementById("btnOcultar").hidden = true;
  localStorage.setItem("id", id);
}

async function guardar() {
  const id = localStorage.getItem("id");
  await axios.put(
    "https://62c682a22b03e73a58cef3bb.mockapi.io/peliculas/" + id,
    {
      nombre: document.getElementById("nombre").value,
      descripcion: document.getElementById("descripcion").value,
      estreno: document.getElementById("estreno").value,
      portada: document.getElementById("portada").value
    }
  );

  Swal.fire({
    title: "Cambios guardados",
    text: "Los cambios se guardaron correctamente",
    icon: "success",
  });

  limpiar();
  mostrar();
  
  document.querySelector("h2").textContent = "Registro de Películas";
  document.getElementById("btnRegistro").hidden = false;
  document.getElementById("btnOcultar").hidden = true;
  document.getElementById("btnGuardar").hidden = true;
  document.getElementById("btnCancelar").hidden = true;
}

async function verDatos(id) {
  const dato = await axios.get(
    "https://62c682a22b03e73a58cef3bb.mockapi.io/peliculas/" + id
  );
  
  document.querySelector("h2").textContent = "Detalle de Película";
  document.getElementById("labelNombre").textContent = "Nombre de la película:";
  document.getElementById("labelDescripcion").textContent = "Descripción:";
  document.getElementById("labelEstreno").textContent = "Fecha de estreno:";
  document.getElementById("labelPortada").textContent = "URL de la portada:";

  document.getElementById("nombre").value = dato.data.nombre;
  document.getElementById("descripcion").value = dato.data.descripcion;
  document.getElementById("estreno").value = dato.data.estreno;
  document.getElementById("portada").value = dato.data.portada;

  document.getElementById("nombre").disabled = true;
  document.getElementById("descripcion").disabled = true;
  document.getElementById("estreno").disabled = true;
  document.getElementById("portada").disabled = true;

  let imgTag = document.getElementById("portada");
  imgTag.src = dato.data.portada;
  imgTag.hidden = false;

  document.getElementById("btnRegistro").hidden = true;
  document.getElementById("btnOcultar").hidden = false;
  document.getElementById("btnGuardar").hidden = true;
}

async function ocultarDatos() {
  
  document.querySelector("h2").textContent = "Registro de Películas";
  document.getElementById("labelNombre").textContent = "Ingrese el nombre de la película:";
  document.getElementById("labelDescripcion").textContent = "Ingrese la descripción:";
  document.getElementById("labelEstreno").textContent = "Ingrese la fecha de estreno:";
  document.getElementById("labelPortada").textContent = "Ingrese la URL de la portada:";

  document.getElementById("nombre").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("estreno").value = "";
  document.getElementById("portada").value = "";

  document.getElementById("nombre").disabled = false;
  document.getElementById("descripcion").disabled = false;
  document.getElementById("estreno").disabled = false;
  document.getElementById("portada").disabled = false;

  document.getElementById("btnRegistro").hidden = false;
  document.getElementById("btnOcultar").hidden = true;
  document.getElementById("btnGuardar").hidden = true;
}

async function cancelar(){
  document.querySelector("h2").textContent = "Registro de Películas";
  document.getElementById("nombre").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("estreno").value = "";
  document.getElementById("portada").value = "";

  document.getElementById("btnRegistro").hidden = false;
  document.getElementById("btnCancelar").hidden = true;
  document.getElementById("btnGuardar").hidden = true;
}

function limpiar() {
  document.getElementById("nombre").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("estreno").value = "";
  document.getElementById("portada").value = "";
}

document.getElementById("btnRegistro").addEventListener("click", agregarPelicula);
document.getElementById("btnGuardar").addEventListener("click", guardar);
document.getElementById("btnOcultar").addEventListener("click", ocultarDatos);
document.getElementById("btnCancelar").addEventListener("click", cancelar);

mostrar();

(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
