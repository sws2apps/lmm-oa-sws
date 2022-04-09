import Box from '@mui/material/Box';
import AppLanguage from '../root/AppLanguage';

const StartupHeader = ({ children }) => {
	return (
		<Box>
			<Box
				sx={{
					position: 'absolute',
					right: 0,
				}}
			>
				<AppLanguage isStartup />
			</Box>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: {
						xs: 'auto',
						sm: '90vh',
					},
					marginTop: {
						xs: '5px',
						sm: '',
					},
				}}
			>
				<Box
					sx={{
						margin: 'auto',
						border: {
							xs: 'none',
							sm: '2px solid #BFC9CA',
						},
						width: {
							xs: '90%',
							sm: '400px',
						},
						display: 'flex',
						justifyContent: 'center',
						padding: '10px',
						borderRadius: '10px',
						flexDirection: 'column',
						marginTop: {
							xs: '50px',
							sm: '',
						},
					}}
				>
					{children}
				</Box>
			</Box>
		</Box>
	);
};

export default StartupHeader;
