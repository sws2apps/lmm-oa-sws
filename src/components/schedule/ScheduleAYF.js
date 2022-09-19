import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { classCountState } from '../../appStates/appCongregation';

const boxStudentAYF = {
	display: 'flex',
	flexDirection: 'column',
	marginBottom: '8px',
};

const typoStudentField = {
	height: '25px',
	lineHeight: '25px',
	width: '165px',
	backgroundColor: 'lightblue',
	color: 'purple',
	padding: '2px 2px 2px 5px',
	borderRadius: 5,
	fontWeight: 'bold',
};

const boxStudentFldContainer = {
	display: 'flex',
	marginRight: '5px',
	alignItems: 'flex-end',
};

const iconButtonContainer = {
	padding: '1px',
};

const editIconButton = {
	fontSize: '24px',
};

const StudentAYF = (props) => {
	const { t } = useTranslation();

	const {
		assType,
		assTypeName,
		assTime,
		assSrc,
		stuA,
		assA,
		stuB,
		assB,
		stuAID,
		assAID,
		stuBID,
		assBID,
		isStuA,
		isAssA,
		isStuB,
		isAssB,
	} = props.params;
	const { loadStudentPicker } = props;

	const classCount = useRecoilValue(classCountState);

	const studentPartWrapper1Styles = {
		width: {
			xs: '100%',
			sm: 'calc(100% - 200px)',
		},
	};

	const studentPartWrapper2Styles = {
		width: {
			xs: '100%',
			sm: 'calc(100% - 200px)',
			sm800: 'calc(100% - 400px)',
			lg: 'calc(100% - 200px)',
		},
		flexDirection: {
			sm800: 'row',
		},
	};

	const studentContainer1Styles = {
		display: 'flex',
		justifyContent: {
			xs: 'flex-start',
			sm: 'flex-end',
		},
	};

	const studentContainer2Styles = {
		display: 'flex',
		justifyContent: {
			xs: 'flex-start',
			sm: 'flex-end',
		},
		flexDirection: {
			xs: 'column',
			xs420: 'row',
			sm: 'column',
			sm800: 'row',
			lg: 'column',
		},
	};

	const loadStuPicker = (
		assID,
		assType,
		assTypeName,
		currentStudent,
		stuForAssistant,
		assTypeNameForAssistant
	) => {
		var obj = {};
		obj.assID = assID;
		obj.assType = assType;
		obj.assTypeName = assTypeName;
		obj.currentStudent = currentStudent;
		obj.stuForAssistant = stuForAssistant;
		obj.assTypeNameForAssistant = assTypeNameForAssistant;
		loadStudentPicker(obj);
	};

	return (
		<>
			{assSrc && (
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						marginBottom: '10px',
					}}
				>
					<Grid
						item
						sx={
							classCount === 1
								? studentPartWrapper1Styles
								: studentPartWrapper2Styles
						}
					>
						{assType !== 107 && (
							<Typography
								variant='body1'
								sx={{ fontWeight: 'bold', fontSize: '16px' }}
							>
								{assTypeName} ({assTime} min.)
							</Typography>
						)}
						<Typography variant='body1'>{assSrc}</Typography>
					</Grid>
					{assType !== 105 && assType !== 106 && assType !== 107 && (
						<Grid
							item
							sx={
								classCount === 1
									? studentContainer1Styles
									: studentContainer2Styles
							}
						>
							<Box sx={boxStudentAYF}>
								<Box sx={boxStudentFldContainer}>
									<Typography sx={typoStudentField} variant='body1'>
										{stuA}
									</Typography>
									{isStuA && (
										<CircularProgress
											sx={{ padding: '1px' }}
											color='secondary'
											size={26}
											disableShrink={true}
										/>
									)}
									{!isStuA && (
										<IconButton
											sx={iconButtonContainer}
											onClick={() =>
												loadStuPicker(stuAID, assType, assTypeName, stuA)
											}
										>
											<EditIcon sx={editIconButton} />
										</IconButton>
									)}
								</Box>
								{assType !== 104 && (
									<Box sx={boxStudentFldContainer}>
										<Typography sx={typoStudentField} variant='body1'>
											{assA}
										</Typography>
										{isAssA && (
											<CircularProgress
												sx={{ padding: '1px' }}
												color='secondary'
												size={26}
												disableShrink={true}
											/>
										)}
										{!isAssA && (
											<IconButton
												sx={iconButtonContainer}
												onClick={() =>
													loadStuPicker(
														assAID,
														assType,
														t('global.assistant'),
														assA,
														stuA,
														assTypeName
													)
												}
											>
												<EditIcon sx={editIconButton} />
											</IconButton>
										)}
									</Box>
								)}
							</Box>
							{classCount === 2 && (
								<Box sx={boxStudentAYF}>
									<Box sx={boxStudentFldContainer}>
										<Typography sx={typoStudentField} variant='body1'>
											{stuB}
										</Typography>
										{isStuB && (
											<CircularProgress
												sx={{ padding: '1px' }}
												color='secondary'
												size={26}
												disableShrink={true}
											/>
										)}
										{!isStuB && (
											<IconButton
												sx={iconButtonContainer}
												onClick={() =>
													loadStuPicker(stuBID, assType, assTypeName, stuB)
												}
											>
												<EditIcon sx={editIconButton} />
											</IconButton>
										)}
									</Box>
									{assType !== 104 && (
										<Box sx={boxStudentFldContainer}>
											<Typography sx={typoStudentField} variant='body1'>
												{assB}
											</Typography>
											{isAssB && (
												<CircularProgress
													sx={{ padding: '1px' }}
													color='secondary'
													size={26}
													disableShrink={true}
												/>
											)}
											{!isAssB && (
												<IconButton
													sx={iconButtonContainer}
													onClick={() =>
														loadStuPicker(
															assBID,
															assType,
															t('global.assistant'),
															assB,
															stuB,
															assTypeName
														)
													}
												>
													<EditIcon sx={editIconButton} />
												</IconButton>
											)}
										</Box>
									)}
								</Box>
							)}
						</Grid>
					)}
				</Box>
			)}
		</>
	);
};

export default StudentAYF;