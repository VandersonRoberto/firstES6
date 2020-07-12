'use strict';

System.register(['../helpers/Bind', '../models/ListaNegociacoes', '../models/Mensagem', '../models/Negociacao', '../views/NegociacoesView', '../views/MensagemView', '../services/NegociacaoService', '../helpers/DateHelper'], function (_export, _context) {
    "use strict";

    var Bind, ListaNegociacoes, Mensagem, Negociacao, NegociacoesView, MensagemView, NegociacaoService, DateHelper, _createClass, NegociacaoController, negociacaoController;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_helpersBind) {
            Bind = _helpersBind.Bind;
        }, function (_modelsListaNegociacoes) {
            ListaNegociacoes = _modelsListaNegociacoes.ListaNegociacoes;
        }, function (_modelsMensagem) {
            Mensagem = _modelsMensagem.Mensagem;
        }, function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }, function (_viewsNegociacoesView) {
            NegociacoesView = _viewsNegociacoesView.NegociacoesView;
        }, function (_viewsMensagemView) {
            MensagemView = _viewsMensagemView.MensagemView;
        }, function (_servicesNegociacaoService) {
            NegociacaoService = _servicesNegociacaoService.NegociacaoService;
        }, function (_helpersDateHelper) {
            DateHelper = _helpersDateHelper.DateHelper;
        }],
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

            NegociacaoController = function () {
                function NegociacaoController() {
                    _classCallCheck(this, NegociacaoController);

                    // JS permite que coloquemos funções em variaveis faciliando a escrita e evitando repeticoes
                    // o bind é para manter a associação e o this document para o $ nao perdendo o contexto
                    var $ = document.querySelector.bind(document);
                    this._inputData = $("#data");
                    this._inputQuantidade = $("#quantidade");
                    this._inputValor = $("#valor");

                    //Exemplo para api reflection onde era necessário passar this como parametro
                    // this._listaNegociacoes = new ListaNegociacoes(this,function(model){
                    //     this._negociacoesView.update(model);
                    // });

                    // So de mudarmos para arrow function ele nao tem contexto como a função ele é léxico (mantem o seu contexto atual onde ela é criada) proprio e assim o this será o NegociacoController
                    //Comportamento antes do proxy
                    //this._listaNegociacoes = new ListaNegociacoes(model =>  this._negociacoesView.update(model));
                    this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($("#negociacoesView")), 'adiciona', 'esvazia', 'ordena', 'inverteOrdem');

                    this._mensagem = new Bind(new Mensagem(), new MensagemView($("#mensagemView")), 'texto');

                    this._ordemAtual = '';

                    this._negociacaoService = new NegociacaoService();

                    this._init();
                }

                _createClass(NegociacaoController, [{
                    key: '_init',
                    value: function _init() {
                        var _this = this;

                        this._negociacaoService.lista().then(function (negociacoes) {
                            return negociacoes.forEach(function (negocicao) {
                                return _this._listaNegociacoes.adiciona(negocicao);
                            });
                        }).catch(function (erro) {
                            _this._mensagem.texto = erro;
                        });

                        setInterval(function () {
                            _this.importaNegociacoes();
                        }, 3000);
                    }
                }, {
                    key: 'adiciona',
                    value: function adiciona() {
                        var _this2 = this;

                        event.preventDefault();

                        var negociacao = this._criaNegociacao();

                        this._negociacaoService.cadastra(negociacao).then(function (mensagem) {
                            _this2._listaNegociacoes.adiciona(negociacao);
                            _this2._mensagem.texto = mensagem;
                            _this2._limpaFormulario();
                        }).catch(function (erro) {
                            return _this2._mensagem.texto = erro;
                        });
                    }
                }, {
                    key: 'importaNegociacoes',
                    value: function importaNegociacoes() {
                        var _this3 = this;

                        this._negociacaoService.importa(this._listaNegociacoes.negociacoes).then(function (negociacoes) {
                            negociacoes.forEach(function (negociacao) {
                                _this3._listaNegociacoes.adiciona(negociacao);
                            });
                            _this3._mensagem.texto = "Negociações do periodo importadas";
                        });

                        /* Exemplo com callback hell 
                        service.obterNegociacoesDaSemana()
                            .then(negociacoes => {
                                  negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
                                this._mensagem.texto = "Negociações importadas com sucesso";
                            })
                            .catch(erro => this._mensagem.texto = erro);
                          service.obterNegociacoesDaSemanaAnterior()
                            .then(negociacoes => {
                                  negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
                                this._mensagem.texto = "Negociações importadas com sucesso";
                            })
                            .catch(erro => this._mensagem.texto = erro);
                          service.obterNegociacoesDaSemanaRetrasada()
                            .then(negociacoes => {
                                  negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
                                this._mensagem.texto = "Negociações importadas com sucesso";
                            })
                            .catch(erro => this._mensagem.texto = erro);
                            */

                        // err callback de erro padrão Error First
                        //    service.obterNegociacoesDaSemana((erro,negociacoes) => {

                        //     if(erro){
                        //         this._mensagem.texto = erro;
                        //         return;
                        //       }

                        //       negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                        //       this._mensagem.texto = "Negociações importadas com sucesso";
                        //    });
                    }
                }, {
                    key: 'apaga',
                    value: function apaga() {
                        var _this4 = this;

                        this._negociacaoService.apagaTodos().then(function (mensagem) {
                            _this4._mensagem.texto = mensagem;
                            _this4._listaNegociacoes.esvazia();
                        }).catch(function (erro) {
                            _this4._mensagem.texto = erro;
                        });
                    }
                }, {
                    key: '_criaNegociacao',
                    value: function _criaNegociacao() {

                        return new Negociacao(DateHelper.textoParaData(this._inputData.value), parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));
                    }
                }, {
                    key: '_limpaFormulario',
                    value: function _limpaFormulario() {

                        this._inputData.value = '';
                        this._inputQuantidade.value = 1;
                        this._inputValor.value = 0.0;

                        this._inputData.focus();
                    }
                }, {
                    key: 'ordena',
                    value: function ordena(coluna) {

                        if (this._ordemAtual == coluna) {
                            this._listaNegociacoes.inverteOrdem();
                        } else {
                            this._listaNegociacoes.ordena(function (p, s) {
                                return p[coluna] - s[coluna];
                            });
                        }
                        this._ordemAtual = coluna;
                    }
                }]);

                return NegociacaoController;
            }();

            negociacaoController = new NegociacaoController();
            function currentInstance() {
                return negociacaoController;
            }

            _export('currentInstance', currentInstance);
        }
    };
});
//# sourceMappingURL=NegociacaoController.js.map