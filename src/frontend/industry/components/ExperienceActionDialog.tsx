// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { FormEvent, useEffect, useRef, useState } from 'react';
import { CypressFields } from '../../utils/enums/CypressFields';
import { useIndustry } from '../IndustryProvider';
import { recordIndustryEvent, withIndustrySpan } from '../telemetry';
import ApiGateway from '../../gateways/Api.gateway';
import * as S from './IndustryExperience.styled';

type FieldDefinition = {
  label: string;
  name: string;
  type?: 'date' | 'email' | 'number' | 'text' | 'textarea';
  defaultValue?: string;
  options?: string[];
  placeholder?: string;
};

type WorkflowDefinition = {
  actionId: string;
  description: string;
  fields: FieldDefinition[];
  submitLabel: string;
  successBody: string;
  successTitle: string;
  title: string;
};

function relativeIsoDate(daysFromToday: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

const workflows: Record<string, WorkflowDefinition> = {
  'Move money': {
    actionId: 'move_money',
    title: 'Move money',
    description: 'Schedule a transfer between your Harbor accounts.',
    fields: [
      { label: 'From account', name: 'from', options: ['Everyday checking · $8,420.16', 'Reserve savings · $24,805.40'] },
      { label: 'To account', name: 'to', options: ['Reserve savings · $24,805.40', 'Everyday checking · $8,420.16'] },
      { label: 'Amount', name: 'amount', type: 'number', defaultValue: '250.00' },
    ],
    submitLabel: 'Schedule transfer',
    successTitle: 'Transfer scheduled',
    successBody: 'The demo transfer is now reflected in this guided session. No real funds were moved.',
  },
  'Manage cards': {
    actionId: 'manage_cards',
    title: 'Manage card controls',
    description: 'Update a common card setting without leaving the account overview.',
    fields: [
      { label: 'Card', name: 'card', options: ['Harbor Rewards ·•••• 2048'] },
      { label: 'Control', name: 'control', options: ['Lock card', 'Unlock card', 'Set travel notice'] },
      { label: 'Effective date', name: 'date', type: 'date', defaultValue: relativeIsoDate(1) },
    ],
    submitLabel: 'Save card setting',
    successTitle: 'Card setting saved',
    successBody: 'The selected control was saved for this demo session.',
  },
  'Deposit a check': {
    actionId: 'deposit_check',
    title: 'Prepare a mobile deposit',
    description: 'Enter the deposit details before capturing the fictional check images.',
    fields: [
      { label: 'Deposit to', name: 'account', options: ['Everyday checking ·•••• 4812', 'Reserve savings ·•••• 9031'] },
      { label: 'Check amount', name: 'amount', type: 'number', defaultValue: '425.00' },
    ],
    submitLabel: 'Prepare deposit',
    successTitle: 'Deposit prepared',
    successBody: 'The demo deposit is ready for image capture. No real check was submitted.',
  },
  'Schedule a visit': {
    actionId: 'schedule_visit',
    title: 'Schedule a visit',
    description: 'Choose a care option and request a convenient appointment.',
    fields: [
      { label: 'Visit type', name: 'visit', options: ['Annual wellness visit', 'Follow-up visit', 'Physical therapy'] },
      { label: 'Clinician', name: 'clinician', options: ['Dr. Maya Chen', 'First available clinician'] },
      { label: 'Preferred date', name: 'date', type: 'date', defaultValue: relativeIsoDate(9) },
    ],
    submitLabel: 'Request appointment',
    successTitle: 'Appointment requested',
    successBody: 'Willow Health received the fictional request for this demo session.',
  },
  'Message care team': {
    actionId: 'message_care_team',
    title: 'Message your care team',
    description: 'Send a secure demo message to a member of the fictional care team.',
    fields: [
      { label: 'Recipient', name: 'recipient', options: ['Dr. Maya Chen', 'Jordan Rivera, PT', 'Billing support'] },
      { label: 'Message', name: 'message', type: 'textarea', placeholder: 'Ask a scheduling or care question…' },
    ],
    submitLabel: 'Send secure message',
    successTitle: 'Message sent',
    successBody: 'The demo message was added to this session. Do not enter real health information.',
  },
  'Health records': {
    actionId: 'view_health_records',
    title: 'Find a health record',
    description: 'Retrieve a fictional result or visit document.',
    fields: [
      { label: 'Record type', name: 'record', options: ['Recent lab results', 'Visit summary', 'Imaging report'] },
      { label: 'Date range', name: 'range', options: ['Past 30 days', 'Past 6 months', 'Past year'] },
    ],
    submitLabel: 'Find records',
    successTitle: 'Records ready',
    successBody: 'Three fictional documents are ready to review in this demo session.',
  },
  'Start a claim': {
    actionId: 'start_claim',
    title: 'Start a claim',
    description: 'Capture the first details for a guided claim draft.',
    fields: [
      { label: 'Policy', name: 'policy', options: ['Auto · EM-4821', 'Home · EM-1938'] },
      { label: 'What happened?', name: 'incident', options: ['Vehicle damage', 'Roadside incident', 'Property damage'] },
      { label: 'Incident date', name: 'date', type: 'date', defaultValue: relativeIsoDate(-1) },
    ],
    submitLabel: 'Create claim draft',
    successTitle: 'Claim draft created',
    successBody: 'A fictional claim draft was created. No coverage decision or real claim was submitted.',
  },
  'Policy documents': {
    actionId: 'policy_documents',
    title: 'Policy documents',
    description: 'Locate a document from one of the fictional policies.',
    fields: [
      { label: 'Policy', name: 'policy', options: ['Auto · EM-4821', 'Home · EM-1938'] },
      { label: 'Document', name: 'document', options: ['Insurance ID card', 'Coverage summary', 'Renewal notice'] },
    ],
    submitLabel: 'Open document',
    successTitle: 'Document ready',
    successBody: 'The requested fictional policy document is ready for the presenter walkthrough.',
  },
  'Talk to an advisor': {
    actionId: 'talk_to_advisor',
    title: 'Talk to an advisor',
    description: 'Request a short conversation about a policy or claim.',
    fields: [
      { label: 'Topic', name: 'topic', options: ['Review my coverage', 'Renewal question', 'Claims help'] },
      { label: 'Contact email', name: 'email', type: 'email', defaultValue: 'taylor@example.test' },
      { label: 'Preferred time', name: 'time', options: ['Today · 4:30 PM', 'Tomorrow · 9:00 AM', 'Tomorrow · 1:30 PM'] },
    ],
    submitLabel: 'Request a call',
    successTitle: 'Call requested',
    successBody: 'A fictional advisor request was scheduled for this demo session.',
  },
  'Search stays': {
    actionId: 'search_stays',
    title: 'Search stays',
    description: 'Try a compact lodging search alongside the primary flight workflow.',
    fields: [
      { label: 'Destination', name: 'destination', defaultValue: 'San Francisco, CA' },
      { label: 'Check in', name: 'checkin', type: 'date', defaultValue: relativeIsoDate(14) },
      { label: 'Check out', name: 'checkout', type: 'date', defaultValue: relativeIsoDate(21) },
      { label: 'Guests', name: 'guests', options: ['1 guest', '2 guests', '2 guests · 1 room'] },
    ],
    submitLabel: 'Search stays',
    successTitle: 'Four stays found',
    successBody: 'The demo lodging search completed. Return to flights to continue the backend-connected booking journey.',
  },
  'Search cars': {
    actionId: 'search_cars',
    title: 'Search rental cars',
    description: 'Prepare a short rental search for the destination airport.',
    fields: [
      { label: 'Pickup location', name: 'pickup', defaultValue: 'San Francisco International (SFO)' },
      { label: 'Pickup date', name: 'pickupDate', type: 'date', defaultValue: relativeIsoDate(14) },
      { label: 'Return date', name: 'returnDate', type: 'date', defaultValue: relativeIsoDate(21) },
      { label: 'Vehicle type', name: 'vehicle', options: ['Any vehicle', 'Compact', 'SUV'] },
    ],
    submitLabel: 'Search cars',
    successTitle: 'Three cars found',
    successBody: 'The deterministic rental search completed for this demo session.',
  },
  'Contact support': {
    actionId: 'contact_support',
    title: 'Contact Harbor support',
    description: 'Start a secure support request from the banking portal.',
    fields: [
      { label: 'Topic', name: 'topic', options: ['Account question', 'Payment help', 'Card support'] },
      { label: 'Message', name: 'message', type: 'textarea', placeholder: 'How can the support team help?' },
    ],
    submitLabel: 'Send support request',
    successTitle: 'Support request sent',
    successBody: 'A fictional secure support request was created for this demo session.',
  },
  'Get patient support': {
    actionId: 'patient_support',
    title: 'Patient support',
    description: 'Route a scheduling, billing, or records question.',
    fields: [
      { label: 'Topic', name: 'topic', options: ['Scheduling', 'Billing', 'Medical records'] },
      { label: 'Message', name: 'message', type: 'textarea', placeholder: 'Enter a fictional support question…' },
    ],
    submitLabel: 'Send request',
    successTitle: 'Request sent',
    successBody: 'The fictional patient-support request was created. Do not enter real health information.',
  },
  'View claims center': {
    actionId: 'claims_center',
    title: 'Claims center',
    description: 'Check the status of a claim or begin a new guided request.',
    fields: [
      { label: 'Action', name: 'action', options: ['Start a new claim', 'Check claim status', 'Upload a document'] },
      { label: 'Policy', name: 'policy', options: ['Auto · EM-4821', 'Home · EM-1938'] },
    ],
    submitLabel: 'Continue',
    successTitle: 'Claims workspace ready',
    successBody: 'The selected fictional claims workflow is ready for the next presenter step.',
  },
  'Visit help center': {
    actionId: 'travel_support',
    title: 'Trip support',
    description: 'Find help for a flight search or an existing fictional itinerary.',
    fields: [
      { label: 'Help topic', name: 'topic', options: ['Change a flight', 'Baggage question', 'Traveler details'] },
      { label: 'Booking email', name: 'email', type: 'email', defaultValue: 'traveler@example.test' },
    ],
    submitLabel: 'Find help',
    successTitle: 'Help options ready',
    successBody: 'The relevant support steps are ready for this demo itinerary.',
  },
};

interface Props {
  action: string | null;
  onClose(): void;
}

export default function ExperienceActionDialog({ action, onClose }: Props) {
  const { industry } = useIndustry();
  const [complete, setComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const closeRef = useRef<HTMLButtonElement>(null);
  const workflow = action ? workflows[action] : undefined;

  useEffect(() => {
    if (!workflow) return;
    setComplete(false);
    setSubmitError('');
    closeRef.current?.focus();
    recordIndustryEvent(industry.id, industry.primaryJourney, 'guided_action_open', {
      'app.action.name': workflow.actionId,
    });
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [industry.id, industry.primaryJourney, onClose, workflow]);

  if (!workflow) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError('');
    const formData = new FormData(event.currentTarget);
    const fields = Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, String(value)]));

    try {
      await withIndustrySpan(
        industry.id,
        industry.primaryJourney,
        'guided_action_complete',
        () => ApiGateway.completeGuidedAction(workflow.actionId, fields),
        { 'app.action.name': workflow.actionId }
      );
      recordIndustryEvent(industry.id, industry.primaryJourney, 'guided_action_complete', {
        'app.action.name': workflow.actionId,
      });
      setComplete(true);
    } catch {
      setSubmitError('This request could not be completed. No success was recorded.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <S.ActionBackdrop role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <S.ActionDialog
        aria-describedby="guided-action-description"
        aria-labelledby="guided-action-title"
        aria-modal="true"
        data-cy={CypressFields.IndustryAction}
        role="dialog"
        $colors={industry.colors}
      >
        <S.ActionDialogHeader>
          <div>
            <S.Kicker $colors={industry.colors}>{industry.brandName} guided action</S.Kicker>
            <h2 id="guided-action-title">{workflow.title}</h2>
            <p id="guided-action-description">{workflow.description}</p>
          </div>
          <S.ActionClose ref={closeRef} aria-label="Close guided action" onClick={onClose} type="button">×</S.ActionClose>
        </S.ActionDialogHeader>

        {complete ? (
          <S.ActionSuccess data-cy={CypressFields.IndustryActionComplete} $colors={industry.colors}>
            <S.SuccessMark $colors={industry.colors}>✓</S.SuccessMark>
            <h3>{workflow.successTitle}</h3>
            <p>{workflow.successBody}</p>
            <S.PrimaryButton $colors={industry.colors} onClick={onClose} type="button">Done</S.PrimaryButton>
          </S.ActionSuccess>
        ) : (
          <S.ActionForm onSubmit={submit}>
            <S.ActionFieldGrid>
              {workflow.fields.map(field => (
                <S.ActionField $colors={industry.colors} key={field.name} $wide={field.type === 'textarea'}>
                  <span>{field.label}</span>
                  {field.options ? (
                    <select defaultValue={field.options[0]} name={field.name} required>
                      {field.options.map(option => <option key={option}>{option}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea name={field.name} placeholder={field.placeholder} required rows={4} />
                  ) : (
                    <input
                      defaultValue={field.defaultValue}
                      min={field.type === 'number' ? '0.01' : undefined}
                      name={field.name}
                      placeholder={field.placeholder}
                      required
                      step={field.type === 'number' ? '0.01' : undefined}
                      type={field.type || 'text'}
                    />
                  )}
                </S.ActionField>
              ))}
            </S.ActionFieldGrid>
            <S.DemoDisclosure $colors={industry.colors}>
              This is deterministic demonstration data. The request is sent to the demo backend and does not affect a real account.
            </S.DemoDisclosure>
            {submitError ? <S.ErrorMessage role="alert">{submitError}</S.ErrorMessage> : null}
            <S.ActionDialogButtons>
              <S.SecondaryButton $colors={industry.colors} disabled={isSubmitting} onClick={onClose} type="button">Cancel</S.SecondaryButton>
              <S.PrimaryButton $colors={industry.colors} disabled={isSubmitting} type="submit">{isSubmitting ? 'Submitting…' : workflow.submitLabel}</S.PrimaryButton>
            </S.ActionDialogButtons>
          </S.ActionForm>
        )}
      </S.ActionDialog>
    </S.ActionBackdrop>
  );
}
