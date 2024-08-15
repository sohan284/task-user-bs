import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { toast } from "react-toastify";

const Form = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ name: "", phone: "", email: "" });

  const validateForm = () => {
    let valid = true;
    let errors = { name: "", phone: "", email: "" };

    if (!name) {
      errors.name = "Name is required";
      valid = false;
    }
    if (!phone) {
      errors.phone = "Phone number is required";
      valid = false;
    } else if (!/^\d+$/.test(phone)) {
      errors.phone = "Phone number must be numeric";
      valid = false;
    }
    if (!email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmitForm = () => {
    if (validateForm()) {
      const data = { name, phone, email };
      const url = `https://task-user-bs-server.onrender.com/users`;

      fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.ok) {
            toast.success("User created successfully!");
            setName("");
            setPhone("");
            setEmail("");
            setErrors({ name: "", phone: "", email: "" });
            if (res?.status === 200) {
              window.location.reload();
            }
          } else {
            toast.error("Failed to create user.");
          }
        })
        .catch((error) => {
          toast.error("An error occurred.");
        });
    }
  };

  return (
    <div className="flex justify-center container mx-auto">
      <Box
        sx={{
          width: 700,
          maxWidth: "100%",
          border: "5px solid purple",
          margin: "10px",
        }}
      >
        <h1 className="px-10 mt-5 text-2xl font-semibold text-purple">
          Create New User
        </h1>
        <div className="bg-primary grid gap-3 container mx-auto rounded-lg p-10">
          <div className="flex flex-col">
            <div>
              <TextField
                onChange={(event) => setName(event.target.value)}
                className="w-full bg-white"
                value={name}
                label="Name"
                error={!!errors.name}
                helperText={errors.name}
              />
            </div>
            <div className="my-3">
              <TextField
                onChange={(event) => setPhone(event.target.value)}
                type="text"
                value={phone}
                className="w-full"
                label="Phone"
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </div>
            <div>
              <TextField
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                className="w-full"
                label="Email"
                error={!!errors.email}
                helperText={errors.email}
              />
            </div>
          </div>
          <Button
            onClick={handleSubmitForm}
            style={{
              width: "",
              marginTop: "10px",
              padding: "12px",
              background: "purple",
              color: "whitesmoke",
              fontWeight: "700",
            }}
          >
            Submit
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default Form;
