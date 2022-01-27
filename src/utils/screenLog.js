/* eslint-disable */
export const printANSI = () => {
  // console.clear()
  // ASCII - ANSI Shadow
  let text = `
                             _        _      _                             _           _       
                            | |      | |    | |                           | |         (_)      
  __ _ _ __  _ __ ______ ___| | _____| | ___| |_ ___  _ __ ______ __ _  __| |_ __ ___  _ _ __  
 / _\` | '_ \\| '_ \\______/ __| |/ / _ \\ |/ _ \\ __/ _ \\| '_ \\______/ _\` |/ _\` | '_ \` _ \\| | '_ \\ 
| (_| | |_) | |_) |     \\__ \\   <  __/ |  __/ || (_) | | | |    | (_| | (_| | | | | | | | | | |
 \\__,_| .__/| .__/      |___/_|\\_\\___|_|\\___|\\__\\___/|_| |_|     \\__,_|\\__,_|_| |_| |_|_|_| |_|
      | |   | |                                                                                
      |_|   |_|                                                                                

\t\t\t\t\tPublished ${APP_VERSION}-${GIT_HASH} @ https://app-skeleton.imadc.cn
\t\t\t\t\tBuild date: ${BUILD_DATE}`
  console.log(`%c${text}`, 'color: #fc4d50')
}
