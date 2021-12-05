import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import { dbSavePersoCode, initAppDb, initUserDb, isDbExist } from '../indexedDb/dbUtility';
import StepperWelcome from '../components/startup/StepperWelcome';
import StepperCongregation from '../components/startup/StepperCongregation';
import StepperMeetingDetails from '../components/startup/StepperMeetingDetails';
import StepperAboutMe from '../components/startup/StepperAboutMe';
import { checkSrcUpdate } from '../indexedDb/dbSourceMaterial';
import { dbUpdateAppSettings } from '../indexedDb/dbAppSettings';

const Startup = (props) => {
    const [isSetup, setIsSetup] = useState(false);
    const [persoCode, setPersoCode] = useState("");
    const [isErrorPersoCode, setIsErrorPersoCode] = useState(false);
    const [congName, setCongName] = useState("");
    const [congNumber, setCongNumber] = useState("");
    const [isErrorCongName, setIsErrorCongName] = useState(false);
    const [isErrorCongNumber, setIsErrorCongNumber] = useState(false);
    const [meetingDay, setMeetingDay] = useState(3);
    const [classCount, setClassCount] = useState(1);

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Tongasoa eto amin’ny LMM-OA",
        "Mombamomba ahy",
        "Fanazavana momba ny fiangonana",
        "Fanazavana momba ny fivoriana",
        "Vita ny fanamboarana"
    ];

    const getStepContent = (step) => {
        if (step === 0) {
            return <StepperWelcome />
        } else if (step === 1) {
            return <StepperAboutMe
                        persoCode={persoCode}
                        setPersoCode={(value) => setPersoCode(value)}
                        isErrorPersoCode={isErrorPersoCode}
                        setIsErrorPersoCode={(value) => setIsErrorPersoCode(value)}
                    />
        } else if (step === 2) {
            return <StepperCongregation
                congName={congName}
                setCongName={(value) => setCongName(value)}
                congNumber={congNumber}
                setCongNumber={(value) => setCongNumber(value)}
                isErrorCongName={isErrorCongName}
                setIsErrorCongName={(value) => setIsErrorCongName(value)}
                isErrorCongNumber={isErrorCongNumber}
                setIsErrorCongNumber={(value) => setIsErrorCongNumber(value)}
            />
        } else if (step === 3) {
            return <StepperMeetingDetails
                        meetingDay={meetingDay}
                        setMeetingDay={(value) => setMeetingDay(value)}
                        classCount={classCount}
                        setClassCount={(value) => setClassCount(value)}
                    />
        } else if (step === 4) {
            return (
                <Typography variant="body2">Vita ny fanamboarana voalohany ilain’ny LMM-OA. Mbola azonao ovana izy ireo rehefa mampiasa ny LMM-OA ianao.</Typography>
            )
        }
    }

    const handleNext = async () => {
        setIsErrorPersoCode(false);
        setIsErrorCongName(false);
        setIsErrorCongNumber(false);
        if (activeStep < steps.length - 1) {
            let hasError = false;

            if (activeStep === 1) {
                if (persoCode === "" || persoCode.length < 6) {
                    setIsErrorPersoCode(true)
                    hasError = true;
                }
                if (!hasError) {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }
            } else if (activeStep === 2) {
                if (congName === "") {
                    setIsErrorCongName(true)
                    hasError = true;
                }
                if (congNumber === "") {
                    setIsErrorCongNumber(true)
                    hasError = true;
                }
                if (!hasError) {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }
            } else {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        } else if (activeStep === steps.length - 1) {
            await handleDbInit();
        }
    };

    const handleDbInit = async () => {
        setIsSetup(false);
        await initAppDb();
        await initUserDb();
        await dbSavePersoCode(persoCode);
        var obj = {};
        obj.cong_name = congName;
        obj.cong_number = congNumber;
        obj.class_count = classCount;
        obj.meeting_day = meetingDay;
        obj.liveEventClass = false;
        await dbUpdateAppSettings(obj);
        await checkSrcUpdate();
        setTimeout(() => {
            props.setIsAppLoad(false);
        }, 1000);
    }
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect (() => {
        const isExist = async () => {
            const isDataExist = await isDbExist();
            if (isDataExist) {
                setIsSetup(false);
                await initAppDb();
                await checkSrcUpdate();
                setTimeout(() => {
                    props.setIsAppLoad(false);
                }, 1000);
            } else {
                setIsSetup(true);
            };
        }

        isExist();

        return () => {
            //clean up
        }
    }, [props])


    if (isSetup) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box sx={{maxWidth: 500}}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <img src="/img/appLogo.png" alt="App logo" className={"appLogoMini"} />
                        <Typography variant="h6">LMM-OA App</Typography>
                    </Box>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {getStepContent(index)}
                                <div>
                                    <div>
                                        <Button
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            sx={{
                                                marginTop: '10px',
                                                marginRight: '10px',
                                            }}
                                        >
                                            Hiverina
                                        </Button>
                                        <Button
                                            disabled={(activeStep === 1 && isErrorPersoCode) || (activeStep === 2 && (isErrorCongName || isErrorCongNumber))}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            sx={{
                                                marginTop: '10px',
                                                marginRight: '10px',
                                            }}
                                        >
                                            {activeStep === steps.length - 1 ? 'Hanokatra' : 'Manaraka'}
                                        </Button>
                                    </div>
                                </div>
                            </StepContent>
                        </Step>
                        ))}
                    </Stepper>
                </Box>
            </Box>
        )
    }

    return ( 
        <div className="app-splash-screen">
            <div className="app-logo-container">
                <img src="/img/appLogo.png" alt="App logo" className="appLogo" />
            </div>
            <CircularProgress />
        </div>
     );
}
 
export default Startup;