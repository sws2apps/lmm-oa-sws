import { useEffect, useState } from 'react';
import maleIcon from '../../img/student_male.svg';
import femaleIcon from '../../img/student_female.svg';
import { db, firebaseApp } from "../../index";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { dbAddPersonData, dbGetStudents, dbGetStudentDetails, dbIsStudentExist, dbSavePersonData } from '../../indexedDb/dbPersons';
import { dbGetAppSettings } from '../../indexedDb/dbAppSettings';

const sharedStyles = {
    studentPart: {
        display: 'flex',
        alignItems: 'center',
    },
    lastAssignment: {
        fontWeight: 'bold',
        color: 'orangered',
        marginRight: '5px',
    },
    stuBtnContainer: {
        padding: '1px',
    },
    btnIcon: {
        fontSize: '36px',
    },
}

const StudentDetails = (props) => {
    const [open, setOpen] = useState(false);
    const id = props.student.id;
    const [name, setName] = useState("");
    const [isMale, setIsMale] = useState(true);
    const [isFemale, setIsFemale] = useState(false);
    const [isErrorName, setIsErrorName] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [isErrorDisplayName, setIsErrorDisplayName] = useState(false);
    const [isBRead, setIsBRead] = useState(false);
    const [isInitialCall, setIsInitialCall] = useState(false);
    const [isReturnVisit, setIsReturnVisit] = useState(false);
    const [isBibleStudy, setIsBibleStudy] = useState(false);
    const [isTalk, setIsTalk] = useState(false);
    const [isUnavailable, setIsUnavailable] = useState(false);
    const [forLivePart, setForLivePart] = useState(false);
    const [viewOnlineSchedule, setViewOnlineSchedule] = useState(false);
    const [studentPIN, setStudentPIN] = useState("");
    const [initPIN, setInitPIN] = useState("");
    const lastBRead = props.student.lastBRead;
    const lastInitialCall = props.student.lastInitialCall;
    const lastReturnVisit = props.student.lastReturnVisit;
    const lastBibleStudy = props.student.lastBibleStudy;
    const lastTalk = props.student.lastTalk;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [students, setStudents] = useState([]);
    const [congID, setCongID] = useState("");
    const [congPIN, setCongPIN] = useState("");
    const [isNew, setIsNew] = useState(true);
    const [isErrorPIN, setIsErrorPIN] = useState(false);
    const [viewList, setViewList] = useState([]);
    const [initViewList, setInitViewList] = useState([]);
    const [dataAC, setDataAC] = useState([]);

    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, user => {
        if (user) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    });
  
    const handleClose = () => {
        props.setOpen(false);
    };

    const handleNameChange = (name) => {
        setIsErrorName(false);
        setIsErrorDisplayName(false);
        if (name === "") {
            setIsErrorName(true);
            setIsErrorDisplayName(true);
        };
        setName(name);
        generateDisplayName(name);
    }

    const generateDisplayName = name => {
        if (name === "") {
            setDisplayName("");
        } else {
            var txtArray = name.split(" ");
            if (txtArray.length === 1) {
                setDisplayName(name);
            } else {
                var varDisplay = "";
                for(let i=0; i < txtArray.length; i++) {
                    if (i === txtArray.length - 1) {
                        varDisplay+= txtArray[i];
                    } else {
                        varDisplay+= txtArray[i].substring(0, 1) + ". ";
                    }
                }
                setDisplayName(varDisplay);
            }
        }
    }

    const handleDisplayNameChange = (name) => {
        setIsErrorDisplayName(false);
        if (name === "") {
            setIsErrorDisplayName(true);
        };
        setDisplayName(name);
    }

    const handleSavePerson = async () => {
        if (name === "" || displayName === "") {
            if (name === "") {
                setIsErrorName(true)
            }
            if (displayName === "") {
                setIsErrorDisplayName(true)
            }
        } else {
            var person = {};
            person.person_name = name;
            person.person_displayName = displayName;
            person.isMale = isMale;
            person.isFemale = isFemale;
            person.isBRead = isBRead;
            person.isInitialCall = isInitialCall;
            person.isReturnVisit = isReturnVisit;
            person.isBibleStudy = isBibleStudy;
            person.isTalk = isTalk;
            person.isUnavailable = isUnavailable;
            person.forLivePart = forLivePart;
            person.viewOnlineSchedule = viewOnlineSchedule;
            person.student_PIN = studentPIN;
            person.viewStudent_Part = viewList;

            let saveInfoFB = "";

            if (isLoggedIn) {
                const arraysAreEqual = initViewList.sort().toString()===viewList.sort().toString();
                if (studentPIN !== initPIN || !arraysAreEqual) {
                    const myKey = congID + "&lmm-oa_" + congPIN;
                    const Cryptr = require('cryptr');
                    const cryptr = new Cryptr(myKey);

                    if (studentPIN.toString().length < 6) {
                        setStudentPIN("");
                        person.student_PIN = ""
                    } else {
                        person.student_PIN = studentPIN;
                    }

                    person.viewStudent_Part = viewList;
    
                    let usersList = [];
                    let newList = [];

                    const congRef = doc(db, 'congregation_public_data', congID.toString());
                    const docSnap = await getDoc(congRef);

                    if (docSnap.exists() && docSnap.data().usersList) {
                        const encryptedList = docSnap.data().usersList;
                        const decryptedData = cryptr.decrypt(encryptedList);
                        usersList = JSON.parse(decryptedData);
                    }
    
                    if (isNew) {
                        let userInfo = {};
                        newList = usersList;
                        if (id !== undefined) {
                            const userIndex = usersList.findIndex(user => user.id_lmm_oa === id);
                            if (userIndex >= 0 ) {
                                userInfo = usersList[userIndex];
                                newList = usersList.filter(user => user.id_lmm_oa !== id);
                            }
                        }
    
                        userInfo.id_lmm_oa = id;
                        userInfo.PIN = studentPIN;
                        userInfo.name = name;
                        if (!arraysAreEqual) {
                            let data = [];
                            for(let i=0; i < viewList.length; i++) {
                                let person = {};
                                let obj = {};
                                person = await dbGetStudentDetails(viewList[i]);
                                obj.id = person.id;
                                obj.person_name = person.person_name;

                                data.push(obj);
                            }
                            userInfo.viewStudentPart = data;
                        }
                        newList.push(userInfo);
                    } else {
                        if (studentPIN.toString().length < 6 && id !== undefined) {
                            newList = usersList;
                            newList = usersList.filter(user => user.id_lmm_oa !== id);
                        } else {
                            const pinIndex = usersList.findIndex(user => user.PIN === studentPIN);
                            if (pinIndex === -1) {
                                saveInfoFB = "pinNotFound";
                            } else {
                                newList = usersList;
                                let userInfo = {};
                                if (id !== undefined) {
                                    const userIndex = usersList.findIndex(user => user.id_lmm_oa === id);
                                    if (userIndex >= 0 ) {
                                        userInfo = usersList[userIndex];
                                        newList = usersList.filter(user => user.id_lmm_oa !== id);
                                    }
                                }
                                
                                userInfo.id_lmm_oa = id;
                                userInfo.PIN = studentPIN;
                                userInfo.name = name;
                                if (!arraysAreEqual) {
                                    let data = [];
                                    for(let i=0; i < viewList.length; i++) {
                                        let person = {};
                                        let obj = {};
                                        person = await dbGetStudentDetails(viewList[i]);
                                        obj.id = person.id;
                                        obj.person_name = person.person_name;

                                        data.push(obj);
                                    }
                                    userInfo.viewStudentPart = data;
                                }
                                newList.push(userInfo);
                            }
                        }
                    }

                    if (saveInfoFB === "") {
                        const fbsaveInfoFB = async () => {
                            return new Promise((resolve, reject) => {
                                const encryptedData = cryptr.encrypt(JSON.stringify(newList));
                                const congDoc = doc(db, 'congregation_public_data', congID.toString());
                                setDoc(
                                    congDoc,
                                    { 
                                        usersList: encryptedData,
                                    },
                                    { merge: true }
                                )
                                .then(() => {
                                    resolve("success");
                                })
                                .catch(() => {
                                    resolve("error");
                                });
                            })
                        }
        
                        saveInfoFB = fbsaveInfoFB();
                    }
                }
            }

            if (saveInfoFB === "error") {
                props.setAppSnackOpen(true);
                props.setAppSeverity("warning");
                props.setAppMessage("Nisy olana nitranga ka tsy voatahiry ny fanovana nataonao");
                props.setOpen(false);
            } else if (saveInfoFB === "pinNotFound") {
                props.setAppSnackOpen(true);
                props.setAppSeverity("warning");
                props.setAppMessage("Tsy mbola misy io kaody manokana io");
            } else {
                if (id === undefined) {
                    const isStuExist = await dbIsStudentExist(name);
                    if (isStuExist === true) {
    
                    } else {
                        await dbAddPersonData(person);
                        props.getStudents();
                        props.setAppSnackOpen(true);
                        props.setAppSeverity("success");
                        props.setAppMessage("Tafiditra ny mpianatra vaovao.");
                        props.setOpen(false);
                    }
                } else {
                    person.id = id;
                    await dbSavePersonData(person);
                    props.setAppSnackOpen(true);
                    props.setAppSeverity("success");
                    props.setAppMessage("Voatahiry ny fanavaozana ny mombamomba ny mpianatra.");
                    props.setOpen(false);
                    props.setStudent(person);
                }
            }
        }        
    }

    const handleMaleCheck = value => {
        setIsMale(value);
        setIsFemale(!value);
    }

    const handleFemaleCheck = value => {
        setIsMale(!value);
        setIsFemale(value);
    }

    const handleViewOnlineSchedule = (e) => {
        setViewOnlineSchedule(e.target.checked);
        if (e.target.checked) {
            setStudentPIN("");
        }
    }

    const handleGenerateStudentPIN = async () => {
        var setPIN = false;

        do {
            if (congID === "") {
                props.setAppSnackOpen(true);
                props.setAppSeverity("warning");
                props.setAppMessage("Tsy mbola misy nomerao famantarana sy kaody miafina ny fiangonana.");
                setPIN = true;
            } else {
                var min = 100000;
                var max = 999999;
                var num = Math.floor(Math.random() * (max - min + 1)) + min;

                const myKey = congID + "&lmm-oa_" + congPIN;
                const Cryptr = require('cryptr');
                const cryptr = new Cryptr(myKey);

                let usersList = [];

                const congRef = doc(db, 'congregation_public_data', congID.toString());
                const docSnap = await getDoc(congRef);

                if (docSnap.exists() && docSnap.data().usersList) {
                    const decryptedData = cryptr.decrypt(docSnap.data().usersList);
                    usersList = JSON.parse(decryptedData)
                }

                const tempNum = num;
                const pinIndex = usersList.findIndex(user => user.PIN === tempNum);

                if (pinIndex < 0) {
                    setStudentPIN(num);
                    setIsNew(true);
                    setPIN = true;
                }
            };
        } while (setPIN === false);
    }

    const handleChangePIN = (e) => {
        setIsNew(false);
        setIsErrorPIN(false);

        if (e.target.value === "") {
            setIsErrorPIN(false);
        } else {
            if (e.target.value.length < 6) {
                setIsErrorPIN(true);
            } else {
                setIsErrorPIN(false);
            }
        }
        setStudentPIN(e.target.value);
    }

    const handleDeletePIN = () => {
        setIsNew(false);
        setStudentPIN("");
    }

    const handleChangeAC = (value) => {
        let data = [];
        for (let i=0; i < value.length; i++) {
            data.push(value[i].id);
        }
        setViewList(data);
    }

    useEffect(() => {
        const getDataAC = async () => {
            let data = [];
            for(let i=0; i < viewList.length; i++) {
                let person = {};
                person = await dbGetStudentDetails(viewList[i]);
                data.push(person);
            }

            setDataAC(data);
        }

        getDataAC();
    }, [viewList])

    useEffect(() => {
        if (props.open !== undefined) {
            setOpen(props.open);
        }
        if (props.student.id !== undefined) {
            setName(props.student.person_name);
            setDisplayName(props.student.person_displayName);
            setIsMale(props.student.isMale);
            setIsFemale(props.student.isFemale);
            setIsBRead(props.student.isBRead);
            setIsInitialCall(props.student.isInitialCall);
            setIsReturnVisit(props.student.isReturnVisit);
            setIsBibleStudy(props.student.isBibleStudy);
            setIsTalk(props.student.isTalk);
            setIsUnavailable(props.student.isUnavailable);
            setForLivePart(props.student.forLivePart);
            setViewOnlineSchedule(props.student.viewOnlineSchedule);
            setStudentPIN(props.student.student_PIN);
            setInitPIN(props.student.student_PIN);
            if (props.student.student_PIN) {
                setIsNew(false);
            }
            setViewList(props.student.viewStudent_Part);
            setInitViewList(props.student.viewStudent_Part);
        }
    }, [props])

    useEffect(() => {
        const getStudents = async () => {
            const students = await dbGetStudents();
            setStudents(students);
        }
        getStudents();
    }, [])

    useEffect(() => {
        const getCongInfo = async () => {
            const appSettings = await dbGetAppSettings();
            if (appSettings.cong_ID !== undefined) {
                setCongID(appSettings.cong_ID);
            }
            if (appSettings.cong_PIN !== undefined) {
                setCongPIN(appSettings.cong_PIN);
            }
        };

        getCongInfo();
    }, [])

    return ( 
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="dialog-title"
        >
            <DialogTitle id="dialog-title">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1.2,
                    }}
                >
                    <Avatar
                        sx={{
                            height: '50px',
                            width: '50px',
                            marginRight: '5px',
                        }}
                        alt="Student icon"
                        src={isMale ? maleIcon : femaleIcon}
                    />
                    {name}
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{display: 'flex'}}>
                    <FormControlLabel
                        control={<Checkbox
                            checked={isMale}
                            onChange={(e) => handleMaleCheck(e.target.checked)}
                            color="primary"
                        />}
                        label="Lahy"
                    />
                    <FormControlLabel
                        control={<Checkbox
                            checked={isFemale}
                            onChange={(e) => handleFemaleCheck(e.target.checked)}
                            color="primary"
                        />}
                        label="Vavy"
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}
                >
                    <TextField
                        label="Anarana"
                        variant="outlined"
                        size="small"
                        autoComplete='off'
                        required
                        error={isErrorName ? true : false}
                        helperText={isErrorName ? "Mila fenoina" : null}
                        sx={{
                            width: '320px',
                            margin: '5px 5px 8px 0',
                        }}
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                    />
                    <TextField
                        label="Fanafohezana Anarana"
                        variant="outlined"
                        size="small"
                        autoComplete='off'
                        required
                        error={isErrorDisplayName ? true : false}
                        helperText={isErrorDisplayName ? "Mila fenoina" : null}
                        sx={{
                            width: '210px',
                            margin: '5px 5px 5px 0',
                        }}
                        value={displayName}
                        onChange={(e) => handleDisplayNameChange(e.target.value)}
                    />
                </Box>
                <div className={`tgwPart meetingPart`}>
                    <Typography variant="h6">
                        HARENA AVY AO AMIN’NY TENIN’ANDRIAMANITRA
                    </Typography>
                </div>
                <Box sx={sharedStyles.studentPart}>
                    <FormControlLabel
                        control={<Checkbox
                            checked={isBRead}
                            onChange={(e) => setIsBRead(e.target.checked)}
                            color="primary"
                        />}
                        label="Famakiana Baiboly"
                    />
                    {lastBRead && (
                        <Typography variant="body1" sx={sharedStyles.lastAssignment}>{lastBRead}</Typography>
                    )}
                </Box>                
                <div className={`ayfPart meetingPart`}>
                    <Typography variant="h6">
                        FAMPIOFANANA AMIN’NY FANOMPOANA
                    </Typography>
                </div>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}
                >
                    <Box sx={sharedStyles.studentPart}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={isInitialCall}
                                onChange={(e) => setIsInitialCall(e.target.checked)}
                                color="primary"
                            />}
                            label="Fitoriana"
                        />
                        {lastInitialCall && (
                            <Typography variant="body1" sx={sharedStyles.lastAssignment}>{lastInitialCall}</Typography>
                        )}
                    </Box>
                    <Box sx={sharedStyles.studentPart}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={isReturnVisit}
                                onChange={(e) => setIsReturnVisit(e.target.checked)}
                                color="primary"
                            />}
                            label="Fiverenana Mitsidika"
                        />
                        {lastReturnVisit && (
                            <Typography variant="body1" sx={sharedStyles.lastAssignment}>{lastReturnVisit}</Typography>
                        )}
                    </Box>
                    <Box sx={sharedStyles.studentPart}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={isBibleStudy}
                                onChange={(e) => setIsBibleStudy(e.target.checked)}
                                color="primary"
                            />}
                            label="Fampianarana Baiboly"
                        />
                        {lastBibleStudy && (
                            <Typography variant="body1" sx={sharedStyles.lastAssignment}>{lastBibleStudy}</Typography>
                        )}
                    </Box>
                    <Box sx={sharedStyles.studentPart}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={isTalk}
                                onChange={(e) => setIsTalk(e.target.checked)}
                                color="primary"
                            />}
                            label="Lahateny"
                        />
                        {lastTalk && (
                            <Typography variant="body1" sx={sharedStyles.lastAssignment}>{lastTalk}</Typography>
                        )}
                    </Box>
                </Box>
                <Typography variant="h6" sx={{marginTop: '10px'}}>
                    Zavatra Hafa:
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <FormControlLabel
                        control={<Checkbox
                            checked={isUnavailable}
                            onChange={(e) => setIsUnavailable(e.target.checked)}
                            color="primary"
                        />}
                        label="Tsy omena anjara"
                    />
                    <FormControlLabel
                        control={<Checkbox
                            checked={forLivePart}
                            onChange={(e) => setForLivePart(e.target.checked)}
                            color="primary"
                        />}
                        label="Afaka manao anjara mivantana"
                    />
                    {(id !== undefined && isLoggedIn && congPIN !== "") && (
                        <>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={viewOnlineSchedule}
                                    onChange={(e) => handleViewOnlineSchedule(e)}
                                    color="primary"
                                />}
                                label="Afaka mijery fandarahana avy amin’ny Internet"
                            />
                            {viewOnlineSchedule && (
                                <>
                                    <Box
                                        sx={{
                                            marginTop: '5px',
                                            marginLeft: '30px',
                                        }}
                                    >
                                        <TextField
                                            label="Kaody manokana"
                                            variant="outlined"
                                            size="small"
                                            type="number"
                                            autoComplete='off'
                                            error={isErrorPIN ? true : false}
                                            sx={{width: '170px'}}
                                            value={studentPIN}
                                            onChange={handleChangePIN}
                                        />
                                        {studentPIN === "" && (
                                            <IconButton
                                                sx={sharedStyles.stuBtnContainer}
                                                onClick={() => handleGenerateStudentPIN()}
                                            >
                                                <FlashAutoIcon sx={sharedStyles.btnIcon} />
                                            </IconButton>
                                        )}
                                        {studentPIN !== "" && (
                                            <IconButton
                                                sx={sharedStyles.stuBtnContainer}
                                                onClick={() => handleDeletePIN()}
                                            >
                                                <DeleteIcon sx={sharedStyles.btnIcon} />
                                            </IconButton>
                                        )}
                                    </Box>
                                    <Box
                                        sx={{
                                            marginLeft: '30px',
                                            marginTop: '10px',
                                        }}
                                    >
                                        <Typography variant="body2">Anjaran’ny mpianatra hafa azony jerena</Typography>
                                    </Box>
                                    <Autocomplete
                                        sx={{
                                            marginTop: '5px',
                                            marginLeft: '30px',
                                            '& .MuiAutocomplete-option': {
                                                backgroundColor: '#85C1E9',
                                            },
                                        }}
                                        multiple
                                        options={id !== undefined ? students.filter(student => student.id !== id) : students}
                                        getOptionLabel={(option) => option.person_name}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                            />
                                        )}
                                        value={dataAC}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onChange={(e, value) => handleChangeAC(value)}
                                    />
                                </>
                            )}
                        </>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus
                    onClick={handleSavePerson}
                    color="primary"
                    disabled={(isErrorName || isErrorDisplayName) ? true : false}
                >
                    Hitahiry
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Aoka ihany
                </Button>
            </DialogActions>
        </Dialog>
     );
}
 
export default StudentDetails;