import { useState } from 'react';
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

const StudentAssignmentItem = () => {
	const { t } = useTranslation();

	const [startedDate, setStartedDate] = useState(
		format(new Date(), 'MM/dd/yyyy')
	);
	const [expiredDate, setExpiredDate] = useState(null);
	const [comments, setComments] = useState('');
	const [assignment, setAssignment] = useState(100);

	const handleStartedChange = (newValue) => {
		if (newValue) setStartedDate(format(newValue, 'MM/dd/yyyy'));
	};

	const handleExpiredChange = (newValue) => {
		if (newValue) setExpiredDate(format(newValue, 'MM/dd/yyyy'));
	};

	const handleAssignmentChange = (value) => {
		setAssignment(value);
	};

	return (
		<Box
			id='assignment-item'
			sx={{
				border: '1px outset',
				width: '100%',
				borderRadius: '8px',
				paddingBottom: '10px',
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
						currentType={assignment}
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
							inputFormat='MM/dd/yyyy'
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
							inputFormat='MM/dd/yyyy'
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
					onChange={(e) => setComments(e.target.value)}
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
				<Button variant='outlined' color='error' startIcon={<ClearIcon />}>
					{t('global.delete')}
				</Button>
			</Box>
		</Box>
	);
};

export default StudentAssignmentItem;
