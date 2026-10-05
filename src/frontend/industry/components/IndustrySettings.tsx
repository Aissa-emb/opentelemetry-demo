// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef, useState } from 'react';
import { useCart } from '../../providers/Cart.provider';
import { CypressFields } from '../../utils/enums/CypressFields';
import { useIndustry } from '../IndustryProvider';
import { AI_CHAT_RESET_EVENT, AI_CHAT_STORAGE_KEY } from '../aiStorage';
import { clearIndustryReceipts } from '../orderStore';
import { industryProfiles } from '../profiles';
import { IndustryId } from '../types';
import { experienceHomePath } from '../routes';
import { recordIndustryEvent } from '../telemetry';
import * as S from './IndustrySettings.styled';

export default function IndustrySettings() {
  const { industry, applyIndustry } = useIndustry();
  const { effectiveUserId, isMutationPending, resetExperience } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<IndustryId>(industry.id);
  const [message, setMessage] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setPreview(industry.id);
    setMessage('');
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      openerRef.current?.focus();
    };
  }, [industry.id, isOpen]);

  const selectedProfile = industryProfiles.find(profile => profile.id === preview)!;

  const copyDemoLink = async () => {
    const url = new URL(experienceHomePath(preview), window.location.origin);

    try {
      await navigator.clipboard.writeText(url.toString());
      setMessage('Demo link copied.');
    } catch {
      setMessage(url.toString());
    }
  };

  const reset = async () => {
    setMessage('');
    if (industry.id === 'ai') {
      try { localStorage.removeItem(AI_CHAT_STORAGE_KEY); } catch { /* storage is optional */ }
      window.dispatchEvent(new Event(AI_CHAT_RESET_EVENT));
      recordIndustryEvent(industry.id, industry.primaryJourney, 'new_chat_started', {
        'app.action.name': 'experience_reset',
      });
      setMessage(`${industry.displayName} conversation history reset.`);
      return;
    }

    try {
      await resetExperience();
      clearIndustryReceipts(industry.id);
      setMessage(`${industry.displayName} demo state reset.`);
    } catch {
      setMessage(`${industry.displayName} demo state could not be reset. Inspect the selection-state request.`);
    }
  };

  return (
    <>
      <S.SettingsButton
        aria-label="Open demo settings"
        data-cy={CypressFields.IndustrySettings}
        onClick={() => setIsOpen(true)}
        ref={openerRef}
        type="button"
      >
        <S.Gear aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3 14H3v-4h.08A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63 1.7 1.7 0 0 0 10 3.08V3h4v.08A1.7 1.7 0 0 0 15 4.64a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9 1.7 1.7 0 0 0 20.92 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z" />
        </S.Gear>
        <span>Settings</span>
      </S.SettingsButton>
      {isOpen && (
        <S.Backdrop role="presentation" onMouseDown={event => event.target === event.currentTarget && setIsOpen(false)}>
          <S.Dialog ref={dialogRef} aria-describedby="experience-settings-description" aria-labelledby="experience-settings-title" aria-modal="true" role="dialog">
            <S.DialogHeader>
              <div>
                <S.Eyebrow>Presenter settings</S.Eyebrow>
                <h2 id="experience-settings-title">Demo experience</h2>
                <p id="experience-settings-description">Preview an industry, then apply it without rebuilding or restarting the demo.</p>
              </div>
              <S.CloseButton ref={closeButtonRef} aria-label="Close settings" onClick={() => setIsOpen(false)} type="button">×</S.CloseButton>
            </S.DialogHeader>

            <S.ChoiceGrid>
              {industryProfiles.map(profile => (
                <S.Choice
                  aria-pressed={preview === profile.id}
                  data-cy={`${CypressFields.IndustryChoice}-${profile.id}`}
                  key={profile.id}
                  onClick={() => setPreview(profile.id)}
                  $selected={preview === profile.id}
                  $accent={profile.colors.accent}
                  type="button"
                >
                  <S.Preview $colors={profile.colors} $image={profile.heroImage}>
                    <span>{profile.brandMark}</span>
                    <i />
                    <i />
                  </S.Preview>
                  <strong>{profile.displayName}</strong>
                  <small>{profile.description}</small>
                </S.Choice>
              ))}
            </S.ChoiceGrid>

            <S.SelectionSummary $colors={selectedProfile.colors}>
              <span>{selectedProfile.brandMark}</span>
              <div>
                <strong>Previewing {selectedProfile.brandName}</strong>
                <small>{selectedProfile.hero.title}</small>
              </div>
            </S.SelectionSummary>

            <S.LiveStatus aria-live="polite">{message}</S.LiveStatus>
            <S.DialogActions>
              <S.SecondaryButton onClick={copyDemoLink} type="button">Copy demo link</S.SecondaryButton>
              <S.ResetButton disabled={isMutationPending || (industry.id !== 'ai' && !effectiveUserId)} onClick={reset} type="button">Reset current experience</S.ResetButton>
              <span />
              <S.SecondaryButton onClick={() => setIsOpen(false)} type="button">Cancel</S.SecondaryButton>
              <S.ApplyButton
                data-cy={CypressFields.IndustryApply}
                disabled={isMutationPending}
                onClick={async () => {
                  await applyIndustry(preview);
                  setIsOpen(false);
                }}
                $accent={selectedProfile.colors.accent}
                type="button"
              >
                {isMutationPending ? 'Transaction in progress' : 'Apply experience'}
              </S.ApplyButton>
            </S.DialogActions>
          </S.Dialog>
        </S.Backdrop>
      )}
    </>
  );
}
