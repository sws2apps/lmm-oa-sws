import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import AssignmentType from '../reusable/AssignmentType';
import { shortDatePickerFormatState } from '../../appStates/appSettings';

const datePicker = {
	marginTop: '25px',
	marginLeft: '10px !important',
	width: '170px !important',
	'.MuiInputBase-inputAdornedEnd': {
		padding: '9px !important',
	},
	'.MuiInputLabel-formControl': {
		top: '-7px !important',
	},
};

const StudentAssignmentItem = ({ assignment, assignments, setAssignments }) => {
	const { t } = useTranslation();
	const { assignmentId } = assignment;
	const shortDatePickerFormat = useRecoilValue(shortDatePickerFormatState);

	const [startedDate, setStartedDate] = useState(assignment.startDate);
	const [expiredDate, setExpiredDate] = useState(assignment.endDate);
	const [comments, setComments] = useState(assignment.comments || '');
	const [assignmentType, setAssignmentType] = useState(assignment.code);
	const [isActive, setIsActive] = useState(true);

	const handleInfoChange = (assignmentType, startDate, endDate, comments) => {
		if (assignmentId) {
			let obj = assignments.map((assignment) =>
				assignment.assignmentId === assignmentId
					? {
							assignmentId: assignmentId,
							code: assignmentType,
							startDate: startDate,
							endDate: endDate,
							comments: comments,
					  }
					: assignment
			);
			setAssignments(obj);
		}
	};

	const handleStartedChange = (newValue) => {
		if (newValue instanceof Date && !isNaN(newValue)) {
			const d = format(newValue, 'MM/dd/yyyy');
			setStartedDate(d);
			handleInfoChange(assignmentType, d, expiredDate, comments);
		}
	};

	const handleExpiredChange = (newValue) => {
		if (newValue instanceof Date && !isNaN(newValue)) {
			const d = format(newValue, 'MM/dd/yyyy');
			setExpiredDate(d);
			handleInfoChange(assignmentType, startedDate, d, comments);
		}
	};

	const handleAssignmentChange = (value) => {
		setAssignmentType(value);
		handleInfoChange(value, startedDate, expiredDate, comments);
	};

	const handleCommentsChange = (value) => {
		setComments(value);
		handleInfoChange(assignmentType, startedDate, expiredDate, value);
	};

	const handleRemoveAssignment = () => {
		let obj = assignments.filter(
			(assignment) => assignment.assignmentId !== assignmentId
		);
		setAssignments(obj);
	};

	useEffect(() => {
		setIsActive(assignment.endDate === null);
	}, [assignment]);

	return (
		<Box
			id='assignment-item'
			sx={{
				border: '1px outset',
				width: '100%',
				borderRadius: '8px',
				paddingBottom: '10px',
				marginBottom: '10px',
				backgroundColor: `${isActive ? '#D5F5E3' : null}`,
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					flexWrap: 'wrap',
					marginTop: '-5px',
				}}
			>
				<Box sx={{ width: '250px', marginLeft: '10px', marginTop: '25px' }}>
					<AssignmentType
						assignable={true}
						currentType={assignmentType}
						handleChangeType={(value) => handleAssignmentChange(value)}
					/>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
					}}
				>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DesktopDatePicker
							id='start-date-assignment-picker'
							label={t('global.startDate')}
							inputFormat={shortDatePickerFormat}
							value={startedDate}
							onChange={handleStartedChange}
							renderInput={(params) => (
								<TextField {...params} sx={datePicker} />
							)}
						/>
					</LocalizationProvider>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DesktopDatePicker
							id='end-date-assignment-picker'
							label={t('global.endDate')}
							inputFormat={shortDatePickerFormat}
							value={expiredDate}
							onChange={handleExpiredChange}
							renderInput={(params) => (
								<TextField {...params} sx={datePicker} />
							)}
							sx={{ marginTop: '15px' }}
						/>
					</LocalizationProvider>
				</Box>
				<TextField
					label={t('global.comments')}
					variant='outlined'
					size='small'
					autoComplete='off'
					sx={{
						marginTop: '20px',
						flexGrow: 1,
						marginRight: '10px',
						marginLeft: '10px',
					}}
					value={comments}
					onChange={(e) => handleCommentsChange(e.target.value)}
				/>
			</Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginTop: '10px',
					marginRight: '10px',
				}}
			>
				<Button
					variant='outlined'
					color='error'
					startIcon={<ClearIcon />}
					onClick={handleRemoveAssignment}
				>
					{t('global.delete')}
				</Button>
			</Box>
		</Box>
	);
};

export default StudentAssignmentItem;