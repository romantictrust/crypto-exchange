import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link, withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import useStyles from "./styles/AuthPageStyles";
import Snackbar from "../../shared/components/Snackbars";
import sendConfirmation from "./functions/sendConfirmation";
import loginUser from "./functions/loginUser";

function SignIn(props) {
  const [snackMessage, setSnackMessage] = React.useState();
  const { history, clearStorage } = props;

  const classes = useStyles();

  const confirmAuth = async event => {
    event.preventDefault();
    setSnackMessage();
    clearStorage();
    const email = SignIn.email.value;
    const password = SignIn.password.value;
    const user = { user: { email, password } };
    await loginUser(user).then(res => {
      if (res.errors) {
        setSnackMessage({ notification: res.errors });
      } else if (!res.user.confirmed) {
        setSnackMessage({
          notification:
            "Please, confirm your email! Click to send another email confirmation.",
          button: "Click",
          onClick: () => {
            sendConfirmation(res.user);
          }
        });
      } else if (res.user.isBlocked) {
        history.replace("/blockpage");
      } else {
        sessionStorage.setItem("user", JSON.stringify(res.user));
        if (res.user.isAdmin) {
          history.replace("/admin");
        } else {
          history.replace("/");
        }
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form
          className={classes.form}
          onSubmit={confirmAuth}
          autoComplete="off"
          noValidate
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            inputRef={el => {
              SignIn.email = el;
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            inputRef={el => {
              SignIn.password = el;
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link
                to="/registration"
                style={{ textDecoration: "none", color: "purple" }}
              >
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
        {snackMessage ? <Snackbar message={snackMessage} /> : null}
      </div>
    </Container>
  );
}
export default withRouter(SignIn);
