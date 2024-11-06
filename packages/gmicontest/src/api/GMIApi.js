
import GMIApiMock from "./GMIApi.mock"
import GMIApiProd from "./GMIApi.prod"

const GMIApi = {

    DIkey: "prod",
    instances: {
        prod: GMIApiProd,
        mock: GMIApiMock
    },

    getInstance: function () {
        return this.instances[this.DIkey];
    }

}


export default GMIApi;