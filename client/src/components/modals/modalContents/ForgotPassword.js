import React from "react";
import { Button, TextField } from "@mui/material";
import classes from "./ForgotPassword.module.css";
import { AuthContext } from "../../../store/auth/AuthStore";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import {
  forgotPassword,
  handleSingleModals,
} from "../../../store/auth/AuthActions";
const CssTextField = styled(TextField)({
  "& label": {
    color: "grey",
  },
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "whitesmoke",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
});
function ForgotPassword() {
  const authCtx = React.useContext(AuthContext);
  const [email, setemail] = React.useState("");

  const handleChange = (e) => {
    setemail(e.target.value);
  };
  const handleClose = () => {
    authCtx.dispatch(handleSingleModals({ forgotPassworModal: false }));
  };
  const handleSend = () => {
    authCtx.dispatch(forgotPassword({ email }, authCtx.dispatch));
  };
  return (
    <div className={classes.container}>
      <CloseIcon
        style={{
          cursor: "pointer",
          position: "absolute",
          top: 2,
          right: 2,
          color: "white",
        }}
        onClick={handleClose}
      />

      <CssTextField
        name="email"
        fullWidth
        value={email}
        onChange={handleChange}
        label="Email"
        variant="outlined"
        type="email"
        placeholder="Input Email you registered with"
        className={classes.form}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button
        fullWidth
        variant="contained"
        color="secondary"
        onClick={handleSend}
        sx={{
          pointerEvents: authCtx.state.loadings.forgotPasswordLoading
            ? "none"
            : "auto",
          opacity: authCtx.state.loadings.forgotPasswordLoading ? 0.3 : 1,
        }}
      >
        Send
      </Button>
    </div>
  );
}

export default ForgotPassword;
