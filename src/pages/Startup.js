import { useRecoilValue } from 'recoil';
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
import {
	isCongAccountCreateState,
	isCongRequestSentState,
	isCongWaitRequestState,
	isEmailBlockedState,
	isEmailNotVerifiedState,
	isSetupState,
	isShowTermsUseState,
	isUnauthorizedRoleState,
	isUserMfaSetupState,
	isUserMfaVerifyState,
	isUserSignInState,
	isUserSignUpState,
} from '../appStates/appSettings';

const Startup = () => {
	const isSetup = useRecoilValue(isSetupState);
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
			<div className='app-logo-container'>
				<img src='/img/appLogo.png' alt='App logo' className='appLogo' />
			</div>
			<CircularProgress />
		</div>
	);
};

export default Startup;
