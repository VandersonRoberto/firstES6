export class Negociacao{

    constructor(data, quantidade, valor){

        this._data = new Date(data.getTime());
        this._quantidade = quantidade;
        this._valor = valor;

        //Congela o objeto para imepdir que ele seja modificado fora da classe;
        // Porém ele é shalow nao é deep então nosso objeto data que é um outro objeto ele nao congela essas propriedades
        Object.freeze(this);
    }

    get volume(){
        return this._quantidade * this._valor;
    }
    
    get data(){
        // Ex Programacao defensiva: evitando data seja modifcada la fora pois sempre passa um cópia
        return new Date(this._data.getTime());
    }

    get quantidade(){
        return this._quantidade;
    }

    get valor(){
        return this._valor;
    }
}