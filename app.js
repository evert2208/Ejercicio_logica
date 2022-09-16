"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundToFixed = void 0;
const Excel = require("xlsx");
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
const roundToFixed = (input, digitos = 1) => {
    var rounded = Math.pow(10, digitos);
    if (input === 0) {
        return input;
    }
    return (Math.round(input * rounded) / rounded).toFixed(digitos);
};
exports.roundToFixed = roundToFixed;
function getDatos(ruta) {
    const workbook = Excel.readFile(ruta);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];
    const dataExcel = Excel.utils.sheet_to_json(workbook.Sheets[sheet]);
    const estados = dataExcel.map((item) => {
        return item['Province_State'];
    });
    const estado = Array.from(new Set(estados));
    const estadoResult = estado.reduce((prev, current) => {
        return Object.assign(Object.assign({}, prev), { [current]: 0 });
    }, {});
    const statePopulations = estado.reduce((prev, current) => {
        return Object.assign(Object.assign({}, prev), { [current]: 0 });
    }, {});
    const stateDeathRates = estados.reduce((prev, current) => {
        return Object.assign(Object.assign({}, prev), { [current]: 0 });
    }, {});
    for (const row of dataExcel) {
        let lastKey = Object.keys(row).pop();
        const currentDeaths = estadoResult[row.Province_State] + row["4/26/21"];
        const currentPopulation = statePopulations[row.Province_State] +
            row.Population;
        const result = Number(currentDeaths) / currentPopulation;
        const currentDeathRate = (isFinite(result) && result) || 0;
        estadoResult[row.Province_State] = currentDeaths;
        statePopulations[row.Province_State] = currentPopulation;
        stateDeathRates[row.Province_State] = currentDeathRate;
    }
    let valuesObtained = Object.values(estadoResult);
    let deathRatesValues = Object.values(stateDeathRates);
    const max = Math.max(...valuesObtained);
    const min = Math.min(...valuesObtained);
    const worstRate = Math.max(...deathRatesValues);
    let maxEstado = getKeyByValue(estadoResult, max);
    let minEstado = getKeyByValue(estadoResult, min);
    let worstState = getKeyByValue(stateDeathRates, worstRate);
    console.log("El estado con mayor acumulado a la fecha es ", maxEstado);
    console.log("El estado con menor acumulado a la fecha es", minEstado);
    console.log("porcentaje de muertes vs el total de población por estado:");
    for (const stateEntry of Object.entries(stateDeathRates)) {
        console.log(stateEntry[0], `${(0, exports.roundToFixed)(Number(stateEntry[1]) * 100, 3)}%`);
    }
    console.log("El estado más afectado fue ", worstState);
}
getDatos("./datos_ejercicio.csv");
//# sourceMappingURL=app.js.map