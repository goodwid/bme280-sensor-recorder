/* globals NodeMCU I2C1 OneWire setWatch pinMode */
import { config } from './config';

import Normalizer from './normal';

const C = new Normalizer();
const F = new Normalizer();
const H = new Normalizer();
const P = new Normalizer();
function main() {
    const { ssid, password, mqttServer, options, deviceId } = config;
    const BME = require('BME280');
    const wifi = require('Wifi');
    const mqtt = require('MQTT').create(mqttServer, options);
    const scl = NodeMCU.D6;
    const sda = NodeMCU.D5;
    I2C1.setup({scl, sda});
    const bme = BME.connect(I2C1);
    const reportTopic = `homeassist/${deviceId}`;
    const interval = 3;  // in seconds
    function reportTemp(callback) {
        callback(bme.getData());
    }
    wifi.connect(ssid, {password}, err => {
        if (err) console.log('Problem: ', err);
        console.log('Connected to wifi.');
        mqtt.connect();
    });
    wifi.save();
    
    setInterval(() => {
        reportTemp(data => {
            const { temp, pressure, humidity } = data;
            const tempF = (temp*(9/5)+32);
            const tempC = temp;
            F.add(tempF);
            C.add(tempC);
            P.add(pressure);
            H.add(humidity);
            const result = `{"fahrenheit": ${F.report()},"celsius":${C.report()},"pressure":${P.report()},"humidity": ${H.report()} }`
            mqtt.publish(reportTopic, result);
            console.log(result);
        });
    }, 1000 * 4);
    
    // setInterval(() => {
    // }, 999 * 4)
}
