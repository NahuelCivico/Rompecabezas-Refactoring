//Creacion del objeto Juego
var Juego = {
  filaVacia: 2,
  columnaVacia: 2,
  cantidadDePiezasPorLado: 3,
  grilla: [],
  piezas: [],
  anchoPiezas: 0,
  altoPiezas: 0,
  anchoDeRompecabezas: 0,
  altoDeRompecabezas: 0,
  imagen: "",
  contexto: "",
  movimientosTotales: 0,
  contadorDeMovimientos: 45,

  //una vez elegido el nivel, se inicia el juego
  iniciar: function (cantMovimientos) {
    this.posicionClick = new Object;
    this.posicionClick.x = 0;
    this.posicionClick.y = 0;
    this.movimientosTotales = cantMovimientos;
    this.contadorDeMovimientos = cantMovimientos;
    this.piezas = [];
    this.grilla = [];
    document.getElementById("count").innerHTML = this.contadorDeMovimientos;
    this.cantidadDePiezasPorLado = document.getElementById("cantidadPiezasPorLado").value;
    //se guarda el contexto en una variable para que no se pierda cuando se ejecute la funcion iniciarImagen (que va a tener otro contexto interno)
    var self = this;
    this.crearGrilla();
    //se instancian los atributos que indican la posicion de las fila y columna vacias de acuerdo a la cantidad de piezas por lado para que sea la ultima del tablero
    this.filaVacia = this.cantidadDePiezasPorLado - 1;
    this.columnaVacia = this.cantidadDePiezasPorLado - 1;
    //se espera a que este iniciada la imagen antes de construir las piezas y empezar a mezclarlas
    this.iniciarImagen(function () {
      self.crearPiezas();
      self.construirPiezas();
      self.piezaVacia(self.filaVacia, self.columnaVacia);
      //la cantidad de veces que se mezcla es en funcion a la cantidad de piezas por lado que tenemos, para que sea lo mas razonable posible.
      var cantidadDeMezclas = Math.max(Math.pow(self.cantidadDePiezasPorLado, 3), 100);
      self.mezclarPiezas(cantidadDeMezclas);
      self.capturarTeclas();
      self.moverClick();
    });
  },

  crearGrilla: function(){
    this.grilla = [];
    for(var i=0; i<this.cantidadDePiezasPorLado; i++ ){
      this.grilla.push([]);
    }
    for(var i=1; i<=this.cantidadDePiezasPorLado; i++ ){
      for(var j=0; j<this.cantidadDePiezasPorLado; j++ ){
        this.grilla[j].push(i + this.cantidadDePiezasPorLado * j);
      }
    }
  },

  crearPiezas: function(){
    this.piezas = []
    for(var i = 0; i < this.cantidadDePiezasPorLado; i++){
      this.piezas[i] = [];
      for(var j = 0; j < this.cantidadDePiezasPorLado; j++){
        this.piezas[i][j] = [];
        this.piezas[i][j].x = i;
        this.piezas[i][j].y = j;
      }
    }
  },

  construirPiezas: function(){
    for(i = 0; i < this.cantidadDePiezasPorLado; i++){
      for(j = 0; j < this.cantidadDePiezasPorLado; j++){
        var x = this.piezas[i][j].x;
        var y = this.piezas[i][j].y;
        this.contexto.drawImage(this.imagen, x * this.anchoPiezas, y * this.altoPiezas, this.anchoPiezas, this.altoPiezas, i * this.anchoPiezas, j * this.altoPiezas, this.anchoPiezas, this.altoPiezas);
      }
    }
  },

  getContext: function(){
     this.contexto = document.getElementById('canvas').getContext('2d');
  },

  //se carga la imagen del rompecabezas
  cargarImagen: function (e) {
      //se calcula el ancho y el alto de las piezas de acuerdo al tamaño del canvas (600).
      this.anchoPiezas = Math.floor(600 / this.cantidadDePiezasPorLado);
      this.altoPiezas = Math.floor(600 / this.cantidadDePiezasPorLado);
      //se calcula el ancho y alto del rompecabezas de acuerdo al ancho y alto de cada pieza y la cantidad de piezas por lado
      this.anchoDeRompecabezas = this.anchoPiezas * this.cantidadDePiezasPorLado;
      this.altoDeRompecabezas = this.altoPiezas * this.cantidadDePiezasPorLado;
      this.getContext();
    },

    //funcion que carga la imagen
    iniciarImagen: function (callback) {
      this.imagen = new Image();
      var self = this;
      //se espera a que se termine de cargar la imagen antes de ejecutar la siguiente funcion
      this.imagen.addEventListener('load', function () {
        self.cargarImagen.call(self);
        callback();
      }, false);
      this.imagen.src = "images/Nahuel.jpg";
    },

  // Esta función va a chequear si el Rompecabezas esta en la posición ganadora
  chequearSiGano: function(){
    var posicionActual = 1;
    for (var i = 0; i < this.grilla.length; i++) {
      for (var j = 0; j < this.grilla.length; j++) {
        if (this.grilla[i][j] == posicionActual)
          posicionActual++;
      }
    }
    posicionActual === Math.pow(this.cantidadDePiezasPorLado, 2) + 1 ?
      this.mostrarCartelGanador() : this.descontarMov();
  },

  piezasClick: function(){
    self = this;
    document.getElementById('canvas').onmousemove = function(e){
    self.posicionClick.x = Math.floor((e.pageX - this.offsetLeft) / self.anchoPiezas);
    self.posicionClick.y = Math.floor((e.pageY - this.offsetTop) / self.altoPiezas);
    }
  },

  calcularPieza: function(x1, y1, x2, y2){
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  },

  moverClick: function(){
    this.piezasClick();
    self = this;
    $('#canvas').click(function(){
      if (self.calcularPieza(self.filaVacia, self.columnaVacia, self.posicionClick.x, self.posicionClick.y) == 1){
        self.intercambiarPosiciones(self.filaVacia, self.columnaVacia, self.posicionClick.x, self.posicionClick.y);
        self.actualizarPosicionVacia(self.posicionClick.x, self.posicionClick.y);
        self.chequearSiGano();
        self.descontarMov();
      }
    });
  },

  intercambiarPosiciones: function(filaPos1, columnaPos1, filaPos2, columnaPos2){
      var pos1 = this.grilla[filaPos1][columnaPos1];
      var pos2 = this.grilla[filaPos2][columnaPos2];
      this.grilla[filaPos1][columnaPos1] = pos2;
      this.grilla[filaPos2][columnaPos2] = pos1;

      var piezaGuardada = [];
      piezaGuardada = this.piezas[filaPos1][columnaPos1];
      this.piezas[filaPos1][columnaPos1] = this.piezas[filaPos2][columnaPos2];
      this.piezas[filaPos2][columnaPos2] = piezaGuardada;

      this.construirPiezas();
      this.piezaVacia(filaPos2, columnaPos2);
  },

  piezaVacia: function(h, v){
      this.contexto.beginPath();
      this.contexto.rect(h * this.anchoPiezas, v * this.altoPiezas, this.altoPiezas, this.anchoPiezas);
      this.contexto.fillStyle = '#fff';
      this.contexto.fill();
  },

  // Actualiza la posición de la pieza vacía
  actualizarPosicionVacia: function(nuevaFila,nuevaColumna){
      this.filaVacia = nuevaFila;
      this.columnaVacia = nuevaColumna;
  },

  // Para chequear si la posicón está dentro de la grilla.
  posicionValida: function(fila, columna){
      return(fila >= 0 && fila < this.cantidadDePiezasPorLado && columna >= 0 && columna < this.cantidadDePiezasPorLado)
  },

  moverEnDireccion: function(direccion){
    var nuevaFilaPiezaVacia;
    var nuevaColumnaPiezaVacia;

    // Intercambia pieza blanca con la pieza que está arriba suyo
    if(direccion == 40){
      nuevaFilaPiezaVacia = this.filaVacia;
      nuevaColumnaPiezaVacia = this.columnaVacia + 1;
    }
    // Intercambia pieza blanca con la pieza que está abajo suyo
    else if (direccion == 38) {
      nuevaFilaPiezaVacia = this.filaVacia;
      nuevaColumnaPiezaVacia = this.columnaVacia - 1;
    }
    // Intercambia pieza blanca con la pieza que está a su izq
    else if (direccion == 39) {
      nuevaFilaPiezaVacia = this.filaVacia + 1;
      nuevaColumnaPiezaVacia = this.columnaVacia;
    }
    // Intercambia pieza blanca con la pieza que está a su der
    else if (direccion == 37) {
      nuevaFilaPiezaVacia = this.filaVacia - 1;
      nuevaColumnaPiezaVacia = this.columnaVacia;
    }

    if (this.posicionValida(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia)){
      this.intercambiarPosiciones(this.filaVacia, this.columnaVacia,
      nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
      this.actualizarPosicionVacia(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
    }
  },

  mezclarPiezas: function(veces){
    var self = this;
    if(veces<=0){return;}
    var direcciones = [40, 38, 39, 37];
    var direccion = direcciones[Math.floor(Math.random()*direcciones.length)];
    this.moverEnDireccion(direccion);

    setTimeout(function(){
      self.mezclarPiezas(veces-1);
    },20);
  },

  capturarTeclas: function(){
    var self = this;
    document.body.onkeydown = (function(evento) {
      if(evento.which == 40 || evento.which == 38 || evento.which == 39 || evento.which == 37){
        self.moverEnDireccion(evento.which);
        self.descontarMov();
        var gano = self.chequearSiGano();
        if(gano){
          setTimeout(function(){
            self.mostrarCartelGanador();
          },500);
        }
        evento.preventDefault();
      }
    })
  },

  descontarMov: function(){
    if (this.contadorDeMovimientos < 1) {
      this.mostrarCartelPerdedor();
    }else {
      this.contadorDeMovimientos -= 1;
      $('#count').html(this.contadorDeMovimientos);
    }
  },

  mostrarCartelGanador: function(){
    swal("¡ Ganaste !)", "Felicitaciones", "success",)
  },

  mostrarCartelPerdedor: function(){
    swal('¡ Perdiste !', 'Intentalo nuevamente', 'error')
  },
}
//Fin del objeto Juego

Juego.iniciar(Juego.contadorDeMovimientos);

// Actions
$('#cantidadPiezasPorLado').on('keyup',function(){
    Juego.iniciar(Juego.contadorDeMovimientos);
});

$('.radio').on('click', function() {
  var nivel = $( "input:checked" ).attr('id');
  switch (nivel) {
    case "easy":  Juego.iniciar(45);
      break;
    case "medium" : Juego.iniciar(30);
      break;
    case "hard" : Juego.iniciar(20);
      break;
    default:
  }
});

// Validate
$('#cantidadPiezasPorLado').keypress(function(tecla) {
        if(tecla.charCode < 50 || tecla.charCode > 54){
          swal('¡ Ouch !', 'Debes elegir entre 2 y 6 piezas por lado.', 'warning')
          return false;
        }
});
