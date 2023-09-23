import { LocaleCommonMessages } from '@/locales/type/common/messages';

export const messages: LocaleCommonMessages = {
  success: {
    login: 'Login successfully',
    logout: 'Logout successfully',
    oauthUnlink: 'Unlink provider successfully',
    updatePassword: 'Password has been changed',
    verifyEmail: 'Verification mail has been sent',
    updateEmail: 'Email has been changed, a verification mail has been sent',
    changeUserRoles: "User {username}'s role change was successful",
    createRole: 'Create role completed',
    updateRole: 'Update role completed',
    deleteRole: 'Delete role completed',
  },
  info: {
    test: 'Test',
  },
  warning: {
    defaultData: "Cann't change default data",
    noChange: 'Sorting remains unchanged',
    unsupportedFileType: 'Unsupported file type',
    fileExceededLimit: 'File exceeds the ${size} limit',
    requestVeriyEmail:
      'The account do not have an email or it already verification',
  },
  error: {
    unknown: 'Unknown Error',
    notFound: 'Not found',
    notFoundEntity: 'Not found {entity}({id})',
    unauthenticated: 'Unauthenticated',
    unauthorized: 'Unauthorized',
    accessDenined: 'Access Denined',
    badQuery: 'Bad Request Query',
    badDto: 'Bad Request Data',
    argument: 'Bad Argument',
    prisma: 'Database Storage Error',
    invalidDateFromTo:
      'The field from date must less than or equal to the field to date',
    changeSort: 'Sort is greater than max sort',
    filesUpload:
      'File(s) upload has failed. Please review the uploaded file(s) or try again',
    filesDownload:
      'File(s) download has failed. Please review the downloaded file(s) or try again',
    filesDelete: 'File(s) delete has failed. Please try again',
    refreshToken:
      'The refresh token provided is invalid or has expired. Please log in again to generate a new refresh token',
    verificationToken:
      'This verification token is invalid or has already been used. Please request a new one if you need to verify your account again',
    forgotPassword: "Not found username or account's email isn't verified",
    sameEmailAddressProvided: 'Same email address provided',
    currentPassword:
      'Current password does not match. Please enter the correct password',
    changeUserRoles: 'Invalid input role(s)',
    notFoundToken: 'Not found token in request',
    oauthServer: 'Unable to link provider',
    providerAlreadyLinked: 'This provider is already linked',
    notRoomMember: '{username} not in room',
    privateRoomDeclare: 'Invalid private room declare',
    groupRoomDeclare: 'Invalid group room declare',
  },
};
