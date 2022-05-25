import React from "react";
import { Form, Button } from "react-bootstrap";
import useForm from "../../hooks/useForm";

const ValidateChildForm = ({ childData, validatePerson }) => {
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
    onSubmit: () => validatePerson(data),
    initialValues: {
      // used to initialize the data
      name: childData.name,
      lastName: childData.lastName,
      birthGender: childData.birthGender,
      birthCountry: childData.birthCountry,
      otherName: childData.otherName,
      birthCity: childData.birthCity,
      idPerson: childData.idPerson,
      parentWallet: childData.parentWallet,
      birthDate: childData.birthDate
    },
  });
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <div className="formGroup">
          <Form.Group controlId="formBasicPassword">
            <Form.Control
              value={data.idPerson || ""}
              type="hidden"
              name="idPerson"
              required
              disabled
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Control
              value={data.parentWallet}
              type="hidden"
              name="parentWallet"
              required
              disabled
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
              disabled
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Last name *</Form.Label>
            <Form.Control
              value={data.lastName || ""}
              onChange={handleChange("lastName")}
              type="text"
              disabled
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
              disabled
            />
            {errors.otherName && <p className="error">{errors.otherName}</p>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Birth gender</Form.Label>
            <Form.Control
              value={data.birthGender || ""}
              onChange={handleChange("birthGender")}
              disabled
            >
            </Form.Control>
            {errors.birthGender && (
              <p className="error">{errors.birthGender}</p>
            )}
          </Form.Group>
        </div>

        <div className="formGroup">
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Birth date *</Form.Label>
            <Form.Control
              type="text"
              value={data.birthDate || ""}
              onChange={handleChange("birthDate")}
              required
              disabled
            />
            {errors.birthDate && <p className="error">{errors.birthDate}</p>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Birth country</Form.Label>
            <Form.Control
              value={data.birthCountry || ""}
              onChange={handleChange("birthCountry")}
              required
              disabled
            >

            </Form.Control>
            {errors.birthCountry && (
              <p className="error">{errors.birthCountry}</p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Birth city *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Birth city"
              value={data.birthCity || ""}
              onChange={handleChange("birthCity")}
              disabled
            />
            {errors.bithCity && <p className="error">{errors.birthCity}</p>}
          </Form.Group>
        </div>

        <div className="formGroup last">
          <Button className="mb-3" variant="primary" type="submit">
            Validate Person
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ValidateChildForm;
