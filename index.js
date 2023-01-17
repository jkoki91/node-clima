import * as dotenv from 'dotenv'
dotenv.config()

import { inquireMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js";
import colors from 'colors';
import { Busquedas } from "./models/busquedas.js";

const main = async () => {

    const busquedas = new Busquedas()
    let opt;

    do {
        
        opt = await inquireMenu();

        switch ( opt ) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                
                // Buscar los lugares
                const lugares = await busquedas.ciudad(termino);
                
                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                if( id === '0' ) continue;
                const lugarSel = lugares.find( l => l.id === id);

                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.nombre);
                console.log('Lat: ', lugarSel.lat);
                console.log('Long: ', lugarSel.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Mínima: ', clima.min);
                console.log('Máxima: ', clima.max);
                console.log('Como está el clima: ', clima.desc);

            break;
            
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i+1}.`.green
                    console.log(`${idx} ${lugar}`);
                })
            break;

        }

        if(opt !== 0 ) await pausa();

    } while ( opt !== 0 );

};


main();