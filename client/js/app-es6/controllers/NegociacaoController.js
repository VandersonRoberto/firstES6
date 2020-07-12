import {Bind} from '../helpers/Bind';
import {ListaNegociacoes} from '../models/ListaNegociacoes';
import {Mensagem} from '../models/Mensagem';
import {Negociacao} from '../models/Negociacao';
import {NegociacoesView} from '../views/NegociacoesView';
import {MensagemView} from '../views/MensagemView';
import {NegociacaoService} from '../services/NegociacaoService';
import {DateHelper} from '../helpers/DateHelper';

class NegociacaoController {

    constructor() {

        // JS permite que coloquemos funções em variaveis faciliando a escrita e evitando repeticoes
        // o bind é para manter a associação e o this document para o $ nao perdendo o contexto
        let $ = document.querySelector.bind(document);
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
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($("#negociacoesView")),
            'adiciona',
            'esvazia',
            'ordena',
            'inverteOrdem'
        );

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($("#mensagemView")),
            'texto'
        );

        this._ordemAtual = '';  

        this._negociacaoService = new NegociacaoService();

        this._init();
    }

    _init() {

        this._negociacaoService
            .lista()
            .then(negociacoes =>
                negociacoes.forEach(negocicao =>
                    this._listaNegociacoes.adiciona(negocicao)))
            .catch(erro => {
                this._mensagem.texto = erro;
            })

       setInterval(() => {
           this.importaNegociacoes();
       }, 3000)
    }

    adiciona() {

        event.preventDefault();

        let negociacao = this._criaNegociacao();

        this._negociacaoService
            .cadastra(negociacao)
            .then(mensagem => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = mensagem;
                this._limpaFormulario();
            })
            .catch(erro => this._mensagem.texto = erro);
    }

    importaNegociacoes() {

      this._negociacaoService
            .importa(this._listaNegociacoes.negociacoes)
            .then(negociacoes => {
                negociacoes.forEach(negociacao => {
                    this._listaNegociacoes.adiciona(negociacao);
                })
                this._mensagem.texto = "Negociações do periodo importadas";
            })



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

    apaga() {

        this._negociacaoService
            .apagaTodos()
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            })
            .catch(erro => {
                this._mensagem.texto = erro;
            });
    }

    _criaNegociacao() {

        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );
    }

    _limpaFormulario() {

        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;

        this._inputData.focus();
    }

    ordena(coluna) {
        
        if(this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem(); 
        } else {
            this._listaNegociacoes.ordena((p, s) => p[coluna] - s[coluna]);    
        }
        this._ordemAtual = coluna;    
    }
}

let negociacaoController = new NegociacaoController();

export function currentInstance(){
    return negociacaoController;
}