import React, { useEffect, useState } from "react";
import getWeb3 from "../getWeb3";
import identityContract from "../contracts/IdentityPerson.json";
import idFundedRewarder from "../contracts/IdFundedRewarder.json";
import AddValidateurForm from "./Form/AddValidateurFrom";
import ValidateChildForm from "./Form/ValidateChildForm";
import { Accordion } from "react-bootstrap";

const Admin = ({ web3, account }) => {
  const [showForm, setShowForm] = useState(false);
  const [showFormValidate, setShowFormValidate] = useState(false);
  const [instanceIdentity, setInstanceIdentity] = useState({});
  const [instanceRewarder, setInstanceRewarder] = useState({});
  const [childrenInformations, setChildrenInformations] = useState([]);
  const informationsChildrens = [];

  const loadContract = async () => {
    try {
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = await identityContract.networks[networkId];
      const instanceIdentity = await new web3.eth.Contract(
        identityContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      loadChildToValidate(instanceIdentity);
      setInstanceIdentity(instanceIdentity);
    } catch (error) {
      console.error(error);
    }
  };

  const loadContractRewarder = async () => {
    try {
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = await idFundedRewarder.networks[networkId];
      const instanceRewarder = await new web3.eth.Contract(
        idFundedRewarder.abi,
        deployedNetwork && deployedNetwork.address
      );
      setInstanceRewarder(instanceRewarder);
    } catch (error) {
      console.error(error);
    }
  };

  const loadChildToValidate = async (instance) => {
    const loadInstance =
      Object.keys(instanceIdentity).length == 0 ? instance : instanceIdentity;
    let i = 0;
    loadInstance.events
      .registerPeople({
        filter: {
          parentWallet: account,
          validate: false,
        }, // Using an array means OR: e.g. 20 or 23
        fromBlock: 0,
      })
      .on("data", function (event) {
        informationsChildrens[i] = event.returnValues;
        i++;
        setChildrenInformations(informationsChildrens);
      })
      .on("changed", function (event) {
        console.log("Mise à jour");
        // remove event from local database
      })
      .on("error", console.error);

    //setChildrenInformations(informationsChildrens);
  };
  const saveEntity = async (data) => {
    await instanceIdentity.methods
      .addVerifier(
        data.wallet,
        data.country,
        data.city,
        data.streetAddress,
        data.typeValidateur
      )
      .send({ from: account })
      .then((res) => {
        console.log("Ca a fonctionné !! ");
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const showPersonToValidate = () => {
    setShowForm(false);
    setShowFormValidate(!showFormValidate);
  };

  const showFormValidateur = () => {
    setShowForm(!showForm);
    setShowFormValidate(false);
  };

  const validatePerson = async (data) => {
    let idPerson = data.idPerson;
    let walletParent = data.parentWallet;
    await instanceIdentity.methods
      .validatePerson(idPerson)
      .send({ from: account })
      .then(async (res) => {
        console.log("Ca a fonctionné !! ");
        await instanceRewarder.methods
          .RegisterAddress(idPerson, walletParent)
          .send({ from: account })
          .then((res) => {
            console.log("Registered in rewarder!! ");
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  useEffect(() => {
    if (account.length !== 0) {
      console.log("new Account");
      loadContract();
      loadContractRewarder();
    }
  }, [account]);

  return (
    <div className="container pt-5">
      {account.length === 0 ? (
        <p style={{ paddingTop: "104px" }}>
          Pour s enregistrer il faut etre connecté à son compte Metamask
        </p>
      ) : (
        <>
          <section className="actions">
            <h2>Action</h2>
            <ul>
              <li>
                <button className="profil" onClick={showFormValidateur}>
                  <i className="fa-solid fa-user-plus"></i>Add a validateur
                </button>{" "}
              </li>
              <li>
                <button className="profil" onClick={showPersonToValidate}>
                  <i className="fa-solid fa-user-plus"></i>Person to validate
                </button>{" "}
              </li>
            </ul>
          </section>
          {showForm && (
            <AddValidateurForm account={account} saveEntity={saveEntity} />
          )}

          {showFormValidate &&
            (childrenInformations.length > 0
              ? childrenInformations.map((value, index) => (
                  <Accordion defaultActiveKey={[{index}]} alwaysOpen>
                    <Accordion.Item eventKey={index}>
                      <Accordion.Header>{childrenInformations[index].name}  {childrenInformations[index].lastName}</Accordion.Header>
                      <Accordion.Body>
                        <ValidateChildForm
                          childData={childrenInformations[index]}
                          validatePerson={validatePerson}
                        />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                ))
              : "No person to validate")}
        </>
      )}
    </div>
  );
};

export default Admin;
