import React, { useEffect, useState } from "react";
import getWeb3 from "../getWeb3";
import identityContract from "../contracts/IdentityPerson.json";
import AddParentForm from "./Form/AddParentForm";
import AddChildForm from "./Form/AddChildForm";
import MyInformations from "./MyInformations";
import { ethers } from "ethers";

const Profil = ({ account }) => {
  const [instanceIdentity, setInstanceIdentity] = useState({});
  const [parentInformation, setParentInformation] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [childrenInformations, setChildrenInformations] = useState([]);

  const loadContract = async () => {
    try {
      const web3 = await getWeb3();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = await identityContract.networks[networkId];
      const instanceIdentity = await new web3.eth.Contract(
        identityContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      await instanceIdentity.methods
        .getParentbyWallet()
        .call({ from: account })
        .then((res) => {
          setParentInformation(res);
        })
        .catch(function (err) {
          console.log(err);
        });

      loadChildren(instanceIdentity);
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
        setShowForm(false);
        console.log(res);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const saveParent = async (data) => {
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
        setParentInformation(data);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const loadChildren = async (instance) => {
    const loadInstance = Object.keys(instanceIdentity).length == 0 ? instance : instanceIdentity;
    const informationsChildrens = []; 
    loadInstance.events
      .registerPeople(
        {
          filter: {
            parentWallet: account,
          }, // Using an array means OR: e.g. 20 or 23
          fromBlock: 0,
        },
        function (error, event) {
          console.log('je passe ici');
          informationsChildrens.push(event.returnValues);
          
        }
      )
      .on("changed", function (event) {
        console.log('Mise à jour');
        // remove event from local database
      })
      .on("error", console.error);
      setChildrenInformations(informationsChildrens);
  };

  const showFormChild = () => {
    setShowForm(!showForm);
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
        <div>
          {parentInformation == undefined ? (
            <AddParentForm account={account} saveParent={saveParent} />
          ) : (
            <>
            
              <MyInformations data={parentInformation} type="parent" />
              <MyInformations data={childrenInformations} type="children" />
              <section className="actions">
                <h2>Action</h2>
                <ul>
                  <li>
                    <button className="profil" onClick={showFormChild}>
                      <i className="fa-solid fa-user-plus"></i>Ajouter un enfant
                    </button>{" "}
                  </li>
                </ul>
              </section>
              {showForm && (
                <AddChildForm account={account} saveChild={saveIdentity} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Profil;
