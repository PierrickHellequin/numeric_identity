import React, { Component, useEffect, useState } from "react";
import { Row, Form, Button } from "react-bootstrap";
import useForm from "../hooks/useForm";
import getWeb3 from "../getWeb3";
import identityContract from "../contracts/IdentityPerson.json";

const Profil = ({ account }) => {
  const {
    handleSubmit, // handles form submission
    handleChange, // handles input changes
    data, // access to the form data
    errors, // includes the errors to show
  } = useForm({
    validations: {
      name: {
        pattern: {
          value: "^[A-Za-z]*$",
          message: "Votre nom doit comporter que des lettres.",
        },
        required: {
          value: true,
          message: "This field is required",
        },
      },
      lastName: {
        pattern: {
          value: "^[A-Za-z]*$",
          message: "Votre prénom doit comporter que des lettres.",
        },
        required: {
          value: true,
          message: "This field is required",
        },
      },
      otherName: {
        pattern: {
          value: "^[A-Za-z]*$",
          message: "Votre prénom doit comporter que des lettres.",
        },
      },
    },
    onSubmit: () => saveIdentity(),
    initialValues: {
      // used to initialize the data
      name: "John",
      lastName: "Hellequin",
      birthGender: "Femme",
      birthCountry: "Guinée",
      otherName: "",
      birthCity: "Wattrelos"
    },
  });
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
        .call()
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

  const saveIdentity = async () => {

    console.log(data);
    console.log(account);
    console.log(data.name);
    await instanceIdentity.methods
      .registerPerson(
        account,
        data.name,
        data.lastName,
        data.otherName,
        data.birthDate,
        "00:00:00",
        data.birthCountry,
        data.birthCity,
        data.birthGender
      )
      .send({from: account})
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
    <div>
      {account.length === 0 ? (
        <p>Pour s enregistrer il faut etre connecté à son compte Metamask</p>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Wallet address</Form.Label>
            <Form.Control
              disabled
              type="text"
              placeholder="Enter votre wallet"
              value={account}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              value={data.name || ""}
              onChange={handleChange("name")}
              type="text"
              placeholder="Name"
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Last name *</Form.Label>
            <Form.Control
              value={data.lastName || ""}
              onChange={handleChange("lastName")}
              type="text"
              required
            />
            {errors.lastName && <p className="error">{errors.lasrName}</p>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Other name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Other name"
              value={data.otherName || ""}
              onChange={handleChange("otherName")}
            />
            {errors.otherName && <p className="error">{errors.otherName}</p>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Birth date *</Form.Label>
            <Form.Control
              type="datetime-local"
              value={data.birthDate || ""}
              onChange={handleChange("birthDate")}
              required
            />
            {errors.birthDate && <p className="error">{errors.birthDate}</p>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Birth country</Form.Label>
            <Form.Select
              value={data.birthCountry || ""}
              onChange={handleChange("birthCountry")}
            >
              <option>Guinée</option>
              <option>France</option>
            </Form.Select>
            {errors.birthCountry && (
              <p className="error">{errors.birthCountry}</p>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Bith city</Form.Label>
            <Form.Control
              type="text"
              placeholder="Birth city"
              value={data.birthCity || ""}
              onChange={handleChange("birthCity")}
            />
            {errors.bithCity && (
              <p className="error">{errors.birthCity}</p>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Birth gender</Form.Label>
            <Form.Select
              value={data.birthGender || ""}
              onChange={handleChange("birthGender")}
            >
              <option>Femme</option>
              <option>Homme</option>
            </Form.Select>
            {errors.birthGender && (
              <p className="error">{errors.birthGender}</p>
            )}
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      )}
    </div>
  );
};

export default Profil;
