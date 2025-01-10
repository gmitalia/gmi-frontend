import GMIApiMock from "./GMIApi.mock"
import GMIApiProd from "./GMIApi.prod"
import GMIApiParent from "./GMIApiParent";

class GMIApi
{
	static DIkey = "prod";

	static instances =
	{
		prod: new GMIApiProd(),
		mock: new GMIApiMock()
	}

	/**@returns {GMIApiParent} */
	static getInstance()
	{
		return this.instances[this.DIkey];
	}
}


export default GMIApi;