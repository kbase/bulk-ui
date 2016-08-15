export const config = {
    endpoints: {
        njs: "https://ci.kbase.us/services/njs_wrapper",
        ujs: "https://ci.kbase.us/services/userandjobstate",
        ws: "https://ci.kbase.us/services/ws",                   // workspace service
        ftpApi: "https://ci.kbase.us/services/kb-ftp-api/v0"
    },
    loginUrl: "https://narrative.kbase.us/#login",
    narrativeUrl: "https://narrative-ci.kbase.us/narrative",
    contactUrl: "http://kbase.us/contact-us/",
    // true: token will be parsed from cookie
    // false: token be parsed from app/dev-token.ts and stored in cookie
    productionMode: true
}