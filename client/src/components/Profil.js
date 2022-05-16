import React, { useEffect, useState } from "react";
import { Row, Form, Button } from "react-bootstrap";
import useForm from "../hooks/useForm";
import getWeb3 from "../getWeb3";
import identityContract from "../contracts/IdentityPerson.json";
import AddParentForm from "./Form/AddParentForm";
import AddChildForm from "./Form/AddChildForm";

const Profil = ({ account }) => {
  const [instanceIdentity, setInstanceIdentity] = useState({});

  const loadContract = async () => {
    try {
      const web3 = await getWeb3();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = await identityContract.networks[networkId];
      const instanceIdentity = new web3.eth.Contract(
        identityContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      console.log(instanceIdentity);
      let dataIdentty = await instanceIdentity.methods
        .getPersonbyWallet(account)
        .call({from: account})
        .then((res) => {
          console.log(res);
        })
        .catch(function (err) {
          console.log(err);
        });

      setInstanceIdentity(instanceIdentity);
    } catch (error) {
      console.error(error);
    }
  };

  const saveIdentity = async (data) => {
    await instanceIdentity.methods
      .registerPerson(
        account,
        data.name,
        data.lastName,
        data.otherName,
        Date.parse(data.birthDate),
        data.birthCountry,
        data.birthCity,
        data.birthGender
      )
      .send({ from: account })
      .then((res) => {
        console.log(res);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const saveParent = async (data) => {
    console.log(data);
    await instanceIdentity.methods
      .registerParent(
        account,
        data.name,
        data.lastName,
        data.Country,
        data.typeDocument,
        data.numberDocument
      )
      .send({ from: account })
      .then((res) => {
        console.log(res);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  useEffect(() => {
    if (account.length !== 0) {
      console.log("new Account");
      loadContract();
    }
  }, [account]);

  return (
    
    <div className="container pt-5">
      {account.length === 0 ? (
        <p style={{ paddingTop: "104px" }}>
          Pour s enregistrer il faut etre connecté à son compte Metamask
        </p>
      ) : (

       <div style={{ paddingTop: "104px" }}>

       <AddParentForm account={account} saveParent={saveParent} />
       
        <section className="actions">
          <h2>Action</h2>
          <ul>
            <li><button className="profil"><i class="fa-solid fa-user-plus"></i>Ajouter un enfant</button> </li>
            <li><button className="profil"><i class="fa-solid fa-user-pen"></i>Modifier un enfant</button> </li>
          </ul>
        </section>
        <section className="family">
          <h2>Mes informations</h2>
          <ul>
            <li>
              <div className="people">
                <div className="top">
                  <div>
                    <p><span>Nom Prénom</span></p>
                    <p>Autre prénom / Autre prénom</p>
                    <p>Masculin</p>
                  </div>
                  <div>
                    <button className="only-icon"><i class="fa-solid fa-pencil"></i></button>
                    <button className="only-icon"><i class="fa-solid fa-xmark"></i></button>
                  </div>
                </div>
                <div className="bottom">
                  <p>00/00/0000</p>
                  <p>Country</p>
                  <p>City</p>
                </div>
                <button className="only-icon pt-4"><i class="fa-solid fa-download"></i><span>Télécharger acte de naissance</span></button>
              </div>
            </li>
            <li>
              <div className="people">
                <div className="top">
                  <div>
                    <p><span>Nom Prénom</span></p>
                    <p>Autre prénom / Autre prénom</p>
                    <p>Masculin</p>
                  </div>
                  <div>
                    <button className="only-icon"><i class="fa-solid fa-pencil"></i></button>
                    <button className="only-icon"><i class="fa-solid fa-xmark"></i></button>
                  </div>
                </div>
                <div className="bottom">
                  <p>00/00/0000</p>
                  <p>Country</p>
                  <p>City</p>
                </div>
                <button className="only-icon pt-4"><i class="fa-solid fa-download"></i><span>Télécharger acte de naissance</span></button>
              </div>
            </li>
            <li>
              <div className="people">
                <div className="top">
                  <div>
                    <p><span>Nom Prénom</span></p>
                    <p>Autre prénom / Autre prénom</p>
                    <p>Masculin</p>
                  </div>
                  <div>
                    <button className="only-icon"><i class="fa-solid fa-pencil"></i></button>
                    <button className="only-icon"><i class="fa-solid fa-xmark"></i></button>
                  </div>
                </div>
                <div className="bottom">
                  <p>00/00/0000</p>
                  <p>Country</p>
                  <p>City</p>
                </div>
                <button className="only-icon pt-4"><i class="fa-solid fa-download"></i><span>Télécharger acte de naissance</span></button>
              </div>
            </li>
          </ul>
        </section>
        <AddChildForm account={account} saveChild={saveIdentity}/>
        </div>
      )}
    </div>
  );
};

export default Profil;
