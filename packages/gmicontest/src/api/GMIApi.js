import GMIApiMock from "./GMIApi.mock"
import GMIApiProd from "./GMIApi.prod"
import GMIApiParent from "./GMIApiParent";

/** Classe statica per la distribuzione al resto dell'app delle GMIApi */
class GMIApi
{
	static DIkey = "prod";

	static instances =
	{
		prod: new GMIApiProd(),
		mock: new GMIApiMock()
	}

	/** Ritorna un'istanza di GMI api in base al tipo specificato da 'DIkey'
	 * @returns {GMIApiParent} */
	static getInstance()
	{
		return this.instances[this.DIkey];
	}
}


export default GMIApi;