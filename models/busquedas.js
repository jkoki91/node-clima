import axios from 'axios';
import fs from 'fs';


class Busquedas {
    historial = [];
    dbPath = './db/database.json'; 

    constructor( ){
        this.leerDb()
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        })
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'language': 'es',
            'limit': 5
        }
    }

    get paramsClima(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'lang' : 'es',
            'units': 'metric'
        }
    }

    async ciudad( lugar = '' ) {
        try{
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            })
            const resp = await instance.get();

            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch ( error ) {
            return [];
        }

    };

    async climaLugar( lat, lon ){
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsClima, lat: lat, lon:lon}
            })
            const resp = await instance.get();
            // console.log(resp.data);
            return{
                desc: resp.data.weather[0].description,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = '' ) {

        if( this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial.unshift( lugar.toLocaleLowerCase() );

        // guardar db
        this.guardarDb();
    }

    guardarDb() {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ))

    }

    leerDb(){
        if(!fs.existsSync(this.dbPath)) return;
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse( info );

        this.historial = data.historial;

    }
}





export {Busquedas}; 