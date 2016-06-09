// This "token" (kbase_session) should be in the exact format given by
// narrative.kbase.us, not the auth service.  The string contains an additional "un=",
// "kbase_sessionid=" and has special encoding
//
// Note: This token will not be used unless "productionMode" in app/service-config.ts
// is set to false.

export const token = "place kbase_session cookie here"