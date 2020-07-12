// Trabalhando com Modulos do ES6 nao precisamos do Module Pattern

const stores = ['negociacoes'];
const version = 1;
const dbName = 'aluraframe';

let connection = null;

let close = null;

export class ConnectionFactory {

    constructor() {
        throw new Error("Não é possível criar instancia de ConnectionFactory");
    }

    static getConnection() {

        return new Promise((resolve, reject) => {

            let openRequest = window.indexedDB.open(dbName, version);

            openRequest.onupgradeneeded = e => {

                ConnectionFactory._createStores(e.target.result);

            };

            openRequest.onsuccess = e => {

                if (!connection) {
                    connection = e.target.result;
                    close = connection.close.bind(connection);
                    connection.close = function () {
                        throw new Error("Você não pode fechar a conexão diretamente");
                    }
                }

                resolve(connection);
            };

            openRequest.onerror = e => {
                console.log(e.target.error);

                reject(e.target.error.name);
            };
        });
    }

    static _createStores(connection) {

        stores.forEach(store => {

            if (connection.objectStoreNames.contains(store))
                connection.deleteObjectStore(store);

            connection.createObjectStore(store, { autoIncrement: true });

        });
    }

    static closeConnection() {

        if (connection) {
            close();
            connection = null;
        }

    }
}


//Exemplo: Module Pattern para permitir nossa classe tenha propriedades mesmo nao sendo instanciada , é com base na criacao de uma funcao anonima alto invocada.
// var ConnectionFactory = (function () {

//     const stores = ['negociacoes'];
//     const version = 1;
//     const dbName = 'aluraframe';

//     var connection = null;

//     var close = null;

//     return class ConnectionFactory {

//         constructor() {
//             throw new Error("Não é possível criar instancia de ConnectionFactory");
//         }

//         static getConnection() {

//             return new Promise((resolve, reject) => {

//                 let openRequest = window.indexedDB.open(dbName, version);

//                 openRequest.onupgradeneeded = e => {

//                     ConnectionFactory._createStores(e.target.result);

//                 };

//                 openRequest.onsuccess = e => {

//                     if (!connection){
//                         connection = e.target.result;
//                         close = connection.close.bind(connection);
//                         connection.close = function(){
//                             throw new Error ("Você não pode fechar a conexão diretamente");
//                         }
//                     }

//                     resolve(connection);
//                 };

//                 openRequest.onerror = e => {
//                     console.log(e.target.error);

//                     reject(e.target.error.name);
//                 };
//             });
//         }

//         static _createStores(connection) {

//             stores.forEach(store => {

//                 if (connection.objectStoreNames.contains(store))
//                     connection.deleteObjectStore(store);

//                 connection.createObjectStore(store, { autoIncrement: true });

//             });
//         }

//         static closeConnection(){

//             if(connection){
//                 close();
//                 connection = null;
//             }

//         }
//     }
// })();