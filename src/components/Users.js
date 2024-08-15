import React, { useEffect, useState } from "react";
import Loader from "../shared/Loader";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

const Users = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({ name: "", phone: "", email: "" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({ name: "", phone: "", email: "" }); // Clear errors on close
  };

  useEffect(() => {
    fetch(`https://task-user-bs-server.onrender.com/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const handleDeleteUser = (id) => {
    fetch(`https://task-user-bs-server.onrender.com/users/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          const remaining = users.filter((user) => user._id !== id);
          setUsers(remaining);
        }
      });
  };

  const handleUpdateUserDialog = (id) => {
    setOpen(true);
    fetch(`https://task-user-bs-server.onrender.com/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserId(data?._id);
        setName(data?.name || "");
        setPhone(data?.phone || "");
        setEmail(data?.email || "");
      });
  };

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

  const handleUpdateUser = () => {
    if (validateForm()) {
      const data = { name, phone, email };
      const url = `https://task-user-bs-server.onrender.com/users/${userId}`;

      fetch(url, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Failed to update user");
          }
        })
        .then(() => {
          setOpen(false);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div>
      <div className="container mx-auto rounded-lg p-2 m-10 mt-12">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="border-b-2 text-start">Name</th>
              <th className="border-b-2 text-start">Phone</th>
              <th className="border-b-2 text-start">Email</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr className="border-[1px]" key={user._id}>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>
                  <Button
                    style={{
                      fontSize: "10px",
                      margin: "5px",
                      padding: "5px",
                      background: "green",
                      color: "whitesmoke",
                      fontWeight: "700",
                    }}
                    onClick={() => handleUpdateUserDialog(user._id)}
                  >
                    Update
                  </Button>
                </td>
                <td>
                  <Button
                    style={{
                      fontSize: "10px",
                      margin: "5px",
                      padding: "5px",
                      background: "red",
                      color: "whitesmoke",
                      fontWeight: "700",
                    }}
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          scroll="body"
        >
          <AppBar
            position="static"
            elevation={0}
            style={{
              background: "darkgreen",
            }}
          >
            <Toolbar className="flex w-full justify-between">
              <Typography variant="subtitle1" style={{ fontWeight: "700" }}>
                Update User
              </Typography>
              <Typography
                className="flex items-center my-10"
                role="button"
                color="inherit"
              >
                <span
                  className="hover:bg-secondary hover:rounded-full px-1.5 py-0.5 font-semibold"
                  onClick={handleClose}
                >
                  Close
                </span>
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              width: 700,
              maxWidth: "100%",
            }}
          >
            <div className="bg-primary grid gap-3 container mx-auto rounded-lg p-10">
              <div className="flex flex-col">
                <TextField
                style={
                  {
                    marginTop : '10px'
                  }
                }
                  onChange={(event) => setName(event.target.value)}
                  className="w-full bg-white"
                  value={name}
                  label="Name"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  style={
                    {
                      marginTop : '10px'
                    }
                  }
                  onChange={(event) => setPhone(event.target.value)}
                  type="text"
                  value={phone}
                  className="w-full"
                  label="Phone"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
                <TextField
                  style={
                    {
                      marginTop : '10px'
                    }
                  }
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                  className="w-full my-2"
                  label="Email"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </div>
              <Button
                onClick={handleUpdateUser}
                style={{
                  marginTop: "10px",
                  padding: "12px",
                  background: "darkgreen",
                  color: "whitesmoke",
                  fontWeight: "700",
                }}
              >
                Update
              </Button>
            </div>
          </Box>
        </Dialog>
        {loading && (
          <div className="flex justify-center">
            <Loader color="#002F31" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
