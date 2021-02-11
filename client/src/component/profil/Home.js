import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'

import { Typography } from '@material-ui/core'
// import { AccountCircle } from '@material-ui/icons'
// import history from '../../history/history'
import MyAddImages from './myAddImages'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

function getSteps() {
  return ['Add Images', 'Fill Profile Informations']
}

function getStepContent(step, props, checkTI) {
  // switch (step) {
  //   case 0:
  //     return <MyAddImages id={props.id}/>;
  //   case 1:
  //     return "Fill all required Informations?";

  //   default:
  //     return "Unknown step";
  // }
  // console.log('P', props)
  if (step === 0 || step === 1) {
    if (step === 0) {
      // console.log('------->' ,props)
      return <MyAddImages id={props.id} checkTotalImg={checkTI} />
    }
    if (step === 1) return 'Fill all required Informations?'
  } else return 'Uknown step'
}

export default function HorizontalLinearStepper(props) {
  // console.log('Props:', props)
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const steps = getSteps()
  const [stepOneFilled, setStepOneFilled] = React.useState('no')

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const checkTotalImg = () => {
    setStepOneFilled('yes')
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography
              component={'span'}
              variant={'body2'}
              className={classes.instructions}
            >
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography
              component={'span'}
              variant={'body2'}
              className={classes.instructions}
            >
              {getStepContent(activeStep, props, checkTotalImg)}
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant='contained'
                color='primary'
                onClick={handleNext}
                className={classes.button}
                disabled={stepOneFilled === 'no' ? true : false}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}