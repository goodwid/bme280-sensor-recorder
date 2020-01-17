const LABEL = 'kitchen'

export const config = {
  ssid: '',
  password: '',
  mqttServer: '192.168.1.xxx',
  deviceId: `sensors/${LABEL}`,
  options: {
    client_id: `${LABEL}_temp_sensor`,
    port: 1883,
    keep_alive: 900,
    clean_session: true
  }
}
