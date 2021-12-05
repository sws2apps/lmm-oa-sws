import { useEffect, useState } from "react";
import { fileDialog } from 'file-select-dialog';
import UAParser from "ua-parser-js";
import { db, firebaseApp } from "../../index";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../index";
import BackupIcon from '@mui/icons-material/Backup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Divider from '@mui/material/Divider';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import Typography from '@mui/material/Typography';
import DialogDbDeletion from "./DialogDbDeletion";
import { dbExportDb, dbExportJsonDb, dbGetUserKey, dbSavePersoCode } from "../../indexedDb/dbUtility";
import DialogDbBackup from "./DialogDbBackup";

const DataStorage = (props) => {
    const auth = getAuth(firebaseApp);
    const [open, setOpen] = useState(false);
    const [openDbBackup, setOpenDbBackup] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [persoCode, setPersoCode] = useState("");
    const [isErrorPersoCode, setIsErrorPersoCode] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [userID, setUserID] = useState("");
    const [hasBackup, setHasBackup] = useState(false);
    const [backupType, setBackupType] = useState("");
    const [isLoadingBackup, setIsLoadingBackup] = useState(false);
    const [backupDate, setBackupDate] = useState("");
    const [backupDevice, setBackupDevice] = useState("");
    const [backupNewDevice, setBackupNewDevice] = useState("");

    let isMenuOpen = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleGeneratePersoCode = () => {
        var min = 1000000000;
        var max = 9999999999;
        var num = Math.floor(Math.random() * (max - min + 1)) + min;

        setPersoCode(num);
    }

    const handlePersoCodeChange = (value) => {
        if (value && value.toString().length >= 6) {
            setIsErrorPersoCode(false);
        } else {
            setIsErrorPersoCode(true);
        }
        setPersoCode(value);
    }

    const handleSavePersoCode = async () => {
        await dbSavePersoCode(persoCode);
        props.setAppSnackOpen(true);
        props.setAppSeverity("success");
        props.setAppMessage("Voatahiry soa aman-tsara ny kaody manokana.");
    }

    const backupDb = async () => {
        handleClose();
        await dbExportDb();
    };

    const getDeviceInfo = () => {
        let obj = {};
        
        var parser = new UAParser();
        const result = parser.getResult();
        let deviceName = "";
        let browserVersion = "";
        deviceName = result.os.name;
        if (result.os.version !== "") {
            deviceName = deviceName + " " + result.os.version + "";
        }
        browserVersion = result.browser.name + " " + result.browser.version;
        
        obj.deviceName = deviceName;
        obj.browserVersion = browserVersion;
        return obj;
    }

    const prepBackupDbOnline = async () => {
        handleClose();

        // Display the Dialog
        setIsLoadingBackup(true);
        setOpenDbBackup(true);

        // Get current online backup
        setHasBackup(false);
        const userDocRef = doc(db, 'user_backup', userID);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists() && docSnap.data().lmmoa) {
            const backup = docSnap.data().lmmoa;
            setBackupDate(backup.backup_date);
            setBackupDevice(backup.backup_device);
            setHasBackup(true);
        }

        // Get current device
        const userDevice = getDeviceInfo();
        setBackupNewDevice(userDevice.deviceName + "|" + userDevice.browserVersion)

        setBackupType("backup");
        setIsLoadingBackup(false);
    }

    const backupDbOnline = async () => {
        const backJSON = await dbExportJsonDb();
        const userDoc = doc(db, 'user_backup', userID);
        setDoc(
            userDoc,
            { 
                lmmoa: {
                    backup_date: Date.now(),
                    backup_data: backJSON,
                    backup_device: backupNewDevice,
                },
            },
            { merge: true }
        )
        .then(() => {
            props.setAppSnackOpen(true);
            props.setAppSeverity("success");
            props.setAppMessage("Voatahiry soa aman-tsara ny rakitra fiandry.");

            logEvent(analytics, 'user_backup_backup');
        })
        .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            props.setAppSnackOpen(true);
            props.setAppSeverity("error");
            props.setAppMessage(`(${errorCode}) ${errorMessage}`);
        })
    }

    const restoreDb = async () => {
        handleClose();
        const file = await fileDialog({
            accept: '.db',
            strict: true
        });

        const getEncryptedText = () => {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.readAsText(file); 
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        };

        const backupData = await getEncryptedText()

        try {
            const myKey = await dbGetUserKey();
            const Cryptr = require('cryptr');
            const cryptr = new Cryptr(myKey);
            const decryptedData =  cryptr.decrypt(backupData);
            fetch(decryptedData)
            .then(res => res.blob())
            .then(blob => {
                props.setJsonFile(blob);
                props.setIsRedirect(true);
            })
        } catch (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (error.message === "Unsupported state or unable to authenticate data") {
                props.setAppSnackOpen(true);
                props.setAppSeverity("error");
                props.setAppMessage("Tsy afaka mamerina io rakitra fiandry io ny kaody manokana ampiasainao izao.");
            } else {
                props.setAppSnackOpen(true);
                props.setAppSeverity("error");
                props.setAppMessage(`(${errorCode}) ${errorMessage}`);
            }
        }
    };

    const prepRestoreDbOnline = async () => {
        handleClose();

        // Display the Dialog
        setIsLoadingBackup(true);
        setOpenDbBackup(true);

        // Get current online backup
        const userDocRef = doc(db, 'user_backup', userID);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists() && docSnap.data().lmmoa) {          
            const backup = docSnap.data().lmmoa;
            setBackupDate(backup.backup_date);
            setBackupDevice(backup.backup_device);

            setBackupType("restore");
            setIsLoadingBackup(false);
        } else {
            setOpenDbBackup(false);
            props.setAppSnackOpen(true);
            props.setAppSeverity("warning");
            props.setAppMessage("Tsy misy rakitra fiandry any amin’ny internet");
        }
    }

    const restoreDbOnline = async () => {
        const userDocRef = doc(db, 'user_backup', userID);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists() && docSnap.data().lmmoa) {
            try {
                const backupData = docSnap.data().lmmoa.backup_data;
                const myKey = await dbGetUserKey();
                const Cryptr = require('cryptr');
                const cryptr = new Cryptr(myKey);
                const decryptedData =  cryptr.decrypt(backupData);
                fetch(decryptedData)
                .then(res => res.blob())
                .then(blob => {
                    props.setJsonFile(blob);
                    props.setIsRedirect(true);

                    logEvent(analytics, 'user_backup_restore');
                })
            } catch (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (error.message === "Unsupported state or unable to authenticate data") {
                    props.setAppSnackOpen(true);
                    props.setAppSeverity("error");
                    props.setAppMessage("Tsy afaka mamerina io rakitra fiandry io ny kaody manokana ampiasainao izao.");
                } else {
                    props.setAppSnackOpen(true);
                    props.setAppSeverity("error");
                    props.setAppMessage(`(${errorCode}) ${errorMessage}`);
                }
            }
        }
    };

    const handleDelete = () => {
        setOpen(true);
    }

    onAuthStateChanged(auth, user => {
        if (user) {
            setIsLoggedIn(true);
            setUserID(user.uid);
        } else {
            setIsLoggedIn(false);
            setUserID("")
        }
    });

    useEffect(() => {
        const getPersoCode = async () => {
            const data = await dbGetUserKey();
            if (data && data.length > 0) {
                const key = data.split("_")[0];
                setPersoCode(key);
            }
        }

        getPersoCode();
    }, [])

    return ( 
        <>
            <DialogDbDeletion
                open={open}
                setOpen={(value) => setOpen(value)}
            />
            <DialogDbBackup 
                open={openDbBackup}
                setOpen={(value) => setOpenDbBackup(value)}
                backupNewDevice={backupNewDevice}
                hasBackup={hasBackup}
                isLoadingBackup={isLoadingBackup}
                backupDevice={backupDevice}
                backupDate={backupDate}
                backupType={backupType}
                backupDbOnline={backupDbOnline}
                restoreDbOnline={restoreDbOnline}
            />
            <Typography variant="h6" color="primary" className={"settingHeader"}>FITEHIRIZANA</Typography>
            <div className={"settingSubItem"}>
                <Box>
                    <Typography variant="body2" paragraph>Kaody manokana ampiasain’ny LMM-OA rehefa mamorona na mamerina rakitra fiandry.</Typography>
                    <Input
                        id="outlined-basic"
                        placeholder="Kaody Manokana"
                        size="small"
                        autoComplete='off'
                        required
                        error={isErrorPersoCode ? true : false}
                        type="number"
                        sx={{
                            width: '180px',
                            marginBottom: '10px',
                        }}
                        value={persoCode}
                        onChange={(e) => handlePersoCodeChange(e.target.value)}
                    />
                    {persoCode === "" && (
                        <IconButton
                            sx={{ padding: '1px'}}
                            onClick={() => handleGeneratePersoCode()}
                        >
                            <FlashAutoIcon sx={{fontSize: '36px'}} />
                        </IconButton>
                    )}
                    <Box>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={isErrorPersoCode}
                            className={"btnSubItem"}
                            startIcon={<SaveIcon />}
                            onClick={() => handleSavePersoCode()}
                        >
                            Hitahiry
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={isErrorPersoCode}
                            className={"btnSubItem"}
                            startIcon={<SettingsBackupRestoreIcon />}
                            aria-controls="basic-menu"
                            aria-haspopup="true"
                            aria-expanded={isMenuOpen ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            Rakitra Fiandry
                        </Button>
                        <Menu
                            id="basic-menu"
                            disableScrollLock={true}
                            anchorEl={anchorEl}
                            open={isMenuOpen}
                            onClose={handleClose}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={backupDb} disabled={isErrorPersoCode}>
                                <ListItemIcon>
                                    <SaveIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Hamorona</ListItemText>
                            </MenuItem>
                            {isLoggedIn && (
                                <MenuItem onClick={prepBackupDbOnline} disabled={isErrorPersoCode}>
                                    <ListItemIcon>
                                        <BackupIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Hamorona (Internet)</ListItemText>
                                </MenuItem>
                            )}
                            <Divider />                            
                            <MenuItem onClick={restoreDb} disabled={isErrorPersoCode}>
                                <ListItemIcon>
                                    <DownloadForOfflineIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Hampiditra</ListItemText>
                            </MenuItem>
                            {isLoggedIn && (
                                <MenuItem onClick={prepRestoreDbOnline} disabled={isErrorPersoCode}>
                                    <ListItemIcon>
                                        <CloudDownloadIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Hampiditra (Internet)</ListItemText>
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                </Box>
            </div>
            <div className={"settingSubItem"}>
                <Box>
                    <Typography variant="body2">Hamafa tanteraka ny rakitra ampiasain’ny LMM-OA.</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="error"
                    className={"btnSubItem"}
                    startIcon={<DeleteForeverIcon />}
                    onClick={() => handleDelete()}
                >
                    Hamafa
                </Button>
            </div>
        </>
     );
}
 
export default DataStorage;