//test

//DECLARACIÓN DE VARIABLES EN COMÚN
var i;
var j;
var oro = [];
var poder = [];
var minas_de_oro = [];
var dado_mov_jugador = "-";
var juega_usuario = true;
var tiro_dado = false;
var cantidad_oponentes;
var seleccion_personaje_jugador;
var se_muestra_instructivo = false;
var segundos_de_juego = 0;
var minutos_de_juego = 0;
var contador_de_tiempo_de_juego;
var habilitar_tab = false;
//clearInterval(contador_de_tiempo_de_juego);

//Esta variable es para detectar si el usuario tiene visibilidad sobre el terreno (por fila y columna)
var visibilidad_terreno = [];

//Declaro este array multidimensional y lo cargo con valor falso a todas las posiciones.
//Cuando se cargue el tablero y la posición del usuario, se reemplazará el valor por true
for (i = 0; i < 20; i++) {
    visibilidad_terreno[i] = [];

    for (j = 0; j < 20; j++) {
        visibilidad_terreno[i][j] = false;
    }
}


/*Este es un array con booleanos, con una posición por cada jugador
Sirve para confirmar que el jugador no perdió y que sus movimientos (en las funciones de inteligencia artifical y cierre del juego)
se pueden hacer

Su tipología es: 
    esta_jugando_el_jugador[numero del jugador] = true o false
*/
var esta_jugando_el_jugador = [];
//por defecto, el usuario juega
esta_jugando_el_jugador[0] = true;

/*
Array multidimensional con tipo y subtipo de terreno posicionado por fila y columna.
Su tipología es:

tablero[NUMERO DE FILA de la posicion][NUMERO DE COLUMNA de la posición][0]: esto da el TIPO de terreno que hay en esa fila-columna
tablero[NUMERO DE FILA de la posicion][NUMERO DE COLUMNA de la posición][1]: esto da el SUBTIPO de terreno que hay en esa fila-columna
*/
var tablero = [];

/*creo un vector en donde se almacenarán las coordenadas de las ciudades
la posición 0 corresponde al jugador
Tipología: 

ciudades[numero de jugador][0] : es la fila de la ciudad del jugador
ciudades[numero de jugador][1] : es la columna de la ciudad del jugador
*/
var ciudades = [];

//Array multi dimensional con una posición por jugador, por indice de fila y de columna
//Aquí iran cargadas las posiciones de los personajes en pantalla
var posicion_personajes = [];


/*
------------------------------------------------------------------------------------------------------------------------------
*/

//INICIO CARGA DE VECTOR DE SPRITES DE TERRENO
var terrenos = [];

terrenos['verde'] = [];
terrenos['verde']['planicie'] = "img/verde_planicie.png";
terrenos['verde']['semiocupado'] = "img/verde_semiocupado.png";
terrenos['verde']['ocupado'] = "img/verde_ocupado.png";
terrenos['verde']['ciudad'] = "img/verde_ciudad.png";

terrenos['arena'] = [];
terrenos['arena']['planicie'] = "img/arena_planicie.png";
terrenos['arena']['semiocupado'] = "img/arena_semiocupado.png";
terrenos['arena']['ocupado'] = "img/arena_ocupado.png";
terrenos['arena']['ciudad'] = "img/arena_ciudad.png";

terrenos['nieve'] = [];
terrenos['nieve']['planicie'] = "img/nieve_planicie.png";
terrenos['nieve']['semiocupado'] = "img/nieve_semiocupado.png";
terrenos['nieve']['ocupado'] = "img/nieve_ocupado.png";
terrenos['nieve']['ciudad'] = "img/nieve_ciudad.png";


//INICIO CARGA DE VECTOR DE SPRITES DE personajes
var personajes = [];

personajes[0] = "img/soldado.png";
personajes[1] = "img/arquero.png";
personajes[2] = "img/mago.png";




//console.log(terrenos);
//FIN CARGA VECTOR DE SPRITES


/*
------------------------------------------------------------------------------------------------------------------------------
*/

$('.ventana_tablero').hide();
$('.visualizador_dado').hide();
$('.panel_lateral').hide();
$('.instructivo').hide();

$('#intro').hide();
$('#intro_primera_linea').hide();
$('#intro_segunda_linea').hide();
$('#intro_tercera_linea').hide();
$('#intro_cuarta_linea').hide();

$('#title').hide();
$('.botoneras_inicio').hide();

$('#boton_mute').hide();



//Posibilidad de pausar - continuar música
//El forzado de inicio de música está dentro de la función intro, ya que google bloquea un forzado sin interacción del usuario
$('#boton_mute').on('click', function () {
    if ($('audio')[0].paused == false) {
        $('audio')[0].pause();
        $('#boton_mute img').attr({
            src: 'img/un_mute.svg'
        });
    } else {
        $('audio')[0].play();
        $('#boton_mute img').attr({
            src: 'img/mute_rojo.svg'
        });
    }
});


//Llamada a la intro
intro();

//Activadores del menú de inicio para realizar el seteo de la UI
$('.botonera_cantidad_jugadores input').on('click', function () {
    if ($(this).attr("id") == "un_oponente") {
        cantidad_oponentes = 1;
        esta_jugando_el_jugador[1] = true;

    } else if ($(this).attr("id") == "dos_oponentes") {
        cantidad_oponentes = 2;

        for (i = 0; i < (cantidad_oponentes + 1); i++) {
            esta_jugando_el_jugador[i] = true;
        }

    } else {
        cantidad_oponentes = 3;

        for (i = 0; i < (cantidad_oponentes + 1); i++) {
            esta_jugando_el_jugador[i] = true;
        }
    }

    botonera_seleccion_personaje();

});

//Activar el tutorial cuando el jugador haga click en su personaje
$('.botoneras_inicio').on("click", "img", function () {

    //console.log("detecté  que hiciste click en una imagen");

    //Según lo que seleccione el usuario, se define que personaje va a tener
    if ($(this).attr("title") == "Arquero") {
        seleccion_personaje_jugador = 1;
        //console.log("hiciste click en el arquero");
    } else if ($(this).attr("title") == "Soldado") {
        seleccion_personaje_jugador = 0;
        //console.log("hiciste click en el Soldado");
    } else if ($(this).attr("title") == "Mago") {
        seleccion_personaje_jugador = 2;
        //console.log("hiciste click en el mago");
    } else {
        alert("Error al detectar selección");
        alert("Por favor recargá el juego");
    }

    //confirma que se haya elegido cantidad de jugadores

    if (cantidad_oponentes != undefined) {
        //console.log("llamo al armado del tablero");

        $('#title').fadeOut(1500);
        $('botoneras_inicio').fadeOut(1500);

        //Carga lo necesario para iniciar el juego y llama al Instructivo
        armado_tablero();
        seteo_de_variables_recursos();
        impresion_variables();
        mostrar_instructivo();
        se_muestra_instructivo = true;

        //console.log("Estas son todas las posiciones de los personajes:");
        //console.log(posicion_personajes);
    } else {
        //Esto no debería pasar nunca.
        //Si pasa, el usuario no tiene posibilidad de volver atras a seleccionar cantidad de jugadores, debe reiniciar el juego
        alert("Error al detectar la selección de cantidad de jugadores");
        alert("Por favor recargá el juego");

    }

});

//Intro salteable
function intro() {

    //Animaciones de la intro
    $('#intro').fadeIn(6000, function () {

        $('#intro_primera_linea').fadeIn(800);
        $('#intro_segunda_linea').delay(800).fadeIn(800);
        $('#intro_tercera_linea').delay(1600).fadeIn(800);
        $('#intro_cuarta_linea').delay(2400).fadeIn(800);

        $('#intro_cuarta_linea').delay(4000).fadeOut(800);
        $('#intro_tercera_linea').delay(4800).fadeOut(800);
        $('#intro_segunda_linea').delay(5600).fadeOut(800);
        $('#intro_primera_linea').delay(6400).fadeOut(800);


        //Para modificar el contenido luego de un tiempo muerto
        window.setTimeout(function () {
            $("#intro_tercera_linea").text('Es ahora');
            $("#intro_cuarta_linea").text('el momento de defenderse.');
        }, 8600);


        $("#intro_tercera_linea").delay(1000).fadeIn(800);
        $('#intro_cuarta_linea').delay(1000).fadeIn(800);


        $('#pie_de_intro').delay(12000).animate({
            fontWeight: "700",
        }, 1000);


    });


    //Posibilidad de saltear la intro
    $(document).one('keydown', function () {
        $('#intro').hide();

        //Forzar inicio de música
        $('audio')[0].play();

        seteo_menu_inicio();

    });



}

function seteo_menu_inicio() {
    $('#title').fadeIn(1000);
    $('.botoneras_inicio').fadeIn(1000);
    $('#boton_mute').fadeIn(1000);
}


//Modifica los botónes del inicio para elegir personaje
function botonera_seleccion_personaje() {
    //console.log("entre a la función de crear las imagencitas")
    $('.botonera_cantidad_jugadores').fadeOut(800);
    $('.botoneras_inicio').hide();

    var botonera_seleccion_personaje = $('<div>').addClass("botonera_seleccion_personaje");

    var titulo_seleccion_personaje = $('<h3>').text("Elegí tu personaje:");
    botonera_seleccion_personaje.append(titulo_seleccion_personaje);

    var nota_seleccion_personaje = $('<p>').text("Nota: la elección del personaje es meramente estética - no varía la forma de jugar");
    botonera_seleccion_personaje.append(nota_seleccion_personaje);

    var imagenes_personajes = $('<div>').css({
        display: "block",
    })

    var img_pj;

    //creo las etiquetas de imágenes de los personajes
    for (i = 1; i < 4; i++) {
        //console.log("entre");
        img_pj = $('<img>');

        //define que imagen sería
        if (i == 1) {
            //console.log("entre al condicional de arquero");
            img_pj.attr({
                src: "img/personajes_botonera_inicio/arquero.png",
                alt: "Imágen de un personaje arquero",
                title: "Arquero",
            });
        } else if (i == 2) {
            //console.log("entre al condicional de soldado");
            img_pj.attr({
                src: "img/personajes_botonera_inicio/soldado.png",
                alt: "Imágen de un personaje soldado",
                title: "Soldado",
            });
        } else {
            //console.log("entre al condicional de mago");
            img_pj.attr({
                src: "img/personajes_botonera_inicio/mago.png",
                alt: "Imágen de un personaje mago",
                title: "Mago",
            });
        }

        //Corrección de estilo sobre la imágen
        img_pj.css({
            width: "100px",
            cursor: "pointer",
            display: "inline-block",
            margin: "0 100px",
        });

        imagenes_personajes.append(img_pj);

    }
    botonera_seleccion_personaje.append(imagenes_personajes);


    $('.botoneras_inicio').append(botonera_seleccion_personaje);
    $('.botoneras_inicio').delay(500).fadeIn(1500);
}


function mostrar_instructivo() {
    //muestro el instructivo
    $('.instructivo').fadeIn(3000);

    //y te digo donde estás ubicado
    //Le avisa al usuario donde comienza
    if (posicion_personajes[0][0] == 2) {
        if (posicion_personajes[0][1] == 2) {
            $('.instructivo .fila #donde_comienzo').text("El margen superior izquierdo");
        } else if (posicion_personajes[0][1] == 17) {
            $('.instructivo .fila #donde_comienzo').text("El margen superior derecho");
        }
    } else if (posicion_personajes[0][0] == 17) {
        if (posicion_personajes[0][1] == 2) {
            $('.instructivo .fila #donde_comienzo').text("El margen inferior izquierdo");
        } else if (posicion_personajes[0][1] == 17) {
            $('.instructivo .fila #donde_comienzo').text("El margen inferior derecho");
        }
    }


}

//oculto el instructivo
$(document).on('keydown', function () {
    if (se_muestra_instructivo) {
        $('.instructivo').hide();
        se_muestra_instructivo = false;
        habilitar_tab = true;

        //activo el contador de tiempo
        contador();

    }
});

//Función que activa el contador e imprime en pantalla el tiempo en minutos y segundos
function contador() {
    contador_de_tiempo_de_juego = window.setInterval(function () {
        segundos_de_juego++;
        if (segundos_de_juego == 60) {
            segundos_de_juego = 0;
            minutos_de_juego += 1;
        }

        $('.tiempo_de_juego p').text(minutos_de_juego + "m " + segundos_de_juego + "s")

    }, 1000);
}


/*
------------------------------------------------------------------------------------------------------------------------------
*/

//INICIA DEFINICIÓN DE ACCIONES DE LOS BOTONES DEL PANEL DEL JUGADOR

//botón de acción del dado de movimientos
$('#dado_mov_jugador').on('click', function () {

    //si el jugador perdió, este botón no hace nada
    if (esta_jugando_el_jugador[0]) {
        //Consulta si es el turno del jugador
        //consulta si yá tiró el dado o aún no
        if (juega_usuario && !tiro_dado) {
            dado_mov_jugador = Math.ceil(Math.random() * 5);
            //console.log(dado_mov_jugador);
            tiro_dado = true;
            impresion_variables();

        }
    }

});

//Botón de finalizar turno
$('#pasar_turno').on('click', function () {
    //Consulta si es el turno del jugador
    //No importa si haya tirado o no el dado
    if (juega_usuario) {

        //prepara el dado para la siguiente vuelta
        dado_mov_jugador = 0;
        tiro_dado = false;

        //Define que el jugador no podrá seguir jugando
        juega_usuario = false;

        //llama a la función que opera a los demás jugadores
        juega_ai();
    }
});

//Botón para comprar minas de oro
$('#compra_oro').on('click', function () {

    //si el jugador perdió, este botón no hace nada
    if (esta_jugando_el_jugador[0]) {

        //Consulta si es el turno del usuario - si no lo es, no hace nada
        if (juega_usuario) {
            if (oro[0] >= 6) {
                if (minas_de_oro[0] < 10) {
                    oro[0] -= 6;
                    minas_de_oro[0] += 1;
                    impresion_variables();
                } else {
                    alert("No puede adquirir más minas de oro. Cantidad máxima de minas: 10");
                }

            } else {
                alert("No cuenta con oro suficiente. Valor de la mina de oro: 6");
            }
        }
    }
});


//Botón para comprar soldados (poderío miltiar)
$('#compra_soldado').on('click', function () {

    //si el jugador perdió, este botón no hace nada
    if (esta_jugando_el_jugador[0]) {

        //Consulta si es el turno del usuario - si no lo es, no hace nada
        if (juega_usuario) {
            if (oro[0] >= 3) {
                oro[0] -= 3;
                poder[0] += 1;
                impresion_variables();
            } else {
                alert("No cuenta con oro suficiente. Valor del soldado: 3");
            }
        }
    }


});

//FINALIZA LA DEFINICIÓN DE ACCIONES DE LOS BOTONES DEL PANEL DE JUGADOR



/*
------------------------------------------------------------------------------------------------------------------------------
*/


//Movimiento del usuario
$('.ventana_tablero').on('click', "table tr td img", function () {
    //comprueba que sea el turno y que haya tirado el dado
    //si tiro_dado es verdadero, implica que también es el turno del jugador

    //console.log('Le hice click a algo!');

    if (tiro_dado) {

        //comprueba que le queden movimientos por hacer
        if (dado_mov_jugador > 0) {



            var valor_de_columna_de_elemento_clickeado = $(this).parent().attr("class");
            var valor_de_fila_de_elemento_clickeado = $(this).parent().parent().attr("class");

            //console.log('Pude detectar que clickie el elemento: ' + valor_de_fila_de_elemento_clickeado + ' - ' + valor_de_columna_de_elemento_clickeado);


            //para facil identificación, se almacena el texto a comparar en una variable

            //almacenamiento del texto de las filas
            var valor_de_fila_actual_del_personaje = "fila" + posicion_personajes[0][0];
            var valor_de_fila_siguiente_al_personaje = "fila" + (posicion_personajes[0][0] + 1);
            var valor_de_fila_anterior_al_personaje = "fila" + (posicion_personajes[0][0] - 1);
            //almacenamiento del texto de las columnas
            var valor_de_columna_actual_del_personaje = "columna" + posicion_personajes[0][1];
            var valor_de_columna_siguiente_al_personaje = "columna" + (posicion_personajes[0][1] + 1);
            var valor_de_columna_anterior_al_personaje = "columna" + (posicion_personajes[0][1] - 1);




            //console.log('El pj está actualmente parado en: ' + valor_de_fila_actual_del_personaje + ' - ' + valor_de_columna_actual_del_personaje);


            //console.log('Valor de fila siguiente al personaje: ' + valor_de_fila_siguiente_al_personaje);
            //console.log('Valor de columna siguiente al personaje: '+valor_de_columna_siguiente_al_personaje);
            //console.log('Valor de fila anterior al personaje: ' + valor_de_fila_anterior_al_personaje);
            //console.log('Valor de columna anterior al personaje: '+valor_de_columna_anterior_al_personaje);

            /*************************************************************************************************************************
            ****************************************************************************************************************************
            IMPORTANTE: que pasa si clickeo un oponente?
            ****************************************************************************************************************************
            *************************************************************************************************************************
            */

            /*Esto puede resultar confuso por la utilización de las variables usadas:
            Si el usuario hizo click en un personaje oponente, hizo click en su imagen. El padre de la imagen es un div con clase:
            "personaje" y el id "personaje#" con el número de jugador.
            cuando consulte valor_de_columna_de_elemento_clickeado - almacené la clase del padre de la imágen. Es por esto que consulto primero:
            Si el padre llega a ser un div con clase "personaje" - entoncces muevo personaje del usuario a la posición matricial donde se encuentra el personaje oponente, sinó, continúo con el movimiento como siempre.
            */
            if (valor_de_columna_de_elemento_clickeado == "personaje") {

                var id_personaje_clickeado = $(this).parent().attr("id");
                var numero_jugador_clickeado;

                //Averiguo a que personaje seleccionó
                for (i = 1; i <= cantidad_oponentes; i++) {
                    if (id_personaje_clickeado == ("personaje" + i)) {
                        numero_jugador_clickeado = i;
                    }
                }

                //Utilizo variables auxiliares para la consulta de proximidad
                //Consulta si el oponente clickeado está en la misma fila, pero en columnas aledañas
                var consulta_misma_fila_diferente_columna = ((posicion_personajes[0][1] == posicion_personajes[numero_jugador_clickeado][1] - 1) || (posicion_personajes[0][1] == posicion_personajes[numero_jugador_clickeado][0] + 1)) && (posicion_personajes[0][0] == posicion_personajes[numero_jugador_clickeado][0]);
                //Consulta si el oponente clickeado está en la misma columna, pero en filas aledañas
                var consulta_misma_columna_diferente_fila = ((posicion_personajes[0][0] == posicion_personajes[numero_jugador_clickeado][0] - 1) || (posicion_personajes[0][0] == posicion_personajes[numero_jugador_clickeado][0] + 1)) && (posicion_personajes[0][1] == posicion_personajes[numero_jugador_clickeado][1]);

                //Averiguo si el oponente seleccionado es adyacente al personaje del usuario
                if (consulta_misma_columna_diferente_fila || consulta_misma_fila_diferente_columna) {

                    //Muevo pj a la nueva ubicación
                    //En este caso no consulto por subtipo de terreno, ya que nunca un personaje debería entrar a un terreno Ocupado


                    //resto la cantidad de movimientos disponibles
                    dado_mov_jugador--;

                    impresion_variables();

                    //limpia el css del tipo de cursor de las posiciones aledañas antes de mover
                    restablecer_cursor(posicion_personajes[0][0], posicion_personajes[0][1]);


                    //Clickié un personaje oponente. Averiguo su posición matricial:
                    var valor_de_fila_del_oponente_clickeado = "fila" + posicion_personajes[numero_jugador_clickeado][0];
                    var valor_de_columna_del_oponente_clickeado = "columna" + posicion_personajes[numero_jugador_clickeado][1];

                    //MUEVE EL CONTENEDOR DEL PERSONAJE DEL USUARIO a la posición del personaje oponente
                    $('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' #personaje0').prependTo('.' + valor_de_fila_del_oponente_clickeado + ' .' + valor_de_columna_del_oponente_clickeado);

                    //Guardo la nueva posición matricial del personaje en el vector
                    posicion_personajes[0][0] = posicion_personajes[numero_jugador_clickeado][0];
                    posicion_personajes[0][1] = posicion_personajes[numero_jugador_clickeado][1];

                    //console.log('Moví al personaje');
                    //console.log('las nuevas coordenadas son: Fila ' + posicion_personajes[0][0] + ' Columna ' + posicion_personajes[0][1]);

                    //llama a la función que cambia el puntero del mouse a "manito" de las posiciones aledañas del usuario
                    manito_posiciones_aledañas(posicion_personajes[0][0], posicion_personajes[0][1]);

                    //llamo a la función que muestra los terrenos aledaños
                    quitar_fog_of_war(posicion_personajes[0][0], posicion_personajes[0][1]);

                    //Llamo a la función que consulta si hay un jugador AI en el campo de visión del usuario
                    ai_toggle_fog_of_war();


                    //Averigua si se posicionó sobre una ciudad
                    if (tablero[posicion_personajes[0][0]][posicion_personajes[0][1]][1] == 3) {
                        //console.log("detecte que USTED se posó sobre una ciudad");
                        //Averigua si es su propia ciudad - Si NO es su propia ciudad - la borra
                        if ((posicion_personajes[0][0] != ciudades[0][0]) || (posicion_personajes[0][1] != ciudades[0][1])) {
                            //console.log("y esa ciudad no es la del mismo jugador");
                            borrar_ciudad_del_mapa(posicion_personajes[0][0], posicion_personajes[0][1]);
                        }
                    }
                    /*
                    Este método es sumamente impresiso, ya que va a borrar todas las ciudades en las que se posición, por mas que haya un defensor, y el jugador pierda la batalla
                    */

                    //El combate se entabla luego del movimiento - está más abajo
                }
                //si no es aledaño, no hago nada



            } else {

                //compruebo que la posición clickeada sea adyacente a la posición actual
                //empiezo consultando por el padre de la imagen clickeada. el padre directo es una "columna"

                //Compruebo el nombre de su clase
                if (((valor_de_columna_de_elemento_clickeado == valor_de_columna_siguiente_al_personaje) || (valor_de_columna_de_elemento_clickeado == valor_de_columna_anterior_al_personaje)) && (valor_de_fila_de_elemento_clickeado == valor_de_fila_actual_del_personaje)) {

                    //console.log("entre en el condicional");
                    //console.log("quiere decir que la columna es adyacente");
                    //console.log("pero es la misma fila");


                    //averiguo que posición del tablero es la clickeada
                    //para saber si es un subtipo de terreno ocupado
                    var subtipo_de_terreno_seleccionado;
                    var numero_fila_seleccionado;
                    var numero_columna_seleccionado;


                    for ( /*var indice_fila in tablero*/ var indice_fila = 0; indice_fila < tablero.length; indice_fila++) {
                        if (("fila" + indice_fila) == valor_de_fila_de_elemento_clickeado) {
                            //console.log("EL BUCLE FOR ENCONTRO SU FILA");
                            //console.log("y su fila es " + indice_fila);
                            numero_fila_seleccionado = indice_fila;

                            for ( /*var indice_columna in tablero[indice_fila]*/ var indice_columna = 0; indice_columna < tablero[indice_fila].length; indice_columna++) {
                                if (("columna" + indice_columna) == valor_de_columna_de_elemento_clickeado) {
                                    //console.log("EL BUCLE FOR ENCONTRO SU COLUMNA");
                                    //console.log("y su COLUMNA ES es " + indice_columna);
                                    subtipo_de_terreno_seleccionado = tablero[indice_fila][indice_columna][1];
                                    numero_columna_seleccionado = indice_columna;
                                }
                            }
                        }
                    }


                    //Consulta si es subtipo ocupado 
                    if (subtipo_de_terreno_seleccionado != 2) {

                        //resto la cantidad de movimientos disponibles
                        dado_mov_jugador--;

                        impresion_variables();

                        //limpia el css del tipo de cursor de las posiciones aledañas antes de mover
                        restablecer_cursor(posicion_personajes[0][0], posicion_personajes[0][1]);


                        //console.log('clases de la fila y columna actual del pj');
                        //console.log('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' .personaje');

                        //console.log('clases de la fila y columna a mover el elemento');
                        //console.log('.' + valor_de_fila_de_elemento_clickeado + ' .' + valor_de_columna_de_elemento_clickeado);

                        //muevo al personaje a la posición clickeada:
                        //MUEVE EL CONTENEDOR DEL PERSONAJE A LA NUEVA POSICIÓN
                        $('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' #personaje0').prependTo('.' + valor_de_fila_de_elemento_clickeado + ' .' + valor_de_columna_de_elemento_clickeado);

                        //Guardo la nueva posición indicial del personaje en el vector
                        posicion_personajes[0][0] = numero_fila_seleccionado;
                        posicion_personajes[0][1] = numero_columna_seleccionado;

                        //console.log('Moví al personaje');
                        //console.log('las nuevas coordenadas son: Fila ' + posicion_personajes[0][0] + ' Columna ' + posicion_personajes[0][1]);

                        //llama a la función que cambia el puntero del mouse a "manito" de las posiciones aledañas del usuario
                        manito_posiciones_aledañas(posicion_personajes[0][0], posicion_personajes[0][1]);

                        //llamo a la función que muestra los terrenos aledaños
                        quitar_fog_of_war(posicion_personajes[0][0], posicion_personajes[0][1]);

                        //Llamo a la función que consulta si hay un jugador AI en el campo de visión del usuario
                        ai_toggle_fog_of_war();


                        //Averigua si se posicionó sobre una ciudad
                        if (tablero[posicion_personajes[0][0]][posicion_personajes[0][1]][1] == 3) {
                            //console.log("detecte que USTED se posó sobre una ciudad");
                            //Averigua si es su propia ciudad - Si NO es su propia ciudad - la borra
                            if ((posicion_personajes[0][0] != ciudades[0][0]) || (posicion_personajes[0][1] != ciudades[0][1])) {
                                //console.log("y esa ciudad no es la del mismo jugador");
                                borrar_ciudad_del_mapa(posicion_personajes[0][0], posicion_personajes[0][1]);
                            }
                            /*else{
                                                        console.log("PERO ERA TU MISMA CIUDAD");
                                                    }*/

                        }
                        /*
                        Este método es sumamente impresiso, ya que va a borrar todas las ciudades en las que se posición, por mas que haya un defensor, y el jugador pierda la batalla
                        */

                    } else {
                        alert("No es un terreno accesible");
                    }

                }
                //En caso de que la comprobación no sea valida
                //continuo consultando por el padre del padre de la imagen clickeada. el padre del padre es una "fila"
                //Compruebo el nombre de su clase
                else if (((valor_de_fila_de_elemento_clickeado == valor_de_fila_siguiente_al_personaje) || (valor_de_fila_de_elemento_clickeado == valor_de_fila_anterior_al_personaje)) && (valor_de_columna_de_elemento_clickeado == valor_de_columna_actual_del_personaje)) {
                    //console.log("CLICKIE fila adyacente");
                    //console.log("pero es la misma COLUMNA");


                    //Ahora hago lo mismo que en el anterior caso, copypasteo el codigo:

                    //averiguo que posición del tablero es la clickeada
                    //para saber si es un subtipo de terreno ocupado
                    var subtipo_de_terreno_seleccionado;
                    var numero_fila_seleccionado;
                    var numero_columna_seleccionado;


                    for (var indice_fila = 0; indice_fila < tablero.length; indice_fila++) {
                        if (("fila" + indice_fila) == valor_de_fila_de_elemento_clickeado) {
                            //console.log("EL BUCLE FOR ENCONTRO SU FILA");
                            //console.log("y su fila es " + indice_fila);
                            numero_fila_seleccionado = indice_fila;

                            for (var indice_columna = 0; indice_columna < tablero[indice_fila].length; indice_columna++) {
                                if (("columna" + indice_columna) == valor_de_columna_de_elemento_clickeado) {
                                    //console.log("EL BUCLE FOR ENCONTRO SU COLUMNA");
                                    //console.log("y su COLUMNA ES es " + indice_columna);
                                    subtipo_de_terreno_seleccionado = tablero[indice_fila][indice_columna][1];
                                    numero_columna_seleccionado = indice_columna;
                                }
                            }
                        }
                    }


                    //Consulta si es subtipo ocupado 
                    if (subtipo_de_terreno_seleccionado != 2) {

                        //resto la cantidad de movimientos disponibles
                        dado_mov_jugador--;

                        impresion_variables();

                        //limpia el css del tipo de cursor de las posiciones aledañas antes de mover
                        restablecer_cursor(posicion_personajes[0][0], posicion_personajes[0][1]);


                        //console.log('clases de la fila y columna actual del pj');
                        //console.log('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' .personaje');

                        //console.log('clases de la fila y columna a mover el elemento');
                        //console.log('.' + valor_de_fila_de_elemento_clickeado + ' .' + valor_de_columna_de_elemento_clickeado);

                        //muevo al personaje a la posición clickeada:
                        //MUEVE EL CONTENEDOR DEL PERSONAJE A LA NUEVA POSICIÓN
                        $('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' #personaje0').prependTo('.' + valor_de_fila_de_elemento_clickeado + ' .' + valor_de_columna_de_elemento_clickeado);

                        //Guardo la nueva posición indicial del personaje en el vector
                        posicion_personajes[0][0] = numero_fila_seleccionado;
                        posicion_personajes[0][1] = numero_columna_seleccionado;

                        //console.log('Moví al personaje');
                        //console.log('las nuevas coordenadas son: Fila ' + posicion_personajes[0][0] + ' Columna ' + posicion_personajes[0][1]);



                        //llama a la función que cambia el puntero del mouse a "manito" de las posiciones aledañas del usuario
                        manito_posiciones_aledañas(posicion_personajes[0][0], posicion_personajes[0][1]);

                        //llamo a la función que muestra los terrenos aledaños
                        quitar_fog_of_war(posicion_personajes[0][0], posicion_personajes[0][1]);

                        //Llamo a la función que consulta si hay un jugador AI en el campo de visión del usuario
                        ai_toggle_fog_of_war();


                        //Averigua si se posicionó sobre una ciudad
                        if (tablero[posicion_personajes[0][0]][posicion_personajes[0][1]][1] == 3) {
                            //console.log("detecte que USTED se posó sobre una ciudad");
                            //Averigua si es su propia ciudad - Si NO es su propia ciudad - la borra
                            if ((posicion_personajes[0][0] != ciudades[0][0]) || (posicion_personajes[0][1] != ciudades[0][1])) {
                                //console.log("y esa ciudad no es la del mismo jugador");
                                borrar_ciudad_del_mapa(posicion_personajes[0][0], posicion_personajes[0][1]);
                            }

                        }

                    } else {
                        alert("No es un terreno accesible");
                    }


                }


            }
        } else {
            alert("No le quedan movimientos, debe pasar el turno!");
        }
    }

    //Recorre el array de posiciones de jugadores, si encuentra que hay más de un jugador en la misma posición, entabla combate
    for (var auxiliar_recorrido_vector_personaje = 1; auxiliar_recorrido_vector_personaje < posicion_personajes.length; auxiliar_recorrido_vector_personaje++) {

        //console.log("entre al for!");

        //console.log("estoy comprobando:");
        //console.log(posicion_personajes[0]);
        //console.log(posicion_personajes[auxiliar_recorrido_vector_personaje]);


        if ((posicion_personajes[0][0] == posicion_personajes[auxiliar_recorrido_vector_personaje][0]) && (posicion_personajes[0][1] == posicion_personajes[auxiliar_recorrido_vector_personaje][1])) {

            //llama a la función que calcula el combate y mueve al perdedor a su ciudad natal
            //console.log("Hay dos personajes en las mismas coordenadas!");
            combate(0, auxiliar_recorrido_vector_personaje);

        }
    }

});


//Función que reestablece el tipo de puntero a las posiciones aledañas, antes de realizar un movimiento
function restablecer_cursor(fila, columna) {
    //console.log("entre a la fun para restablecer el cursor");
    if (fila != 0) {

        $('.fila' + (fila - 1) + ' .columna' + columna + ' img').css({
            cursor: "auto",
        });
    }

    if (fila != 20) {
        $('.fila' + (fila + 1) + ' .columna' + columna + ' img').css({
            cursor: "auto",
        });
    }

    if (columna != 0) {
        $('.fila' + fila + ' .columna' + (columna - 1) + ' img').css({
            cursor: "auto",
        });
    }

    if (columna != 20) {
        $('.fila' + fila + ' .columna' + (columna + 1) + ' img').css({
            cursor: "auto",
        });
    }
}

//Función que cambia el tipo de puntero de las imagenes de terreno de posiciones aledañas a la asignada
function manito_posiciones_aledañas(fila, columna) {

    //console.log("entre a la función pa cambiar el cursor");

    if (fila != 0) {

        $('.fila' + (fila - 1) + ' .columna' + columna + ' img').css({
            cursor: "pointer",
        });
        //console.log("se lo cambié a la pos izq");
    }

    if (fila != 20) {
        //console.log("se lo cambié a la pos der");
        $('.fila' + (fila + 1) + ' .columna' + columna + ' img').css({
            cursor: "pointer",
        });
    }

    if (columna != 0) {
        //console.log("se lo cambié a la pos arriba");
        $('.fila' + fila + ' .columna' + (columna - 1) + ' img').css({
            cursor: "pointer",
        });
    }

    if (columna != 20) {
        //console.log("se lo cambié a la pos abajo");
        $('.fila' + fila + ' .columna' + (columna + 1) + ' img').css({
            cursor: "pointer",
        });
    }

}

//Función que sube la opacidad a los terrenos recorridos
function quitar_fog_of_war(fila, columna) {

    //console.log("entre a la función de sacar fog of war");

    //Si es la primera vez que se llama a la función (osea, carga del tablero) se carga el valor de la posición como true y se muestra el terreno
    //Esto no debería volver a suceder a lo largo del juego
    if (!visibilidad_terreno[fila][columna]) {
        //console.log("entre para sacar el fog of war de donde estoy parado");
        //console.log("voy a intentar sacar la fila " + fila + " columna " + columna);

        visibilidad_terreno[fila][columna] = true;

        $('.imagen_fila' + fila + '_columna' + columna).css({
            opacity: "1",
        });

    }



    if (fila != 0) {
        if (!visibilidad_terreno[fila - 1][columna]) {
            visibilidad_terreno[fila - 1][columna] = true;

            $('.imagen_fila' + (fila - 1) + '_columna' + columna).css({
                opacity: "1",
            });
        }

        if (columna != 0) {
            if (!visibilidad_terreno[fila - 1][columna - 1]) {
                visibilidad_terreno[fila - 1][columna - 1] = true;

                $('.imagen_fila' + (fila - 1) + '_columna' + (columna - 1)).css({
                    opacity: "1",
                });
            }
        }

        if (columna != 20) {
            if (!visibilidad_terreno[fila - 1][columna + 1]) {
                visibilidad_terreno[fila - 1][columna + 1] = true;

                $('.imagen_fila' + (fila - 1) + '_columna' + (columna + 1)).css({
                    opacity: "1",
                });
            }
        }

    }

    if (fila != 20) {
        if (!visibilidad_terreno[fila + 1][columna]) {
            visibilidad_terreno[fila + 1][columna] = true;

            $('.imagen_fila' + (fila + 1) + '_columna' + columna).css({
                opacity: "1",
            });
        }

        if (columna != 0) {
            if (!visibilidad_terreno[fila + 1][columna - 1]) {
                visibilidad_terreno[fila + 1][columna - 1] = true;

                $('.imagen_fila' + (fila + 1) + '_columna' + (columna - 1)).css({
                    opacity: "1",
                });
            }
        }

        if (columna != 20) {
            if (!visibilidad_terreno[fila + 1][columna + 1]) {
                visibilidad_terreno[fila + 1][columna + 1] = true;

                $('.imagen_fila' + (fila + 1) + '_columna' + (columna + 1)).css({
                    opacity: "1",
                });
            }
        }

    }

    if (columna != 0) {
        if (!visibilidad_terreno[fila][columna - 1]) {
            visibilidad_terreno[fila][columna - 1] = true;

            $('.imagen_fila' + fila + '_columna' + (columna - 1)).css({
                opacity: "1",
            });
        }
    }

    if (columna != 20) {
        if (!visibilidad_terreno[fila][columna + 1]) {
            visibilidad_terreno[fila][columna + 1] = true;

            $('.imagen_fila' + fila + '_columna' + (columna + 1)).css({
                opacity: "1",
            });
        }
    }

}


/*
------------------------------------------------------------------------------------------------------------------------------
*/


/*Aquí se desarrolla el juego de la "inteligencia artifical"
Según las reglas.*/
function juega_ai() {


    //esto lo debe hacer por cada jugador no-usuario que haya.
    //empieza del 1, porque la posición 0 del array de jugadores es el usuario
    for (var ai_actual = 1; ai_actual < (cantidad_oponentes + 1); ai_actual++) {

        //Primero consulta si el jugador sigue jugando, si perdió, no realiza acción
        if (esta_jugando_el_jugador[ai_actual]) {



            //console.log("soy el jugador " + ai_actual);


            //accion de compra
            do {
                //tira dado de compra
                var dado_compra = Math.round(Math.random() * 5);

                //console.log("tire el dado para ver que comprar - salió: " + dado_compra);

                //si sale 0 o 1 y tiene dinero compra un soldado
                if ((dado_compra < 2) && (oro[ai_actual] >= 3)) {
                    oro[ai_actual] = oro[ai_actual] - 3;
                    poder[ai_actual] = poder[ai_actual] + 1;
                    //console.log("Compre un soldado");
                } else
                    //Si el dado sale 2,3 o 4 y tiene dinero compra una mina de oro
                    if ((dado_compra < 5) && (oro[ai_actual] >= 6)) {
                        //no puede tener más de 10 minas de oro
                        if (minas_de_oro[ai_actual] < 10) {
                            oro[ai_actual] = oro[ai_actual] - 6;
                            minas_de_oro[ai_actual] = minas_de_oro[ai_actual] + 1;
                            //console.log("Compre una mina de oro");
                        }
                    }

                //está la posibilidad de que compre multiples veces. Mientras no salga 5 en el dado y todavía le quede oro, sigue tirando
            } while ((dado_compra != 5) && (oro[ai_actual] >= 3));



            //Acciones movimiento
            //Primero tira un dado qeu define que es lo que va a hacer:
            var dado_desicion = Math.round(Math.random() * 3);

            var dado_mov_ai;

            //si el dado da 0, el personaje se mueve al azar
            if (dado_desicion == 0) {
                //define cantidad de posiciones a moverse
                dado_mov_ai = Math.ceil(Math.random() * 3);


                //va a moverse por cantidad de posiciones definidas por el dado
                for (i = 0; i < dado_mov_ai; i++) {
                    //define coordenadas a moverse por posición 
                    //(en forma horaria, 1 es para arriba, 2 es derecha, 3 abajo, 4 izquierda)
                    var coordenada_random = Math.ceil(Math.random() * 4);


                    //console.log("entre al bucle que se mueve al azar");

                    //almacenamiento del texto de las filas
                    var valor_de_fila_actual_del_personaje = "fila" + posicion_personajes[ai_actual][0];
                    var valor_de_fila_siguiente_al_personaje = "fila" + (posicion_personajes[ai_actual][0] + 1);
                    var valor_de_fila_anterior_al_personaje = "fila" + (posicion_personajes[ai_actual][0] - 1);
                    //almacenamiento del texto de las columnas
                    var valor_de_columna_actual_del_personaje = "columna" + posicion_personajes[ai_actual][1];
                    var valor_de_columna_siguiente_al_personaje = "columna" + (posicion_personajes[ai_actual][1] + 1);
                    var valor_de_columna_anterior_al_personaje = "columna" + (posicion_personajes[ai_actual][1] - 1);





                    /*
                    -----------------ayuda memoria:
                    posicion_personajes[ai_actual][0]: da la fila actual
                    posicion_personajes[ai_actual][1]: da la columna actual

                    tablero[posicion_personajes[ai_actual][0]][posicion_personajes[ai_actual][1]][1]: da el subtipo de terreno donde está parado el personaje

                    */


                    if (coordenada_random == 1) {
                        //intenta moverse para arriba
                        //Confirma que no haya terreno ocupado arriba del personaje
                        if (tablero[posicion_personajes[ai_actual][0] - 1][posicion_personajes[ai_actual][1]][1] != 2) {
                            /*hace el movimiento
                            MUEVE EL CONTENEDOR DEL PERSONAJE A LA NUEVA POSICIÓN
                            En este caso lo mueve una fila para arriba, osea, una fila menos. Mantiene la columna
                            */
                            $('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' #personaje' + ai_actual).prependTo('.' + valor_de_fila_anterior_al_personaje + ' .' + valor_de_columna_actual_del_personaje);

                            //actualiza posición en vector de pos de personajes
                            posicion_personajes[ai_actual][0] = posicion_personajes[ai_actual][0] - 1;


                        } else {
                            //si hay terreno ocupado le da otra oportunidad de movimiento, resta la coordenada i para que el bucle trabaje otra vez
                            i--;
                        }
                        //se  mueve para arriba
                    } else if (coordenada_random == 2) {
                        //intenta moverse para la derecha
                        //Confirma que no haya terreno ocupado a la derecha del personaje
                        if (tablero[posicion_personajes[ai_actual][0]][posicion_personajes[ai_actual][1] + 1][1] != 2) {
                            /*hace el movimiento
                            MUEVE EL CONTENEDOR DEL PERSONAJE A LA NUEVA POSICIÓN
                            En este caso lo mueve una columna para la derecha, osea, una columna más. Mantiene la fila
                            */
                            $('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' #personaje' + ai_actual).prependTo('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_siguiente_al_personaje);

                            //actualiza posición en vector de pos de personajes
                            posicion_personajes[ai_actual][1] = posicion_personajes[ai_actual][1] + 1;
                        } else {
                            //si hay terreno ocupado le da otra oportunidad de movimiento, resta la coordenada i para que el bucle trabaje otra vez
                            i--;
                        }
                    } else if (coordenada_random == 3) {
                        //intenta moverse para abajo
                        //Confirma que no haya terreno ocupado abajo del personaje
                        if (tablero[posicion_personajes[ai_actual][0] + 1][posicion_personajes[ai_actual][1]][1] != 2) {
                            /*hace el movimiento
                            MUEVE EL CONTENEDOR DEL PERSONAJE A LA NUEVA POSICIÓN
                            En este caso lo mueve una fila para abajo, osea, una fila más. Mantiene la columna
                            */
                            $('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' #personaje' + ai_actual).prependTo('.' + valor_de_fila_siguiente_al_personaje + ' .' + valor_de_columna_actual_del_personaje);

                            //actualiza posición en vector de pos de personajes
                            posicion_personajes[ai_actual][0] = posicion_personajes[ai_actual][0] + 1;
                        } else {
                            //si hay terreno ocupado le da otra oportunidad de movimiento, resta la coordenada i para que el bucle trabaje otra vez
                            i--;
                        }
                    } else if (coordenada_random == 4) {
                        //intenta moverse para la izquierda
                        //Confirma que no haya terreno ocupado a la izquierda del personaje
                        if (tablero[posicion_personajes[ai_actual][0]][posicion_personajes[ai_actual][1] - 1][1] != 2) {
                            /*hace el movimiento
                            MUEVE EL CONTENEDOR DEL PERSONAJE A LA NUEVA POSICIÓN
                            En este caso lo mueve una columna para la izquierda, osea, una columna menos. Mantiene la fila
                            */
                            $('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' #personaje' + ai_actual).prependTo('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_anterior_al_personaje);

                            //actualiza posición en vector de pos de personajes
                            posicion_personajes[ai_actual][1] = posicion_personajes[ai_actual][1] - 1;
                        } else {
                            //si hay terreno ocupado le da otra oportunidad de movimiento, resta la coordenada i para que el bucle trabaje otra vez
                            i--;
                        }
                    }


                    //POR CADA MOVIMIENTO QUE HAGA, PREGUNTA SI HAY COMBATE              

                    //Recorre el array de posiciones de jugadores, si encuentra que hay más de un jugador en la misma posición, entabla combate
                    for (var auxiliar_recorrido_vector_personaje = 0; auxiliar_recorrido_vector_personaje < posicion_personajes.length; auxiliar_recorrido_vector_personaje++) {

                        //comprueba que no se esté comparando un jugador consigo mismo
                        if (auxiliar_recorrido_vector_personaje != ai_actual) {

                            if ((posicion_personajes[ai_actual][0] == posicion_personajes[auxiliar_recorrido_vector_personaje][0]) && (posicion_personajes[ai_actual][1] == posicion_personajes[auxiliar_recorrido_vector_personaje][1])) {

                                //llama a la función que calcula el combate y mueve al perdedor a su ciudad natal
                                //console.log("Hay dos personajes en las mismas coordenadas!");
                                combate(ai_actual, auxiliar_recorrido_vector_personaje);

                            }
                        }
                    }

                    /******************************************************************************************************
                        
                        esto es un gran foco de bugs
                        
                        ******************************************************************************************************/

                    //Averigua si se posicionó sobre una ciudad
                    if (tablero[posicion_personajes[ai_actual][0]][posicion_personajes[ai_actual][1]][1] == 3) {
                        //console.log("detecte que un jugador se posó sobre una ciudad");
                        //Averigua si es su propia ciudad - Si NO es su propia ciudad - la borra
                        if ((ciudades[ai_actual][0] != posicion_personajes[ai_actual][0]) || (ciudades[ai_actual][1] != posicion_personajes[ai_actual][1])) {
                            //console.log("y esa ciudad no es la del mismo jugador");
                            borrar_ciudad_del_mapa(posicion_personajes[ai_actual][0], posicion_personajes[ai_actual][1]);
                        }
                        /*else {
                                                   console.log("pero era su propia ciudad");
                                               }*/

                    }
                    /*
                    Este método es sumamente impresiso, ya que va a borrar todas las ciudades en las que se posición, por mas que haya un defensor, y el jugador pierda la batalla
                    */



                    //Llamo a la función que consulta si hay un jugador AI en el campo de visión del usuario
                    ai_toggle_fog_of_war();


                    //Acá termino el bucle de movimientos random
                }


            } else
                //Si sale 1 o 2, se mueve hacia el oponente
                if (dado_desicion < 3) {

                    //define cantidad de posiciones a moverse
                    dado_mov_ai = Math.ceil(Math.random() * 3);



                    for (i = 0; i < dado_mov_ai; i++) {

                        //define hacia que jugador se va a mover
                        //Lo defino aquí para evitar bucles infinitos
                        //Esto significa que por cada movimiento que haga, va a re-calcular a que oponente dirigirse
                        var jugador_elegido = Math.round(Math.random() * cantidad_oponentes);

                        //console.log("Entre al bucle para buscar la posición de un oponente");


                        //almacenamiento del texto de las filas
                        var valor_de_fila_actual_del_personaje = "fila" + posicion_personajes[ai_actual][0];
                        var valor_de_fila_siguiente_al_personaje = "fila" + (posicion_personajes[ai_actual][0] + 1);
                        var valor_de_fila_anterior_al_personaje = "fila" + (posicion_personajes[ai_actual][0] - 1);
                        //almacenamiento del texto de las columnas
                        var valor_de_columna_actual_del_personaje = "columna" + posicion_personajes[ai_actual][1];
                        var valor_de_columna_siguiente_al_personaje = "columna" + (posicion_personajes[ai_actual][1] + 1);
                        var valor_de_columna_anterior_al_personaje = "columna" + (posicion_personajes[ai_actual][1] - 1);





                        /*
                        -----------------ayuda memoria:
                        posicion_personajes[ai_actual][0]: da la fila actual
                        posicion_personajes[ai_actual][1]: da la columna actual

                        tablero[posicion_personajes[ai_actual][0]][posicion_personajes[ai_actual][1]][1]: da el subtipo de terreno donde está parado el personaje

                        */

                        /*Pasos:
                                //compara su posición respecto a la posición del oponente
                                //pregunta si la posición aledaña es ocuopada
                                //mueve a la posición aledaña
                                            */

                        /*PREGUNTA SI LA POSICIÓN DEL JUGADOR ELEGIDO EN FILA ES MENOR A LA DEL JUGADOR ACTUAL*/
                        if (posicion_personajes[jugador_elegido][0] < posicion_personajes[ai_actual][0]) {
                            //intenta moverse para arriba
                            //Confirma que no haya terreno ocupado arriba del personaje
                            if (tablero[posicion_personajes[ai_actual][0] - 1][posicion_personajes[ai_actual][1]][1] != 2) {
                                /*hace el movimiento
                                MUEVE EL CONTENEDOR DEL PERSONAJE A LA NUEVA POSICIÓN
                                En este caso lo mueve una fila para arriba, osea, una fila menos. Mantiene la columna
                                */
                                $('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' #personaje' + ai_actual).prependTo('.' + valor_de_fila_anterior_al_personaje + ' .' + valor_de_columna_actual_del_personaje);

                                //actualiza posición en vector de pos de personajes
                                posicion_personajes[ai_actual][0] = posicion_personajes[ai_actual][0] - 1;


                            } else {
                                //si hay terreno ocupado le da otra oportunidad de movimiento, resta la coordenada i para que el bucle trabaje otra vez
                                i--;
                            }
                        } else
                            /*PREGUNTA SI LA POSICIÓN DEL JUGADOR ELEGIDO EN COLUMNA ES MAYOR A LA DEL JUGADOR ACTUAL*/
                            if (posicion_personajes[jugador_elegido][1] > posicion_personajes[ai_actual][1]) {
                                //intenta moverse para la derecha
                                //Confirma que no haya terreno ocupado a la derecha del personaje
                                if (tablero[posicion_personajes[ai_actual][0]][posicion_personajes[ai_actual][1] + 1][1] != 2) {
                                    /*hace el movimiento
                                    MUEVE EL CONTENEDOR DEL PERSONAJE A LA NUEVA POSICIÓN
                                    En este caso lo mueve una columna para la derecha, osea, una columna más. Mantiene la fila
                                    */
                                    $('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' #personaje' + ai_actual).prependTo('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_siguiente_al_personaje);

                                    //actualiza posición en vector de pos de personajes
                                    posicion_personajes[ai_actual][1] = posicion_personajes[ai_actual][1] + 1;
                                } else {
                                    //si hay terreno ocupado le da otra oportunidad de movimiento, resta la coordenada i para que el bucle trabaje otra vez
                                    i--;
                                }
                            } else
                                /*PREGUNTA SI LA POSICIÓN DEL JUGADOR ELEGIDO EN FILA ES MAYOR A LA DEL JUGADOR ACTUAL*/
                                if (posicion_personajes[jugador_elegido][0] > posicion_personajes[ai_actual][0]) {
                                    //intenta moverse para abajo
                                    //Confirma que no haya terreno ocupado abajo del personaje
                                    if (tablero[posicion_personajes[ai_actual][0] + 1][posicion_personajes[ai_actual][1]][1] != 2) {
                                        /*hace el movimiento
                                        MUEVE EL CONTENEDOR DEL PERSONAJE A LA NUEVA POSICIÓN
                                        En este caso lo mueve una fila para abajo, osea, una fila más. Mantiene la columna
                                        */
                                        $('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' #personaje' + ai_actual).prependTo('.' + valor_de_fila_siguiente_al_personaje + ' .' + valor_de_columna_actual_del_personaje);

                                        //actualiza posición en vector de pos de personajes
                                        posicion_personajes[ai_actual][0] = posicion_personajes[ai_actual][0] + 1;
                                    } else {
                                        //si hay terreno ocupado le da otra oportunidad de movimiento, resta la coordenada i para que el bucle trabaje otra vez
                                        i--;
                                    }
                                } else
                                    /*PREGUNTA SI LA POSICIÓN DEL JUGADOR ELEGIDO EN COLUMNA ES MENOR A LA DEL JUGADOR ACTUAL*/
                                    if (posicion_personajes[jugador_elegido][1] < posicion_personajes[ai_actual][1]) {
                                        //intenta moverse para la izquierda
                                        //Confirma que no haya terreno ocupado a la izquierda del personaje
                                        if (tablero[posicion_personajes[ai_actual][0]][posicion_personajes[ai_actual][1] - 1][1] != 2) {
                                            /*hace el movimiento
                                            MUEVE EL CONTENEDOR DEL PERSONAJE A LA NUEVA POSICIÓN
                                            En este caso lo mueve una columna para la izquierda, osea, una columna menos. Mantiene la fila
                                            */
                                            $('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' #personaje' + ai_actual).prependTo('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_anterior_al_personaje);

                                            //actualiza posición en vector de pos de personajes
                                            posicion_personajes[ai_actual][1] = posicion_personajes[ai_actual][1] - 1;
                                        } else {
                                            //si hay terreno ocupado le da otra oportunidad de movimiento, resta la coordenada i para que el bucle trabaje otra vez
                                            i--;
                                        }
                                    }

                        //Luego de cada movimiento, averigua si hay combate

                        //Recorre el array de posiciones de jugadores, si encuentra que hay más de un jugador en la misma posición, entabla combate
                        for (var auxiliar_recorrido_vector_personaje = 0; auxiliar_recorrido_vector_personaje < posicion_personajes.length; auxiliar_recorrido_vector_personaje++) {

                            //comprueba que no se esté comparando un jugador consigo mismo
                            if (auxiliar_recorrido_vector_personaje != ai_actual) {

                                if ((posicion_personajes[ai_actual][0] == posicion_personajes[auxiliar_recorrido_vector_personaje][0]) && (posicion_personajes[ai_actual][1] == posicion_personajes[auxiliar_recorrido_vector_personaje][1])) {

                                    //llama a la función que calcula el combate y mueve al perdedor a su ciudad natal
                                    //Le paso el jugador actual como jugador atacante, y el auxiliar como jugador defensor
                                    combate(ai_actual, auxiliar_recorrido_vector_personaje);


                                    //console.log("Hay dos personajes en las mismas coordenadas!");

                                }
                            }
                        }


                        /******************************************************************************************************
                        
                            esto es un gran foco de bugs:
                        
                            ******************************************************************************************************/

                        //Averigua si se posicionó sobre una ciudad
                        if (tablero[posicion_personajes[ai_actual][0]][posicion_personajes[ai_actual][1]][1] == 3) {
                            //console.log("detecte que un jugador se posó sobre una ciudad");
                            //Averigua si es su propia ciudad - Si NO es su propia ciudad - la borra
                            if ((ciudades[ai_actual][0] != posicion_personajes[ai_actual][0]) || (ciudades[ai_actual][1] != posicion_personajes[ai_actual][1])) {
                                //console.log("y esa ciudad no es la del mismo jugador");
                                borrar_ciudad_del_mapa(posicion_personajes[ai_actual][0], posicion_personajes[ai_actual][1]);
                            }
                            /*else {
                                                           console.log("pero era su propia ciudad");
                                                       }*/

                        }
                        /*
                        Este método es sumamente impresiso, ya que va a borrar todas las ciudades en las que se posición, por mas que haya un defensor, y el jugador pierda la batalla
                        */

                    }


                } /*Y SI EL DADO DA 3, NO HACE NADA.*/




        }
    }


    //Cuando finaliza de desarrollarse, inicia el siguiente turno del jugador
    actualizar_variables_nuevo_turno();
}


//Esta función es para sacar una ciudad del mapa y actualizar las variables e imágenes asociadas
function borrar_ciudad_del_mapa(fila_ciudad_a_borrar, columna_ciudad_a_borrar) {
    //esta función se llama comprobando (siempre) que no se esté borrando la misma ciudad del jugador

    //reemplaza el valor en el tablero por un elemento semi-ocupado
    tablero[fila_ciudad_a_borrar][columna_ciudad_a_borrar][1] = 1;

    //console.log("Entre a la función 'borrar ciudad'");


    //almacenamiento del texto de la fila
    var valor_de_fila_de_la_ciudad = "fila" + fila_ciudad_a_borrar;
    //almacenamiento del texto de la columna
    var valor_de_columna_de_la_ciudad = "columna" + columna_ciudad_a_borrar;



    //hace el movimiento:

    //necesita saber que tipo de terreno hay en esa ubicación
    //yo tengo en la variable tablero[][] un valor numérico por tipo de terreno y
    //la variable "terreno[][]" es con indices string
    var iterador_tipo_terreno = 0;
    for (var indice_tipo_terreno in terrenos) {

        //pregunta si el TIPO de terreno que está iterando es igual al tipo de terreno de la ciudad a borrar
        if (iterador_tipo_terreno == tablero[fila_ciudad_a_borrar][columna_ciudad_a_borrar][0]) {
            //Si son del mismo tipo, le cambia el atributo "source" de la imagen por una imagen del mismo tipo, subtipo semiocupado
            $('.' + valor_de_fila_de_la_ciudad + ' .' + valor_de_columna_de_la_ciudad + ' .imagen_fila' + fila_ciudad_a_borrar + '_columna' + columna_ciudad_a_borrar).attr({
                src: terrenos[indice_tipo_terreno]['semiocupado']
            });
        }

        iterador_tipo_terreno++;
    }

    //Averigua de quien es la ciudad
    for (i = 0; i <= cantidad_oponentes; i++) {

        //pregunta por jugador si las coordenadas borradas son de su ciudad
        if ((ciudades[i][0] == fila_ciudad_a_borrar) && (ciudades[i][1] == columna_ciudad_a_borrar)) {

            //borra las coordenadas de su ciudad en el vector de ciudades... este jugador no tiene más ciudad
            ciudades[i][0] = undefined;
            ciudades[i][1] = undefined;

        }

    }
}


//Hace la diferencia del poderío militar y mueve al perdedor de nuevo a su base. En caso de no haber base lo elimina
function combate(jugador_atacante,
    jugador_defensor) {

    var titulo_del_jugador_atacante;
    var titulo_del_jugador_defensor;

    if (jugador_atacante == 0) {
        titulo_del_jugador_atacante = "USTED";
    } else {
        titulo_del_jugador_atacante = "Jugador " + jugador_atacante;
    }

    if (jugador_defensor == 0) {
        titulo_del_jugador_defensor = "USTED";
    } else {
        titulo_del_jugador_defensor = "Jugador " + jugador_defensor;
    }


    alert("¡COMBATE! entre " + titulo_del_jugador_atacante + " y " + titulo_del_jugador_defensor);

    //averiguo quien tiene más poderío militar
    if (poder[jugador_atacante] > poder[jugador_defensor]) {
        //gano el jugador atacante - osea el que llamó a la función
        poder[jugador_atacante] = poder[jugador_atacante] - poder[jugador_defensor];
        poder[jugador_defensor] = 0;

        alert("Ganó la batalla: " + titulo_del_jugador_atacante);


        /*Llamo a la función que comprueba si el jugador perdió o si lo tiene que mover a su base*/
        mover_personaje_a_base(jugador_defensor);

    } else if (poder[jugador_defensor] > poder[jugador_atacante]) {
        //gano el jugador defensor - osea, quien fue atacado

        poder[jugador_defensor] = poder[jugador_defensor] - poder[jugador_atacante];
        poder[jugador_defensor] = 0;

        alert("Ganó la batalla: " + titulo_del_jugador_defensor);


        /*Llamo a la función que comprueba si el jugador perdió o si lo tiene que mover a su base*/
        mover_personaje_a_base(jugador_atacante);

    } else {
        //si llegó acá quiere decir que ambos dos jugadores tenian el mismo poderío militar

        poder[jugador_atacante] = 0;
        poder[jugador_defensor] = 0;

        alert("¡¡Ocurrio un empate!!");

        /*Llamo a la función que comprueba si el jugador perdió o si lo tiene que mover a su base*/
        mover_personaje_a_base(jugador_atacante);
        mover_personaje_a_base(jugador_defensor);


    }

    //si el Usuario participó en el combate, actualiza en pantalla su poder
    if ((jugador_atacante == 0) || (jugador_defensor == 0)) {
        impresion_variables();
    }

}

//esta función es llamada cuando un jugador pierde una batalla - hay que mover su sprite a su base... si es que tiene
function mover_personaje_a_base(jugador_dueño) {

    //Consulta si existe base del personaje (osea que sus coordenadas NO SEAN undefined)
    if ((ciudades[jugador_dueño][0] != undefined) && (ciudades[jugador_dueño][1] != undefined)) {
        //Existe la base del jugador

        //console.log("estoy intentando mover un jugador a su base");
        //console.log("es el jugador " + jugador_dueño);

        //almacenamiento del texto de la fila
        /*var valor_de_fila_actual_del_personaje = "fila" + posicion_personajes[jugador_dueño][0];*/
        var valor_de_fila_de_la_ciudad = "fila" + ciudades[jugador_dueño][0];
        //console.log("lo estoy mandando a la siguiente clase: " + valor_de_fila_de_la_ciudad);
        //almacenamiento del texto de la columna
        /*var valor_de_columna_actual_del_personaje = "columna" + posicion_personajes[jugador_dueño][1];*/
        var valor_de_columna_de_la_ciudad = "columna" + ciudades[jugador_dueño][1];
        //console.log("lo estoy mandando a la siguiente clase: " + valor_de_columna_de_la_ciudad);


        //Actualiza el SPRITE del personaje
        /*'.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + */
        $('#personaje' + jugador_dueño).prependTo('.' + valor_de_fila_de_la_ciudad + ' .' + valor_de_columna_de_la_ciudad);


        //Actualiza las coordenadas en el vector del personaje
        posicion_personajes[jugador_dueño][0] = ciudades[jugador_dueño][0];
        posicion_personajes[jugador_dueño][1] = ciudades[jugador_dueño][1];

        //console.log("las coordenadas nuevas del personaje son: " + posicion_personajes[jugador_dueño][0] + "," + posicion_personajes[jugador_dueño][1]);

        //si el jugador que se mueve es el usuario
        if (jugador_dueño == 0) {

            restablecer_cursor(posicion_personajes[0][0], posicion_personajes[0][1])

            //llama a la función que cambia el puntero del mouse a "manito" de las posiciones aledañas del usuario
            manito_posiciones_aledañas(posicion_personajes[0][0], posicion_personajes[0][1]);

            //llamo a la función que muestra los terrenos aledaños
            quitar_fog_of_war(posicion_personajes[0][0], posicion_personajes[0][1]);

            //Llamo a la función que consulta si hay un jugador AI en el campo de visión del usuario
            ai_toggle_fog_of_war();
        }

    } else {
        //no existe la base del jugador y el jugador acaba de perder una batalla:
        perdio_jugador(jugador_dueño);
    }

}

/*esta función se llama una vez esté comprobado que el jugador no tiene base, y que perdió una batalla
por lo tanto hay que eliminarlo de todas las variables*/
function perdio_jugador(jugador_que_perdio) {

    var titulo_del_jugador;
    if (jugador_que_perdio == 0) {
        titulo_del_jugador = "USTED";
    } else {
        titulo_del_jugador = "Jugador " + jugador_que_perdio;
    }

    alert("Ha perdido: " + titulo_del_jugador);

    //almacenamiento del texto de la fila
    var valor_de_fila_actual_del_personaje = "fila" + posicion_personajes[jugador_que_perdio][0];
    //almacenamiento del texto de la columna
    var valor_de_columna_actual_del_personaje = "columna" + posicion_personajes[jugador_que_perdio][1];

    //escondo el sprite del personaje
    $('.' + valor_de_fila_actual_del_personaje + ' .' + valor_de_columna_actual_del_personaje + ' #personaje' + jugador_que_perdio).hide();

    //Desvinculo las coordenadas del personaje en el vector de posición
    posicion_personajes[jugador_que_perdio][0] = undefined;
    posicion_personajes[jugador_que_perdio][1] = undefined;

    //me aseguro que no exista más su ciudad en el vector de ciudades
    if ((ciudades[jugador_que_perdio][0] != undefined) || (ciudades[jugador_que_perdio][1] != undefined)) {
        ciudades[jugador_que_perdio][0] = undefined;
        ciudades[jugador_que_perdio][1] = undefined
    }


    //Pongo a cero sus recursos, para uqe no afecten en los pasos de turno
    oro[jugador_que_perdio] = 0;
    poder[jugador_que_perdio] = 0;
    minas_de_oro[jugador_que_perdio] = 0;

    //Defino que no va a jugar más este jugador, en su posición correspondiente, en el array de "esta_jugando..."
    esta_jugando_el_jugador[jugador_que_perdio] = false;


    /*
    ¿restar la la variable cantidad_de_oponentes?
    */

    var jugador_ganador;
    var jugadores_restantes = 0;
    //Recorre este array para ver si quedan más jugadores, si no queda más, termina el juego
    for (i = 0; i <= cantidad_oponentes; i++) {
        if (esta_jugando_el_jugador[i]) {
            jugadores_restantes++;

            //recuerda quien fue el último jugador encontrado para felicitarlo
            jugador_ganador = i;
        }
    }

    if (jugadores_restantes <= 1) {
        finalizar_juego(jugador_ganador);
    }

}

function finalizar_juego(jugador_ganador) {

    var titulo_del_jugador_ganador;
    if (jugador_ganador == 0) {
        titulo_del_jugador_ganador = "¡¡USTED!!";
    } else {
        titulo_del_jugador_ganador = "Jugador " + jugador_ganador;
    }


    alert("Juego finalizado!");
    alert("Jugador ganador: " + titulo_del_jugador_ganador);

    cartel_de_finalizacion(jugador_ganador);

}


function cartel_de_finalizacion(jugador_ganador) {


    var texto_jugador_ganador;
    if (jugador_ganador == 0) {
        texto_jugador_ganador = "Usted";
    } else {
        texto_jugador_ganador = "Jugador " + jugador_ganador;
    }

    var ventana_finalización = $('<div>').addClass('ventana_finalizacion');

    var texto_de_la_ventana = $('<h2>').text("¡" + texto_jugador_ganador + " ganado!");

    var boton_de_finalizacion = $('<input>').attr({
        type: "button",
        value: "Reiniciar el Juego"
    });

    ventana_finalización.append(texto_de_la_ventana);
    ventana_finalización.append(boton_de_finalizacion);

    $('.ventana_tablero').append(ventana_finalización);

    $('.ventana_tablero').on('click', '.ventana_finalizacion input', function () {

        window.location.reload();


    });

}


//Recorre los vectores de recursos y reestablece sus valores
function seteo_de_variables_recursos() {
    for (i = 0; i < (cantidad_oponentes + 1); i++) {
        oro[i] = 3;
        poder[i] = 0;
        minas_de_oro[i] = 1;
    }

}




function actualizar_variables_nuevo_turno() {


    dado_mov_jugador = "-";


    for (i = 0; i < (cantidad_oponentes + 1); i++) {

        //Si el jugador no está jugando, lo ignora
        if (esta_jugando_el_jugador[i]) {
            //Las minas generan oro:
            oro[i] = oro[i] + (1 * minas_de_oro[i]);


            //Los soldados consumen oro:
            oro[i] = oro[i] - (0.1 * poder[i]);

            //en caso que el consumo de oro se mayor a la capacidad de producción de las minas
            //No se genera oro hasta reducir el poderío militar
            if (oro[i] < 0) {
                oro[i] = 0;
            }
        }
    }

    /*
    si el jugador perdió, igual puede seguir pasando turnos, para ver los resultados
    */
    juega_usuario = true;

    //imprime en pantalla los nuevos valores
    impresion_variables();
}



//Esta variable será llamada para actualizar los datos en pantalla
function impresion_variables() {
    //Imprime el valor del dado
    $('.visualizador_dado').children().last().text(dado_mov_jugador);

    //Imprime el poderío militar
    $('.poder').children().last().html("<strong> " + poder[0] + "</strong>");

    //Imprime la cantidad de minas de oro con las que se cuenta
    $('.num_minas').html("<strong> " + minas_de_oro[0] + "</strong>");

    var oro_a_mostrar = Math.round(oro[0] * 100) / 100;

    /*
    //La manutención del poderío militar puede generar un valor decimal, en ese caso, lo imprime de forma "Amigable":
    if (Math.round(oro[0]) > oro[0]) {
        oro_a_mostrar = Math.round(oro[0] * 100) / 100 + "-";
    } else if (Math.round(oro[0]) < oro[0]) {
        oro_a_mostrar = Math.round(oro[0] * 100) / 100 + "+";
    } else {
        oro_a_mostrar = oro[0];
    }*/

    //Imprime la cantidad de oro
    $('.oro').children().last().html("<strong> " + oro_a_mostrar + "</strong>");
}




/*
------------------------------------------------------------------------------------------------------------------------------
*/
//función que prepara el tablero al comenzar el juego
function armado_tablero() {

    //console.log("empiezo a armar el tablero");

    //INICIA JUEGO:
    $('#title').hide();
    $('.botoneras_inicio').hide();

    $('.ventana_tablero').show();
    $('.panel_lateral').show();
    $('.visualizador_dado').show();



    //Creación de la tabla
    var tabla_tablero = $('<table>');





    //COMIENZO procedimiento para ubicar las ciudades
    //console.log(cantidad_oponentes + 1);
    for (var indice_ciudad = 0; indice_ciudad < (cantidad_oponentes + 1); indice_ciudad++) {
        ciudades[indice_ciudad] = [];
        var coordenadas_encontradas;
        do {
            coordenadas_encontradas = false;

            //tira al azar las coordenadas de las ciudades
            //Según las reglas, las ciudades se puede ubicar únicamente en la fila 2 o fila 17
            //y columna 2 o columna 17
            if ((Math.floor(Math.random() * 2)) == 0) {
                ciudades[indice_ciudad][0] = 2;
            } else {
                ciudades[indice_ciudad][0] = 17;
            }
            if ((Math.floor(Math.random() * 2)) == 0) {
                ciudades[indice_ciudad][1] = 2;
            } else {
                ciudades[indice_ciudad][1] = 17;
            }

            //comprueba que no haya dos ciudades en las mismas coordenadas
            for (var auxiliar_de_busqueda = 0; auxiliar_de_busqueda < indice_ciudad; auxiliar_de_busqueda++) {
                //console.log("entré al bucle");
                if (ciudades[indice_ciudad][0] == ciudades[auxiliar_de_busqueda][0]) {
                    //console.log("entre al primer condiciona");
                    if (ciudades[indice_ciudad][1] == ciudades[auxiliar_de_busqueda][1]) {
                        coordenadas_encontradas = true;
                        //console.log("rechacé una coordenada");
                    }
                }
            }

        } while (coordenadas_encontradas);
        //estas coordenadas se cargaran en el tablero al momento de imprimir las imágenes;
        //FINALIZO UBICACIÓN DE LAS CIUDADES

        //console.log("ciudad en " + ciudades[indice_ciudad]);
    }


    for (i = 0; i < 20; i++) {
        //Creación de las filas

        /*$('.ventana_tablero table').html('<tr class="fila_' + i + '"></tr>');*/
        var fila_tablero = $('<tr>').addClass('fila' + i);

        tablero[i] = [];
        for (j = 0; j < 20; j++) {
            //Asignación del terreno que le corresponda a la celda
            //El tablero guarda, en la fila i, columna j, 
            //posición 0 el TIPO de terreno, posición 1 el SUBTIPO del terreno
            tablero[i][j] = [];


            //creación de las columnas
            var columna_tablero = $('<td>').addClass('columna' + j);


            //Condiciones de borde de tablero
            if ((i == 0) || (i == 19) || (j == 0) || (j == 19)) {
                //Si el terreno está en el borde, solo puede ser subtipo ocupado.
                tablero[i][j][1] = 2;

                //Si es el primer elemento, asigna un TIPO de terreno al azar
                if ((i == 0) && (j == 0)) {

                    //console.log("es la primer celda");

                    tablero[i][j][0] = Math.floor(Math.random() * 3);
                } // FIN DE LA DEFINICIÓN DEL TERRENO DE LA PRIMER CELDA
                else {
                    //Si es la primera fila
                    if (i == 0) {
                        if (Math.floor(Math.random() * 3) == 0) {
                            //define el tipo del terreno al azar
                            tablero[i][j][0] = Math.floor(Math.random() * 3);
                        } else {
                            //define el tipo del terreno acorde a la posición anterior
                            tablero[i][j][0] = tablero[i][j - 1][0];
                        }
                    }
                    //Si es la primera columna
                    else if (j == 0) {
                        if (Math.floor(Math.random() * 3) == 0) {
                            //define el tipo del terreno al azar
                            tablero[i][j][0] = Math.floor(Math.random() * 3);
                        } else {
                            //define el tipo del terreno acorde a la posición anterior
                            tablero[i][j][0] = tablero[i - 1][j][0];
                        }
                    }
                }

            } //FIN DE LA DEFINICION DE BORDES DEL TABLERO


            //Inicio de carga de posiciones intermedias
            //si el tipo de terreno fue definido previamente, lo ignoro.
            if (tablero[i][j][0] == undefined) {
                //solo se cergarán las posiciones del tablero no definidas



                //Definición del TIPO de terreno
                //si tablero[i][j][0] ya está definido, no lo sobreescribo
                if (Math.floor(Math.random() * 3) == 0) {
                    //define el tipo del terreno al azar
                    tablero[i][j][0] = Math.floor(Math.random() * 3);
                } else {
                    //define el tipo del terreno acorde a la posición anterior
                    if (tablero[i - 1][j][0] == tablero[i][j - 1][0]) {
                        //si la fila y la columna anterior tienen el mismo tipo, pone lo mismo
                        tablero[i][j][0] = tablero[i - 1][j][0];
                    }
                    //Si no son iguales, tira al azar entre uno o el otro
                    else {
                        if (Math.floor(Math.random() * 2) == 0) {
                            tablero[i][j][0] = tablero[i - 1][j][0];
                        } else {
                            tablero[i][j][0] = tablero[i][j - 1][0];
                        }
                    }

                }

                //definición del SUBTIPO del terreno
                //si tablero[i][j][1] ya está definido, no lo sobreescribo
                if (tablero[i][j][1] == undefined) {
                    var subtipo_random = Math.floor(Math.random() * 6);
                    //al azar, con probabilidades

                    if (subtipo_random < 3) {
                        //si sale 0, 1 o 2, pone en esta posición una planicie
                        tablero[i][j][1] = 0;
                    } else if (subtipo_random < 5) {
                        //si sale 3 o 4, pone en esta posición un semiocupado
                        tablero[i][j][1] = 1;
                    } else {
                        //finalmente, si sale 5, pone un ocupado
                        tablero[i][j][1] = 2;
                    }

                }

            }




            //Ahora, ubicará las ciudades
            //Para esto va a pisar lo cargado en el tablero en la sección anterior

            if ((i == 2) || (i == 17)) {
                if ((j == 2) || (j == 17)) {

                    for (indice_ciudad = 0; indice_ciudad < (cantidad_oponentes + 1); indice_ciudad++) {

                        if ((i == ciudades[indice_ciudad][0]) && (j == ciudades[indice_ciudad][1])) {
                            //Almacena en el tablero las posiciones curadas de las ciudades
                            tablero[i][j][1] = 3;

                            //console.log("cambié un terreno por ciudad!");
                        }

                    }
                }

            }









            //dado la información que salió en los condicionales anteriores, se define la imágen a posicionar en el tablero.
            //Primero declaro las variables auxiliares que servirán como indice para comparar el elemento del vector asociativo en el que estoy posicionado con el valor numérico randomizado que me salió en la definición anterior.
            var contador_iteraciones_tipo_terr = 0;
            var contador_iteraciones_subtipo_terr = 0;

            //RECORRE LA lista de posibles terrenos para definir cual irá
            for (var indice_tipo_terr in terrenos) {
                //console.log("entro al primer forin");
                if (contador_iteraciones_tipo_terr == tablero[i][j][0]) {
                    //console.log("entro al primer condicional");
                    for (var indice_subtipo_terr in terrenos[indice_tipo_terr]) {
                        //console.log("entro al segundo forin");
                        if (contador_iteraciones_subtipo_terr == tablero[i][j][1]) {
                            //console.log("entro al último condicional");



                            //Aquí defino que titulo (al posicionar el mouse) se le va a asociar a la imagen

                            var titulo_de_imagen;
                            if ((contador_iteraciones_subtipo_terr == 0) || (contador_iteraciones_subtipo_terr == 1)) {
                                //console.log("imprimo terreno libre");
                                titulo_de_imagen = "Terreno libre";
                            } else if (contador_iteraciones_subtipo_terr == 2) {
                                //console.log("imprimo terreno ocupado");
                                titulo_de_imagen = "Terreno OCUPADO";
                            } else if (contador_iteraciones_subtipo_terr == 3) {

                                for (var k = 0 in ciudades) {

                                    if ((ciudades[k][0] == i) && (ciudades[k][1] == j)) {
                                        //console.log("encontré una posición de ciudad");
                                        if (k == 0) {
                                            titulo_de_imagen = "Su ciudad";
                                        } else {
                                            titulo_de_imagen = "Ciudad del jugador " + k;
                                        }
                                    }
                                }


                            }

                            //CREO LA ETIQUETA DE IMÁGEN
                            var imagen_terreno = $('<img>').attr({
                                src: terrenos[indice_tipo_terr][indice_subtipo_terr],
                                alt: "Celda del terreno de fila " + i + " columna " + j,
                                title: titulo_de_imagen,
                            }).addClass('imagen_fila' + i + '_columna' + j);
                            //console.log(terrenos[indice_tipo_terr][indice_subtipo_terr]);
                        }
                        contador_iteraciones_subtipo_terr++;
                    }
                }
                contador_iteraciones_tipo_terr++;
            }


            //Agrega la imágen del terreno definida en el apartado anterior al la colúmna
            columna_tablero.append(imagen_terreno);

            //Agrega la columna a la fila en curso.
            fila_tablero.append(columna_tablero);

        }
        //Agrega la fila en la tabla
        tabla_tablero.append(fila_tablero);
    }

    //Agrega la tabla en el html

    $('.ventana_tablero').append(tabla_tablero);

    //posiciono el fog of war en toda el tablero
    cargar_fog_of_war();

    //Ubico los personajes de los jugadores en pantalla
    posicionar_jugadores();




}

//FIN seteo de UI









/*
------------------------------------------------------------------------------------------------------------------------------
*/

//Esta función ubica las ciudades de los jugadores y le posiciona el sprite del personaje
//a ser llamada únicamente al comienzo del juego
function posicionar_jugadores() {

    //Repetición por cantidad de jugadores +1 (para considerar al usuario)

    for (i = 0; i < cantidad_oponentes + 1; i++) {

        //Le creo el sub-vector de indices de coordenadas
        posicion_personajes[i] = [];

        //Guardo la posición indicial del personaje en el vector
        posicion_personajes[i][0] = ciudades[i][0];
        posicion_personajes[i][1] = ciudades[i][1];

        //crea un contenedor para el personaje
        var div_personaje = $('<div>').addClass("personaje").attr({
            id: "personaje" + i,
        });
        //crea la imagen

        var titulo_de_la_img_del_jugador;
        if (i == 0) {
            titulo_de_la_img_del_jugador = "¡USTED!";
        } else {
            titulo_de_la_img_del_jugador = "Jugador " + i;
        }

        var img_personaje;

        //Si es el jugador, su personaje es el que eligió en el inicio
        if (i == 0) {
            img_personaje = $('<img>').attr({
                src: personajes[seleccion_personaje_jugador],
                alt: "Personaje del jugador " + i,
                title: titulo_de_la_img_del_jugador,
            }).css({
                marginLeft: "5px",
                marginTop: "5px",
            });
        } else {
            //Caso de que no sea el jugador, carga personajes al azar
            img_personaje = $('<img>').attr({
                src: personajes[Math.floor(Math.random() * 3)],
                alt: "Personaje del jugador " + i,
                title: titulo_de_la_img_del_jugador,
            }).css({
                marginLeft: "5px",
                marginTop: "5px",
                //Los jugadores que no sean el usuario se cargan con opacidad baja
                opacity: "0.02",
            });
        }

        //pongo la imágen del personaje sobre la imágen de la ciudad - alineada al centro en eje horizontal
        img_personaje.offset($('.fila' + ciudades[i][0]).offset());

        //Carga la imagen en el contenedor
        div_personaje.append(img_personaje);

        //console.log($('.fila' + ciudades[i][0]).offset());


        //si es el jugador llamo a la función que modifica el tipo de puntero de posiciones aledañas
        if (i == 0) {
            manito_posiciones_aledañas(posicion_personajes[0][0], posicion_personajes[0][1]);

            //llamo a la función que muestra los terrenos aledaños
            quitar_fog_of_war(posicion_personajes[0][0], posicion_personajes[0][1]);
        }


        //carga el contenedor en la fila y columna correspondiente en el tablero
        $('.fila' + ciudades[i][0] + ' .columna' + ciudades[i][1]).prepend(div_personaje);

        //console.log('.fila' + ciudades[i][0] + ' .columna' + ciudades[i][1]);

    }


}

//Esta función disminulle la transparencia del tablero para actuar como fog of war
function cargar_fog_of_war() {
    //console.log("entre para poner fog of wars");

    for (i = 0; i < 20; i++) {
        for (j = 0; j < 20; j++) {
            $('.imagen_fila' + i + '_columna' + j).css({
                opacity: "0.02",
            });
        }
    }
}

//Esta función detecta si el hubo algún jugador AI que haya entrado o salido del área de visión del usuario
function ai_toggle_fog_of_war() {

    //variable para simplificar la consulta del if
    var auxiliar_de_consulta;

    for (i = 1; i <= cantidad_oponentes; i++) {
        //busca la posición del personaje, por fila y columna en el vector de visibilidad, y almacena el resultado
        auxiliar_de_consulta = visibilidad_terreno[posicion_personajes[i][0]][posicion_personajes[i][1]];
        //console.log("el resultado lógico de la busqueda de la posición de la ia en el vector de visibilidad es: " + auxiliar_de_consulta);

        if (auxiliar_de_consulta) {
            /*si entra aquí, quiere decir que el personaje del jugador que se está consultando está en el campo de visión del USUARIO
            y debe mostrarse.
            
            No es lo correcto, pero se está forzando la sobreescritura de la opacidad (en css) de todos los jugadores
            todas las veces que se haga esta consulta
            */

            $('#personaje' + i + ' img').css({
                opacity: "1",
            });


        } else {
            /*si entra aquí, quiere decir que el personaje del jugador que se está consultando NO está en el campo de visión 
            del USUARIO y debe ocultarse.
            
            No es lo correcto, pero se está forzando la sobreescritura de la opacidad (en css) de todos los jugadores
            todas las veces que se haga esta consulta
            */

            $('#personaje' + i + ' img').css({
                opacity: "0.02",
            });
        }

        //pregunto si la posición del jugador está registrada en el vector de visibilidad - si lo está lo muestro - si no lo está lo oculto
    }

}



//Detección de teclado - por si presiona TAB
$(document).on('keydown', function (e) {

    //console.log("detecte que tocaste una tecla");

    //Comprueba si ya comennzó el juego, si no comenzó no debe hacer nada
    if (habilitar_tab) {
        var codigo_tecla = e.which;
        //console.log("tocaste: " + codigo_tecla);

        //Comprueba que la tecla presionada es tab
        if (codigo_tecla == 9) {
            //console.log("reconoci tab");
            $('.instructivo').toggle(500);
        }
    }

});
