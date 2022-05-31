import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';

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

const StudentTimeAway = () => {
	const { t } = useTranslation();

	const [startedDate, setStartedDate] = useState(
		format(new Date(), 'MM/dd/yyyy')
	);
	const [expiredDate, setExpiredDate] = useState(null);
	const [comments, setComments] = useState('');

	const handleStartedChange = (newValue) => {
		if (newValue) setStartedDate(format(newValue, 'MM/dd/yyyy'));
	};

	const handleExpiredChange = (newValue) => {
		if (newValue) setExpiredDate(format(newValue, 'MM/dd/yyyy'));
	};

	return (
		<Box id='time-away-container'>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginBottom: '10px',
				}}
			>
				<Button
					variant='outlined'
					color='success'
					startIcon={<AddCircleIcon />}
				>
					{t('students.addTimeAway')}
				</Button>
			</Box>
			<Box
				id='time-away-item'
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
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
						}}
					>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DesktopDatePicker
								id='start-date-time-away-picker'
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
								id='end-date-time-away-picker'
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
						Delete
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default StudentTimeAway;
