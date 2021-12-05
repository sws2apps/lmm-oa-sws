import { useEffect, useState } from "react";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../index";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import FiberPinIcon from '@mui/icons-material/FiberPin';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { db, firebaseApp } from "../../index";
import { browserLocalPersistence, getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { dbGetAppSettings, dbUpdateAppSettings } from "../../indexedDb/dbAppSettings";

const sharedStyles = {
    btnSubItem: {
        marginRight: '5px',
        marginBottom: '5px',
        display: 'flex',
        alignItems: 'center',
    },
    textBeforeField: {
        marginBottom: '10px',
    },
    inputCongID: {
        width: '210px',
        marginRight: '5px',
        marginBottom: '10px',
    },
    inputCongPIN: {
        width: '160px',
        marginBottom: '10px',
    },
}

const UseInternet = (props) => {
    const [classCount, setClassCount]= useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [congID, setCongID] = useState("");
    const [isErrorID, setIsErrorID] = useState(false);
    const [isLessID, setIsLessID] = useState(true);
    const [congPIN, setCongPIN] = useState("");
    const [isErrorPIN, setIsErrorPIN] = useState(false);
    const [isLessPIN, setIsLessPIN] = useState(true);
    const [isNew, setIsNew] = useState(false);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    const handleChangeID = (value) => {
        setIsErrorID(false);
        setIsLessID(false);
        setIsNew(false);

        if (value === "") {
            setCongID(value);
            setIsLessID(true);
        } else {
            if (value.length < 10) {
                setIsLessID(true);
                setIsErrorID(true);
            } else if (value.length === 10) {
                setIsLessID(false);
            }
            setCongID(parseInt(value, 10));
        }
    }

    const handleChangePIN = (value) => {
        setIsErrorPIN(false);
        setIsLessPIN(false);

        if (value === "") {
            setCongPIN(value);
            setIsLessPIN(true);
        } else {
            if (value.length < 6) {
                setIsLessPIN(true);
                setIsErrorPIN(true);
            } else if (value.length === 6) {
                setIsLessPIN(false);
            }
            setCongPIN(parseInt(value, 10));
        }
    }

    const handleSaveLogin = async () => {
        const myKey = congID + "&lmm-oa_" + congPIN;
        const Cryptr = require('cryptr');
        const cryptr = new Cryptr(myKey);
        const encryptedPIN = await cryptr.encrypt(congPIN);

        if (isNew) {
            const congDoc = doc(db, 'congregation_public_data', congID.toString());
            setDoc(
                congDoc,
                { 
                    congPIN: encryptedPIN,
                    classCount: classCount,
                },
                { merge: true }
            )
            .then(async () => {
                var obj = {};
                obj.cong_ID = congID;
                obj.cong_PIN = congPIN;
                await dbUpdateAppSettings(obj);
                props.setAppSnackOpen(true);
                props.setAppSeverity("success");
                props.setAppMessage("Voatahiry soa aman-tsara ny nomerao famantarana sy kaody miafina");
                setIsNew(false);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                props.setAppSnackOpen(true);
                props.setAppSeverity("error");
                props.setAppMessage(`(${errorCode}) ${errorMessage}`);
            });
        } else {
            let isExist = false;
            const congRef = doc(db, 'congregation_public_data', congID.toString());
            const docSnap = await getDoc(congRef);

            isExist = docSnap.exists();

            if (isExist) {
                const congDataRef = doc(db, "congregation_public_data", congID.toString());

                updateDoc(congDataRef, {
                    congPIN: encryptedPIN,
                    classCount: classCount,
                })
                .then(async () => {
                    var obj = {};
                    obj.cong_ID = congID;
                    obj.cong_PIN = congPIN;
                    await dbUpdateAppSettings(obj);
                    props.setAppSnackOpen(true);
                    props.setAppSeverity("success");
                    props.setAppMessage("Voatahiry soa aman-tsara ny nomerao famantarana sy kaody miafina");
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    props.setAppSnackOpen(true);
                    props.setAppSeverity("error");
                    props.setAppMessage(`(${errorCode}) ${errorMessage}`);
                });
            } else {
                props.setAppSnackOpen(true);
                props.setAppSeverity("warning");
                props.setAppMessage("Tsy mbola misy io nomerao famantarana fa hamarino tsara. Na mamòrona vaovao raha mbola tsy manana ny fiangonana misy anao");
            }
        }
    }

    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, user => {
        if (user) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    });

    const handleUserSignIn = () => {
        if (isLoggedIn) {
            signOut(auth)
            .then(() => {
                props.setAppSnackOpen(true);
                props.setAppSeverity("success");
                props.setAppMessage("Niala soa aman-tsara");
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                props.setAppSnackOpen(true);
                props.setAppSeverity("error");
                props.setAppMessage(`(${errorCode}) ${errorMessage}`);
            });
        } else {
            setPersistence(auth, browserLocalPersistence)
            .then(() => {
                var provider = new GoogleAuthProvider();
                signInWithPopup(auth, provider)
                .then(() => {
                    props.setAppSnackOpen(true);
                    props.setAppSeverity("success");
                    props.setAppMessage("Tafiditra soa aman-tsara ianao!");

                    logEvent(analytics, 'login');
                }).catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    props.setAppSnackOpen(true);
                    props.setAppSeverity("error");
                    props.setAppMessage(`(${errorCode}) ${errorMessage}`);
                });
            })
        }
    };

    const handleGenerateCongID = async () => {
        setIsNew(true);
        var setID = false;

        do {
            var min = 1000000000;
            var max = 9999999999;
            var num = Math.floor(Math.random() * (max - min + 1)) + min;

            let isExist = false;
            const congRef = doc(db, 'congregation_public_data', num.toString());
            const docSnap = await getDoc(congRef);

            isExist = docSnap.exists();

            if (!isExist) {
                setCongID(num);
                handleChangePIN("");
                setID = true;
            }
        } while (setID === false);
    }

    useEffect(() => {
        const loadInfo = async () => {
            const appSettings = await dbGetAppSettings();
            setClassCount(appSettings.class_count);
            if (appSettings.cong_ID !== undefined) {
                setCongID(appSettings.cong_ID);
                setIsLessID(false);
                setIsNew(false);
            }
            if (appSettings.cong_PIN !== undefined) {
                setCongPIN(appSettings.cong_PIN);
                setIsLessPIN(false);
            }
        };
        loadInfo();
    }, [])

    useEffect(() => {
        if (!isLessID && !isLessPIN) {
            setIsBtnDisabled(false);
        } else {
            setIsBtnDisabled(true);
        }
    }, [isLessID, isLessPIN])

    return ( 
        <>
            <Typography variant="h6" color="primary" className={"settingHeader"}>HAMPIASA INTERNET</Typography>
            <div className={"settingSubItem"}>
                <Box>
                    <Typography variant="body2">Mila manana kaonty Gmail aloha ianao raha tianao ny hampiasa internet. Ireto avy ny zavatra fanampiny azo atao ao amin’ny LMM-OA: mandefa rakitra fiandry any amin’ny internet, mandefa ny fandaharana misy ny anjaran’ny mpianatra any amin’ny Anti-panahy Mpandrindra, sy ny mpianatra rehetra.</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    sx={sharedStyles.btnSubItem}
                    startIcon={isLoggedIn ? <ExitToAppIcon /> : <VpnKeyIcon />}
                    onClick={() => handleUserSignIn()}
                >
                    {isLoggedIn ? "Hiala" : "Hiditra"}
                </Button>
            </div>
            <div className={"settingSubItem"}>
                {isLoggedIn && (
                    <>
                        <Box sx={sharedStyles.textBeforeField}>
                            <Typography variant="body2" gutterBottom>Hitanao eto ambany ny nomerao famantarana sy ny kaody miafina ampiasain’ny fiangonana raha te hizara fanazavana avy ato amin’ny LMM-OA.</Typography>
                        </Box>
                        <TextField
                            label="Nomerao famantarana"
                            variant="outlined"
                            type="number"
                            size="small"
                            required
                            error={isErrorID ? true : false}
                            helperText={isErrorID ? "10 fara fahakeliny" : null}
                            sx={sharedStyles.inputCongID}
                            value={congID}
                            onChange={(e) => handleChangeID(e.target.value)}
                        />
                        <TextField
                            label="Kaody miafina"
                            variant="outlined"
                            type="number"
                            size="small"
                            required
                            error={isErrorPIN ? true : false}
                            helperText={isErrorPIN ? "6 fara fahakeliny" : null}
                            sx={sharedStyles.inputCongPIN}
                            value={congPIN}
                            onChange={(e) => handleChangePIN(e.target.value)}
                        />
                        <Box sx={sharedStyles.btnSubItem} >
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isBtnDisabled}
                                sx={sharedStyles.btnSubItem}
                                startIcon={<FiberPinIcon />}
                                onClick={handleSaveLogin}
                            >
                                Hitahiry
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={sharedStyles.btnSubItem}
                                startIcon={<FlashAutoIcon />}
                                onClick={handleGenerateCongID}
                            >
                                Vaovao
                            </Button>
                        </Box>
                    </>
                )}
            </div>
        </>
     );
}
 
export default UseInternet;