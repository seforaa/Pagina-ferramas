var swiper1 = new Swiper(".mySwiper-1", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    }
});

var swiper2 = new Swiper(".mySwiper-2", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    }
});

const carrito = document.getElementById('carrito');
const elemento1 = document.getElementById('lista-1');
const elemento2 = document.getElementById('lista-2');
const elemento3 = document.getElementById('lista-3');
const agregarCarritoBtn = document.querySelector('.agregar-carrito'); 
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const totalElement = document.getElementById('total-carrito');


cargarEventListeners();

function cargarEventListeners() {
    if (elemento1) elemento1.addEventListener('click', comprarElemento);
    if (elemento2) elemento2.addEventListener('click', comprarElemento);
    if (elemento3) elemento3.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
    if (agregarCarritoBtn) agregarCarritoBtn.addEventListener('click', agregarAlCarrito); 
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    document.addEventListener('DOMContentLoaded', cargarCarritoDeLocalStorage);
    document.addEventListener('DOMContentLoaded', calcularTotal);
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h1').textContent, 
        precio: elemento.querySelector('.precio').textContent,
        id: elemento.querySelector('a').getAttribute('data-id')
    }
    insertarCarrito(infoElemento);
}


function guardarCarritoEnLocalStorage(){
    localStorage.setItem('carrito', JSON.stringify(Array.from(lista.children).map(item => item.outerHTML)));
}

document.addEventListener('DOMContentLoaded', () => {
    if (localSmetorage.getItem('carrito')) {
        lista.innerHTML = JSON.parse(localStorage.getItem('carrito')).join('');
    }
}); 

function cargarCarritoDeLocalStorage(){
    if (localStorage.getItem('carrito')){
        lista.innerHTML = '';
       const productos = JSON.parse(localStorage.getItem('carrito'));
       productos.forEach(producto => {
            lista.innerHTML += producto;
       });
       calcularTotal();
    }
}

function agregarAlCarrito(e) {
    e.preventDefault();

    // Obtener información 
    const imagen = document.querySelector('.container-fluid img').src;
    const titulo = document.querySelector('.container-fluid h1').textContent;
    const precio = document.querySelector('.container-fluid .precio').textContent;

    // Crear objeto con la información del producto
    const infoElemento = {
        imagen: imagen,
        titulo: titulo,
        precio: precio,
        id: agregarCarritoBtn.getAttribute('data-id')
    }

    // Insertar el producto en el carrito
    insertarCarrito(infoElemento);
}

function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${elemento.imagen}" width=100 ></td>
        <td> ${elemento.titulo}</td>
        <td>${elemento.precio}</td>
        <td><a href="#" class="borrar" data-id="${elemento.id}">X</a></td>
    `;
    lista.appendChild(row);

    guardarCarritoEnLocalStorage();
    calcularTotal();
}

function eliminarElemento(e) {
    e.preventDefault();

    if (e.target.classList.contains('borrar')) {
        e.target.parentElement.parentElement.remove();
        guardarCarritoEnLocalStorage();
        calcularTotal(); //vuelve a calcular luego de eliminar
    }
}

function vaciarCarrito() {
    lista.innerHTML = ''; // Vacía el contenido de la tabla
    localStorage.removeItem('carrito');
    calcularTotal();
}


function mostrarProductosCarrito() {
    // Obtener el contenedor donde se mostrarán los productos
    const productosCarritoDiv = document.querySelector('#lista-carrito tbody');
    // Limpiar el contenido existente
    productosCarritoDiv.innerHTML = '';
  
    // Obtener productos del almacenamiento local
    if (localStorage.getItem('carrito')) {
      const productos = JSON.parse(localStorage.getItem('carrito'));
      // Mostrar cada producto en el contenedor
      productos.forEach(producto => {
        const productoDiv = document.createElement('tr');
        productoDiv.innerHTML = producto;
        productosCarritoDiv.appendChild(productoDiv);
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDeLocalStorage();
    calcularTotal();
})


// Llama a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', mostrarProductosCarrito);

//calculo del total
function calcularTotal(){
    const precios = document.querySelectorAll('#lista-carrito tbody tr td:nth-child(3)');
    let total = 0;
    precios.forEach(precio => {
        const precioNumerico = parseFloat(precio.textContent.replace('$', ''));
        total += precioNumerico;
    });
    totalElement.textContent = `Total: CLP ${total.toFixed(0)}`; // Cambiar $ por CLP

    const totalPagoElement = document.getElementById('total-pago');
    totalPagoElement.textContent = `CLP ${total.toFixed(0)}`;
}


