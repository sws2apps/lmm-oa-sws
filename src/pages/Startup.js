import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import CongregationRequestSent from '../components/startup/CongregationRequestSent';
import CongregationSignUp from '../components/startup/CongregationSignUp';
import CongregationWait from '../components/startup/CongregationWait';
import EmailBlocked from '../components/startup/EmailBlocked';
import EmailNotVerified from '../components/startup/EmailNotVerified';
import TermsUse from '../components/startup/TermsUse';
import UnauthorizedRole from '../components/startup/UnauthorizedRole';
import UserMfaSetup from '../components/startup/UserMfaSetup';
import UserMfaVerify from '../components/startup/UserMfaVerify';
import UserSignIn from '../components/startup/UserSignIn';
import UserSignUp from '../components/startup/UserSignUp';
import { initAppDb, initBackupDb, isDbExist } from '../indexedDb/dbUtility';
import {
	checkSrcUpdate,
	dbGetListWeekType,
	dbGetYearList,
} from '../indexedDb/dbSourceMaterial';
import {
	dbGetAppSettings,
	dbUpdateAppSettings,
} from '../indexedDb/dbAppSettings';
import {
	classCountState,
	congIDState,
	congNameState,
	congNumberState,
	congPasswordState,
	liveClassState,
	meetingDayState,
} from '../appStates/appCongregation';
import {
	appLangState,
	isAppLoadState,
	isCongAccountCreateState,
	isCongConnectedState,
	isCongRequestSentState,
	isCongWaitRequestState,
	isEmailBlockedState,
	isEmailNotVerifiedState,
	isShowTermsUseState,
	isUnauthorizedRoleState,
	isUserLoggedState,
	isUserMfaSetupState,
	isUserMfaVerifyState,
	isUserSignInState,
	isUserSignUpState,
	uidUserState,
} from '../appStates/appSettings';
import {
	assTypeListState,
	weekTypeListState,
	yearsListState,
} from '../appStates/appSourceMaterial';
import {
	allStudentsState,
	filteredStudentsState,
} from '../appStates/appStudents';
import { dbGetStudents } from '../indexedDb/dbPersons';
import { dbGetListAssType } from '../indexedDb/dbAssignment';

const Startup = () => {
	const { i18n } = useTranslation();

	const [isSetup, setIsSetup] = useState(false);

	const [congName, setCongName] = useRecoilState(congNameState);
	const [congNumber, setCongNumber] = useRecoilState(congNumberState);
	const [meetingDay, setMeetingDay] = useRecoilState(meetingDayState);
	const [classCount, setClassCount] = useRecoilState(classCountState);

	const setCongID = useSetRecoilState(congIDState);
	const setAppLang = useSetRecoilState(appLangState);
	const setIsAppLoad = useSetRecoilState(isAppLoadState);
	const setDbStudents = useSetRecoilState(allStudentsState);
	const setStudents = useSetRecoilState(filteredStudentsState);
	const setYearsList = useSetRecoilState(yearsListState);
	const setAssTypeList = useSetRecoilState(assTypeListState);
	const setWeekTypeList = useSetRecoilState(weekTypeListState);
	const setLiveClass = useSetRecoilState(liveClassState);
	const setIsConnected = useSetRecoilState(isCongConnectedState);
	const setUidUser = useSetRecoilState(uidUserState);
	const setIsUserLogged = useSetRecoilState(isUserLoggedState);
	const setCongPassword = useSetRecoilState(congPasswordState);

	const isUserMfaSetup = useRecoilValue(isUserMfaSetupState);
	const isUserMfaVerify = useRecoilValue(isUserMfaVerifyState);
	const isUserSignIn = useRecoilValue(isUserSignInState);
	const isUserSignUp = useRecoilValue(isUserSignUpState);
	const isEmailBlocked = useRecoilValue(isEmailBlockedState);
	const isEmailNotVerified = useRecoilValue(isEmailNotVerifiedState);
	const isCongAccountCreate = useRecoilValue(isCongAccountCreateState);
	const isCongRequestSent = useRecoilValue(isCongRequestSentState);
	const isCongWaitRequest = useRecoilValue(isCongWaitRequestState);
	const isShowTermsUse = useRecoilValue(isShowTermsUseState);
	const isUnauthorizedRole = useRecoilValue(isUnauthorizedRoleState);

	const handleDbInit = async () => {
		setIsSetup(false);
		await initBackupDb();
		await initAppDb();
		var obj = {};
		obj.cong_name = congName;
		obj.cong_number = congNumber;
		obj.class_count = classCount;
		obj.meeting_day = meetingDay;
		obj.liveEventClass = false;
		await dbUpdateAppSettings(obj);

		await checkSrcUpdate();
		setTimeout(() => {
			setIsAppLoad(false);
		}, 1000);
	};

	useEffect(() => {
		const isExist = async () => {
			const isDataExist = await isDbExist('lmm_oa');
			if (isDataExist) {
				await initAppDb();

				// save settings
				let obj = {};
				obj.isScheduleConverted = true;
				await dbUpdateAppSettings(obj);

				let {
					cong_number,
					cong_name,
					class_count,
					meeting_day,
					cong_id,
					app_lang,
					liveEventClass,
					isCongVerified,
				} = await dbGetAppSettings();

				setAppLang(app_lang || 'e');

				if (isCongVerified) {
					setIsSetup(false);
					await initBackupDb();
					await checkSrcUpdate();

					setCongNumber(cong_number);
					setCongName(cong_name);
					setClassCount(class_count);
					setMeetingDay(meeting_day);
					setCongID(+cong_id || '');
					setLiveClass(liveEventClass);

					i18n.changeLanguage(app_lang);

					const weekTypeList = await dbGetListWeekType();
					setWeekTypeList(weekTypeList);

					const assTypeList = await dbGetListAssType();
					setAssTypeList(assTypeList);

					const data = await dbGetStudents();
					setDbStudents(data);
					setStudents(data);

					const years = await dbGetYearList();
					setYearsList(years);

					setTimeout(() => {
						setIsAppLoad(false);
					}, 1000);
				} else {
					setIsSetup(true);
				}
			} else {
				setIsSetup(true);
			}
		};

		isExist();

		return () => {
			//clean up
		};
	}, [
		i18n,
		setIsAppLoad,
		setClassCount,
		setCongID,
		setCongName,
		setCongNumber,
		setLiveClass,
		setMeetingDay,
		setAppLang,
		setDbStudents,
		setStudents,
		setYearsList,
		setAssTypeList,
		setWeekTypeList,
		setIsConnected,
		setUidUser,
		setIsUserLogged,
		setCongPassword,
	]);

	if (isSetup) {
		return (
			<>
				{isShowTermsUse && <TermsUse />}
				{!isShowTermsUse && (
					<>
						{isUserSignIn && <UserSignIn />}
						{isUserSignUp && <UserSignUp />}
						{isEmailNotVerified && <EmailNotVerified />}
						{isEmailBlocked && <EmailBlocked />}
						{isUserMfaSetup && <UserMfaSetup />}
						{isUserMfaVerify && <UserMfaVerify />}
						{isUnauthorizedRole && <UnauthorizedRole />}
						{isCongAccountCreate && <CongregationSignUp />}
						{isCongRequestSent && <CongregationRequestSent />}
						{isCongWaitRequest && <CongregationWait />}
					</>
				)}
			</>
		);
	}

	return (
		<div className='app-splash-screen'>
			<div className='app-logo-container' onClick={handleDbInit}>
				<img src='/img/appLogo.png' alt='App logo' className='appLogo' />
			</div>
			<CircularProgress />
		</div>
	);
};

export default Startup;
