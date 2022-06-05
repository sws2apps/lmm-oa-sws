import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { styled, alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SearchIcon from '@mui/icons-material/Search';
import StudentCard from '../components/students/StudentCard';
import StudentAdvancedSearch from '../components/students/StudentAdvancedSearch';
import { dbDeleteStudent, dbFilterStudents } from '../indexedDb/dbPersons';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../appStates/appNotification';
import { allStudentsState } from '../appStates/appStudents';
import {
	currentStudentState,
	isStudentDeleteState,
} from '../appStates/appStudent';

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.black, 0.25),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.black, 0.15),
	},
	marginLeft: theme.spacing(1),
	marginBottom: '5px',
	flexGrow: 1,
	minWidth: '330px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(0.8, 1, 0.8, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
	},
	'&.MuiInputBase-root': {
		width: '100%',
	},
}));

const Students = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const theme = useTheme();
	const xsUp = useMediaQuery(theme.breakpoints.up(510), { noSsr: true });

	const [advancedOpen, setAdvancedOpen] = useState(false);
	const [students, setStudents] = useState([]);
	const [anchorElMenuSmall, setAnchorElMenuSmall] = useState(null);
	const [txtSearch, setTxtSearch] = useState('');
	const [isMale, setIsMale] = useState(false);
	const [isFemale, setIsFemale] = useState(false);
	const [assTypes, setAssTypes] = useState([]);
	const [isSearch, setIsSearch] = useState(false);

	const [isStudentDelete, setIsStudentDelete] =
		useRecoilState(isStudentDeleteState);
	const [dbStudents, setDbStudents] = useRecoilState(allStudentsState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const currentStudent = useRecoilValue(currentStudentState);

	const openMenuSmall = Boolean(anchorElMenuSmall);

	const handleClickMenuSmall = (event) => {
		setAnchorElMenuSmall(event.currentTarget);
	};

	const handleCloseMenuSmall = () => {
		setAnchorElMenuSmall(null);
	};

	const handleToggleAdvanced = () => {
		handleCloseMenuSmall();
		setAdvancedOpen(!advancedOpen);
	};

	const handleAddStudent = () => {
		navigate('/students/new');
	};

	const handleClose = () => {
		setIsStudentDelete(false);
	};

	const handleSearchStudent = async () => {
		handleCloseMenuSmall();
		setIsSearch(true);
		setTimeout(async () => {
			let obj = { txtSearch, isMale, isFemale, assTypes };
			const data = await dbFilterStudents(obj);
			setAdvancedOpen(false);
			setStudents(data);
			setIsSearch(false);
		}, [1000]);
	};

	const handleDelete = async () => {
		const varID = currentStudent.person_uid;
		await dbDeleteStudent(varID);
		let newPersons = students.filter((student) => student.person_uid !== varID);
		let dbNewPersons = dbStudents.filter(
			(student) => student.person_uid !== varID
		);
		setIsStudentDelete(false);
		setStudents(newPersons);
		setDbStudents(dbNewPersons);

		setAppSnackOpen(true);
		setAppSeverity('success');
		setAppMessage(t('students.deleteSucess'));
	};

	useEffect(() => {
		if (!xsUp) setAnchorElMenuSmall(null);
	}, [xsUp]);

	return (
		<>
			{isStudentDelete && (
				<Dialog open={isStudentDelete} onClose={handleClose}>
					<DialogTitle>
						<Box sx={{ lineHeight: 1.2 }}>
							{t('students.deleteTitle', {
								currentStudent: currentStudent.name,
							})}
						</Box>
					</DialogTitle>
					<DialogContent>
						<DialogContentText id='alert-dialog-description'>
							{t('students.deleteConfirmation')}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleDelete} color='primary'>
							{t('global.delete')}
						</Button>
						<Button onClick={handleClose} color='primary' autoFocus>
							{t('global.cancel')}
						</Button>
					</DialogActions>
				</Dialog>
			)}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					width: '100%',
					paddingRight: '10px',
					marginTop: '10px',
				}}
			>
				<Search>
					<SearchIconWrapper>
						<SearchIcon />
					</SearchIconWrapper>
					<StyledInputBase
						placeholder={t('students.search')}
						inputProps={{ 'aria-label': 'search' }}
						value={txtSearch}
						onChange={(e) => setTxtSearch(e.target.value)}
					/>
				</Search>
				{xsUp && (
					<Box>
						<IconButton
							onClick={handleToggleAdvanced}
							sx={{
								backgroundColor: '#ABB2B9',
								margin: '-5px 5px 0 5px',
							}}
						>
							{advancedOpen ? (
								<ExpandLessIcon
									sx={{
										fontSize: '25px',
										color: 'black',
									}}
								/>
							) : (
								<ExpandMoreIcon
									sx={{
										fontSize: '25px',
										color: 'black',
									}}
								/>
							)}
						</IconButton>
						<IconButton
							sx={{
								backgroundColor: '#ABB2B9',
								marginTop: '-5px',
								marginRight: '5px',
							}}
							onClick={handleSearchStudent}
						>
							<PersonSearchIcon
								sx={{
									fontSize: '25px',
									color: 'black',
								}}
							/>
						</IconButton>
						<IconButton
							sx={{
								backgroundColor: '#ABB2B9',
								marginTop: '-5px',
							}}
							onClick={handleAddStudent}
						>
							<AddCircleIcon
								sx={{
									fontSize: '25px',
									color: 'black',
								}}
							/>
						</IconButton>
					</Box>
				)}
				{!xsUp && (
					<>
						<IconButton
							sx={{
								backgroundColor: '#ABB2B9',
								margin: '-5px 5px 0 5px',
							}}
							aria-label='more'
							id='students-small-button'
							aria-controls={openMenuSmall ? 'students-small-menu' : undefined}
							aria-expanded={openMenuSmall ? 'true' : undefined}
							aria-haspopup='true'
							onClick={handleClickMenuSmall}
						>
							<MoreVertIcon />
						</IconButton>
						<Menu
							id='students-small-menu'
							anchorEl={anchorElMenuSmall}
							open={!xsUp && openMenuSmall}
							onClose={handleCloseMenuSmall}
							MenuListProps={{
								'aria-labelledby': 'students-small-button',
							}}
						>
							<MenuItem onClick={handleToggleAdvanced}>
								<ListItemIcon>
									{advancedOpen ? (
										<ExpandLessIcon
											sx={{
												fontSize: '25px',
												color: 'black',
											}}
										/>
									) : (
										<ExpandMoreIcon
											sx={{
												fontSize: '25px',
												color: 'black',
											}}
										/>
									)}
								</ListItemIcon>
								<ListItemText>
									{advancedOpen
										? t('global.hideAvancedSearch')
										: t('global.advancedSearch')}
								</ListItemText>
							</MenuItem>
							<MenuItem onClick={handleSearchStudent}>
								<ListItemIcon>
									<PersonSearchIcon
										sx={{
											fontSize: '25px',
											color: 'black',
										}}
									/>
								</ListItemIcon>
								<ListItemText>{t('students.search')}</ListItemText>
							</MenuItem>
							<MenuItem onClick={handleAddStudent}>
								<ListItemIcon>
									<AddCircleIcon
										sx={{
											fontSize: '25px',
											color: 'black',
										}}
									/>
								</ListItemIcon>
								<ListItemText>{t('students.addNew')}</ListItemText>
							</MenuItem>
						</Menu>
					</>
				)}
			</Box>

			<StudentAdvancedSearch
				advancedOpen={advancedOpen}
				isMale={isMale}
				isFemale={isFemale}
				assTypes={assTypes}
				setIsMale={(value) => setIsMale(value)}
				setIsFemale={(value) => setIsFemale(value)}
				setAssTypes={(value) => setAssTypes(value)}
			/>

			<Box sx={{ marginBottom: '10px', marginRight: '5px' }}>
				{!isSearch && (
					<>
						{students.length > 0 && (
							<Grid container>
								{students.map((student) => (
									<StudentCard key={student.person_uid} student={student} />
								))}
							</Grid>
						)}
					</>
				)}
				{isSearch && (
					<CircularProgress
						color='secondary'
						size={80}
						disableShrink={true}
						sx={{
							display: 'flex',
							margin: '20vh auto',
						}}
					/>
				)}
			</Box>
		</>
	);
};

export default Students;
