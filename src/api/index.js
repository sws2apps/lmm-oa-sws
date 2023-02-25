export const {
  apiSendAuthorization,
  apiHandleVerifyOTP,
  apiRequestPasswordlesssLink,
  apiUpdatePasswordlessInfo,
  apiPocketSignUp,
  apiPocketValidate,
  apiFetchPocketSessions,
  apiPocketDeviceDelete,
} = await import('./auth.js');
