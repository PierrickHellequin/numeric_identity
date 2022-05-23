import React, { useEffect, useState } from "react";
import getWeb3 from "../getWeb3";
import identityContract from "../contracts/IdentityPerson.json";
import AddParentForm from "./Form/AddParentForm";
import AddChildForm from "./Form/AddChildForm";
import MyInformations from "./MyInformations";

const Profil = ({ account }) => {
  const [instanceIdentity, setInstanceIdentity] = useState({});
  const [parentInformation, setParentInformation] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [childrenInformations, setChildrenInformations] = useState([]);
  const informationsChildrens = [];

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
          if (res.alive == true) {
            setParentInformation(res);
          }
        })
        .catch(function (err) {
          console.log(err);
        });

      let i = 0;
      await instanceIdentity.events
        .registerPeople({
          filter: {
            parentWallet: account.toLowerCase(),
          }, // Using an array means OR: e.g. 20 or 23
          fromBlock: 0,
        })
        .on("data", function (event) {
          if(event.returnValues.parentWallet.toLowerCase() != account.toLowerCase()){
            return;
          }
          console.log(event.returnValues);
          informationsChildrens[i] = event.returnValues;
          i++;
          setChildrenInformations(informationsChildrens);
        })
        .on("changed", function (event) {
          console.log("Mise à jour");
          // remove event from local database
        })
        .on("error", console.error);

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
        alert("Enfant ajouté.");
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
        alert("Parent ajouté.");
        setParentInformation(data);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const showFormChild = (e) => {
    e.preventDefault();
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
          {parentInformation == 0 ? (
            <AddParentForm account={account} saveParent={saveParent} />
          ) : (
            <>
              <section className="family">
                <h2>Mes informations</h2>
                <ul>
                  <MyInformations data={parentInformation} type="parent" />
                </ul>
              </section>
              {childrenInformations.length > 0 ? (
                <section className="family">
                  <h2>Mes enfants</h2>
                  <ul>
                    {childrenInformations.map((value, index) => (
                      <MyInformations
                        data={childrenInformations[index]}
                        type="children"
                        key={index}
                      />
                    ))}
                  </ul>
                </section>
              ) : (
                ""
              )}

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
