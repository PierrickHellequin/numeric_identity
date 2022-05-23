import React from "react";
import { Form, Button } from "react-bootstrap";
import useForm from "../../hooks/useForm";

const AddValidateurForm = ({ account, saveEntity }) => {
  const {
    handleSubmit, // handles form submission
    handleChange, // handles input changes
    data, // access to the form data
    errors, // includes the errors to show
  } = useForm({
    validations: {},
    onSubmit: () => saveEntity(data),
    initialValues: {
      // used to initialize the data
      country: "Guinée",
      city: "Conakry",
      streetAddress: "218 rue de la formet saint homain",
      typeValidateur: 1,
      wallet: ""
    },
  });
  return (
    <div>
      <h2 style={{ paddingTop: "10px" }}>Ajouter un validateur </h2>
      <Form onSubmit={handleSubmit}>
        <div className="formGroup">
          <Form.Group className="mb-3">
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Wallet of validator *</Form.Label>
            <Form.Control
              value={data.wallet || ""}
              onChange={handleChange("wallet")}
              type="text"
              required
            />
            {errors.wallet && <p className="error">{errors.wallet}</p>}
          </Form.Group>
            <Form.Label>Country *</Form.Label>
            <Form.Select
              value={data.country || ""}
              onChange={handleChange("country")}
              required
            >
              <option>Guinée</option>
              <option>France</option>
            </Form.Select>
            {errors.country && <p className="error">{errors.country}</p>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>City *</Form.Label>
            <Form.Control
              value={data.city || ""}
              onChange={handleChange("city")}
              type="text"
              required
            />
            {errors.city && <p className="error">{errors.city}</p>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Postal address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Postal address"
              value={data.streetAddress || ""}
              onChange={handleChange("streetAddress")}
              required
            />
            {errors.streetAddress && (
              <p className="error">{errors.streetAddress}</p>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Entity *</Form.Label>
            <Form.Select
              value={data.typeValidateur || ""}
              onChange={handleChange("typeValidateur")}
              required
            >
              <option value="1">Hospital</option>
              <option value="2">State</option>
              <option value="3">TownHall</option>
            </Form.Select>
            {errors.typeValidateur && (
              <p className="error">{errors.typeValidateur}</p>
            )}
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

export default AddValidateurForm;
