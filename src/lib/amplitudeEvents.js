
export const AmplitudeEvent = {
  ADD_CLASS: 'Add a class',
  ADD_ROW: 'Add row',
  IMPORT_FILE: 'Import a file',
  ADD_COLUMN: 'Add a column',
  SAVE_CLP: 'save clp',
  SAVE_PROTECTED_FIELDS: 'save protected fields',
  EXPORT_DATA: 'Export data',
  CLOUD_CODE_ADD_NEW_FILE: 'Cloud code - create a file',
  CLOUD_CODE_CREATE_FOLDER: 'Cloud code - create a folder',
  CLOUD_CODE_DEPLOY: 'Cloud code - deploy',
  RUN_JOB: 'Job page - run a job',
  API_CONNECT: 'API connect - {}',
  PUSH_SEND_QUERY: 'Push - send query',
  EXPORT_cURL: 'REST console - export cURL',
  JS_CONSOLE_SAVE: 'JS Console - save button',
  JS_CONSOLE_RUN: 'JS Console - run button',
};

export const getPageViewName = (dashboardPage, subPage) => {
  let pageName = '';
  switch (dashboardPage) {
    case 'Browser':
    case 'Index':
    case 'Config':
    case 'Webhooks':
      break;
    case 'Cloud_code':
      pageName = 'Cloud Code'
      break;
    case 'Jobs': {
      if (subPage === 'Status') {
        pageName = 'Jobs Status'
      } pageName = 'All Jobs'
      break;
    }
    case 'Logs':
      pageName = `${dashboardPage} ${subPage}`;
      break;
    case 'Api_console':{
      pageName = `${subPage} Console`;
      if (subPage === 'Js_console') {
        pageName = 'JS Console'
      }
      break;
    }
    case 'Settings': {
      if (subPage === 'General') {
        pageName = 'General Settings'
      } else if (subPage === 'Keys') {
        pageName = 'Security & keys'
      } else {
        pageName = 'Server Settings'
      }
      break;
    }
    case 'Push': {
      if (subPage === 'New') {
        pageName = 'Send New Push'
      } else if (subPage === 'Activity') {
        pageName = 'Push Pushes all';
      } else {
        pageName = 'Push Audiences'
      }
      break;
    }
    case 'Analytics': {
      if (subPage === 'Slow_requests') {
        pageName = 'Analytics Slow requests'
      }
      break;
    }
    case 'Connections':
      pageName = 'Database hub';
      break;
    case 'connect':
      pageName = 'API Connect';
      break;
    default:
      break;
  }
  return pageName;
}
