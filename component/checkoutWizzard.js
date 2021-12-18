import { Step, StepLabel } from "@material-ui/core";
import { Stepper } from "@mui/material";
import React from "react";
import useStyles from "../utils/style";

export default function CheckoutWizzard({ activeStep = 0 }) {
  const classes = useStyles();
  return (
    <Stepper
      className={classes.transparentBackground}
      activeStep={activeStep}
      alternativeLabel
    >
      {["Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
}
