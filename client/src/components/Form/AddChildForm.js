import React from "react";
import {  Form, Button } from "react-bootstrap";
import useForm from "../../hooks/useForm";

const AddChildForm = ({ account, saveChild }) => {
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
    onSubmit: () => saveChild(data),
    initialValues: {
      // used to initialize the data
      name: "Astou",
      lastName: "Doe",
      birthGender: "Femme",
      birthCountry: "Guinée",
      otherName: "",
      birthCity: "Conakry",
    },
  });
  return (
    <div>
      <h2 style={{ paddingTop: "10px" }}>Ajouter un enfant </h2>
      <Form onSubmit={handleSubmit}>

        <div className="formGroup">
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
          <Form.Group className="mb-3">
            <Form.Label>Birth gender</Form.Label>
            <Form.Select
              value={data.birthGender || ""}
              onChange={handleChange("birthGender")}
            >
              <option>Femme</option>
              <option>Homme</option>
            </Form.Select>
            {errors.birthGender && <p className="error">{errors.birthGender}</p>}
          </Form.Group>
        </div>

        <div className="formGroup">
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
            <Form.Label>Birth city</Form.Label>
            <Form.Control
              type="text"
              placeholder="Birth city"
              value={data.birthCity || ""}
              onChange={handleChange("birthCity")}
            />
            {errors.bithCity && <p className="error">{errors.birthCity}</p>}
          </Form.Group>
        </div>
        
        <div className="formGroup last">
          <Button className="mb-3" variant="primary" type="submit">
            Submit
          </Button>
        </div>           
      </Form>
    </div>
  );
};

export default AddChildForm;