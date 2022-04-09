import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import maleIcon from '../../img/student_male.svg';
import femaleIcon from '../../img/student_female.svg';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
	dbAddPersonData,
	dbGetStudents,
	dbIsStudentExist,
	dbSavePersonData,
} from '../../indexedDb/dbPersons';
import {
	currentStudentState,
	isStudentAddState,
	isStudentDetailsOpenState,
	isStudentEditState,
} from '../../appStates/appStudent';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import { allStudentsState } from '../../appStates/appStudents';

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
};

const StudentDetails = (props) => {
	const { t } = useTranslation();

	const [name, setName] = useState('');
	const [isMale, setIsMale] = useState(true);
	const [isFemale, setIsFemale] = useState(false);
	const [isErrorName, setIsErrorName] = useState(false);
	const [displayName, setDisplayName] = useState('');
	const [isErrorDisplayName, setIsErrorDisplayName] = useState(false);
	const [isBRead, setIsBRead] = useState(false);
	const [isInitialCall, setIsInitialCall] = useState(false);
	const [isReturnVisit, setIsReturnVisit] = useState(false);
	const [isBibleStudy, setIsBibleStudy] = useState(false);
	const [isTalk, setIsTalk] = useState(false);
	const [isUnavailable, setIsUnavailable] = useState(false);
	const [forLivePart, setForLivePart] = useState(false);

	const [isStudentAdd, setIsStudentAdd] = useRecoilState(isStudentAddState);
	const [isStudentEdit, setIsStudentEdit] = useRecoilState(isStudentEditState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setDbStudents = useSetRecoilState(allStudentsState);

	const currentStudent = useRecoilValue(currentStudentState);
	const isStudentDetailsOpen = useRecoilValue(isStudentDetailsOpenState);

	const uid = currentStudent.person_uid;
	const lastBRead = currentStudent.lastBRead;
	const lastInitialCall = currentStudent.lastInitialCall;
	const lastReturnVisit = currentStudent.lastReturnVisit;
	const lastBibleStudy = currentStudent.lastBibleStudy;
	const lastTalk = currentStudent.lastTalk;

	const handleClose = () => {
		setIsStudentAdd(false);
		setIsStudentEdit(false);
	};

	const handleNameChange = (name) => {
		setIsErrorName(false);
		setIsErrorDisplayName(false);
		if (name === '') {
			setIsErrorName(true);
			setIsErrorDisplayName(true);
		}
		setName(name);
		generateDisplayName(name);
	};

	const generateDisplayName = (name) => {
		if (name === '') {
			setDisplayName('');
		} else {
			var txtArray = name.split(' ');
			if (txtArray.length === 1) {
				setDisplayName(name);
			} else {
				var varDisplay = '';
				for (let i = 0; i < txtArray.length; i++) {
					if (i === txtArray.length - 1) {
						varDisplay += txtArray[i];
					} else {
						varDisplay += txtArray[i].substring(0, 1) + '. ';
					}
				}
				setDisplayName(varDisplay);
			}
		}
	};

	const handleDisplayNameChange = (name) => {
		setIsErrorDisplayName(false);
		if (name === '') {
			setIsErrorDisplayName(true);
		}
		setDisplayName(name);
	};

	const handleSavePerson = async () => {
		if (name === '' || displayName === '') {
			if (name === '') {
				setIsErrorName(true);
			}
			if (displayName === '') {
				setIsErrorDisplayName(true);
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

			if (uid === undefined) {
				const isStuExist = await dbIsStudentExist(name);
				if (isStuExist) {
					setAppSnackOpen(true);
					setAppSeverity('warning');
					setAppMessage(t('students.existAlready'));
				} else {
					const uid = window.crypto.randomUUID();
					person.person_uid = uid;
					await dbAddPersonData(person);
					const data = await dbGetStudents();
					setDbStudents(data);
					setAppSnackOpen(true);
					setAppSeverity('success');
					setAppMessage(t('students.addedSuccess'));
				}
			} else {
				person.person_uid = uid;
				await dbSavePersonData(person);
				const data = await dbGetStudents();
				setDbStudents(data);
				setAppSnackOpen(true);
				setAppSeverity('success');
				setAppMessage(t('students.modifiedSuccess'));
			}
			handleClose();
		}
	};

	const handleMaleCheck = (value) => {
		setIsMale(value);
		setIsFemale(!value);
	};

	const handleFemaleCheck = (value) => {
		setIsMale(!value);
		setIsFemale(value);
	};

	useEffect(() => {
		if (isStudentEdit) {
			setName(currentStudent.person_name);
			setDisplayName(currentStudent.person_displayName);
			setIsMale(currentStudent.isMale);
			setIsFemale(currentStudent.isFemale);
			setIsBRead(currentStudent.isBRead);
			setIsInitialCall(currentStudent.isInitialCall);
			setIsReturnVisit(currentStudent.isReturnVisit);
			setIsBibleStudy(currentStudent.isBibleStudy);
			setIsTalk(currentStudent.isTalk);
			setIsUnavailable(currentStudent.isUnavailable);
			setForLivePart(currentStudent.forLivePart);
		}
		if (isStudentAdd) {
		}
	}, [isStudentAdd, isStudentEdit, currentStudent]);

	return (
		<Dialog
			open={isStudentDetailsOpen}
			onClose={handleClose}
			aria-labelledby='dialog-title-studentDetails'
		>
			<DialogTitle id='dialog-title-studentDetails'>
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
						alt='Student icon'
						src={isMale ? maleIcon : femaleIcon}
					/>
					{name}
				</Box>
			</DialogTitle>
			<DialogContent>
				<Box sx={{ display: 'flex' }}>
					<FormControlLabel
						control={
							<Checkbox
								checked={isMale}
								onChange={(e) => handleMaleCheck(e.target.checked)}
								color='primary'
							/>
						}
						label={t('students.male')}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={isFemale}
								onChange={(e) => handleFemaleCheck(e.target.checked)}
								color='primary'
							/>
						}
						label={t('students.female')}
					/>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
					}}
				>
					<TextField
						label={t('global.name')}
						variant='outlined'
						size='small'
						autoComplete='off'
						required
						error={isErrorName ? true : false}
						sx={{
							width: '320px',
							margin: '5px 5px 8px 0',
						}}
						value={name}
						onChange={(e) => handleNameChange(e.target.value)}
					/>
					<TextField
						label={t('global.displayName')}
						variant='outlined'
						size='small'
						autoComplete='off'
						required
						error={isErrorDisplayName ? true : false}
						helperText={isErrorDisplayName ? 'Mila fenoina' : null}
						sx={{
							width: '210px',
							margin: '5px 5px 5px 0',
						}}
						value={displayName}
						onChange={(e) => handleDisplayNameChange(e.target.value)}
					/>
				</Box>
				<div className={`tgwPart meetingPart`}>
					<Typography variant='h6'>{t('global.treasuresPart')}</Typography>
				</div>
				<Box sx={sharedStyles.studentPart}>
					<FormControlLabel
						control={
							<Checkbox
								checked={isBRead}
								onChange={(e) => setIsBRead(e.target.checked)}
								color='primary'
							/>
						}
						label={t('global.bibleReading')}
					/>
					{lastBRead && (
						<Typography variant='body1' sx={sharedStyles.lastAssignment}>
							{lastBRead}
						</Typography>
					)}
				</Box>
				<div className={`ayfPart meetingPart`}>
					<Typography variant='h6'>
						{t('global.applyFieldMinistryPart')}
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
							control={
								<Checkbox
									checked={isInitialCall}
									onChange={(e) => setIsInitialCall(e.target.checked)}
									color='primary'
								/>
							}
							label={t('global.initialCall')}
						/>
						{lastInitialCall && (
							<Typography variant='body1' sx={sharedStyles.lastAssignment}>
								{lastInitialCall}
							</Typography>
						)}
					</Box>
					<Box sx={sharedStyles.studentPart}>
						<FormControlLabel
							control={
								<Checkbox
									checked={isReturnVisit}
									onChange={(e) => setIsReturnVisit(e.target.checked)}
									color='primary'
								/>
							}
							label={t('global.returnVisit')}
						/>
						{lastReturnVisit && (
							<Typography variant='body1' sx={sharedStyles.lastAssignment}>
								{lastReturnVisit}
							</Typography>
						)}
					</Box>
					<Box sx={sharedStyles.studentPart}>
						<FormControlLabel
							control={
								<Checkbox
									checked={isBibleStudy}
									onChange={(e) => setIsBibleStudy(e.target.checked)}
									color='primary'
								/>
							}
							label={t('global.bibleStudy')}
						/>
						{lastBibleStudy && (
							<Typography variant='body1' sx={sharedStyles.lastAssignment}>
								{lastBibleStudy}
							</Typography>
						)}
					</Box>
					<Box sx={sharedStyles.studentPart}>
						<FormControlLabel
							control={
								<Checkbox
									checked={isTalk}
									onChange={(e) => setIsTalk(e.target.checked)}
									color='primary'
								/>
							}
							label={t('global.talk')}
						/>
						{lastTalk && (
							<Typography variant='body1' sx={sharedStyles.lastAssignment}>
								{lastTalk}
							</Typography>
						)}
					</Box>
				</Box>
				<Typography variant='h6' sx={{ marginTop: '10px' }}>
					{t('students.other')}
				</Typography>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<FormControlLabel
						control={
							<Checkbox
								checked={isUnavailable}
								onChange={(e) => setIsUnavailable(e.target.checked)}
								color='primary'
							/>
						}
						label={t('global.isUnavailable')}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={forLivePart}
								onChange={(e) => setForLivePart(e.target.checked)}
								color='primary'
							/>
						}
						label={t('students.livePart')}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button
					autoFocus
					onClick={handleSavePerson}
					color='primary'
					disabled={isErrorName || isErrorDisplayName ? true : false}
				>
					{t('global.save')}
				</Button>
				<Button onClick={handleClose} color='primary' autoFocus>
					{t('global.cancel')}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default StudentDetails;
