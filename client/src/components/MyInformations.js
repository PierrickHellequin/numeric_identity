import React from "react";

const MyInformations = ({ data, type }) => {
  return (
    <section className="family">
      <h2>Mes informations</h2>
      <ul>
        {type === "parent" ? (
          <li>
            <div className="people">
              <div className="top">
                <div>
                  <p>
                    <span>
                      Nom {data.name} Prénom {data.lastName}
                    </span>
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
          </li>
        ) : (
          <>
            {data.length > 0 ? (
              <>
                {data.map((value, index) => (
                  <li key={index}>
                    <div className="people">
                      {data[index].validate == false ? (
                        <div className="flap inProgress">
                          <span>inProgress</span>
                        </div>
                      ) : (
                        <div className="flap validate">
                          <span>validate</span>
                        </div>
                      )}
                      <div className="top">
                        <div>
                          <p>
                            <span>
                              {data[index].name} {data[index].lastName}{" "}
                            </span>
                          </p>
                          <p>{data[index].otherName}</p>
                          <p>{data[index].birthGender}</p>
                        </div>
                      </div>
                      <div className="bottom">
                        <p>{data[index].birthDate}</p>
                        <p>{data[index].birthCountry}</p>
                        <p>{data[index].birthCity}</p>
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
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </>
            ) : (
              ""
            )}
          </>
        )}
      </ul>
    </section>
  );
};

export default MyInformations;