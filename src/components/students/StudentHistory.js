import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const StudentHistory = () => {
	const { t } = useTranslation();

	return (
		<Box sx={{ overflow: 'auto' }}>
			<TableContainer
				sx={{
					maxHeight: '170px',
					marginBottom: '5px',
					maxWidth: '370px',
				}}
			>
				<Table stickyHeader size='small'>
					<TableHead>
						<TableRow>
							<TableCell style={{ width: '60px' }} align='center'>
								{t('global.date')}
							</TableCell>
							<TableCell
								style={{ width: '250px' }}
								sx={{
									'& .MuiTableCell-sizeSmall': { padding: '6px 3px 6px 3px' },
								}}
							>
								{t('global.assignment')}
							</TableCell>
							<TableCell style={{ width: '60px' }} align='center'>
								{t('global.class')}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{[1, 2, 3, 4, 5].map((a, i) => (
							<TableRow key={i} hover role='checkbox' tabIndex={-1}>
								<TableCell
									align='center'
									style={{ width: '60px' }}
									sx={{
										'& .MuiTableCell-sizeSmall': { padding: '6px 3px 6px 3px' },
									}}
								>
									05/31/2022
								</TableCell>
								<TableCell
									style={{ width: '250px' }}
									sx={{
										'& .MuiTableCell-sizeSmall': { padding: '6px 3px 6px 3px' },
									}}
								>
									Bible Reading
								</TableCell>
								<TableCell
									style={{ width: '60px' }}
									sx={{
										'& .MuiTableCell-sizeSmall': { padding: '6px 3px 6px 3px' },
									}}
									align='center'
								>
									A
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default StudentHistory;
