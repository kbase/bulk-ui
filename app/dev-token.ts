// This "token" (kbase_session) should be in the exact format given by
// narrative.kbase.us, not the auth service.  The string contains an additional "un=",
// "kbase_essionid" and has special encoding
//
// Note: This token will not be used unless "productionMode" in app/service-config.ts
// is set to false.

export const token = 'Copy and paste the value from "kbase_session" here.'