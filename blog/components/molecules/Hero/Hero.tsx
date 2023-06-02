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
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-gray-100  text-gray-100 decoration-4">
              GMI
            </span>{" "}
            &egrave; la community italiana di GameMaker
          </h1>
          <h2>
            Un software che permette di creare videogiochi in modo veloce e
            divertente.
          </h2>
        </div>
        <GMLogo className="fill-white max-w-sm p-5 hidden md:block" />
      </div>
    </div>
  );
};

export default Hero;
