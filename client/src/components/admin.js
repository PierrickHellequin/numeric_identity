import React, { useEffect, useState } from "react";
import getWeb3 from "../getWeb3";
import identityContract from "../contracts/IdentityPerson.json";
import AddValidateurForm from "./Form/AddValidateurFrom";
import { Form, Button } from "react-bootstrap";

const Admin = ({ web3, account }) => {
  const [showForm, setShowForm] = useState(false);
  const [showFormValidate, setShowFormValidate] = useState(false);
  const [instanceIdentity, setInstanceIdentity] = useState({});
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

  const validatePerson = async (e) => {
    e.preventDefault();
    let idPerson = e.target.idPerson.value;
    let walletParent = e.target.walletParent.value;
    await instanceIdentity.methods
      .validatePerson(idPerson)
      .send({ from: account })
      .then((res) => {
        console.log("Ca a fonctionné !! ");
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
             
                  <div key={index}>
                    <form onSubmit={validatePerson}>
                      {childrenInformations[index].name} -
                      {childrenInformations[index].lastName}
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Id person</Form.Label>
                        <Form.Control
                          value={childrenInformations[index].idPerson}
                          type="text"
                          name="idPerson"
                          required
                          disabled
                        />

                      <Form.Label>Wallet</Form.Label>
                        <Form.Control
                          value={childrenInformations[index].parentWallet}
                          type="text"
                          name="walletParent"
                          required
                          disabled
                        />
                      </Form.Group>
                      <div className="formGroup last">
                        <Button
                          className="mb-3"
                          variant="primary"
                          type="submit"
                        >
                          Validate Person
                        </Button>
                      </div>
                    </form>
                  </div>
                ))
              : "No person to validate")}
        </>
      )}
    </div>
  );
};

export default Admin;
