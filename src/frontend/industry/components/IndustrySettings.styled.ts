// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { IndustryColors } from '../types';

export const SettingsButton = styled.button`
  align-items: center;
  background: transparent;
  border: 1px solid #ccd2da;
  border-radius: 9px;
  color: inherit;
  cursor: pointer;
  display: flex;
  font: inherit;
  gap: 7px;
  min-height: 42px;
  padding: 8px 12px;

  &:focus-visible { outline: 3px solid #f0b34e; outline-offset: 2px; }
  @media (max-width: 620px) { padding: 6px; span:last-child { display: none; } }
`;

export const Gear = styled.svg`
  fill: none;
  height: 19px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  width: 19px;
`;

export const Backdrop = styled.div`
  align-items: center;
  backdrop-filter: blur(7px);
  background: rgb(17 24 39 / 48%);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 28px;
  position: fixed;
  z-index: 3000;
  @media (max-width: 620px) { padding: 12px; }
`;

export const Dialog = styled.div`
  background: #fcfcfd;
  border: 1px solid rgb(255 255 255 / 58%);
  border-radius: 24px;
  box-shadow: 0 32px 96px rgb(15 23 42 / 28%), 0 2px 8px rgb(15 23 42 / 9%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI Variable", "Segoe UI", Inter, Helvetica, Arial, sans-serif;
  max-height: calc(100vh - 48px);
  max-width: 1040px;
  overflow: auto;
  padding: 26px 28px;
  width: 100%;

  &, & * { font-family: inherit; }
  * { color: #18181b; font-weight: 400; }
  button { -webkit-font-smoothing: antialiased; }
  @media (max-width: 620px) { border-radius: 18px; max-height: calc(100vh - 24px); padding: 20px; }
`;

export const DialogHeader = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 28px;
  justify-content: space-between;
  margin-bottom: 20px;

  h2 { font-size: 29px; font-weight: 650; letter-spacing: -.04em; line-height: 1.12; margin: 6px 0 7px; }
  p { color: #6b6b72; font-size: 14px; line-height: 1.5; margin: 0; max-width: 660px; }
`;

export const Eyebrow = styled.span`
  color: #77777f;
  font-size: 10px;
  font-weight: 650;
  letter-spacing: .16em;
  text-transform: uppercase;
`;

export const CloseButton = styled.button`
  align-items: center;
  background: #f1f1f3;
  border: 1px solid #e7e7e9;
  border-radius: 50%;
  color: #2f3033;
  cursor: pointer;
  display: flex;
  flex: 0 0 auto;
  font-size: 22px;
  height: 38px;
  justify-content: center;
  line-height: 1;
  transition: background 140ms ease, border-color 140ms ease;
  width: 38px;
  &:hover { background: #e8e8eb; border-color: #d8d8dc; }
  &:focus-visible { outline: 2px solid #52525b; outline-offset: 2px; }
`;

export const ChoiceGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 760px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const Choice = styled.button<{ $selected: boolean; $accent: string }>`
  background: ${({ $selected }) => $selected ? '#fff' : '#fdfdfe'};
  border: 1px solid ${({ $selected, $accent }) => $selected ? $accent : '#e3e3e7'};
  border-radius: 15px;
  box-shadow: ${({ $selected, $accent }) => $selected ? `0 0 0 2px ${$accent}18, 0 8px 24px rgb(24 24 27 / 7%)` : '0 1px 2px rgb(24 24 27 / 3%)'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 164px;
  padding: 10px 10px 13px;
  position: relative;
  text-align: left;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;

  &::after {
    align-items: center;
    background: ${({ $accent }) => $accent};
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 1px 4px rgb(24 24 27 / 18%);
    color: #fff;
    content: '✓';
    display: ${({ $selected }) => $selected ? 'flex' : 'none'};
    font-size: 9px;
    font-weight: 700;
    height: 19px;
    justify-content: center;
    position: absolute;
    right: 16px;
    top: 16px;
    width: 19px;
    z-index: 2;
  }
  &:hover { border-color: ${({ $accent }) => $accent}; box-shadow: 0 10px 26px rgb(24 24 27 / 9%); transform: translateY(-2px); }
  &:focus-visible { outline: 2px solid ${({ $accent }) => $accent}; outline-offset: 2px; }
  > strong { font-size: 15px; font-weight: 650; letter-spacing: -.018em; line-height: 1.25; padding: 3px 4px 0; }
  > small { color: #6d6d75; font-size: 12px; font-weight: 450; line-height: 1.42; padding: 0 4px; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const Preview = styled.div<{ $colors: IndustryColors; $image?: string }>`
  background:
    ${({ $image }) => $image ? 'linear-gradient(90deg, rgb(15 23 42 / 48%), rgb(15 23 42 / 7%)),' : ''}
    ${({ $image, $colors }) => $image ? `url(${$image}) center / cover` : $colors.accentSoft};
  border: 1px solid rgb(255 255 255 / 68%);
  border-radius: 11px;
  display: grid;
  gap: 7px;
  grid-template-columns: 36px 1fr;
  grid-template-rows: 1fr 1fr;
  height: 68px;
  overflow: hidden;
  padding: 8px;
  width: 100%;

  span { align-items: center; background: ${({ $colors }) => $colors.accent}; border: 0; border-radius: 9px; color: white; display: flex; font-size: 13px; font-weight: 650; grid-row: 1 / 3; justify-content: center; letter-spacing: .015em; position: relative; }
  i { background: ${({ $image, $colors }) => $image ? 'rgb(255 255 255 / 80%)' : $colors.surface}; border-radius: 5px; display: block; opacity: .86; position: relative; }
`;

export const SelectionSummary = styled.div<{ $colors: IndustryColors }>`
  align-items: center;
  background: #f5f5f6;
  border: 1px solid #e8e8eb;
  border-radius: 14px;
  display: flex;
  gap: 12px;
  margin-top: 12px;
  padding: 10px 12px;
  > span { align-items: center; background: ${({ $colors }) => $colors.accent}; border-radius: 9px; color: white; display: flex; font-size: 12px; font-weight: 650; height: 38px; justify-content: center; letter-spacing: .02em; width: 38px; }
  div { display: flex; flex-direction: column; gap: 3px; }
  strong { font-size: 13px; font-weight: 650; letter-spacing: -.01em; }
  small { color: #73737b; font-size: 11px; font-weight: 450; }
`;

export const LiveStatus = styled.div`
  color: #52525b;
  font-size: 11px;
  min-height: 17px;
  padding: 4px 2px 0;
`;

export const DialogActions = styled.div`
  align-items: center;
  border-top: 1px solid #ededf0;
  display: grid;
  gap: 10px;
  grid-template-columns: auto auto 1fr auto auto;
  margin-top: 2px;
  padding-top: 12px;
  @media (max-width: 760px) { grid-template-columns: 1fr 1fr; span { display: none; } }
`;

const ActionButton = styled.button`
  border-radius: 10px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  min-height: 42px;
  padding: 9px 15px;
  transition: background 140ms ease, border-color 140ms ease, transform 140ms ease;
  &:active { transform: translateY(1px); }
  &:disabled { cursor: not-allowed; opacity: .55; }
  &:focus-visible { outline: 2px solid #52525b; outline-offset: 2px; }
`;

export const SecondaryButton = styled(ActionButton)`
  background: #fff;
  border: 1px solid #d9d9de;
  color: #35353a;
  &:hover { background: #f6f6f7; border-color: #c9c9ce; }
`;

export const ResetButton = styled(SecondaryButton)`
  color: #9b2c2c;
`;

export const ApplyButton = styled(ActionButton)<{ $accent: string }>`
  background: ${({ $accent }) => $accent};
  border: 1px solid ${({ $accent }) => $accent};
  color: white;
  box-shadow: 0 2px 6px rgb(24 24 27 / 12%);
  &:hover { filter: brightness(.94); }
`;
