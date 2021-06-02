/***
 * 
 * Entrevista realizada el día 1 de Junio 2021
 * Interezado: Federico Manzano
 * Empresa Contratante: Mindtu
 * 
 * Logica de la aplicación
 * 
 */


(function() {
    
    // Arreglo que contiene los elemntos del carrito
    var carrito = new Array()
    
    // Indice que me permite añadirle un ID 
    // a los elementos cargados en el carrito
    var cantidadProdCarrito = 0
   

    /** 
     * Funcion para inicializar con los valores del 
     * archivo productos.js 
     */
    var inicializar = () => {
        cargarProductos()
        cargarLocalStorage()
        actualizarCarrito()
        actualizarCosto()
    }

    var cargar = () => {

        /**
         * Cuando presiona el botón carrito
         * de cada elemento del listado de productos
         * decide si agregar al carrito dicho producto o no
         * en caso que no este en el carrito y el producto tenga stock
         * lo agrega
         */
        $(".item .carrito").click((e) => {
            
            // Verifica si el elemento se encuentra en 
            // el carrito
            var repetido = false;

            // Objeto donde cargo la información
            // del elemento presionado
            var prodCarrito = {
                // Id del elemento dentro del carrito
                numero: cantidadProdCarrito + 1,

                // Nombre del producto dentro del listado de productos
                nombre: $(e.target).siblings(".titulo").text(),

                // Precio del producto
                precio: parseInt($(e.target).siblings(".precio").text()),

                // Cantidad disponible de dicho producto
                stock: parseInt($(e.target).siblings(".stock").text())
            }
            

            /**
             * Recorro el arreglo del carrito y verifico 
             * si el producto actual que se quiere añadir 
             * se encuentra disponible o no.
             */
            carrito.forEach( (ele) => {

                // Si el nombre es igual repetido = true
                if(ele.nombre === prodCarrito.nombre)
                    repetido = true
            })
            
            // Si hay stock y no está repetido lo 
            // agrega al carrito 
            if( !repetido && prodCarrito.stock > 0) {

                // Si el precio de una compra anterior 
                // es borrada
                $("#comprado").html("")

                // Agrego el elemnto
                carrito.push(prodCarrito)
                agregarLocalStorage(prodCarrito)
                actualizarCarrito()
                // actualiza el costo total de la compra
                actualizarCosto()

                // Incrementa el id del producto en el carrito
                cantidadProdCarrito ++
            } else if(prodCarrito.stock == 0) 
                BS.Toast({html: 'No Hay Stock disponible'}) 
            else if(repetido) 
                BS.Toast({html: 'El producto ya fue seleccionado'}) 

            
        })
    }

    /**
     * Funcion para cargar el producto dentro 
     * del los productos desde el JSON al HTML
     */
    const cargarProductos = () => {
      
        // Recorro los productos 
        productos.map( ( ele ) => {
            
            // Bloque de HTML para agregar el pedido al carrito
            // con la información del arreglo
            $("#app").append(`
                <div class="item">
                    <div class="cont-flex">
                        <img  class="img-display-128 img-display-enc fd-rojo-t"  
                        src="${ ele.imagen }"  alt="Imagen del producto">
                        <div class="info">
                            <h6 class="mab-1 titulo">${ ele.nombre }</h6>
                            <p class="descripcion">
                                ${ ele.descripcion }
                            </p>
                            <p class="f-grosor-9 precio">
                                ${ele.precio}
                            </p>
                            <p class="stock" style="display:none">
                                ${ele.stock}
                            </p>
                            <a class="btn-sm fd-verde mar-1 carrito">Carrito</a>
                        </div>
                    </div>
                </div>
                <div class="divisor"></div>
            `)
        })
    }

    /**
     * Funcion que calcula el total calculado en el carrito
     * @returns total actual calculado en el carrito
     */
    const actualizarCosto = () => {

        // Inicializo la variable
        var total = 0
        carrito.forEach( ( ele ) => {
            // Acumulo el precio de los productos
            total += ele.precio
        })


        // Lo imprimo en el html
        // Muestro el resultado parcial de lo acumulado
        $("#total").html(`<strong>Total: $<span>${ total }</span></strong>`)
        return total
    }

    /**
     * Vaciar la tabla donde se muestra el carrito
     */
    var vaciar = () => {

        // Borra la informacion del carrito dejandolo vacio
        $("#carrito-cargado table").html("")
    }

    /**
     * Evento Click para vaciar el carrito
     * El usuario presiona el elemento #vaciar 
     * y el carrito queda en el estado original
     */
    var vaciarContenidoCarrito = () => {
        $("#vaciar").click( () => {

            vaciar()

            carrito.map( (ele) => eliminarLocalStorage(ele.numero) )
            // Vacia el arreglo de productos en el carrito
            carrito.splice(0, carrito.length);
            
            // Vuelve a inicializar los valores del 
            // ID de los productos dentro del carrito
            enumerar()
            
            // Actualiza el costo actual en el carrito
            actualizarCosto()
        })
    }


    /**
     * Funcion que sirve para impromir la cabecera de 
     * la tabla del carrito en el HTML
     */
    var imprimirCabeceraDeTabla = () => {
        $("#carrito-cargado table").append(`
             <tr>
                <td>Numero</td>
                <td>Nombre</td>
                <td>Precio</td>
                <td>Borrar</td>
            </tr>
        `)
    }
    /**
     * Funcion que se encarga de actualizar 
     * los elementos del carrito en el HTML 
     * para que los vea el usuario
     */
    var actualizarCarrito = () => {

        // Vaciar carrito
        vaciar()

        // Imprimir nuevamente la cabecera de 
        // la tabla del carrito
        imprimirCabeceraDeTabla()

        // Recorro el elementos carrito
        // para mostrar el cuerpo con la informacion
        carrito.map((ele) => {
            $("#carrito-cargado table").append(`
                <tr >
                    <td>${ele.numero}</td>
                    <td class="nombreCarrito">${ele.nombre}</td>
                    <td>${ele.precio}</td>
                    <td >
                        <span  class="badge badge-rojo borrar" style="cursor:pointer">Borrar</span>
                    </td>
                </tr>
            `)
        })

        // Una vez actualizado el carrito se 
        // habilita el evento para poder borrar 
        // elementos del carrito 
        borrar()
    }

    /**
     * Vuelve a inicializar los valores ID
     * de los elementos en el carrito
     */
    var enumerar = () => {
        // Variable que configura el ID de los elementos
        // del carrito
        cantidadProdCarrito = 0

        // Configura el ID nuevamente
        // Para mostrar los elementos actualizados
        carrito.map( (e) => {
            e.numero = ++ cantidadProdCarrito
        })
    }


    /**
     * Función que contiene el método necesario
     * para borrar de a uno y a elección del usuario un elemento 
     * del carrito
     */
    var borrar = () => {

        // Este evento solo borra un elemento
        // del listado del carrito
        $("#carrito-cargado .borrar").click((e) => {

            // Obtiene el nombre del elemento a eliminar
            var nombre = $(e.target).parent().siblings(".nombreCarrito").text()
            
            // filtra y actualiza el arreglo del carrito
            var elimim = carrito.filter((e) => nombre === e.nombre)
            carrito = carrito.filter((e) => nombre !== e.nombre)
            
            if(elimim !== null)
                eliminarLocalStorage(elimim[0].numero)

            // Configur nuevamente los IDS
            enumerar()

            // Actualiza el carrito en el 
            // En la vista
            actualizarCarrito()

            // Vuelve a actualizar el costo
            actualizarCosto()
        })
    }

    var comprar = () => {

        /**
         * Evento click para llevar a cabo la compra
         */
        $("#comprar").click( () => {
            
            // Obtiene el total antes de borrar
            let total = actualizarCosto()
            
            // Actualiza el total en la vista
            $("#comprado").html(`<span>Total: $ ${total}</span>`)

            // Vacia la vista
            vaciar()

            carrito.map( (ele) => {
                eliminarLocalStorage(ele.numero)
            } )
            // Vacia el arreglo del carrito
            carrito.splice(0, carrito.length);
            
            // Inicializa la enumeración de IDS 
            enumerar()

            /**
             * Actualiza el costo parcial en la vista 0
             * en este caso
             */
            actualizarCosto()

        })
    } 

    const cargarLocalStorage = () => {
        for(let i = 1; i <= localStorage.length; i ++) {
            let obj = JSON.parse ( localStorage.getItem(i) )
            carrito.push(obj)
            console.log(obj)
        }
    }

    const eliminarLocalStorage = (id) => {
        console.log(id)
        localStorage.removeItem(id)
    }

    const agregarLocalStorage = (obj) => {
        localStorage.setItem(obj.numero, JSON.stringify(obj))
    }

    const Compras = {
        init: () => {
            inicializar()
            cargar()
            vaciarContenidoCarrito()
            comprar()
        }
    }
    window.Compras = Compras 
})()

Compras.init()
