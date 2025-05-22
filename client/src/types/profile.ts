export interface IUploadUserAvatarFx {
  jwt: string;
  formData: FormData;
}

interface IBaseEditUser {
  jwt: string;
  setEdit: (arg0: boolean) => void;
}

export interface IEditLoginFx extends IBaseEditUser {
  login: string;
}

export interface IEditPasswordFx extends IBaseEditUser {
  oldPassword: string;
  newPassword: string;
}

export interface IEditEmailFx extends IBaseEditUser {
  email: string;
}

export interface IEditFullnameFx extends IBaseEditUser {
  fullname: string;
}

export interface IEditBirthdateFx extends IBaseEditUser {
  birthdate: string;
}

export interface IEditPhoneFx extends IBaseEditUser {
  phone: string;
}

export interface IDeleteUserFx extends IBaseEditUser {
  login: string;
}

// export interface IVerifyEmailFx {
//   jwt: string;
//   email: string;
// }

// export interface IVerifyCodeFx {
//   code: number;
//   jwt: string;
//   codeId: string;
// }

// export interface IProfileInfoActionsProps {
//   spinner: boolean;
//   handleSaveInfo: VoidFunction;
//   disabled: boolean;
//   handleCancelEdit: VoidFunction;
// }

// export interface IProfileInfoBlockProps {
//   allowEdit: VoidFunction;
//   text: string;
// }

// export interface ICodeInputProps {
//   processInput: (arg0: React.ChangeEvent<HTMLInputElement>, arg1: number) => void;
//   onKeyUp: (arg0: React.KeyboardEvent<HTMLInputElement>, arg1: number) => void;
//   index: number;
//   handlePushCurrentInput: (arg0: HTMLInputElement) => void;
//   num: string;
//   autoFocus: boolean;
// }

// export interface IDeleteUserFx {
//   jwt: string;
//   id: string;
//   handleLogout: VoidFunction;
// }
