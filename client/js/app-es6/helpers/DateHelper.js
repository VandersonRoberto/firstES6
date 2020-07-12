export class DateHelper {

    constructor(){
        throw new Error('DateHelper não pode ser instanciado');
    }


    static textoParaData(texto) {

       //Fail fast validation  
       if(!/\d{4}-\d{2}-\d{2}/.test(texto))
           throw new Error("Deve estar no formato YYYY-mm-dd");

        //Speed operator converter data, cada elemento do array vai como parametro ... , um para cada ponto
        return new Date(...texto.split('-')
            .map((item, indice) => item - indice % 2));
    }

    static dataParaTexto(data) {
              
       // Template string
       return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;       
    }
}