export class ListaNegociacoes{


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

    constructor(){
        this._negociacoes = [];
    }

    adiciona(negociacao){
        this._negociacoes.push(negociacao)
        //this._armadilha(this);
        //API reflection JS
       // Reflect.apply(this._armadilha,this._contexto,[this]);
    }

    get negociacoes(){
        return [].concat(this._negociacoes);
    }

    esvazia(){
        this._negociacoes = [];
        //this._armadilha(this);
        //Reflect.apply(this._armadilha,this._contexto,[this]);
    }

    ordena(criterio) {

        this._negociacoes.sort(criterio);        
    }
    
    inverteOrdem() {

        this._negociacoes.reverse();
    }    
}