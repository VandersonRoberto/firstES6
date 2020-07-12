"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, ListaNegociacoes;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export("ListaNegociacoes", ListaNegociacoes = function () {

                // Exemplo para API Reflection, onde era necessário passar o contexto para execucao da armadilha
                // constructor(contexto, armadilha){
                //     this._negociacoes = [];
                //     this._armadilha = armadilha;
                //     this._contexto = contexto;
                // }

                // Codigo antes usar proxy
                // constructor(armadilha){
                //     this._negociacoes = [];
                //     this._armadilha = armadilha;
                // }

                function ListaNegociacoes() {
                    _classCallCheck(this, ListaNegociacoes);

                    this._negociacoes = [];
                }

                _createClass(ListaNegociacoes, [{
                    key: "adiciona",
                    value: function adiciona(negociacao) {
                        this._negociacoes.push(negociacao);
                        //this._armadilha(this);
                        //API reflection JS
                        // Reflect.apply(this._armadilha,this._contexto,[this]);
                    }
                }, {
                    key: "esvazia",
                    value: function esvazia() {
                        this._negociacoes = [];
                        //this._armadilha(this);
                        //Reflect.apply(this._armadilha,this._contexto,[this]);
                    }
                }, {
                    key: "ordena",
                    value: function ordena(criterio) {

                        this._negociacoes.sort(criterio);
                    }
                }, {
                    key: "inverteOrdem",
                    value: function inverteOrdem() {

                        this._negociacoes.reverse();
                    }
                }, {
                    key: "negociacoes",
                    get: function get() {
                        return [].concat(this._negociacoes);
                    }
                }]);

                return ListaNegociacoes;
            }());

            _export("ListaNegociacoes", ListaNegociacoes);
        }
    };
});
//# sourceMappingURL=ListaNegociacoes.js.map