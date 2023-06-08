import GMILogo from "../../atoms/GMILogo/GMILogo";
import HeroImage from "../../../public/images/HompageHero.png";
import GMLogo from "../../atoms/GMLogo/GMLogo";

const Hero = () => {
  return (
    <div
      className="bg-gray-800 text-gray-100 border-y border-gray-100 py-10"
      style={{ backgroundImage: `url(${HeroImage.src})` }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="space-y-5 p-5 max-w-7xl">
          <div className="text-6xl max-w-xl font-sans">
            <h1 className="text-gray-100 mb-5 text-4xl md:text-6xl">
              GameMaker Italia
            </h1>
            <div className="text-xl md:text-3xl">
              Sviluppatori per passione
            </div>
          </div>
        </div>
        <GMLogo className="fill-white max-w-sm p-5 hidden md:block" />
      </div>
    </div>
  );
};

export default Hero;
