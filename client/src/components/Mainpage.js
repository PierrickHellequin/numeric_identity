import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import pattern from "../assets/images/bg-pattern.png";
import people from "../assets/images/people.jpg";
import "../App.css"

const Mainpage = ({ account }) => { 

  useEffect(() => {
    console.log("new Account");
  }, [account]);

  return (
    <div className="p-0">
      <section className="bg-home">
        <div className="bg-overlay"></div>
        <div className="app">
          <div className="container">
            <div className="justify-content-center row">
              <div className="text-white text-center col-lg-8">
                <h1 className="home-title">Nous aidons les gouvernements Africains à recenser leur population
</h1>
                {/* <p className="pt-3 home-desc">Etiam sed.Interdum consequat proin vestibulum class at.</p> */}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-pattern-effect"><img src={pattern}></img></div>
      </section>
      <section className="our-services pt-5">
        <div className="container">
          <h2 className="text-center home">Our services</h2>
          <ul>
            <li>
              <i className="fa-solid fa-gem"></i>
              <h3 className="pt-3">Acte de naissance </h3>
              <p className="pt-3 text-center">Nous vous permettons via un simple smartphone d’enregistrer votre enfant, de consulter l’acte de naissance et de le modifier.</p>
            </li>
            <li>
              <i className="fa-solid fa-chart-pie"></i>
              <h3 className="pt-3">Acte de décès </h3>
              <p className="pt-3 text-center">Nous vous permettons via un simple smartphone d’enregistrer le décès de votre membre de famille, de consulter l’acte de décès et de le modifier au besoin</p>
            </li>
            <li>
              <i className="fa-solid fa-piggy-bank"></i>
              <h3 className="pt-3">Récompense</h3>
              <p className="pt-3 text-center">Nous vous récompensons pour vos enregistrements.</p>
            </li>
            <li>
              <i className="fa-solid fa-atom"></i>
              <h3 className="pt-3">Utilisation des récompenses </h3>
              <p className="pt-3 text-center">Epargner, Acheter simplement payes vos impôts.</p>
            </li><li>
               <i className="fa-solid fa-scroll"></i>
              <h3 className="pt-3">Enregistrement des Mairies </h3>
              <p className="pt-3 text-center">Votre rôle sera de valider les données de la population.</p>
            </li><li>
              <i className="fa-solid fa-plane"></i>
              <h3 className="pt-3">Enregistrement des Hôpitaux </h3>
              <p className="pt-3 text-center">Votre rôle sera de valider les données de la population.</p>
            </li>
          </ul>
        </div>
      </section>      
      <section className="process dark pt-5"> 
        <div className="container">
          <h2 className="text-center home">Work process</h2>
          <ul>
            <li className="plan-line">
              <i className="fa-solid fa-pen-fancy"></i>
              <h4>Tell us what you need</h4>
              <p>The Big Oxmox advised her not to do so.</p>
            </li>
            <li className="plan-line">
              <i className="fa-solid fa-id-card-clip"></i>
              <h4>Get free quotes</h4>
              <p>Little Blind Text didn’t listen.</p>
            </li>
            <li>
              <i className="fa-solid fa-bullseye"></i>
              <h4>Deliver high quality product</h4>
              <p>When she reached the first hills.</p>
            </li>
          </ul>
        </div>
      </section>
      <section className="people pt-5"> 
        <div className="container">
            <h2 className="text-center home">Behind the people</h2>
            <ul>
              <li>
                <img src={people} alt="Thibaud C. Developpeur"></img>
                <h4>Thibaud C.</h4>
                <p className="text-uppercase text-center">Développeur</p>
              </li>
              <li>
                <img src={people} alt="Pierrick Hellequin Developpeur"></img>
                <h4>Pierrick Hellequin</h4>
                <p className="text-uppercase text-center">Développeur</p>
              </li>
              <li>
                <img src={people} alt="François Dias"></img>
                <h4>François Dias</h4>
                <p className="text-uppercase text-center">Chef de projet</p>
              </li>
              <li>
                <img src={people} alt="Ad"></img>
                <h4>Abdoulaye TOURÉ</h4>
                <p className="text-uppercase text-center">Chef de projet</p>
              </li>
            </ul>
          </div>
      </section>
      <footer>
        <div className="contact">
          <div className="container">
            <ul>
              <li><a href=""><i className="fa-brands fa-facebook-f"></i></a></li>
              <li><a href=""><i className="fa-brands fa-twitter"></i></a></li>
              <li><a href=""><i className="fa-brands fa-linkedin-in"></i></a></li>
              <li><a href=""><i className="fa-brands fa-google-plus-g"></i></a></li>
            </ul>
            <div><i className="fa-solid fa-envelope m-2"></i> support@identitypower.com</div>
          </div>
        </div>
        <div className="copyright">
          <div className="container">
            2022 © IdentityPower
          </div>
        </div>
      </footer>
    </div>
  );
};
  
export default Mainpage;
