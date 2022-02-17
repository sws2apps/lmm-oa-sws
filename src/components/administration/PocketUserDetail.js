import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {
	congIDState,
	congNameState,
	congNumberState,
	congPasswordState,
} from '../../appStates/appCongregation';
import { allStudentsState } from '../../appStates/appStudents';
import {
	childPocketUsersState,
	parentPocketUserState,
	userPocketPINState,
} from '../../appStates/appAdministration';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import { apiHostState, uidUserState } from '../../appStates/appSettings';

const PocketUserDetail = () => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const dbStudents = useRecoilValue(allStudentsState);
	const uidUser = useRecoilValue(uidUserState);
	const apiHost = useRecoilValue(apiHostState);
	const congName = useRecoilValue(congNameState);
	const congNumber = useRecoilValue(congNumberState);
	const congID = useRecoilValue(congIDState);
	const congPassword = useRecoilValue(congPasswordState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const [parentStudent, setParentStudent] = useRecoilState(
		parentPocketUserState
	);
	const [childStudents, setChildStudents] = useRecoilState(
		childPocketUsersState
	);
	const [tempPIN, setTempPIN] = useRecoilState(userPocketPINState);

	const [filterStudents, setFilterStudents] = useState([]);
	const [isGenerate, setIsGenerate] = useState(false);

	const handleOnParentChange = (selected) => {
		if (selected?.id) {
			setParentStudent(selected.id);
		} else {
			setParentStudent(undefined);
			setChildStudents([]);
		}
	};

	const handleOnChildChange = (selected) => {
		setChildStudents(selected);
	};

	const handleGenerateUserPIN = async () => {
		setIsGenerate(true);
		if (apiHost !== '') {
			const reqPayload = {
				cong_id: congID,
				cong_password: congPassword,
				cong_name: congName,
				cong_number: congNumber,
			};

			fetch(`${apiHost}api/congregation/pocket-generate-pin`, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					uid: uidUser,
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					const data = await res.json();
					if (res.status === 200) {
						setTempPIN(data.message);
					} else {
						let warnMsg;
						if (data.message === 'FORBIDDEN') {
							warnMsg = t('administration.warnForbidden');
						} else if (data.message === 'WAIT_FOR_REQUEST') {
							warnMsg = t('global.waitForRequest');
						} else {
							warnMsg = t('global.errorTryAgain');
						}
						setAppMessage(warnMsg);
						setAppSeverity('warning');
						setAppSnackOpen(true);
					}
					setIsGenerate(false);
				})
				.catch((err) => {
					setIsGenerate(false);
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
				});
		}
	};

	useEffect(() => {
		if (parentStudent) {
			const newArray = dbStudents.filter(
				(student) => student.id !== parentStudent
			);
			setFilterStudents(newArray);
		} else {
			setFilterStudents([]);
		}
	}, [dbStudents, parentStudent]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box>
			<Autocomplete
				id='combo-box-select-pocket'
				options={dbStudents}
				getOptionLabel={(option) => option.person_name}
				sx={{
					width: 300,
					marginBottom: '15px',
					marginTop: '10px',
				}}
				noOptionsText={t('global.noOptions')}
				size='small'
				onChange={(e, value) => handleOnParentChange(value)}
				renderInput={(params) => (
					<TextField {...params} label={t('global.student')} />
				)}
			/>
			<Autocomplete
				multiple
				id='pocket-user-access'
				options={filterStudents}
				getOptionLabel={(option) => option.person_name}
				sx={{
					width: 300,
					marginBottom: '15px',
				}}
				filterSelectedOptions
				noOptionsText={t('global.noOptions')}
				value={childStudents}
				onChange={(e, value) => handleOnChildChange(value)}
				renderInput={(params) => (
					<TextField
						{...params}
						label={t('administration.pocketUserAccess')}
						placeholder={t('global.student')}
					/>
				)}
			/>
			<TextField
				label={t('administration.userPIN')}
				variant='outlined'
				type='number'
				size='small'
				sx={{
					width: '140px',
					marginRight: '13px',
					marginBottom: '10px',
				}}
				value={tempPIN}
				onChange={(e) => setTempPIN(e.target.value)}
			/>
			{isGenerate && (
				<CircularProgress
					disableShrink
					color='secondary'
					size={'30px'}
					sx={{
						marginRight: '8px',
						marginTop: '3px',
					}}
				/>
			)}
			{!isGenerate && (
				<Tooltip title={t('administration.generateUserPIN')}>
					<IconButton
						color='inherit'
						edge='start'
						sx={{
							marginRight: '5px',
						}}
						onClick={handleGenerateUserPIN}
					>
						<FlashAutoIcon />
					</IconButton>
				</Tooltip>
			)}
		</Box>
	);
};

export default PocketUserDetail;
