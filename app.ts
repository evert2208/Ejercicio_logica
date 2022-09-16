
const Excel = require("xlsx");

interface data {
  Province_State: string;
  '4/26/21': string;
  Population: number
}
function getKeyByValue (object: any, value : any) {
  return Object.keys(object).find(key => object[key] === value);
}

export const roundToFixed = (input:number, digitos = 1) => {
  var rounded = Math.pow(10, digitos);
  if (input === 0) {
    return input;
  }
  return (Math.round(input * rounded) / rounded).toFixed(digitos);
};

function getDatos(ruta: String) {
  const workbook = Excel.readFile(ruta);
  const workbookSheets = workbook.SheetNames;
  const sheet = workbookSheets[0];
  const dataExcel: Array<data> = Excel.utils.sheet_to_json(workbook.Sheets[sheet]);
 
  const estados = dataExcel.map((item: any)=> {
    return item['Province_State'];
  })


  const estado:Array<string> =Array.from(new Set(estados))

  const estadoResult: any = estado.reduce((prev:any, current:string) => {
    return {...prev, [current]: 0}
  }, {})


  const statePopulations: any = estado.reduce(
    (prev: any, current: string) => {
      return { ...prev, [current]: 0 };
    },
    {}
  );

  const stateDeathRates: any = estados.reduce(
    (prev: any, current: string) => {
      return { ...prev, [current]: 0 };
    },
    {}
  );


  for (const row of dataExcel) {
    let lastKey = Object.keys(row).pop()
    const currentDeaths = estadoResult[row.Province_State] + row["4/26/21"];
    const currentPopulation = statePopulations[row.Province_State] +
      row.Population;
      const result = Number(currentDeaths) / currentPopulation;
    const currentDeathRate: number = (isFinite(result) && result) || 0 ;
    estadoResult[row.Province_State] = currentDeaths;
    statePopulations[row.Province_State] = currentPopulation;
    stateDeathRates[row.Province_State] = currentDeathRate;
  }

  
  
  let valuesObtained: Array<number> =  Object.values(estadoResult);
  let deathRatesValues: Array<number> = Object.values(stateDeathRates);
  const max : number = Math.max(...valuesObtained);
  const min : number = Math.min(...valuesObtained);
  const worstRate: number = Math.max(...deathRatesValues);
  let maxEstado = getKeyByValue(estadoResult, max);
  let minEstado = getKeyByValue(estadoResult, min);
  let worstState = getKeyByValue(stateDeathRates, worstRate);
  console.log("El estado con mayor acumulado a la fecha es ", maxEstado);
  console.log("El estado con menor acumulado a la fecha es", minEstado);
  console.log("porcentaje de muertes vs el total de población por estado:");
  for (const stateEntry of Object.entries(stateDeathRates)) {
    console.log(stateEntry[0], `${roundToFixed(Number(stateEntry[1]) * 100, 3)}%`);
  }
  console.log("El estado más afectado fue ", worstState);


}


getDatos("./datos_ejercicio.csv");