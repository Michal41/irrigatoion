const http = require('http');
var Gpio = require('onoff').Gpio;
var PIN = new Gpio(516, 'out', { initial: 1 }); // on rasberyPI it is physical 7

function checkLocalhost() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '192.168.55.14',
            port: 3000,
            path: '/sensors',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            console.log(res.statusCode)
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        req.on('error', (e) => {
            console.log(e)
            resolve(false);
        });

        req.end();
    });
}

async function main() {
    while (true) {
        const isRunning = await checkLocalhost();
        if (isRunning) {
            PIN.writeSync(0)
            PIN.writeSync(1)
            break;
        } else {
            console.log('not running');
        }
        await new Promise(resolve => setTimeout(resolve, 10000)); // Check every 10 seconds
    }
}

main();