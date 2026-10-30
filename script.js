"use strict";

const URL_API = "https://rickandmortyapi.com/api/character";
const CLAVE_FAVORITOS = "portaldex:favoritos";
const CLAVE_TEMA = "portaldex:tema";

const TRADUCCIONES = {
  estado: { Alive: "Vivo", Dead: "Muerto", unknown: "Desconocido" },
  genero: { Male: "Masculino", Female: "Femenino", Genderless: "Sin género", unknown: "Desconocido" },
  especie: {
    Human: "Humano", Alien: "Alienígena", Humanoid: "Humanoide", Robot: "Robot", Animal: "Animal",
    Cronenberg: "Cronenberg", Disease: "Enfermedad", "Mythological Creature": "Criatura mitológica",
    Poopybutthole: "Poopybutthole", unknown: "Desconocida"
  }
};

const $ = (id) => document.getElementById(id);

const elementos = {
  buscador: $("buscador"),
  filtroEstado: $("filtroEstado"),
  filtroGenero: $("filtroGenero"),
  filtroEspecie: $("filtroEspecie"),
  orden: $("orden"),
  limpiar: $("limpiarFiltros"),
  cuadricula: $("cuadricula"),
  mensaje: $("mensaje"),
  paginacion: $("paginacion"),
  textoPagina: $("textoPagina"),
  anterior: $("paginaAnterior"),
  siguiente: $("paginaSiguiente"),
  vistaExplorar: $("vistaExplorar"),
  vistaFavoritos: $("vistaFavoritos"),
  cuadriculaFavoritos: $("cuadriculaFavoritos"),
  mensajeFavoritos: $("mensajeFavoritos"),
  vaciarFavoritos: $("vaciarFavoritos"),
  contadorFavoritos: $("contadorFavoritos"),
  totalPersonajes: $("totalPersonajes"),
  botonTema: $("botonTema")
};

const estado = {
  pagina: 1,
  totalPaginas: 1,
  personajes: [],
  orden: "original",
  favoritos: cargarFavoritos(),
  controlador: null
};

/* ---------- Utilidades ---------- */

function crearElemento(etiqueta, clase, texto) {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

function retrasar(funcion, milisegundos) {
  let temporizador;
  return (...argumentos) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcion(...argumentos), milisegundos);
  };
}

const traducir = (diccionario, valor) => TRADUCCIONES[diccionario][valor] ?? valor;
const textoLugar = (lugar) => (!lugar || lugar === "unknown" ? "lugar desconocido" : lugar);

function normalizarPersonaje(personaje) {
  return {
    id: personaje.id,
    nombre: personaje.name,
    estado: personaje.status,
    especie: personaje.species,
    tipo: personaje.type,
    genero: personaje.gender,
    origen: personaje.origin?.name ?? "unknown",
    ubicacion: personaje.location?.name ?? "unknown",
    imagen: personaje.image,
    episodios: Array.isArray(personaje.episode) ? personaje.episode.length : 0
  };
}

function describir(personaje) {
  const especie = traducir("especie", personaje.especie);
  const tipo = personaje.tipo ? ` (${personaje.tipo})` : "";
  const episodios = personaje.episodios === 1 ? "1 episodio" : `${personaje.episodios} episodios`;
  return `${especie}${tipo} de género ${traducir("genero", personaje.genero).toLowerCase()}. ` +
    `Origen: ${textoLugar(personaje.origen)}. Visto por última vez en ${textoLugar(personaje.ubicacion)}. ` +
    `Aparece en ${episodios}.`;
}

function ordenar(lista, criterio) {
  if (criterio === "original") return lista;
  const ordenada = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  return criterio === "za" ? ordenada.reverse() : ordenada;
}

/* ---------- Favoritos (localStorage) ---------- */

function cargarFavoritos() {
  try {
    const guardados = JSON.parse(localStorage.getItem(CLAVE_FAVORITOS));
    return Array.isArray(guardados) ? guardados.filter((p) => p && typeof p.id === "number") : [];
  } catch {
    return [];
  }
}

function guardarFavoritos() {
  try {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(estado.favoritos));
  } catch {
    mostrarMensajeEn(elementos.mensaje, {
      icono: "💾", titulo: "No se pudo guardar",
      texto: "Tu navegador bloqueó el almacenamiento local. Los favoritos se perderán al cerrar la página."
    });
  }
}

const esFavorito = (id) => estado.favoritos.some((p) => p.id === id);

function alternarFavorito(personaje) {
  estado.favoritos = esFavorito(personaje.id)
    ? estado.favoritos.filter((p) => p.id !== personaje.id)
    : [...estado.favoritos, personaje];
  guardarFavoritos();
  sincronizarFavoritos();
}

function sincronizarFavoritos() {
  elementos.contadorFavoritos.textContent = estado.favoritos.length;
  document.querySelectorAll("[data-favorito]").forEach((boton) => {
    const marcado = esFavorito(Number(boton.dataset.favorito));
    boton.setAttribute("aria-pressed", String(marcado));
    boton.setAttribute("aria-label", `${marcado ? "Quitar de" : "Agregar a"} favoritos`);
  });
  if (!elementos.vistaFavoritos.hidden) pintarFavoritos();
}

/* ---------- Renderizado ---------- */

const ICONO_CORAZON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2 0 3.6 1 5.4 3 1.8-2 3.4-3 5.4-3 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z"/></svg>';

function crearTarjeta(personaje, indice) {
  const tarjeta = crearElemento("article", "tarjeta");
  tarjeta.dataset.estado = personaje.estado;
  tarjeta.style.animationDelay = `${Math.min(indice, 12) * 45}ms`;

  const boton = crearElemento("button", "favorito");
  boton.type = "button";
  boton.dataset.favorito = personaje.id;
  boton.innerHTML = ICONO_CORAZON;

  const retrato = crearElemento("div", "tarjeta__retrato");
  const imagen = document.createElement("img");
  imagen.src = personaje.imagen;
  imagen.alt = `Retrato de ${personaje.nombre}`;
  imagen.width = 300;
  imagen.height = 300;
  imagen.loading = "lazy";
  retrato.append(imagen);

  const etiquetas = crearElemento("div", "etiquetas");
  etiquetas.append(
    crearElemento("span", "etiqueta etiqueta--estado", traducir("estado", personaje.estado)),
    crearElemento("span", "etiqueta", traducir("especie", personaje.especie))
  );

  const cuerpo = crearElemento("div", "tarjeta__cuerpo");
  cuerpo.append(
    crearElemento("h3", "tarjeta__nombre", personaje.nombre),
    etiquetas,
    crearElemento("p", "tarjeta__descripcion", describir(personaje))
  );

  tarjeta.append(boton, retrato, cuerpo);
  return tarjeta;
}

function pintarTarjetas(contenedor, lista) {
  contenedor.replaceChildren(...lista.map(crearTarjeta));
  sincronizarFavoritos();
}

function mostrarMensajeEn(contenedor, { icono, titulo, texto, accion, error = false }) {
  contenedor.className = `mensaje${error ? " mensaje--error" : ""}`;
  const piezas = [
    crearElemento("span", "mensaje__icono", icono),
    crearElemento("h3", "mensaje__titulo", titulo),
    crearElemento("p", "mensaje__texto", texto)
  ];
  if (accion) {
    const boton = crearElemento("button", "boton", accion.texto);
    boton.type = "button";
    boton.addEventListener("click", accion.alHacerClic);
    piezas.push(boton);
  }
  contenedor.replaceChildren(...piezas);
  contenedor.hidden = false;
}

const ocultarMensaje = (contenedor) => { contenedor.hidden = true; };

function mostrarEsqueletos() {
  const huecos = Array.from({ length: 8 }, () => crearElemento("div", "tarjeta esqueleto"));
  elementos.cuadricula.replaceChildren(...huecos);
  ocultarMensaje(elementos.mensaje);
}

function actualizarPaginacion() {
  elementos.paginacion.hidden = estado.totalPaginas <= 1;
  elementos.textoPagina.textContent = `Página ${estado.pagina} de ${estado.totalPaginas}`;
  elementos.anterior.disabled = estado.pagina <= 1;
  elementos.siguiente.disabled = estado.pagina >= estado.totalPaginas;
}

function pintarExplorar() {
  ocultarMensaje(elementos.mensaje);
  pintarTarjetas(elementos.cuadricula, ordenar(estado.personajes, estado.orden));
  actualizarPaginacion();
}

function pintarFavoritos() {
  const hayFavoritos = estado.favoritos.length > 0;
  elementos.vaciarFavoritos.hidden = !hayFavoritos;
  if (!hayFavoritos) {
    elementos.cuadriculaFavoritos.replaceChildren();
    mostrarMensajeEn(elementos.mensajeFavoritos, {
      icono: "🌀", titulo: "Aún no hay favoritos",
      texto: "Toca el corazón de cualquier personaje y aparecerá aquí, guardado en tu navegador."
    });
    return;
  }
  ocultarMensaje(elementos.mensajeFavoritos);
  elementos.cuadriculaFavoritos.replaceChildren(
    ...ordenar(estado.favoritos, estado.orden).map(crearTarjeta)
  );
  document.querySelectorAll("#cuadriculaFavoritos [data-favorito]").forEach((boton) => {
    boton.setAttribute("aria-pressed", "true");
    boton.setAttribute("aria-label", "Quitar de favoritos");
  });
}

/* ---------- Consulta a la API ---------- */

function construirUrl() {
  const parametros = new URLSearchParams({ page: estado.pagina });
  const filtros = {
    name: elementos.buscador.value.trim(),
    status: elementos.filtroEstado.value,
    gender: elementos.filtroGenero.value,
    species: elementos.filtroEspecie.value
  };
  Object.entries(filtros).forEach(([clave, valor]) => valor && parametros.set(clave, valor));
  return `${URL_API}?${parametros}`;
}

const hayFiltrosActivos = () =>
  Boolean(elementos.buscador.value.trim() || elementos.filtroEstado.value ||
    elementos.filtroGenero.value || elementos.filtroEspecie.value);

async function consultarPersonajes() {
  estado.controlador?.abort();
  estado.controlador = new AbortController();
  mostrarEsqueletos();

  try {
    const respuesta = await fetch(construirUrl(), { signal: estado.controlador.signal });

    if (respuesta.status === 404) {
      estado.personajes = [];
      estado.totalPaginas = 1;
      elementos.cuadricula.replaceChildren();
      actualizarPaginacion();
      mostrarMensajeEn(elementos.mensaje, {
        icono: "🛸", titulo: "Sin resultados",
        texto: "Ningún personaje coincide con tu búsqueda en esta dimensión. Prueba con otros filtros.",
        accion: { texto: "Limpiar filtros", alHacerClic: limpiarFiltros }
      });
      return;
    }
    if (!respuesta.ok) throw new Error(`Respuesta inesperada del servidor (${respuesta.status})`);

    const datos = await respuesta.json();
    estado.personajes = datos.results.map(normalizarPersonaje);
    estado.totalPaginas = datos.info.pages;
    if (!hayFiltrosActivos()) elementos.totalPersonajes.textContent = datos.info.count;
    pintarExplorar();
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error("Error al consultar la API:", error);
    elementos.cuadricula.replaceChildren();
    elementos.paginacion.hidden = true;
    mostrarMensajeEn(elementos.mensaje, {
      icono: "⚡", titulo: "El portal falló",
      texto: "No pudimos conectar con la API. Revisa tu conexión a internet e inténtalo otra vez.",
      accion: { texto: "Reintentar", alHacerClic: consultarPersonajes },
      error: true
    });
  }
}

/* ---------- Eventos ---------- */

function reiniciarYConsultar() {
  estado.pagina = 1;
  consultarPersonajes();
}

function limpiarFiltros() {
  elementos.buscador.value = "";
  elementos.filtroEstado.value = "";
  elementos.filtroGenero.value = "";
  elementos.filtroEspecie.value = "";
  reiniciarYConsultar();
}

function cambiarPagina(delta) {
  estado.pagina += delta;
  consultarPersonajes();
  elementos.cuadricula.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cambiarVista(vista) {
  const mostrandoFavoritos = vista === "favoritos";
  elementos.vistaExplorar.hidden = mostrandoFavoritos;
  elementos.vistaFavoritos.hidden = !mostrandoFavoritos;
  document.querySelectorAll(".pestana").forEach((pestana) =>
    pestana.classList.toggle("is-activa", pestana.dataset.vista === vista));
  if (mostrandoFavoritos) pintarFavoritos();
}

function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  try { localStorage.setItem(CLAVE_TEMA, tema); } catch { /* sin almacenamiento disponible */ }
}

function configurarEventos() {
  const buscarConRetraso = retrasar(reiniciarYConsultar, 400);
  elementos.buscador.addEventListener("input", buscarConRetraso);
  [elementos.filtroEstado, elementos.filtroGenero, elementos.filtroEspecie]
    .forEach((filtro) => filtro.addEventListener("change", reiniciarYConsultar));

  elementos.orden.addEventListener("change", () => {
    estado.orden = elementos.orden.value;
    if (estado.personajes.length) pintarExplorar();
    if (!elementos.vistaFavoritos.hidden) pintarFavoritos();
  });

  elementos.limpiar.addEventListener("click", limpiarFiltros);
  document.getElementById("panelFiltros").addEventListener("submit", (e) => e.preventDefault());
  elementos.anterior.addEventListener("click", () => cambiarPagina(-1));
  elementos.siguiente.addEventListener("click", () => cambiarPagina(1));

  document.querySelectorAll(".pestana").forEach((pestana) =>
    pestana.addEventListener("click", () => cambiarVista(pestana.dataset.vista)));

  elementos.vaciarFavoritos.addEventListener("click", () => {
    if (!confirm("¿Seguro que quieres quitar todos tus favoritos?")) return;
    estado.favoritos = [];
    guardarFavoritos();
    sincronizarFavoritos();
  });

  elementos.botonTema.addEventListener("click", () => {
    const actual = document.documentElement.dataset.tema;
    aplicarTema(actual === "oscuro" ? "claro" : "oscuro");
  });

  document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-favorito]");
    if (!boton) return;
    const id = Number(boton.dataset.favorito);
    const personaje = estado.personajes.find((p) => p.id === id) ?? estado.favoritos.find((p) => p.id === id);
    if (personaje) alternarFavorito(personaje);
  });
}

configurarEventos();
sincronizarFavoritos();
consultarPersonajes();
