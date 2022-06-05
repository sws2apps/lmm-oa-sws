import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';

const StudentAdvancedSearch = ({
	advancedOpen,
	isFemale,
	isMale,
	assTypes,
	setIsFemale,
	setIsMale,
	setAssTypes,
}) => {
	const { t } = useTranslation();

	const [isBRead, setIsBRead] = useState(false);
	const [isInitialCall, setIsInitialCall] = useState(false);
	const [isReturnVisit, setIsReturnVisit] = useState(false);
	const [isBibleStudy, setIsBibleStudy] = useState(false);
	const [isTalk, setIsTalk] = useState(false);

	const handleCheckBRead = (value) => {
		if (value) {
			if (assTypes.findIndex((assType) => assType === 100) === -1) {
				setAssTypes((prev) => {
					return [...prev, 100];
				});
			}
		} else {
			setAssTypes((prev) => {
				const obj = prev.filter((assType) => assType !== 100);
				return obj;
			});
		}
	};

	const handleCheckInitialCall = (value) => {
		if (value) {
			if (assTypes.findIndex((assType) => assType === 101) === -1) {
				setAssTypes((prev) => {
					return [...prev, 101];
				});
			}
		} else {
			setAssTypes((prev) => {
				const obj = prev.filter((assType) => assType !== 101);
				return obj;
			});
		}
	};

	const handleCheckReturnVisit = (value) => {
		if (value) {
			if (assTypes.findIndex((assType) => assType === 102) === -1) {
				setAssTypes((prev) => {
					return [...prev, 102];
				});
			}
		} else {
			setAssTypes((prev) => {
				const obj = prev.filter((assType) => assType !== 102);
				return obj;
			});
		}
	};

	const handleCheckBibleStudy = (value) => {
		if (value) {
			if (assTypes.findIndex((assType) => assType === 103) === -1) {
				setAssTypes((prev) => {
					return [...prev, 103];
				});
			}
		} else {
			setAssTypes((prev) => {
				const obj = prev.filter((assType) => assType !== 103);
				return obj;
			});
		}
	};

	const handleCheckTalk = (value) => {
		if (value) {
			if (assTypes.findIndex((assType) => assType === 104) === -1) {
				setAssTypes((prev) => {
					return [...prev, 104];
				});
			}
		} else {
			setAssTypes((prev) => {
				const obj = prev.filter((assType) => assType !== 104);
				return obj;
			});
		}
	};

	useEffect(() => {
		setIsBRead(false);
		setIsInitialCall(false);
		setIsReturnVisit(false);
		setIsBibleStudy(false);
		setIsTalk(false);

		for (let i = 0; i < assTypes.length; i++) {
			const type = assTypes[i];

			if (type === 100) setIsBRead(true);
			if (type === 101) setIsInitialCall(true);
			if (type === 102) setIsReturnVisit(true);
			if (type === 103) setIsBibleStudy(true);
			if (type === 104) setIsTalk(true);
		}
	}, [assTypes]);

	return (
		<Collapse in={advancedOpen} timeout='auto' unmountOnExit>
			<Box
				sx={{
					margin: '0 10px',
					backgroundColor: '#F2F4F4',
					borderRadius: '8px',
					marginTop: '8px',
					padding: '5px 20px',
					boxShadow: '0 3px 5px 2px rgba(44, 62, 80, .3)',
				}}
			>
				<Box sx={{ display: 'flex' }}>
					<FormGroup sx={{ marginRight: '30px' }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={isMale}
									onChange={(e) => setIsMale(e.target.checked)}
									color='primary'
									sx={{ padding: '5px' }}
								/>
							}
							label={t('students.male')}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={isFemale}
									onChange={(e) => setIsFemale(e.target.checked)}
									color='primary'
									sx={{ padding: '5px' }}
								/>
							}
							label={t('students.female')}
						/>
					</FormGroup>
					<Box sx={{ marginTop: '3px' }}>
						<Typography sx={{ fontWeight: 'bold' }}>
							{t('global.assignment')}
						</Typography>
						<FormGroup
							sx={{
								marginRight: '30px',
								flexDirection: 'row',
								flexWrap: 'wrap',
							}}
						>
							<FormControlLabel
								control={
									<Checkbox
										checked={isBRead}
										onChange={(e) => handleCheckBRead(e.target.checked)}
										color='primary'
										sx={{ padding: '5px' }}
									/>
								}
								label={t('global.bibleReading')}
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={isInitialCall}
										onChange={(e) => handleCheckInitialCall(e.target.checked)}
										color='primary'
										sx={{ padding: '5px' }}
									/>
								}
								label={t('global.initialCall')}
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={isReturnVisit}
										onChange={(e) => handleCheckReturnVisit(e.target.checked)}
										color='primary'
										sx={{ padding: '5px' }}
									/>
								}
								label={t('global.returnVisit')}
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={isBibleStudy}
										onChange={(e) => handleCheckBibleStudy(e.target.checked)}
										color='primary'
										sx={{ padding: '5px' }}
									/>
								}
								label={t('global.bibleStudy')}
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={isTalk}
										onChange={(e) => handleCheckTalk(e.target.checked)}
										color='primary'
										sx={{ padding: '5px' }}
									/>
								}
								label={t('global.talk')}
							/>
						</FormGroup>
					</Box>
				</Box>
			</Box>
		</Collapse>
	);
};

export default StudentAdvancedSearch;
