import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
	childPocketUsersState,
	currentPocketState,
	isPocketAddState,
	isPocketDeleteState,
	isPocketEditState,
	parentPocketUserState,
	userPocketPINState,
} from '../../appStates/appAdministration';

const PocketUserRead = ({ pocketUser }) => {
	const { t } = useTranslation();

	const setParentPocketUser = useSetRecoilState(parentPocketUserState);
	const setChildPocketUsers = useSetRecoilState(childPocketUsersState);
	const setPocketPIN = useSetRecoilState(userPocketPINState);
	const setPocketOpen = useSetRecoilState(isPocketAddState);
	const setPocketEdit = useSetRecoilState(isPocketEditState);
	const setIsPocketDelete = useSetRecoilState(isPocketDeleteState);
	const setCurrentPocket = useSetRecoilState(currentPocketState);

	const handleEditPocket = () => {
		setParentPocketUser(pocketUser);
		setPocketPIN(pocketUser.student_PIN);
		setChildPocketUsers(pocketUser.viewPartFull);
		setPocketEdit(true);
		setPocketOpen(true);
	};

	const handleDeletePocket = () => {
		setCurrentPocket(pocketUser);
		setIsPocketDelete(true);
	};

	return (
		<Grid item sx={{ marginBottom: '5px' }} xs={12} sm={6} md={6} lg={4}>
			<Card
				sx={{
					marginRight: '5px',
					backgroundColor: '#e3f2fd',
					height: '130px',
				}}
			>
				<CardHeader
					sx={{
						padding: '5px',
						'& .MuiCardHeader-title': {
							fontSize: '18px',
							fontWeight: 'bold',
							marginLeft: '5px',
							color: '#1a237e',
						},
					}}
					action={
						<>
							<Tooltip title={t('global.edit')}>
								<IconButton onClick={handleEditPocket}>
									<EditIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title={t('global.delete')}>
								<IconButton onClick={handleDeletePocket}>
									<DeleteIcon />
								</IconButton>
							</Tooltip>
						</>
					}
					title={pocketUser.person_name}
				/>
				<CardContent
					sx={{
						padding: '5px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginRight: '5px',
					}}
				>
					<Typography
						sx={{
							fontSize: '30px',
							color: '#ff5722',
							marginRight: '15px',
						}}
					>
						{pocketUser.student_PIN}
					</Typography>
					<Box sx={{ textAlign: 'right' }}>
						{pocketUser.viewPartName.map((user) => (
							<Chip
								key={user}
								label={user}
								size='small'
								sx={{ margin: '2px' }}
							/>
						))}
					</Box>
				</CardContent>
			</Card>
		</Grid>
	);
};

export default PocketUserRead;
