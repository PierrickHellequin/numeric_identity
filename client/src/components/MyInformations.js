import React from "react";

const MyInformations = ({ data, type }) => {
  return (
    <>
      {type === "parent" ? (
        <li>
          <div className="people">
            <div className="top">
              <div>
                <p>
                  <span>
                    {data.name} {data.lastName}
                  </span>
                </p>
                <p>Autre prénom </p>
                <p>Masculin</p>
              </div>
            </div>
            <div className="bottom">
              <p>00/00/0000</p>
              <p>{data.country}</p>
              <p>City</p>
            </div>
          </div>
        </li>
      ) : (
        <>
          <li>
            <div className="people">
              {data.validate == false ? (
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
                      {data.name} {data.lastName}{" "}
                    </span>
                  </p>
                  <p>{data.otherName}</p>
                  <p>{data.birthGender}</p>
                </div>
              </div>
              <div className="bottom">
                <p>{data.birthDate}</p>
                <p>{data.birthCountry}</p>
                <p>{data.birthCity}</p>
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
        </>
      )}
    </>
  );
};

export default MyInformations;
