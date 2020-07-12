import {HttpService} from '../services/HttpService';
import {Negociacao} from '../models/Negociacao';
import {ConnectionFactory} from '../services/ConnectionFactory';
import {NegociacaoDao} from '../dao/NegociacaoDao';

export class NegociacaoService {


    constructor() {
        this._http = new HttpService();
    }

    obterNegociacoesDaSemana() {

        return new Promise((resolve, reject) => {

            this._http
                .get('negociacoes/semana')
                .then(negociacoes => {
                    resolve(negociacoes.map(objeto =>
                        new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)
                    ))
                })
                .catch(erro => reject("Não foi possível obter as negociacoes da semana"));
        });
    }

    obterNegociacoesDaSemanaAnterior() {

        return new Promise((resolve, reject) => {

            this._http
                .get('negociacoes/anterior')
                .then(negociacoes => {
                    resolve(negociacoes.map(objeto =>
                        new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)
                    ))
                })
                .catch(erro => reject("Não foi possível obter as negociacoes da semana anterior"));
        });
    }

    obterNegociacoesDaSemanaRetrasada() {

        return new Promise((resolve, reject) => {

            this._http
                .get('negociacoes/retrasada')
                .then(negociacoes => {
                    resolve(negociacoes.map(objeto =>
                        new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)
                    ))
                })
                .catch(erro => reject("Não foi possível obter as negociacoes da semana retrasada"));
        });
    }


    obterNegociacoes() {

        return Promise.all([
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()
        ]).then(periodos => {

            let negociacoes = periodos
                .reduce((dados, periodo) => dados.concat(periodo), [])
                .map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor));

            return negociacoes;
        }).catch(erro => {
            console.log(erro);
            throw new Error(erro);
        });
    }

    cadastra(negociacao) {

        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociacao adicionada com sucesso')
            .catch(() => {
                console.log(erro);
                throw new Error("Não foi possível adicionar a negociação")
            })
    }

    lista() {

        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listarTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível listar as negociações")
            });
    }

    apagaTodos() {

        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagarTodos())
            .then(() => "Negociações apagadas com sucesso")
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível apagar as negociações")
            })
    }

    importa(listaAtual) {

        return this.obterNegociacoes()
            .then(negociacoes =>
                negociacoes.filter(negociacao =>
                    !listaAtual.some(negociacaoExisente =>
                        JSON.stringify(negociacaoExisente) == JSON.stringify(negociacao)))
            )
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível buscar as negociações para importar");
            });
    }
}