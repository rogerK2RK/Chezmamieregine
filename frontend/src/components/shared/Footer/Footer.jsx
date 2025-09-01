import './Footer.css';
import logo from '../../../assets/Logo CMR Blc.svg'
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className='footer-top'>

        <div className='footer-top--left'>
          <img className='logo' src={logo} alt="logo de chez mamie régine" />
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint cumque ipsa, ad, natus fugit, distinctio error optio cupiditate non in praesentium officia? Praesentium totam corporis libero. Nam possimus alias quod.</p>
          <div>
            <h4>OPENING HOURS</h4>
            <div className='blc-hours'>
              <div>
                <p>Lundi - vendredi</p>
                <p>14h à 18h</p>
              </div>
              <div>
                <p>Samedi</p>
                <p>8h à 18h</p>
              </div>
              <div>
                <p>Dimanche</p>
                <p>FERMER</p>
              </div>
            </div>
            
          </div>
        </div>

        <div className='footer-top--right'>
          <div className='content'>
            <h4>NAVIGATION</h4>
            <Link>Malgache</Link>
            <Link>Malgache</Link>
            <Link>Malgache</Link>
          </div>
          <div className='content'>
            <h4>DISHES</h4>
            <Link>Malgache</Link>
            <Link>Malgache</Link>
            <Link>Malgache</Link>
          </div>
          <div className='content'>
            <h4>FOLLOW US</h4>
            <Link>Malgache</Link>
            <Link>Malgache</Link>
            <Link>Malgache</Link>
          </div>
        </div>

      </div>

      <hr/>

      <div className='footer-btm'>
        <p>© {year} Chez Mamie Régine. Tous droits réservés. Designed by Roger RETITA</p>
        <div className="links">
          <a href="/mentions-legales">Mentions légales</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
      
    </footer>
  );
}
