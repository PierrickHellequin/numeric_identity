import React from "react";

const MyInformations = ({ data, type  }) => {
  return (
    <section className="family">
      {console.log(data)}
      <h2>Mes informations</h2>
      <ul>
      { type === "parent" ? (
        <li>
          <div className="people">
          
            <div className="top">
              <div>
                <p>
                  <span>Nom {data.name} Prénom {data.lastName}</span>
                </p>
                <p>Autre prénom / Autre prénom</p>
                <p>Masculin</p>
              </div>
            </div>
            <div className="bottom">
              <p>00/00/0000</p>
              <p>Country: {data.country}</p>
              <p>City</p>
            </div>


          </div>
        </li>):""}
        { type== "children" ? (() => console.log(data[8])) : ''}
        { type == "children"  ? ( 
        
        data.forEach(element => {
         console.log("je suis laa ");
        return(
        <><li>
          <div className="people">
            <div className="flap inProgress">
              <span>In progresss</span>
            </div>
            <div className="top">
              <div>
                <p>
                  <span>Nom Prénom</span>
                </p>
                <p>Autre prénom / Autre prénom</p>
                <p>Masculin</p>
              </div>
            </div>
            <div className="bottom">
              <p>00/00/0000</p>
              <p>Country</p>
              <p>City</p>
            </div>
            <div className="groupButton pt-3">
              <button className="btn only-icon">
                <i className="fa-solid fa-download"></i>
                <span>Télécharger acte de naissance</span>
              </button>
              <div>
                <button className="only-icon btn">
                  <i className="fa-solid fa-pencil"></i>
                </button>
                <button className="only-icon btn">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div className="people">
            <div className="top">
              <div>
                <p>
                  <span>Nom Prénom</span>
                </p>
                <p>Autre prénom / Autre prénom</p>
                <p>Masculin</p>
              </div>
              <div>
                <button className="btn only-icon">
                  <i className="fa-solid fa-pencil"></i>
                </button>
                <button className="btn only-icon">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
            <div className="bottom">
              <p>00/00/0000</p>
              <p>Country</p>
              <p>City</p>
            </div>
            <button className="btn only-icon pt-4">
              <i className="fa-solid fa-download"></i>
              <span>Télécharger acte de naissance</span>
            </button>
          </div>
        </li> </>
        )})) :""}

      </ul>
    </section>
  );
};

export default MyInformations;
