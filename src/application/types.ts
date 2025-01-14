import { WrappedFieldProps } from 'redux-form';

import { ApiAttributes } from '../api/types';
import { FormField } from '../plotSearch/types';

export type NestedFieldLeaf = string | number | boolean | null;

// A type definition cannot contain circular references, but an interface definition can,
// thus this is implemented this way.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NestedField
  extends Record<string, NestedFieldLeaf | NestedField | Array<NestedField>> {}

export type FieldTypeMapping = Record<number, string>;

export enum SupportedFieldTypes {
  TextField = 'textbox',
  TextArea = 'textarea',
  SelectField = 'dropdown',
  Checkbox = 'checkbox',
  RadioButton = 'radiobutton',
  RadioButtonInline = 'radiobuttoninline',
  FileUpload = 'uploadfiles',
}

export type FieldValue =
  | Array<string | number | boolean>
  | string
  | number
  | boolean
  | null;
export type FieldRendererProps = WrappedFieldProps & {
  id: string;
  field: FormField;
  setValues: (newValues: {
    value?: FieldValue;
    extraValue?: FieldValue;
  }) => void;
  fieldType: SupportedFieldTypes | null;
};

export enum ApplicationSectionKeys {
  Subsections = 'sections',
  Fields = 'fields',
}

export type ApplicationSubmission = {
  targets: Array<number>;
  form: number;
  entries: NestedField;
  attachments: Array<number>;
};

export type UploadedFileMeta = {
  id: number;
  attachment: string;
  name: string;
  field: number;
  created_at: string;
  answer: number | null;
};

export const FETCH_FORM_ATTRIBUTES = 'application/FETCH_FORM_ATTRIBUTES';
export interface FetchFormAttributesAction {
  type: typeof FETCH_FORM_ATTRIBUTES;
}

export const RECEIVE_FORM_ATTRIBUTES = 'application/RECEIVE_FORM_ATTRIBUTES';
export interface ReceiveFormAttributesAction {
  type: typeof RECEIVE_FORM_ATTRIBUTES;
  payload: ApiAttributes;
}

export const FORM_ATTRIBUTES_NOT_FOUND =
  'application/FORM_ATTRIBUTES_NOT_FOUND';
export interface FormAttributesNotFoundAction {
  type: typeof FORM_ATTRIBUTES_NOT_FOUND;
}

export const SUBMIT_APPLICATION = 'application/SUBMIT_APPLICATION';
export interface SubmitApplicationAction {
  type: typeof SUBMIT_APPLICATION;
  payload: ApplicationSubmission;
}

export const RECEIVE_APPLICATION_SAVED =
  'application/RECEIVE_APPLICATION_SAVED';
export interface ReceiveApplicationSavedAction {
  type: typeof RECEIVE_APPLICATION_SAVED;
  payload: number;
}
export const APPLICATION_SUBMISSION_FAILED =
  'application/APPLICATION_SUBMISSION_FAILED';
export interface ApplicationSubmissionFailedAction {
  type: typeof APPLICATION_SUBMISSION_FAILED;
  payload: Error;
}

export const RESET_LAST_APPLICATION_SUBMISSION_ERROR =
  'application/RESET_LAST_APPLICATION_SUBMISSION_ERROR';
export interface ResetLastApplicationSubmissionErrorAction {
  type: typeof RESET_LAST_APPLICATION_SUBMISSION_ERROR;
}

export const FETCH_PENDING_UPLOADS = 'application/FETCH_PENDING_UPLOADS';
export interface FetchPendingUploadsAction {
  type: typeof FETCH_PENDING_UPLOADS;
}

export const RECEIVE_PENDING_UPLOADS = 'application/RECEIVE_PENDING_UPLOADS';
export interface ReceivePendingUploadsAction {
  type: typeof RECEIVE_PENDING_UPLOADS;
  payload: Array<UploadedFileMeta>;
}

export const PENDING_UPLOADS_NOT_FOUND =
  'application/PENDING_UPLOADS_NOT_FOUND';
export interface PendingUploadsNotFoundAction {
  type: typeof PENDING_UPLOADS_NOT_FOUND;
}

export const DELETE_UPLOAD = 'application/DELETE_UPLOAD';
export interface DeleteUploadAction {
  type: typeof DELETE_UPLOAD;
  payload: number;
}

export const UPLOAD_FILE = 'application/UPLOAD_FILE';
export interface UploadFileAction {
  type: typeof UPLOAD_FILE;
  payload: {
    field: number;
    file: File;
  };
}

export const FILE_OPERATION_FINISHED = 'application/FILE_OPERATION_FINISHED';
export interface FileOperationFinishedAction {
  type: typeof FILE_OPERATION_FINISHED;
}

export const APPLICATION_FORM_NAME = 'application';

export type ApplicationField = {
  value: NestedFieldLeaf;
  extraValue: NestedFieldLeaf;
};

export type ApplicationFormNode = {
  fields: Record<string, ApplicationField>;
  sections:
    | Record<string, ApplicationFormNode>
    | Record<string, Array<ApplicationFormNode>>;
};

export type ApplicationFormRoot = {
  sections: Record<string, ApplicationFormNode>;
  sectionTemplates: Record<string, NestedField>;
  fileFieldIds: Array<number>;
};
