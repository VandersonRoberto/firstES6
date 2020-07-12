export class HttpService {

    _handleErros(res){
        if(!res.ok) throw new Error(res.statusText);
        return res;
    }

    get(url){
        return fetch(url)
                 .then(res => this._handleErros(res))
                 .then(res => res.json());
    }

    getXhr(url) {
        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();

            xhr.open('GET', url);

            xhr.onreadystatechange = () => {
                /*
                    Status requisicao ajax
                    
                    0: requisicao ainda nao iniciada
                    1: conexao com o servidor estabelecida
                    2: requisicao recebida
                    3: processando requisicao
                    4: requisicao concluida e resposta pronta 
    
                */

                if (xhr.readyState == 4) {

                    if (xhr.status == 200) {

                        resolve(JSON.parse(xhr.responseText));

                    } else {

                        reject(xhr.responseText);

                    }
                }

            };

            xhr.send();
        });
    }

    post(url,dado){

        return fetch(url,{
            headers: {'Content-type' : 'application/json'},
            method: 'post',
            body: JSON.stringify(dado)
        })
        .then(res => this._handleErros(res))
        
    }

    postXhr(url, dado) {

        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = () => {

                if (xhr.readyState == 4) {

                    if (xhr.status == 200) {

                        resolve(JSON.parse(xhr.responseText));
                    } else {

                        reject(xhr.responseText);
                    }
                }
            };
            xhr.send(JSON.stringify(dado)); // usando JSON.stringifly para converter objeto em uma string no formato JSON.
        });

    }
}