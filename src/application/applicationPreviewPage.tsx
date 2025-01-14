import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { Button, Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Navigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-grid-system';

import { RootState } from '../root/rootReducer';
import { prepareApplicationForSubmission } from './helpers';
import { submitApplication } from './actions';
import {
  ApplicationField,
  ApplicationFormNode,
  ApplicationFormRoot,
  ApplicationSectionKeys,
  ApplicationSubmission,
  FieldTypeMapping,
  SupportedFieldTypes,
  UploadedFileMeta,
} from './types';
import { AppRoutes, getRouteById } from '../root/routes';
import { getPlotSearchFromFavourites } from '../favourites/helpers';
import { Favourite } from '../favourites/types';
import { FormField, FormSection, PlotSearch } from '../plotSearch/types';
import AuthDependentContent from '../auth/components/authDependentContent';
import BlockLoader from '../loader/blockLoader';
import ApplicationTargetList from './components/applicationTargetList';
import { getFieldTypeMapping } from './selectors';
import MainContentElement from '../a11y/MainContentElement';

interface State {
  favourite: Favourite;
  relevantPlotSearch: PlotSearch | null;
  isFetchingFormAttributes: boolean;
  isFetchingPlotSearches: boolean;
  isSubmitting: boolean;
  submittedAnswerId: number;
  formValues: ApplicationFormRoot;
  fieldTypeMapping: FieldTypeMapping;
  pendingUploads: Array<UploadedFileMeta>;
  lastError: unknown;
}

interface Props {
  favourite: Favourite;
  relevantPlotSearch: PlotSearch | null;
  isFetchingFormAttributes: boolean;
  isFetchingPlotSearches: boolean;
  isSubmitting: boolean;
  submitApplication: (data: ApplicationSubmission) => void;
  submittedAnswerId: number;
  formValues: ApplicationFormRoot;
  fieldTypeMapping: FieldTypeMapping;
  pendingUploads: Array<UploadedFileMeta>;
  lastError: unknown;
}

interface ApplicationPreviewSubsectionProps {
  section: FormSection;
  answers?: ApplicationFormNode | Array<ApplicationFormNode>;
  headerTag?: React.ElementType;
}

const ApplicationPreviewPage = ({
  isSubmitting,
  submitApplication,
  submittedAnswerId,
  formValues,
  relevantPlotSearch,
  fieldTypeMapping,
  pendingUploads,
  lastError,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [previousAnswerId] = useState<number>(submittedAnswerId);

  const submit = () => submitApplication(prepareApplicationForSubmission());

  const renderSubsectionFields = (
    sectionFields: Array<FormField>,
    sectionAnswers: Record<string, ApplicationField>
  ): JSX.Element => {
    return (
      <dl className="ApplicationPreviewPage__subsection-fields">
        {sectionFields.map((field) => {
          const value = sectionAnswers[field.identifier]?.value;
          let displayValue = '' + value;
          switch (fieldTypeMapping[field.type]) {
            case SupportedFieldTypes.TextField:
            case SupportedFieldTypes.TextArea:
              // plain text with no special handling
              break;
            case SupportedFieldTypes.SelectField:
            case SupportedFieldTypes.RadioButton:
            case SupportedFieldTypes.RadioButtonInline:
              {
                if (!value) {
                  displayValue = '-';
                  break;
                }

                const optionItem = field.choices.find(
                  (choice) => choice.value === value
                );
                if (optionItem) {
                  displayValue = optionItem.text;
                  if (optionItem.has_text_input) {
                    displayValue += ` (${
                      sectionAnswers[field.identifier]?.extraValue
                    })`;
                  }
                } else {
                  // should not happen
                  displayValue = '?';
                }
              }
              break;
            case SupportedFieldTypes.Checkbox:
              if (Array.isArray(value)) {
                if (value.length === 0) {
                  displayValue = '-';
                  break;
                }

                displayValue = value
                  .map((singleValue) => {
                    const optionItem = field.choices.find(
                      (choice) => choice.value === singleValue
                    );
                    let optionText;
                    if (optionItem) {
                      optionText = optionItem.text;
                      if (optionItem.has_text_input) {
                        optionText += ` (${
                          sectionAnswers[field.identifier]?.extraValue
                        })`;
                      }
                    } else {
                      // should not happen
                      optionText = '?';
                    }

                    return optionText;
                  })
                  .join(', ');
              } else {
                displayValue = (
                  value
                    ? t('application.preview.booleanYes', 'Yes')
                    : t('application.preview.booleanNo', 'No')
                ) as string;
              }
              break;
            case SupportedFieldTypes.FileUpload:
              displayValue = pendingUploads
                .filter((upload) => upload.field === field.id)
                .map(
                  (file, i) =>
                    `${t(
                      'application.preview.attachmentNo',
                      'Attachment #{{number}}',
                      {
                        number: i + 1,
                      }
                    )} (${file.name})`
                )
                .join(', ');
              break;
            default:
              // treat unknown types as plain text
              break;
          }

          return (
            <Row
              key={field.id}
              className="ApplicationPreviewPage__subsection-field"
            >
              <Col component="dt" xs={4}>
                {field.label}
              </Col>
              <Col component="dd" xs={8}>
                {displayValue || '-'}
              </Col>
            </Row>
          );
        })}
      </dl>
    );
  };

  const renderSubsection = ({
    answers,
    section,
    headerTag: HeaderTag = 'h3',
  }: ApplicationPreviewSubsectionProps): JSX.Element => {
    const isArray = section.add_new_allowed;

    return (
      <div className="ApplicationPreviewPage__subsection">
        {isArray ? (
          <>
            {(answers as Array<ApplicationFormNode>).map((answer, i) => (
              <div key={i}>
                <HeaderTag>
                  {section.title} ({i + 1})
                </HeaderTag>
                <div className="ApplicationPreviewPage__subsection-content">
                  {renderSubsectionFields(
                    section.fields,
                    answer[ApplicationSectionKeys.Fields]
                  )}
                  {section.subsections.map((subsection) =>
                    renderSubsection({
                      section: subsection,
                      answers:
                        answer[ApplicationSectionKeys.Subsections][
                          subsection.identifier
                        ],
                    })
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <HeaderTag>{section.title}</HeaderTag>
            <div className="ApplicationPreviewPage__subsection-content">
              {renderSubsectionFields(
                section.fields,
                (answers as ApplicationFormNode)[ApplicationSectionKeys.Fields]
              )}
              {section.subsections.map((subsection) =>
                renderSubsection({
                  section: subsection,
                  answers: (answers as ApplicationFormNode)[
                    ApplicationSectionKeys.Subsections
                  ][subsection.identifier],
                })
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (submittedAnswerId !== previousAnswerId) {
      navigate(getRouteById(AppRoutes.APPLICATION_SUBMIT));
    }
  }, [submittedAnswerId]);

  return (
    <AuthDependentContent>
      {(loading, loggedIn) => (
        <MainContentElement className="ApplicationPreviewPage">
          <Container>
            <h1>
              {t('application.preview.heading', 'Plot application preview')}
            </h1>
            <ApplicationTargetList />

            {loading ? (
              <BlockLoader />
            ) : (
              <div className="ApplicationPreviewPage__top-level-sections">
                {/* these should already be loaded if we came from the first page; this page shouldn't be navigated to directly */}
                {loggedIn && relevantPlotSearch && pendingUploads ? (
                  relevantPlotSearch.form.sections.map((section) =>
                    renderSubsection({
                      section,
                      answers:
                        formValues[ApplicationSectionKeys.Subsections][
                          section.identifier
                        ],
                      headerTag: 'h2',
                    })
                  )
                ) : (
                  <Navigate
                    replace
                    to={getRouteById(AppRoutes.APPLICATION_FORM)}
                  />
                )}
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate(getRouteById(AppRoutes.APPLICATION_FORM))
                  }
                  disabled={isSubmitting}
                  className="ApplicationPreviewPage__submission-button"
                >
                  {t('application.returnToForm', 'Edit application')}
                </Button>
                <Button
                  variant="primary"
                  onClick={submit}
                  isLoading={isSubmitting}
                  loadingText={t(
                    'application.submitInProcess',
                    'Submitting...'
                  )}
                  className="ApplicationPreviewPage__submission-button"
                >
                  {t('application.submit', 'Submit application')}
                </Button>
                {lastError && (
                  <Notification
                    size="small"
                    type="error"
                    label={t('application.error.label', 'Submission error')}
                  >
                    {t(
                      'application.error.generic',
                      'The application could not be submitted correctly. Please try again later.'
                    )}
                  </Notification>
                )}
              </div>
            )}
          </Container>
        </MainContentElement>
      )}
    </AuthDependentContent>
  );
};

export default connect(
  (state: RootState): State => ({
    formValues: getFormValues('application')(state) as ApplicationFormRoot,
    isSubmitting: state.application.isSubmittingApplication,
    submittedAnswerId: state.application.submittedAnswerId,
    favourite: state.favourite.favourite,
    relevantPlotSearch: getPlotSearchFromFavourites(state),
    isFetchingPlotSearches: state.plotSearch.isFetchingPlotSearches,
    isFetchingFormAttributes: state.application.isFetchingFormAttributes,
    fieldTypeMapping: getFieldTypeMapping(state),
    pendingUploads: state.application.pendingUploads,
    lastError: state.application.lastError,
  }),
  {
    submitApplication,
  }
)(ApplicationPreviewPage);
