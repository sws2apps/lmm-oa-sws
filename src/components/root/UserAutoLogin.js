import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import {
	congAccountConnectedState,
	congIDState,
	isAdminCongState,
} from '../../appStates/appCongregation';
import {
	apiHostState,
	isOnlineState,
	userEmailState,
	userIDState,
	visitorIDState,
} from '../../appStates/appSettings';

const UserAutoLogin = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const [userEmail, setUserEmail] = useRecoilState(userEmailState);
	const [visitorID, setVisitorID] = useRecoilState(visitorIDState);

	const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
	const setIsAdminCong = useSetRecoilState(isAdminCongState);
	const setCongID = useSetRecoilState(congIDState);
	const setUserID = useSetRecoilState(userIDState);

	const isOnline = useRecoilValue(isOnlineState);
	const apiHost = useRecoilValue(apiHostState);

	const checkLogin = useCallback(async () => {
		try {
			if (apiHost !== '' && userEmail !== '' && visitorID !== '') {
				const res = await fetch(`${apiHost}api/users/validate-me`, {
					signal: abortCont.signal,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						visitor_id: visitorID,
						email: userEmail,
					},
				});

				const data = await res.json();

				// congregation found
				if (res.status === 200) {
					// role admin
					if (data.cong_role.includes('admin')) {
						setIsAdminCong(true);
					}

					// role approved
					if (
						data.cong_role.includes('lmmo') ||
						data.cong_role.includes('lmmo-backup')
					) {
						setCongAccountConnected(true);
						setCongID(data.cong_id);
						setUserID(data.id);
						return;
					}

					// role disapproved
					return;
				}

				// congregation not found
				if (res.status === 404) {
					// user not authorized and delete local data
					return;
				}
			}
		} catch {}
	}, [
		apiHost,
		abortCont,
		visitorID,
		userEmail,
		setCongAccountConnected,
		setCongID,
		setIsAdminCong,
		setUserID,
	]);

	useEffect(() => {
		// get visitor ID and check if there is an active connection
		const getUserID = async () => {
			const fpPromise = FingerprintJS.load({
				apiKey: 'XwmESck7zm6PZAfspXbs',
			});

			let visitorId = '';

			do {
				const fp = await fpPromise;
				const result = await fp.get();
				visitorId = result.visitorId;
			} while (visitorId.length === 0);

			setVisitorID(visitorId);
		};

		if (isOnline) {
			getUserID();
		}
	}, [setVisitorID, isOnline]);

	useEffect(() => {
		setUserEmail(localStorage.getItem('email'));
	}, [setUserEmail]);

	useEffect(() => {
		if (isOnline) {
			checkLogin();
		} else {
			setCongAccountConnected(false);
		}
	}, [checkLogin, isOnline, setCongAccountConnected, userEmail]);

	return <></>;
};

export default UserAutoLogin;
