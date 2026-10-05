// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import styled from 'styled-components';
import { IndustryColors } from '../types';

export const Page = styled.div<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.background};
  color: ${({ $colors }) => $colors.ink};
  min-height: 70vh;
  padding-bottom: 80px;

  * { color: inherit; }
`;

export const Content = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  padding: 0 28px;
  @media (max-width: 560px) { padding: 0 18px; }
`;

export const PortalHero = styled.section<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.surface};
  border-bottom: 1px solid ${({ $colors }) => $colors.border};
  padding: 52px 0 0;
`;

export const PortalHeroGrid = styled.div`
  align-items: stretch;
  display: grid;
  gap: clamp(36px, 6vw, 80px);
  grid-template-columns: minmax(0, .86fr) minmax(440px, 1.14fr);
  min-height: 390px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

export const PortalHeroCopy = styled.div`
  align-self: center;
  padding: 24px 0 64px;
  h1 { font-size: clamp(42px, 5vw, 68px); letter-spacing: -.055em; line-height: .98; margin: 14px 0 22px; max-width: 680px; }
  p { color: #52606d; font-size: 18px; line-height: 1.68; margin: 0 0 28px; max-width: 610px; }
  @media (max-width: 900px) { padding-bottom: 0; }
`;

export const PortalHeroMedia = styled.div<{ $colors: IndustryColors }>`
  align-self: stretch;
  background: ${({ $colors }) => $colors.accentSoft};
  border-radius: 22px 22px 0 0;
  min-height: 390px;
  overflow: hidden;
  position: relative;
  img { height: 100%; inset: 0; object-fit: cover; position: absolute; width: 100%; }
  &::after { background: linear-gradient(90deg, ${({ $colors }) => $colors.surface} 0, transparent 24%); content: ''; inset: 0; pointer-events: none; position: absolute; }
  @media (max-width: 900px) { border-radius: 18px; min-height: 330px; }
`;

export const QuickActions = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, 1fr);
  margin: -34px 0 0;
  padding-bottom: 28px;
  position: relative;
  z-index: 2;
  @media (max-width: 760px) { grid-template-columns: 1fr; margin-top: 24px; }
`;

export const QuickAction = styled.button<{ $colors: IndustryColors }>`
  align-items: center;
  background: ${({ $colors }) => $colors.surface};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 14px;
  box-shadow: 0 14px 36px rgb(26 43 55 / 9%);
  color: inherit;
  cursor: pointer;
  display: grid;
  font: inherit;
  gap: 13px;
  grid-template-columns: auto 1fr auto;
  padding: 16px;
  text-align: left;
  transition: border-color 160ms ease, transform 160ms ease;
  span { display: flex; flex-direction: column; gap: 3px; }
  strong { font-size: 14px; }
  small { color: ${({ $colors }) => $colors.muted}; font-size: 11px; }
  i { color: ${({ $colors }) => $colors.accent}; font-size: 18px; font-style: normal; }
  &:hover { border-color: ${({ $colors }) => $colors.accent}; transform: translateY(-2px); }
  &:focus-visible { outline: 3px solid ${({ $colors }) => $colors.accentSoft}; outline-offset: 2px; }
`;

export const ActionIcon = styled.span<{ $colors: IndustryColors }>`
  align-items: center;
  background: ${({ $colors }) => $colors.accentSoft};
  border-radius: 10px;
  display: inline-flex;
  height: 42px;
  justify-content: center;
  width: 42px;
  svg { fill: none; height: 21px; stroke: ${({ $colors }) => $colors.accent}; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.8; width: 21px; }
`;

export const TravelHero = styled.section<{ $colors: IndustryColors }>`
  background: #eef2f5;
  border-bottom: 1px solid ${({ $colors }) => $colors.border};
  padding: 38px 0 46px;
`;

export const TravelHeroGrid = styled.div`
  align-items: center;
  display: grid;
  gap: 44px;
  grid-template-columns: minmax(0, .82fr) minmax(480px, 1.18fr);
  @media (max-width: 940px) { grid-template-columns: 1fr; }
`;

export const TravelHeroCopy = styled.div`
  padding: 36px 0 92px;
  h1 { color: #18212a; font-size: clamp(46px, 5.6vw, 76px); letter-spacing: -.055em; line-height: .98; margin: 14px 0 22px; }
  p { color: #4c5c68; font-size: 18px; line-height: 1.65; margin: 0; max-width: 580px; }
  @media (max-width: 940px) { padding-bottom: 0; }
`;

export const TravelHeroMedia = styled.div`
  aspect-ratio: 1.66;
  border-radius: 26px;
  box-shadow: 0 24px 60px rgb(30 41 59 / 14%);
  overflow: hidden;
  img { display: block; height: 100%; object-fit: cover; width: 100%; }
`;

export const TravelSearchPanel = styled.form<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.surface};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 16px;
  box-shadow: 0 20px 55px rgb(30 41 59 / 14%);
  margin-top: -66px;
  padding: 20px;
  position: relative;
  z-index: 2;
  @media (max-width: 940px) { margin-top: 28px; }
`;

export const TravelModes = styled.div`
  align-items: center;
  display: flex;
  gap: 4px;
  margin-bottom: 14px;
  button { align-items: center; background: transparent; border: 0; border-radius: 8px; cursor: pointer; display: inline-flex; font: inherit; font-size: 13px; gap: 7px; padding: 9px 12px; }
  button[aria-pressed='true'] { background: #fff0e9; color: #bf451c; }
  svg { fill: none; height: 17px; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2; width: 17px; }
`;

export const TravelMeta = styled.div`
  display: flex;
  gap: 18px;
  margin-bottom: 12px;
  span { color: #54616d; font-size: 12px; }
`;

export const TravelFields = styled.div`
  align-items: stretch;
  display: grid;
  gap: 0;
  grid-template-columns: 1.2fr 38px 1.2fr .76fr .76fr .72fr auto;
  label { border: 1px solid #cfd7df; border-right: 0; display: flex; flex-direction: column; gap: 2px; justify-content: center; min-height: 66px; padding: 9px 13px; }
  label:first-child { border-radius: 10px 0 0 10px; }
  small { color: #6b7782; font-size: 10px; letter-spacing: .06em; text-transform: uppercase; }
  input, select { appearance: none; background: transparent; border: 0; color: #17212b; font: inherit; font-size: 13px; min-width: 0; outline: 0; padding: 0; width: 100%; }
  label:focus-within { box-shadow: inset 0 0 0 2px #e95c28; }
  @media (max-width: 1040px) { grid-template-columns: 1fr 38px 1fr; label { border: 1px solid #cfd7df; } }
  @media (max-width: 620px) { grid-template-columns: 1fr; label:first-child { border-radius: 10px 10px 0 0; } }
`;

export const Swap = styled.button`
  align-self: center;
  background: white;
  border: 1px solid #cfd7df;
  border-radius: 50%;
  cursor: pointer;
  font-size: 17px;
  height: 34px;
  margin: 0 -2px;
  position: relative;
  width: 34px;
  z-index: 2;
  @media (max-width: 620px) { display: none; }
`;

export const TravelSubmit = styled.button<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.accent};
  border: 0;
  border-radius: 0 10px 10px 0;
  color: white;
  cursor: pointer;
  font: inherit;
  padding: 0 20px;
  white-space: nowrap;
  &:hover { background: ${({ $colors }) => $colors.accentDark}; }
  &:focus-visible { outline: 3px solid ${({ $colors }) => $colors.accentSoft}; outline-offset: 2px; }
  @media (max-width: 1040px) { border-radius: 8px; grid-column: 1 / -1; min-height: 52px; margin-top: 10px; }
`;

export const Hero = styled.section<{ $colors: IndustryColors; $layout: string }>`
  background:
    radial-gradient(circle at 86% 18%, ${({ $colors }) => $colors.accentSoft} 0, transparent 28%),
    linear-gradient(135deg, ${({ $colors }) => $colors.surface}, ${({ $colors }) => $colors.background});
  border-bottom: 1px solid ${({ $colors }) => $colors.border};
  min-height: ${({ $layout }) => $layout === 'editorial' ? '520px' : $layout === 'retail' ? '430px' : '300px'};
  overflow: hidden;
  padding: ${({ $layout }) => $layout === 'portal' || $layout === 'workspace' ? '48px 0' : '76px 0'};
  position: relative;

  @media (max-width: 700px) { min-height: auto; padding: 48px 0; }
`;

export const HeroGrid = styled.div<{ $layout: string }>`
  align-items: center;
  display: grid;
  gap: 48px;
  grid-template-columns: ${({ $layout }) => $layout === 'portal' || $layout === 'workspace' ? '1.5fr .5fr' : '1.2fr .8fr'};
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;

export const HeroCopy = styled.div<{ $layout: string }>`
  max-width: 720px;
  h1 { font-size: ${({ $layout }) => $layout === 'portal' || $layout === 'workspace' ? 'clamp(34px, 4vw, 52px)' : 'clamp(40px, 5vw, 72px)'}; letter-spacing: -.045em; line-height: .99; margin: 12px 0 22px; }
  p { font-size: 18px; line-height: 1.65; margin: 0 0 28px; max-width: 660px; opacity: .76; }
`;

export const Kicker = styled.span<{ $colors: IndustryColors }>`
  color: ${({ $colors }) => $colors.accent};
  font-size: 12px;
  letter-spacing: .16em;
  text-transform: uppercase;
`;

export const PrimaryLink = styled(Link)<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.accent};
  border-radius: 10px;
  color: white;
  display: inline-flex;
  padding: 14px 20px;
  text-decoration: none;
  &:focus-visible { outline: 3px solid ${({ $colors }) => $colors.accentDark}; outline-offset: 3px; }
`;

export const HeroVisual = styled.div<{ $colors: IndustryColors; $layout: string }>`
  align-items: center;
  aspect-ratio: 1.15;
  background: ${({ $colors }) => $colors.accent};
  border-radius: 45% 18% 42% 22%;
  box-shadow: 0 30px 70px color-mix(in srgb, ${({ $colors }) => $colors.accent} 28%, transparent);
  display: flex;
  justify-content: center;
  margin-left: auto;
  max-width: ${({ $layout }) => $layout === 'portal' || $layout === 'workspace' ? '230px' : '390px'};
  transform: rotate(-3deg);
  width: 100%;

  svg { height: 64%; stroke: white !important; transform: rotate(3deg); width: 64%; }
  @media (max-width: 760px) { display: none; }
`;

export const Stats = styled.section<{ $flush?: boolean }>`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(3, 1fr);
  margin-top: ${({ $flush }) => $flush ? '26px' : '22px'};
  position: relative;
  z-index: 2;
  @media (max-width: 720px) { grid-template-columns: 1fr; margin-top: 20px; }
`;

export const Stat = styled.article<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.surface};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 13px;
  box-shadow: 0 12px 35px rgb(27 37 50 / 7%);
  padding: 20px;
  span { color: ${({ $colors }) => $colors.muted}; display: block; font-size: 12px; text-transform: uppercase; }
  strong { display: block; font-size: 23px; margin: 7px 0 5px; }
  small { color: ${({ $colors }) => $colors.muted}; font-size: 12px; }
`;

export const Section = styled.section`
  padding-top: 72px;
`;

export const SectionHeader = styled.div`
  align-items: end;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin-bottom: 24px;
  h2 { font-size: clamp(27px, 3vw, 42px); letter-spacing: -.025em; margin: 0; }
  p { margin: 7px 0 0; opacity: .68; }
  @media (max-width: 650px) { align-items: stretch; flex-direction: column; }
`;

export const ResultEyebrow = styled.span`
  color: #bf451c;
  display: block;
  font-size: 12px;
  letter-spacing: .08em;
  margin-bottom: 7px;
  text-transform: uppercase;
`;

export const Search = styled.input<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.surface};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 9px;
  font: inherit;
  min-width: min(320px, 100%);
  padding: 12px 14px;
  &:focus { border-color: ${({ $colors }) => $colors.accent}; outline: 3px solid ${({ $colors }) => $colors.accentSoft}; }
`;

export const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

export const Filter = styled.button<{ $active: boolean; $colors: IndustryColors }>`
  background: ${({ $active, $colors }) => $active ? $colors.accent : $colors.surface};
  border: 1px solid ${({ $active, $colors }) => $active ? $colors.accent : $colors.border};
  border-radius: 8px;
  color: ${({ $active }) => $active ? 'white' : 'inherit'};
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  padding: 8px 12px;
  &:focus-visible { outline: 3px solid ${({ $colors }) => $colors.accentSoft}; outline-offset: 2px; }
`;

export const ProductGrid = styled.div<{ $layout: string }>`
  display: grid;
  gap: ${({ $layout }) => $layout === 'workspace' ? '10px' : '20px'};
  grid-template-columns: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? '1fr' : $layout === 'editorial' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'};
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 580px) { grid-template-columns: 1fr; }
`;

export const ProductLink = styled(Link)`
  text-decoration: none;
`;

export const ProductCard = styled.article<{ $colors: IndustryColors; $layout: string }>`
  align-items: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? 'center' : 'stretch'};
  background: ${({ $colors }) => $colors.surface};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? '9px' : '16px'};
  display: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? 'grid' : 'flex'};
  flex-direction: column;
  gap: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? '18px' : '0'};
  grid-template-columns: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? '76px minmax(0, 1fr) minmax(250px, auto)' : 'none'};
  height: 100%;
  overflow: hidden;
  padding: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? '12px' : '0'};
  transition: transform 160ms ease, box-shadow 160ms ease;
  &:hover { box-shadow: 0 18px 40px rgb(30 41 59 / 10%); transform: translateY(-3px); }
  @media (prefers-reduced-motion: reduce) { transition: none; }
  @media (max-width: 760px) { grid-template-columns: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? '64px minmax(0, 1fr)' : 'none'}; }
`;

export const Artwork = styled.div<{ $colors: IndustryColors; $compact?: boolean; $large?: boolean }>`
  align-items: center;
  background:
    linear-gradient(145deg, ${({ $colors }) => $colors.accentSoft}, ${({ $colors }) => $colors.background});
  display: flex;
  height: ${({ $compact, $large }) => $large ? '460px' : $compact ? '72px' : '210px'};
  justify-content: center;
  min-height: ${({ $large }) => $large ? '320px' : 'auto'};
  width: 100%;
  svg { fill: none; height: ${({ $compact }) => $compact ? '68%' : '58%'}; stroke: ${({ $colors }) => $colors.accent}; stroke-linecap: round; stroke-linejoin: round; stroke-width: 4; width: ${({ $compact }) => $compact ? '68%' : '58%'}; }
  @media (max-width: 760px) { height: ${({ $compact, $large }) => $large ? '300px' : $compact ? '64px' : '190px'}; }
`;

export const ArtworkPhoto = styled.div<{ $src: string; $position?: string }>`
  background-image: url(${({ $src }) => $src});
  background-position: ${({ $position }) => $position || 'center'};
  background-repeat: no-repeat;
  background-size: ${({ $position }) => $position ? '205% 205%' : 'cover'};
  height: 100%;
  width: 100%;
`;

export const CardBody = styled.div<{ $layout: string }>`
  padding: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? '0' : '19px'};
  min-width: 0;
  h3 { font-size: 19px; margin: 6px 0 8px; }
  p { font-size: 13px; line-height: 1.55; margin: 0; opacity: .68; }
`;

export const Eyebrow = styled.span<{ $colors: IndustryColors }>`
  color: ${({ $colors }) => $colors.accent};
  font-size: 11px;
  letter-spacing: .09em;
  text-transform: uppercase;
`;

export const CardFooter = styled.div<{ $colors: IndustryColors; $layout: string }>`
  align-items: center;
  border-top: ${({ $layout, $colors }) => $layout === 'workspace' || $layout === 'portal' ? '0' : `1px solid ${$colors.border}`};
  display: flex;
  gap: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? '18px' : '0'};
  justify-content: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? 'flex-end' : 'space-between'};
  margin-top: auto;
  padding: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? '0 18px 0 0' : '15px 19px'};
  strong { white-space: nowrap; }
  span { color: ${({ $colors }) => $colors.accent}; font-size: 13px; white-space: nowrap; }
  @media (max-width: 760px) {
    grid-column: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? '2' : 'auto'};
    justify-content: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? 'flex-start' : 'space-between'};
    padding: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? '0 0 8px' : '15px 19px'};
  }
  @media (max-width: 430px) {
    align-items: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? 'flex-start' : 'center'};
    flex-direction: ${({ $layout }) => $layout === 'workspace' || $layout === 'portal' ? 'column' : 'row'};
    gap: 5px;
  }
`;

export const FlightList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FlightLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

export const FlightCard = styled.article<{ $colors: IndustryColors }>`
  align-items: stretch;
  background: ${({ $colors }) => $colors.surface};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 15px;
  display: grid;
  grid-template-columns: 144px minmax(0, 1fr) 170px;
  min-height: 180px;
  overflow: hidden;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
  &:hover { border-color: ${({ $colors }) => $colors.accent}; box-shadow: 0 18px 42px rgb(30 41 59 / 10%); transform: translateY(-2px); }
  @media (max-width: 760px) { grid-template-columns: 105px 1fr; }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

export const FlightImage = styled.div<{ $src: string; $position?: string }>`
  background-image: url(${({ $src }) => $src});
  background-position: ${({ $position }) => $position || 'center'};
  background-size: 205% 205%;
  min-height: 180px;
  @media (max-width: 520px) { min-height: 160px; }
`;

export const FlightDetails = styled.div`
  padding: 20px;
  p { color: #66737d; font-size: 12px; line-height: 1.55; margin: 9px 0 13px; }
`;

export const FlightBrand = styled.div`
  align-items: center;
  display: grid;
  gap: 3px 9px;
  grid-template-columns: 34px 1fr;
  span { align-items: center; background: #263746; border-radius: 50%; color: white; display: flex; grid-row: 1 / 3; height: 34px; justify-content: center; width: 34px; }
  strong { font-size: 14px; }
  small { color: #7b8790; font-size: 10px; }
`;

export const FlightRoute = styled.div`
  font-size: 17px;
  margin-top: 15px;
`;

export const FlightBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  span { background: #f0f3f5; border-radius: 999px; color: #53606a; font-size: 10px; padding: 5px 8px; }
`;

export const FlightPrice = styled.div<{ $colors: IndustryColors }>`
  align-items: flex-end;
  border-left: 1px solid ${({ $colors }) => $colors.border};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  small { color: #74808a; font-size: 10px; }
  strong { font-size: 23px; margin: 5px 0 15px; }
  > span { background: ${({ $colors }) => $colors.accent}; border-radius: 8px; color: white; font-size: 12px; padding: 10px 13px; }
  @media (max-width: 760px) { align-items: center; border-left: 0; border-top: 1px solid ${({ $colors }) => $colors.border}; flex-direction: row; grid-column: 1 / -1; justify-content: space-between; strong { margin: 0; } }
`;

export const ActivityGrid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: 1.25fr .75fr;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;

export const AdCallout = styled.aside<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.accentSoft};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 10px;
  font-size: 13px;
  margin-bottom: 20px;
  padding: 13px 16px;
  strong { color: ${({ $colors }) => $colors.accentDark}; margin-right: 7px; }
`;

export const Panel = styled.section<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.surface};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 14px;
  padding: 22px;
  h3 { margin: 0 0 18px; }
`;

export const SupportPanel = styled.aside<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.accentDark};
  border-radius: 14px;
  color: white;
  padding: 24px;
  ${ActionIcon} { background: rgb(255 255 255 / 13%); svg { stroke: white; } }
  h3 { color: white; font-size: 21px; line-height: 1.25; margin: 20px 0 10px; }
  p { color: rgb(255 255 255 / 72%); font-size: 13px; line-height: 1.65; }
  button { background: white; border: 0; border-radius: 8px; color: ${({ $colors }) => $colors.accentDark}; cursor: pointer; font: inherit; font-size: 12px; margin-top: 10px; padding: 10px 13px; }
`;

export const ActivityRow = styled.div<{ $colors: IndustryColors }>`
  align-items: center;
  border-top: 1px solid ${({ $colors }) => $colors.border};
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr auto;
  padding: 14px 0;
  &:first-of-type { border-top: 0; }
  strong { display: block; font-size: 14px; }
  small { color: ${({ $colors }) => $colors.muted}; }
  > span { color: ${({ $colors }) => $colors.accent}; font-size: 13px; }
`;

export const Notice = styled.aside<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.accentSoft};
  border-left: 4px solid ${({ $colors }) => $colors.accent};
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.55;
  margin-top: 28px;
  padding: 14px 16px;
`;

export const DetailGrid = styled.div`
  display: grid;
  gap: 56px;
  grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
  padding-top: 64px;
  @media (max-width: 760px) { gap: 28px; grid-template-columns: 1fr; padding-top: 28px; }
`;

export const DetailCopy = styled.div`
  align-self: center;
  h1 { font-size: clamp(34px, 4vw, 58px); letter-spacing: -.04em; line-height: 1.03; margin: 12px 0 20px; }
  > p { font-size: 17px; line-height: 1.7; opacity: .72; }
`;

export const Amount = styled.div`
  font-size: 29px;
  margin: 24px 0;
`;

export const ActionRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 25px;
`;

export const Quantity = styled.select<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.surface};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 9px;
  min-height: 48px;
  padding: 10px 38px 10px 14px;
`;

export const PrimaryButton = styled.button<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.accent};
  border: 1px solid ${({ $colors }) => $colors.accent};
  border-radius: 9px;
  color: white;
  cursor: pointer;
  font: inherit;
  min-height: 48px;
  padding: 11px 19px;
  &:disabled { cursor: not-allowed; opacity: .55; }
  &:focus-visible { outline: 3px solid ${({ $colors }) => $colors.accentSoft}; outline-offset: 2px; }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background: transparent;
  color: ${({ $colors }) => $colors.accent};
`;

export const CartLayout = styled.div`
  display: grid;
  gap: 28px;
  grid-template-columns: minmax(0, 1.25fr) minmax(330px, .75fr);
  padding-top: 52px;
  @media (max-width: 880px) { grid-template-columns: 1fr; }
`;

export const CartHeading = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
  h1 { font-size: clamp(30px, 4vw, 48px); margin: 0; }
  @media (max-width: 520px) { align-items: flex-start; flex-direction: column; }
`;

export const LineItem = styled.article<{ $colors: IndustryColors }>`
  align-items: center;
  background: ${({ $colors }) => $colors.surface};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 11px;
  display: grid;
  gap: 16px;
  grid-template-columns: 82px minmax(0, 1fr) auto;
  margin-bottom: 10px;
  padding: 12px;
  h3 { font-size: 16px; margin: 0 0 5px; }
  p { margin: 0; opacity: .66; }
  @media (max-width: 520px) { grid-template-columns: 64px minmax(0, 1fr); > div:last-child { grid-column: 2; } }
`;

export const MiniArtwork = styled.div<{ $colors: IndustryColors }>`
  border-radius: 8px;
  overflow: hidden;
  ${Artwork} { height: 72px; min-height: 0; }
`;

export const LineActions = styled.div`
  align-items: end;
  display: flex;
  flex-direction: column;
  gap: 7px;
  select { min-height: 36px; }
`;

export const Summary = styled.aside<{ $colors: IndustryColors }>`
  align-self: start;
  background: ${({ $colors }) => $colors.surface};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 14px;
  padding: 22px;
  position: sticky;
  top: 22px;
  h2 { margin: 0 0 6px; }
  > p { color: ${({ $colors }) => $colors.muted}; font-size: 13px; line-height: 1.55; }
  @media (max-width: 880px) { position: static; }
`;

export const SummaryRow = styled.div<{ $total?: boolean; $colors: IndustryColors }>`
  border-top: 1px solid ${({ $colors }) => $colors.border};
  display: flex;
  font-size: ${({ $total }) => $total ? '18px' : '14px'};
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 14px;
  strong { font-size: inherit; }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
`;

export const Field = styled.label<{ $colors: IndustryColors }>`
  color: ${({ $colors }) => $colors.muted};
  display: flex;
  flex-direction: column;
  font-size: 12px;
  gap: 6px;
  input, select { background: ${({ $colors }) => $colors.background}; border: 1px solid ${({ $colors }) => $colors.border}; border-radius: 8px; font: inherit; min-height: 44px; padding: 10px 12px; }
  input:focus, select:focus { border-color: ${({ $colors }) => $colors.accent}; outline: 3px solid ${({ $colors }) => $colors.accentSoft}; }
`;

export const ErrorMessage = styled.div`
  background: #fff1f1;
  border: 1px solid #e5a4a4;
  border-radius: 8px;
  color: #8e2525;
  font-size: 13px;
  line-height: 1.5;
  padding: 11px;
`;

export const Empty = styled.div<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.surface};
  border: 1px dashed ${({ $colors }) => $colors.border};
  border-radius: 14px;
  padding: 48px 24px;
  text-align: center;
  h1 { margin: 0 0 10px; }
  p { color: ${({ $colors }) => $colors.muted}; margin: 0 0 22px; }
`;

export const ConfirmationHero = styled.section<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.surface};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 18px;
  margin-top: 52px;
  padding: clamp(28px, 6vw, 70px);
  text-align: center;
  h1 { font-size: clamp(34px, 5vw, 58px); letter-spacing: -.04em; margin: 14px 0; }
  p { color: ${({ $colors }) => $colors.muted}; margin: 0 auto; max-width: 650px; }
`;

export const Checkmark = styled.div<{ $colors: IndustryColors }>`
  align-items: center;
  background: ${({ $colors }) => $colors.accentSoft};
  border-radius: 50%;
  color: ${({ $colors }) => $colors.accent};
  display: flex;
  font-size: 30px;
  height: 62px;
  justify-content: center;
  margin: 0 auto;
  width: 62px;
`;

export const Receipt = styled.section<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.surface};
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 14px;
  margin: 20px auto 0;
  max-width: 820px;
  padding: 22px;
  h2 { margin: 0 0 18px; }
`;

export const Loading = styled.div`
  min-height: 300px;
  padding: 80px 0;
  text-align: center;
`;

export const ActionBackdrop = styled.div`
  align-items: center;
  background: rgb(15 23 42 / 62%);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 22px;
  position: fixed;
  z-index: 2900;
`;

export const ActionDialog = styled.section<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.surface};
  border-radius: 19px;
  box-shadow: 0 30px 90px rgb(15 23 42 / 34%);
  color: ${({ $colors }) => $colors.ink};
  max-height: calc(100vh - 40px);
  max-width: 660px;
  overflow: auto;
  padding: 28px;
  width: 100%;
  * { color: inherit; }
  @media (max-width: 560px) { padding: 20px; }
`;

export const ActionDialogHeader = styled.header`
  align-items: flex-start;
  display: flex;
  gap: 22px;
  justify-content: space-between;
  h2 { font-size: 31px; letter-spacing: -.025em; margin: 7px 0 8px; }
  p { color: #647084; line-height: 1.55; margin: 0; max-width: 510px; }
`;

export const ActionClose = styled.button`
  align-items: center;
  background: #eff2f5;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  flex: 0 0 auto;
  font-size: 25px;
  height: 40px;
  justify-content: center;
  line-height: 1;
  width: 40px;
`;

export const ActionForm = styled.form`
  margin-top: 26px;
`;

export const ActionFieldGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

export const ActionField = styled.label<{ $colors: IndustryColors; $wide?: boolean }>`
  color: ${({ $colors }) => $colors.muted};
  display: flex;
  flex-direction: column;
  font-size: 12px;
  gap: 7px;
  grid-column: ${({ $wide }) => $wide ? '1 / -1' : 'auto'};
  span { font-weight: 650; }
  input, select, textarea {
    appearance: none;
    background: ${({ $colors }) => $colors.background};
    border: 1px solid ${({ $colors }) => $colors.border};
    border-radius: 9px;
    color: ${({ $colors }) => $colors.ink};
    font: inherit;
    font-size: 14px;
    min-height: 46px;
    padding: 11px 12px;
    resize: vertical;
    width: 100%;
  }
  textarea { min-height: 98px; }
  input:focus, select:focus, textarea:focus { border-color: ${({ $colors }) => $colors.accent}; outline: 3px solid ${({ $colors }) => $colors.accentSoft}; }
`;

export const DemoDisclosure = styled.aside<{ $colors: IndustryColors }>`
  background: ${({ $colors }) => $colors.accentSoft};
  border-radius: 9px;
  color: ${({ $colors }) => $colors.muted};
  font-size: 12px;
  line-height: 1.5;
  margin-top: 18px;
  padding: 11px 13px;
`;

export const ActionDialogButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const ActionSuccess = styled.div<{ $colors: IndustryColors }>`
  padding: 36px 18px 16px;
  text-align: center;
  h3 { font-size: 27px; margin: 17px 0 9px; }
  p { color: ${({ $colors }) => $colors.muted}; line-height: 1.6; margin: 0 auto 24px; max-width: 460px; }
`;

export const SuccessMark = styled.div<{ $colors: IndustryColors }>`
  align-items: center;
  background: ${({ $colors }) => $colors.accentSoft};
  border-radius: 50%;
  color: ${({ $colors }) => $colors.accent};
  display: flex;
  font-size: 27px;
  height: 62px;
  justify-content: center;
  margin: 0 auto;
  width: 62px;
`;
