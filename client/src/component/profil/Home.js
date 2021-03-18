import React  from "react"
import Axios from 'axios'
import { CircularProgress, Stepper, Step, StepLabel, Button, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import FillProfil from './fillProfil'
import MyAddImages from './myAddImages'
import history from '../../history/history'

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  button: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

function getSteps() {
  return ["Add Images", "Fill Profile Informations"];
}

function getStepContent(step, props, checkTI, checkNo) {
  switch (step) {
    case 0:
      return <MyAddImages id={props.id} checkTotalImg={checkTI} stop={false} />
    case 1:
      return (
        <FillProfil id={props.id} checkTotalImg={checkTI} checkFill={checkNo} />
      )
    default:
      return 'Unknown step'
  }
}

const HorizontalLinearStepper = (props) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [stepOneFilled, setStepOneFilled] = React.useState('no')
  // const [activeSkip, setActiveSkip] = React.useState(false)
  const [progress, setprogress] = React.useState(false)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = (e, id) => {
    Axios.post(`/base/dltImg/${id}`).then((res) => {
      if (res.data.status) setActiveStep(0)
    })
  };

  const handleDone = (e, id) => {
    Axios.post(`/base/status/${id}`)
    history.push(`/browsing/${id}`)
  }

  const checkTotalImg = () => {
    setStepOneFilled('yes');
  }

  const fillProfil = () => {
    setStepOneFilled('no')
  }

  // const skipBtnSkip = () => {
  //   setActiveSkip(true)
  // }

  const reloadFunc = React.useCallback(() => {
    if (activeStep === 0 && props.id) {
      // IF YOU WANT TO DELETE IMAGES OF USERS IN FIRST EVENT
      // Axios.post(`/base/onlyImg/${props.id}`)
    }
  }, [activeStep, props])

  React.useEffect(() => {
    reloadFunc()
    setStepOneFilled('no')
  }, [reloadFunc])

  // check if data is already filled

  const funProgress = React.useCallback(async () => {
    console.log("ha ana");
    if (props.id){
      await Axios.post(`/base/check1/${props.id}`)
      setprogress(true)
    }else
      setprogress(false)
  }, [props])

  React.useEffect(() => {
    funProgress()
  }, [funProgress, progress])

  return (
    
  <div className={classes.root}>
    {progress === false ? <CircularProgress disableShrink /> : 
      <React.Fragment>
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
              <Button
                onClick={(event) => handleReset(event, props.id)}
                className={classes.button}
              >
                Reset
              </Button>
              <Button
                onClick={(event) => handleDone(event, props.id)}
                className={classes.button}
                color='primary'
              >
                Done
              </Button>
            </div>
          ) : (
            <div>
              <Typography
                component={'span'}
                variant={'body2'}
                className={classes.instructions}
              >
                {getStepContent(
                  activeStep,
                  props,
                  checkTotalImg,
                  fillProfil
                  // skipBtnSkip
                )}
              </Typography>
              <div>
                
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
      </React.Fragment>
    }
    </div>
  )
}

export default HorizontalLinearStepper