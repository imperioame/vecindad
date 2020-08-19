# Juego de rol "Vecindad"
## Sinopsis:
> Sos un emperador en un  país en conflicto, tenes que defender tu castillo ante los emperadores enemigos.
> Inicias  es una ciudad tenes que conquistar las otras ciudades con tu heroe. 

# ESTRUCTURAS DE DATOS
- Terrenos
Array de arrays: Array principal de 3 elementos (uno por tipo de terreno), array secundario de 4 elementos.
en el sub array se encuentran cada variante de del terreno
- Tablero
Array de arrays: 20 elementos por array principal, 20 por array secundario

- Recursos:
        - Oro: Array de 1 posición por cada jugador. En cada posición se almacena el oro actual
        - Poder: Array de 1 posición por cada jugador. En cada posición se almacena el poderío militar actual
        - Minas de oro: Array de 1 posición por cada jugador. En cada posición se almacena la cantidad de minas actuales




(Esta sección está incompleta, ver los comentarios de la hoja de javascript)


# REGLAS
- Reglas del tablero:
	- Matriz 20*20
	- Tipos de terreno de terreno:
		- Verde (codigo de terreno 1)
		- Arena (codigo de terreno 2)
		- Nieve (codigo de terreno 3)
		- Castillo (puede ser sobre fondo verde, arena o nieve. Es conceptual, pero se detalla como subtipo). 

	- Subtipos de terrenos transitables (hay uno por cada tipo):
		- planicie (codigo de subtipo 1)
		- semiocupado (codigo de subtipo 2)
		- Castillo (codigo de subtipo 4)
	- Subtipos de terrenos no transitables:
		- ocupado (codigo de subtipo 3)

- Reglas de creación del tablero:
	- Al iniciar el juego:
		- se recorre la matriz tablero con dos variables (fila y columna)
			- si fila == 1 o Fila == 20 y/o Columna == 1 o Columna == 20
				- Posiciona un terreno no transitable

- Normas de posición de terrenos:
	- si fila == 1 o Fila == 20 y/o Columna == 1 o Columna == 20
		- Posiciona terreno al azar
	-Tira dado de 0 a 2:
		- Si sale 1 o 2:
			- Si el terreno anterior en la fila es Arena, y el terreno anterior en la columna es Arena
				- Posiciona un terreno arena
			- Si el terreno anterior en la fila es Arena y el terreno anterior en la columna es OTRO (O VISEVERSA)
				- tira azar de 1 a 2, si es 1 posiciona otra arena, si es 2 posiciona del otro.
		- si sale 0
			- Pone tipo de terreno al azar

	- Tira otro dado del 0 al 5 para definir el subtipo que se ubicará:
		- Si sale 0, 1, o 2, se ubica una planicie.
		- Si sale 3 o 4 se ubica un semiocupado.
		- Si sale 5 se ubica un ocupado.

	- Por cantidad de jugadores (minimo 2, máximo 4):
		- Selecciona al azar la fila 3 o fila 18 y columna 3 o columna 18
			- almacena esas coordenadas en memoria
			- Posiciona LA CIUDAD DEL USUARIO
		- Selecciona al azar la fila 3 o fila 18 y columna 3 o columna 18
			- Consulta si esas coordenadas ya fueron elegidas
			- almacena esas coordenadas EN OTRA VARIABLE
			- Posiciona otra ciudad (de un jugador no usuario).
		(se repite por cantidad de jugadores).


- Fog of war:
	- Textura de "Nube" o "estrellas" de predominancia negra superpuesta sobre los terrenos en opacidad .9
	- array que almacene las posiciones que fueron transitadas.
	- Función que se ejecuta por movimiento detectado:
		- Consulta si la posición nueva está en el array de movimientos
			- Si está en el array de movimientos no hace nada
			- Si no está:
				- Registra la nueva posición del usuario en el array de movimientos
				- evalúa si la casilla aún tiene la textura superpuesta
					- Borra de esta casilla la textura superpuesta 
				- Evalúa si las casillas aledañas (en todos los sentidos) tienen la textura superpuesta
					- Les pone transparencia 0.4 a la textura superpuesta

- Highlight de casillas transitables
        - Al tirar el dado, que highlightee las casillas aledañas de la siguiente forma:
		- bucle por sentido cardinal
			- Consulta subtipo de terreno:
				-Planicie o Semiocupado: Le agrega una imágen color verde plano superpuesta con opacidad .3 (Probar si en vez de imágen con un div y color de fondo en css)
				-Ocupado: Le agrega un color plano rojo opacidad .3
				-Ciudad: Agrega algún ícono o la resalta de alguna manera
				-ENEMIGO: Agrega algún ícono o la resalta de alguna manera (Ideal - evaluarlo luego)

- Cada jugador cuenta con una ciudad y un personaje.
- Puede haber hasta 4 jugadores (usuario + 3 pc)
	- Cada jugador se identifica numéricamente
		- El usuario es el jugador 0
		- Los demas jugadores pc tienen los subsecuentes números
- Podes elegir moverte o pasar turno (Hay un botón para tirar el dado, un botón para pasar de turno)
	- para moverte tiras un dado del 1 al 3, el valor que sale es lo que te podes mover
        - Podes pasar el turno por más que no hayas finalizado de moverte.
- Posiciones en forma matricial, cada posicion aledaña gasta un valor del dado en moverse
	- Para moverse hay que hacer click en la posición aledaña con terreno transitable
		- Si el terreno es transitable, mueve al personaje y resta 1 al dado que se tiró
		- Si el terreno no es transitable no mueve al personaje y marca una alerta (de color rojo sobre la posición que se seleccionó).
- Ganas 1 de oro por turno minimo (esto es lo mismo que decir que comenzas con una mina de oro).
- Podes comprar soldados o minas de oro
	- las minas agregan 1 de oro por turno
		- Las minas cuestan 6 de oro
		- se puede comprar maximo 10 minas
	- Los soldados aumentan en 1 tu poder de ataque
		- Soldados cuestan 3 de oro
		- los soldados cuestan 0,1 de oro adicional por turno
- Si la consumición excede al poder adquisitivo, no se obtiene oro por turno hasta que disminuzca la consumición (no genera deuda)
- Se comienza con 3 de oro
- Se comienza con 0 de poder


---
## "INTELIGENCIA ARTIFICIAL"

- Por azar
- Dos dados, uno de compra, uno de acción
	- Dado de compra:
		- Si el dado de compra sale 0 o 1, compra un soldado
		- Si el dado de compra sale 2 o 3 o 4, compra una mina de oro
		- Si el dado de compra sale 5, no compra nada
		- Si el dado de compra sale 0, 1, 2, 3, o 4, pero no tiene oro suficiente para comprar, no compra nada.
	- Dado de acción:
		- Si el dado de acción sale 0, se mueve al azar:
			- Para moverse tira otro dado del 1 al 3, esa es la cantidad de lugares que se va a mover
			- Para saber donde moverse, tira otro dado del 1 al 4, por cantidad de lugares a moverse.
		- Si el dado de acción sale 1 o 2, se mueve hacia el oponente
			- Para moverse tira otro dado del 1 al 3, esa es la cantidad de lugares que se va a mover
			- Si hay múltiples jugadores, tira un dado del 1 al la cantidad de jugadores.
				- Si sale 0, se moverá hacia el usuario
				- Si sale otro valor, se moverá hacia el jugador que le corresponda en número
			- Buscará la posición matricial de donde se ubique el jugador
				-Llama a la función de pathfinding para trazar el camino
		- Si el dado de acción sale 3, no realiza movimiento y pasa el turno.
- Al lanzar ambos dados y finalizar las acciones, le toca al siguiente jugador

- Función pathfinding:
	- registra en un array el camino que haría moviendose primero en forma horizontal y luego vertical
	- Depura ese array buscando la forma con menos nodos.
	-La función recibe la posición del oponente seleccionado
	-Registra en un array las coordenadas del camino de la siguiente forma:
		- Por cada columna hasta la columna del usuario o encontrar un subtipo de terreno ocupado
			- Por cada fila hasta la fila del usuario o encontrar un subtipo de terreno ocupado
				- Si choca con un subtipo ocupado, consulta los valores aledaños en eje horizontal:
					- Bucle, hasta que la fila:
						- si algúno NO es subtipo ocupado, se desplaza hacia allí.
							- termina el bucle.
						- Si TODOS los aledaños son ocupados
							- Se desplaza a una fila anterior
							- Vuelve a consultar por camino alternativo 
		 
 ***MEJORAR ESTE CONDICIONAL***



---
## COMBATE

No hay: aplicación de azar al poderío militar en combate (el calculo es directo)

	- Se hace una diferencia entre la cantidad de soldados de cada combatiente
		- El ganador de la batalla es quien tenga más soldados
                - Si ambos tienen el mismo poder, ambos vuelven a la base con 0 poder.
	- Si un personaje se posiciona sobre una ciudad:
		- Si No hay personaje oponente sobre la ciudad, la destruye.
                      - Cambia el subtipo de terreno a semiocupado
                      - Elimina la posición de la ciudad del vector de ciudades.
		- Si hay personaje oponente hay combate.



---
## Condiciones de victoria
Gana quien quede solo:
- Si el usuario gana:
	- Se emite cartel de victoria
	- Se informa estadisticas:
		- Se informa la cantidad de batallas ganadas
		- Se informa la cantidad de batallas perdidas
		- Se informa cantidad de oro recolectado
		- Se informa ejercito máximo alcanzado
		- Se realiza un promedio de estos valores
			- Se muestra y compara el promedio de puntaje de todos los jugadores.
- Si el usuario no gana:
	- Al perder se le da la posibilidad de terminar con el juego y volver a la pantalla inicial.
		- Si elije no terminar con el juego:
			- Se continua con el juego hasta obtener un ganador
			- Se informa las estadísticas del ganador.
