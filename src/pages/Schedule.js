import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { db, firebaseApp } from "../index";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import AssignmentIcon from '@mui/icons-material/Assignment';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import { dbGetScheduleListByYear, dbGetSourceMaterial, dbGetWeekListBySched, dbGetYearList } from "../indexedDb/dbSourceMaterial";
import { dbBuildScheduleForShare, dbGetScheduleData, dbGetScheduleName } from "../indexedDb/dbSchedule";
import ScheduleDetails from "../components/schedule/ScheduleDetails";
import DialogAutoFill from "../components/schedule/DialogAutoFill";
import ScheduleActions from "../components/schedule/ScheduleActions";
import DialogAssignmentDelete from "../components/schedule/DialogAssignmentDelete";
import { dbGetAppSettings } from "../indexedDb/dbAppSettings";

const sharedStyles = {
    btnSchedule: {
        margin: '0 2px 2px 0',
    },
};

const Schedule = (props) => {
    let history = useHistory();
    const [years, setYears] = useState([]);
    const [currentYear, setCurrentYear] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [currentSchedule, setCurrentSchedule] = useState("");
    const [weeks, setWeeks] = useState([]);
    const [currentWeek, setCurrentWeek] = useState("");
    const [weeksDelete, setWeeksDelete] = useState([]);
    const [scheduleParams, setScheduleParams] = useState({});
    const [dlgAutoFillOpen, setDlgAutoFillOpen] = useState(false);
    const [dlgAssDeleteOpen, setDlgAssDeleteOpen] = useState(false);
    const [isDlgActionOpen, setIsDlgActionOpen] = useState(false);
    const [isAutoFill, setIsAutoFill] = useState(false);
    const [isS89, setIsS89] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [congID, setCongID] = useState("");
    const [congPIN, setCongPIN] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    let isMenuOpen = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, user => {
        if (user) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    });

    const handleAutoFill = () => {
        setDlgAutoFillOpen(true);
    }

    const handleS89 = () => {
        setIsS89(true);
    }

    const handleDeleteAssignment = () => {
        setDlgAssDeleteOpen(true);
    }

    const renderYearList = year => {
        return (
            <MenuItem key={year.value} value={year.value}>{year.label}</MenuItem>
        );
    }

    const renderScheduleList = schedule => {
        return (
            <MenuItem key={schedule.value} value={schedule.value}>{schedule.label}</MenuItem>
        );
    }

    const handleYearChange = async (e) => {
        setIsS89(false);
        setCurrentYear(e.target.value);
        const scheduleData = await dbGetScheduleListByYear(e.target.value);
        setCurrentSchedule("");
        setSchedules(scheduleData);
        handleScheduleChange(scheduleData[0].value);
    }

    const handleScheduleChange = async (value) => {
        setIsS89(false);
        setCurrentSchedule(value);
        const weekData = await dbGetWeekListBySched(value);
        setCurrentWeek("");
        setWeeks(weekData);
        handleWeekChange(weekData[0].value);
    }

    const renderWeekList = week => {
        return (
            <MenuItem key={week.value} value={week.value}>{week.label}</MenuItem>
        );
    }

    const handleWeekChange = async (value) => {
        setIsS89(false);
        const scheduleData = await dbGetScheduleData(value);
        const sourceData = await dbGetSourceMaterial(value);
        setScheduleParams({...sourceData, ...scheduleData});
        setCurrentWeek(value);
    }

    const handlePreviewSchedule = () => {
        history.push({
            pathname: '/ScheduleTemplate',
            state: { currentSchedule }
        });
    }

    const handleSendScheduleToMSC = async () => {
        handleClose();
        const data = await dbBuildScheduleForShare(currentSchedule);
        let toMSC = [];

        const congRef = doc(db, 'congregation_private_data', congID.toString());
        const docSnap = await getDoc(congRef);

        if (docSnap.exists() && docSnap.data().toMSC) {
            toMSC = docSnap.data().toMSC;
        }

        const schedName = dbGetScheduleName(currentSchedule);
        const dataID = `schedule-${currentSchedule}`;
        let newToMSC = toMSC.filter(dataMSC => dataMSC.id !== dataID);

        var obj = {};
        obj.id = dataID;
        obj.title = "Fandaharana " + schedName;
        obj.data = data;
        obj.dateSent = Date.now();

        newToMSC.push(obj);

        const congDoc = doc(db, 'congregation_private_data', congID.toString());
        setDoc(
            congDoc,
            { 
                toMSC: newToMSC,
            },
            { merge: true }
        )
        .then(() => {
            props.setAppSnackOpen(true);
            props.setAppSeverity("success");
            props.setAppMessage("Lasa MSC ny fandaharana " + schedName);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            props.setAppSnackOpen(true);
            props.setAppSeverity("error");
            props.setAppMessage(`(${errorCode}) ${errorMessage}`);
        });
    }

    const handleShareSchedule = async () => {
        handleClose();
        const data = await dbBuildScheduleForShare(currentSchedule);
        let schedLMMOA = [];

        const congRef = doc(db, 'congregation_public_data', congID.toString());
        const docSnap = await getDoc(congRef);

        if (docSnap.exists() && docSnap.data().schedLMMOA) {
            schedLMMOA = docSnap.data().schedLMMOA;
        }

        const schedName = dbGetScheduleName(currentSchedule);
        const dataID = `schedule-${currentSchedule}`;
        let newSchedLMMOA = schedLMMOA.filter(dataLMMOA => dataLMMOA.id !== dataID);

        var obj = {};
        obj.id = dataID;
        obj.title = "Fandaharana " + schedName;
        obj.data = data;
        obj.dateSent = Date.now();

        newSchedLMMOA.push(obj);

        const congDoc = doc(db, 'congregation_public_data', congID.toString());
        setDoc(
            congDoc,
            { 
                schedLMMOA: newSchedLMMOA,
            },
            { merge: true }
        )
        .then(() => {
            props.setAppSnackOpen(true);
            props.setAppSeverity("success");
            props.setAppMessage("Afaka mijery ny fandaharana " + schedName + " izao ny mpianatra rehetra");
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            props.setAppSnackOpen(true);
            props.setAppSeverity("error");
            props.setAppMessage(`(${errorCode}) ${errorMessage}`);
        });
    }

    useEffect(() => {
        let mounted = true;

        const getSchedules = async () => {
            const years = await dbGetYearList();
            setYears(years);
            const year = years[0].value;
            setCurrentYear(year);
            const data = await dbGetScheduleListByYear(year);
            setSchedules(data);
            const sched = data[0].value;
            setCurrentSchedule(sched);
            const weekData = await dbGetWeekListBySched(sched);
            setWeeks(weekData);
            const scheduleData = await dbGetScheduleData(weekData[0].value);
            const sourceData = await dbGetSourceMaterial(weekData[0].value);
            setScheduleParams({...sourceData, ...scheduleData});
            setCurrentWeek(weekData[0].value);
        };

        const getCongInfo = async () => {
            const appSettings = await dbGetAppSettings();
            if (appSettings.cong_ID !== undefined) {
                setCongID(appSettings.cong_ID);
            }
            if (appSettings.cong_PIN !== undefined) {
                setCongPIN(appSettings.cong_PIN);
            }
        };

        if (mounted === true) {
            getSchedules();
            getCongInfo();
        }

        return (() => {
            mounted = false;
        })
    }, [])

    return ( 
        <Box sx={{marginRight: '5px'}}>
            {dlgAutoFillOpen && (
                <DialogAutoFill
                    scheduleName={currentSchedule}
                    dlgAutoFillOpen={dlgAutoFillOpen}
                    setIsAutoFill={(value) => setIsAutoFill(value)}
                    setDlgAutoFillOpen={(value) => setDlgAutoFillOpen(value)}
                    setIsDlgActionOpen={(value) => setIsDlgActionOpen(value)}
                />
            )}
            {dlgAssDeleteOpen && (
                <DialogAssignmentDelete
                    weekList={weeks}
                    currentWeek={currentWeek}
                    scheduleName={currentSchedule}
                    dlgAssDeleteOpen={dlgAssDeleteOpen}
                    setIsDelete={(value) => setIsDelete(value)}
                    setWeeksDelete={(value) => setWeeksDelete(value)}
                    setDlgAssDeleteOpen={(value) => setDlgAssDeleteOpen(value)}
                    setIsDlgActionOpen={(value) => setIsDlgActionOpen(value)}
                />
            )}
            {isDlgActionOpen && (
                <ScheduleActions
                    scheduleName={currentSchedule}
                    isDlgActionOpen={isDlgActionOpen}
                    setIsDlgActionOpen={(value) => setIsDlgActionOpen(value)}
                    currentWeek={currentWeek}
                    handleWeekChange={handleWeekChange}
                    weeks={weeksDelete}
                    type={isAutoFill ? "AutoFill" : isDelete ? "DeleteAssignment" : ""}
                />
            )}
            {schedules.length > 0 && (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            marginTop: '10px',
                        }}
                    >
                        <div>
                            <TextField
                                id="outlined-select-year"
                                select
                                label="Taona"
                                value={currentYear}
                                onChange={(e) => handleYearChange(e)}
                                size="small"
                                sx={{
                                    minWidth: '80px',
                                    marginRight: '5px',
                                    marginBottom: '10px',
                                }}
                            >
                                {years.map(year => renderYearList(year))}
                            </TextField>
                            {schedules.length > 0 && (
                                <TextField
                                    id="outlined-select-schedule"
                                    select
                                    label="Fandaharana"
                                    value={currentSchedule}
                                    onChange={(e) => handleScheduleChange(e.target.value)}
                                    size="small"
                                    sx={{
                                        minWidth: '130px',
                                        marginRight: '5px',
                                        marginBottom: '10px',
                                    }}
                                >
                                    {schedules.map(schedule => renderScheduleList(schedule))}
                                </TextField>
                            )}
                            {weeks.length > 0 && (
                                <TextField
                                    id="outlined-select-week"
                                    select
                                    label="Herinandro"
                                    value={currentWeek}
                                    onChange={(e) => handleWeekChange(e.target.value)}
                                    size="small"
                                    sx={{
                                        minWidth: '140px',
                                        marginRight: '5px',
                                        marginBottom: '10px',
                                    }}
                                >
                                    {weeks.map(week => renderWeekList(week))}
                                </TextField>
                            )}
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FlashAutoIcon />}
                                sx={sharedStyles.btnSchedule}
                                onClick={() => handleAutoFill()}
                            >
                                Hameno ho azy
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveAltIcon />}
                                sx={sharedStyles.btnSchedule}
                                onClick={handlePreviewSchedule}
                            >
                                PDF
                            </Button>
                            {(isLoggedIn && congPIN !== "") && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={sharedStyles.btnSchedule}
                                        startIcon={<SendIcon />}
                                        onClick={handleClick}
                                        aria-controls="basic-menu"
                                        aria-haspopup="true"
                                        aria-expanded={isMenuOpen ? 'true' : undefined}
                                    >
                                        Hizara
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
                                        <MenuItem onClick={handleSendScheduleToMSC}>
                                            Alefa MSC
                                        </MenuItem>
                                        <MenuItem onClick={handleShareSchedule}>
                                            Mpianatra rehetra
                                        </MenuItem>
                                    </Menu>
                                </>
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                sx={sharedStyles.btnSchedule}
                                startIcon={<AssignmentIcon />}
                                onClick={() => handleS89()}
                            >
                                S-89
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                sx={sharedStyles.btnSchedule}
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteAssignment()}
                            >
                                Hamafa
                            </Button>
                        </div>
                    </Box>
                    <div>
                        {currentWeek && (
                            <ScheduleDetails
                                isS89={isS89}
                                setIsS89={(value) => setIsS89(value)}
                                currentSchedule={currentSchedule}
                                scheduleParams={scheduleParams}
                            />
                        )}
                    </div>
                </>
            )}
        </Box>
     );
}
 
export default Schedule;