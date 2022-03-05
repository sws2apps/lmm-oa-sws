import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CongregationLogin from '../components/administration/CongregationLogin';
import PocketUserDialog from '../components/administration/PocketUserDialog';
import PocketUserRead from '../components/administration/PocketUserRead';
import {
	isPocketAddState,
	isPocketDeleteState,
	isPocketEditState,
	pocketUsersState,
} from '../appStates/appAdministration';
import { congIDState, congPasswordState } from '../appStates/appCongregation';
import {
	isCongConnectedState,
	isCongCreateAccountState,
	isCongLoginOpenState,
	isCongSignInState,
	isCongUpdateAccountState,
	isUserLoggedState,
} from '../appStates/appSettings';
import { dbBuildPocketUsers } from '../indexedDb/dbPersons';
import PocketDelete from '../components/administration/PocketDelete';

const Administration = () => {
	const { t } = useTranslation();

	const [isLoginOpen, setIsLoginOpen] = useRecoilState(isCongLoginOpenState);
	const [isConnected, setIsConnected] = useRecoilState(isCongConnectedState);
	const [isPocketAdd, setIsPocketAdd] = useRecoilState(isPocketAddState);
	const [pocketUsers, setPocketUsers] = useRecoilState(pocketUsersState);

	const isUserLogged = useRecoilValue(isUserLoggedState);
	const congID = useRecoilValue(congIDState);
	const congPassword = useRecoilValue(congPasswordState);
	const isPocketEdit = useRecoilValue(isPocketEditState);
	const isPocketDelete = useRecoilValue(isPocketDeleteState);

	const setIsCongCreateAccount = useSetRecoilState(isCongCreateAccountState);
	const setIsCongSignIn = useSetRecoilState(isCongSignInState);
	const setIsCongUpdateAccount = useSetRecoilState(isCongUpdateAccountState);

	const [isLoading, setIsLoading] = useState(false);

	const handleCreateCongAccount = () => {
		setIsCongCreateAccount(true);
		setIsCongSignIn(false);
		setIsCongUpdateAccount(false);
		setIsLoginOpen(true);
	};

	const handleSignIn = () => {
		setIsCongCreateAccount(false);
		setIsCongSignIn(true);
		setIsCongUpdateAccount(false);
		setIsLoginOpen(true);
	};

	const handleUpdateCongAccount = () => {
		setIsCongCreateAccount(false);
		setIsCongSignIn(false);
		setIsCongUpdateAccount(true);
		setIsLoginOpen(true);
	};

	const handlePocketUserAdd = () => {
		setIsPocketAdd(true);
	};

	useEffect(() => {
		if (!isUserLogged) {
			setIsConnected(false);
		}
	}, [isUserLogged, setIsConnected]);

	useEffect(() => {
		const loadPocketUsers = async () => {
			setIsLoading(true);
			const pocketUsers = await dbBuildPocketUsers();
			setPocketUsers(pocketUsers);
			setIsLoading(false);
		};

		loadPocketUsers();
	}, [isConnected, setPocketUsers]);

	return (
		<>
			{isLoginOpen && <CongregationLogin />}
			{isPocketDelete && <PocketDelete />}
			<Box>
				<Typography
					sx={{
						fontWeight: 'bold',
						lineHeight: '1.2',
						marginBottom: '10px',
					}}
				>
					{t('administration.congregationAccount')}
				</Typography>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-start',
					}}
				>
					{isUserLogged && (
						<>
							{isConnected && (
								<Box
									sx={{
										marginTop: '10px',
									}}
								>
									<TextField
										label={t('administration.congregationId')}
										variant='outlined'
										type='number'
										size='small'
										sx={{
											width: '150px',
											marginRight: '10px',
											marginBottom: '15px',
										}}
										value={congID}
										InputProps={{
											readOnly: true,
										}}
									/>
									<TextField
										label={t('administration.congregationPassphrase')}
										variant='outlined'
										size='small'
										type='password'
										sx={{
											width: '200px',
											marginRight: '10px',
											marginBottom: '15px',
										}}
										value={congPassword}
										InputProps={{
											readOnly: true,
										}}
									/>
									<Button
										variant='contained'
										color='primary'
										onClick={handleUpdateCongAccount}
										sx={{
											marginBottom: '15px',
										}}
									>
										{t('administration.congregationInfoUpdate')}
									</Button>
								</Box>
							)}
							{!isConnected && (
								<>
									{congID.length < 10 && (
										<Button
											variant='contained'
											color='primary'
											onClick={handleCreateCongAccount}
											sx={{
												marginRight: '8px',
											}}
										>
											{t('administration.createCongregationAccount')}
										</Button>
									)}
									<Button
										variant='contained'
										color='primary'
										onClick={handleSignIn}
									>
										{t('administration.signInCongregationAccount')}
									</Button>
								</>
							)}
						</>
					)}
					{!isUserLogged && (
						<Typography>{t('administration.userLogin')}</Typography>
					)}
				</Box>
			</Box>
			<Box
				sx={{
					marginTop: '15px',
				}}
			>
				<Typography
					sx={{
						fontWeight: 'bold',
						lineHeight: '1.2',
						marginBottom: '10px',
					}}
				>
					{t('administration.swsPocketAccess')}
				</Typography>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-start',
					}}
				>
					<>
						{!isConnected && (
							<Typography>{t('administration.pocketLoginFirst')}</Typography>
						)}
						{isConnected && (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									width: '100%',
								}}
							>
								{(isPocketAdd || isPocketEdit) && <PocketUserDialog />}
								<Box>
									<Button
										variant='contained'
										color='success'
										onClick={handlePocketUserAdd}
										endIcon={<AddCircleIcon />}
									>
										{t('global.add')}
									</Button>
								</Box>
								{isLoading && (
									<CircularProgress
										color='secondary'
										size={60}
										disableShrink={true}
										sx={{
											display: 'flex',
											margin: '10px auto',
											marginTop: '20px',
										}}
									/>
								)}
								{!isLoading && (
									<Box sx={{ marginTop: '10px', marginBottom: '10px' }}>
										<Grid container>
											{pocketUsers.map((pocketUser) => (
												<PocketUserRead
													key={pocketUser.id}
													pocketUser={pocketUser}
												/>
											))}
										</Grid>
									</Box>
								)}
							</Box>
						)}
					</>
				</Box>
			</Box>
		</>
	);
};

export default Administration;
