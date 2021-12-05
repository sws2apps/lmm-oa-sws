import maleIcon from '../../img/student_male.svg';
import femaleIcon from '../../img/student_female.svg';
import { useState} from 'react';
import { blue, brown, green, orange, purple, red, teal } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import StudentDetails from './StudentDetails';

const sharedStyles = {
    root: {
        backgroundColor: blue[50],
        margin: '5px',
        height: '100%',
    },
    rootUnavailable: {
        backgroundColor: red[200],
        margin: '5px',
        height: '100%',
    },
    chip: {
        margin: '2px',
    },
    chipBRead: {
        backgroundColor: orange[200],
    },
    chipIniCall: {
        backgroundColor: purple[200],
    },
    chipRV: {
        backgroundColor: teal[200],
    },
    chipBS: {
        backgroundColor: green[200],
    },
    chipTalk: {
        backgroundColor: brown[200],
    },
};

const StudentCard = (props) => {
    const [student, setStudent] = useState(props.student);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleDelete = (id, name) => {
        var obj = {};
        obj.name = name;
        obj.id = id;
        props.setCurrentStudent(obj);
        props.setOpen(true);
    }

    return ( 
        <>
            <Grid item sx={{marginBottom: '5px'}} xs={12} sm={6} md={6} lg={4}>
                <Card sx={student.isUnavailable ? sharedStyles.rootUnavailable : sharedStyles.root}>
                    <CardHeader
                        sx={{
                            padding: '5px',
                            '& .MuiCardHeader-title': {
                                fontSize: "16px",
                                fontWeight: "bold",
                            },
                            '& .MuiCardHeader-action': {
                                alignSelf: "center",
                            },
                        }}
                        avatar={
                            <Avatar
                                sx={{
                                    height: '50px',
                                    width: '50px',
                                }}
                                alt="Student icon"
                                src={student.isMale ? maleIcon : femaleIcon}
                            />
                        }
                        action={
                            <>
                                <IconButton onClick={handleClickOpen}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(student.id, student.person_name)}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }
                        title={student.person_name}
                    />
                    <CardContent
                        sx={{
                            padding: '2px',
                            marginLeft: '60px',
                            "&:last-child": {
                                paddingBottom: 0,
                            }
                        }}
                    >
                        {student.isBRead && (
                            <Chip
                                label="FB"
                                size="small"
                                sx={{...sharedStyles.chip, ...sharedStyles.chipBRead}}
                            />
                        )}
                        {student.isInitialCall && (
                            <Chip
                                label="FIT"
                                size="small"
                                sx={{...sharedStyles.chip, ...sharedStyles.chipIniCall}}
                            />
                        )}
                        {student.isReturnVisit && (
                            <Chip
                                label="FIV"
                                size="small"
                                sx={{...sharedStyles.chip, ...sharedStyles.chipRV}}
                            />
                        )}
                        {student.isBibleStudy && (
                            <Chip
                                label="FAMP"
                                size="small"
                                sx={{...sharedStyles.chip, ...sharedStyles.chipBS}}
                            />
                        )}
                        {student.isTalk && (
                            <Chip
                                label="L"
                                size="small"
                                sx={{...sharedStyles.chip, ...sharedStyles.chipTalk}}
                            />
                        )}                
                    </CardContent>
                </Card>
            </Grid>
            {open && (
                <StudentDetails 
                    open={open}
                    setOpen={(value) => setOpen(value)}
                    student={student}
                    setStudent={(value) => setStudent(value)}
                    setAppSnackOpen={(value) => props.setAppSnackOpen(value)}
                    setAppSeverity={(value) => props.setAppSeverity(value)}
                    setAppMessage={(value) => props.setAppMessage(value)}
                />
            )}
        </>
     );
}
 
export default StudentCard;