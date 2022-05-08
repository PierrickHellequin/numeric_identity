import React, { useEffect, useState } from "react";
import { Row, Form, Button } from "react-bootstrap";
import useForm from "../../hooks/useForm";

const AddParentForm = ({account, saveParent  }) => {
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
    },
    onSubmit: () => saveParent(data),
    initialValues: {
      // used to initialize the data
      name: "John",
      lastName: "Hellequin",
      Gender: "Homme",
      Country: "Guinée",
      typeDocument: "Passport"
    },
  });

  return (
    <div>
    <h2>Enregistrer mes données de parent </h2>
    <Form onSubmit={handleSubmit}>

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
        {errors.lastName && <p className="error">{errors.lastName}</p>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Country</Form.Label>
        <Form.Select
          value={data.country || ""}
          onChange={handleChange("Country")}
        >
          <option>Guinée</option>
          <option>France</option>
        </Form.Select>
        {errors.Country && <p className="error">{errors.Country}</p>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Gender</Form.Label>
        <Form.Select
          value={data.Gender || ""}
          onChange={handleChange("Gender")}
        >
          <option>Femme</option>
          <option>Homme</option>
        </Form.Select>
        {errors.Gender && <p className="error">{errors.Gender}</p>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Type document</Form.Label>
        <Form.Select
          value={data.typeDocument || ""}
          onChange={handleChange("typeDocument")}
        >
          <option>Passport</option>
          <option>Sécurité social </option>
          <option>Permis</option>
        </Form.Select>

        {errors.typeDocument && <p className="error">{errors.typeDocument}</p>}
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Numéro document</Form.Label>
        <Form.Control
          value={data.numberDocument || ""}
          onChange={handleChange("numberDocument")}
          type="text"
          required
        />
        {errors.numberDocument && <p className="error">{errors.numberDocument}</p>}
      </Form.Group>

      <Button variant="primary" type="submit">
        Enregistrer ces informations
      </Button>
    </Form>
    </div>
  );
};

export default AddParentForm;
