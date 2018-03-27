var expect = chai.expect;

describe('Creación', function() {
    'use strict';

describe('Juego', function() {
    it('El Objeto Juego está definido', function(done) {
      if (!window.Juego){
        done(err);
      }
      else{
        done();
      }
    });
});

describe('Tamaño de la grilla', function() {
    it('La grilla tiene el tamaño correcto', function() {
      //se crea la grilla con un valor de cantidad de piezas por lado
      Juego.cantidadDePiezasPorLado = 5;
      Juego.crearGrilla();
      //se evalua si el tamaño de la grilla creada es correcto
      expect(Juego.grilla.length).to.equal(Juego.cantidadDePiezasPorLado);
      expect(Juego.grilla[0].length).to.equal(Juego.cantidadDePiezasPorLado);
    });
  });

  describe('Posición válida', function(){
    it('La posición esta dentro de la grilla', function(){
      //Se llama a la funcion posicionValida(), para un caso correcto y para como un caso incorrecto
      var correcto = Juego.posicionValida(2, 2);
      var incorrecto = Juego.posicionValida(-3, -3);
      expect(correcto).to.equal(true);
      expect(incorrecto).to.equal(false);
    });
  });
});
