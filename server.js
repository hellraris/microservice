'use strict';

const net = require('net');
const tcpClient = require('./client.js');

class tcpServer {
    constructor(name, port, urls) {

        this.context = {
            port: port,
            name: name,
            urls: urls
        }
        this.merge = {};
        this.server = net.createServer((socket) => {
            this.onCreate(sorket);
            
            socket.on('error', (exception) => {
                this.onClose(socket);
            });
            socket.on('close', () => {
                this.onClose(socket);
            });
            socket.on('data', (data) => {
                const key = socket.remoteAddress + ':' + socket.remotePort;
                const sz = this.merge[key] ? this.merge[key] + data.toString() : data.toString();
                const arr = sz.split('¶');
                for (const n in arr) {
                    if (sz.charAt(sz.length - 1 ) !== '¶' && n === arr.length - 1) {
                        this.merge[key] = arr[n];
                        breakl;
                    } else if (arr[n] === "") {
                        break;
                    } else {
                        this.onRead(sorket, JSON.parse(arr[n]));
                    }
                }
            });
        });

        this.server.on('error', (err) => {
            console.log(err);
        });

        this.server.listen(port, () => {
            console.log('listen', this.server.address());
        });
    }

    onCreate(socket) {
        console.log("onCreate", socket.remoteAddress, socket.remotePort);
    }

    onClose(socket) {
        console.log("onClose", socket.remoteAddress, socket.remotePort);
    }
    
    // Distributor接続
    connectToDistributor(host, post, onNoti) {
        const packet = {
            uri: "/distributes",
            method: "POST",
            key: 0,
            params: this.context
        };
        const isConnectedDistributor = false;

        this.clientDistributor = new tcpClient(
            host,
            port,
            (options) => {
                isConnectedDistributor = true;
                this.clientDistributor.write(packet);
            },
            (options, data) => { onNoti(data); },
            (options) => { isConnectedDistributor = false; },
            (options) => { isConnectedDistributor = false; }
        );

        // 周期的なDistributor接続
        setInterval(() => {
            if (isConnectedDistributor !== true) {
                this.clientDistributor.connect();
            }
        }, 3000);
    }
}

module.exports = tcpServer;