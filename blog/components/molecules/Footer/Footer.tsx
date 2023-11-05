import GMILogo from "../../atoms/GMILogo/GMILogo"
import SocialIcon from "../../atoms/SocialIcon/SocialIcon"

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__body">
        <div className="footer__social">
          <div>Seguici su:</div>
          <SocialIcon social= "YouTube"/>
          <SocialIcon social= "Twitter"/>
          <SocialIcon social= "Discord" />
        </div>
      </div>
    </div>
  )
}

export default Footer