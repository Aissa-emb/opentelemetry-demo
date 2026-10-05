// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

const enterpriseFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif';

export const Page = styled.div`
  background: #fff;
  box-sizing: border-box;
  color: #1f2023;
  display: grid;
  font-family: ${enterpriseFont};
  grid-template-columns: 272px minmax(0, 1fr);
  height: 100dvh;
  inset: 0;
  max-width: 100vw;
  min-height: 620px;
  overflow: hidden;
  position: fixed;
  width: 100vw;
  z-index: 1;
  &, & * { box-sizing: border-box; }
  &, & * { font-family: ${enterpriseFont}; font-weight: 400; }
  strong, h1 { font-weight: 600; }
  @media (max-width: 1050px) { grid-template-columns: 240px minmax(0, 1fr); }
  @media (max-width: 900px) { grid-template-columns: minmax(0, 1fr); }
`;

export const Sidebar = styled.aside`
  background: #f7f7f8;
  border-right: 1px solid #e5e5e7;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  padding: 18px 14px 14px;
  @media (max-width: 900px) { display: none; }
`;

export const Brand = styled.div`
  align-items: center;
  display: flex;
  gap: 11px;
  margin: 1px 8px 20px;
  strong { color: #171719; font-size: 16px; letter-spacing: -.02em; }
`;

export const BrandMark = styled.span`
  align-items: center;
  background: #171717;
  border: 1px solid #171717;
  border-radius: 10px;
  color: #fff;
  display: flex;
  height: 36px;
  justify-content: center;
  width: 36px;
  svg { height: 23px; width: 23px; }
`;

export const NewChatButton = styled.button`
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: #29292c;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  gap: 10px;
  min-height: 40px;
  padding: 9px 10px;
  text-align: left;
  width: 100%;
  span { font-size: 18px; }
  &:hover { background: #e9e9eb; }
  &:focus-visible { outline: 2px solid #526784; outline-offset: 1px; }
`;

export const NavItem = styled.button`
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: #424246;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  gap: 10px;
  padding: 9px 10px;
  text-align: left;
  &:hover { background: #e9e9eb; }
  span { color: #69696e; font-size: 16px; }
`;

export const History = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  margin-top: 15px;
  min-height: 0;
  overflow-y: auto;
  > strong { color: #85858b; font-size: 11px; margin: 0 10px 6px; }
  > p { color: #98989e; font-size: 11px; line-height: 1.5; margin: 4px 10px; }
  button { background: transparent; border: 0; border-radius: 8px; color: #505055; cursor: pointer; font-size: 13px; overflow: hidden; padding: 9px 10px; text-align: left; text-overflow: ellipsis; white-space: nowrap; }
  button:hover, button[aria-current='page'] { background: #e9e9eb; color: #202123; }
`;

export const SidebarBottom = styled.div`
  border-top: 1px solid #e2e2e4;
  padding-top: 10px;
  > button { background: transparent; border: 0; justify-content: flex-start; width: 100%; }
  > button:hover { background: #e9e9eb; }
`;

export const Main = styled.main`
  display: grid;
  grid-template-rows: 60px minmax(0, 1fr) auto;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  position: relative;
`;

export const Topbar = styled.header`
  align-items: center;
  border-bottom: 1px solid #f0f0f1;
  display: flex;
  justify-content: space-between;
  min-width: 0;
  padding: 0 24px;
  > strong { color: #303033; font-size: 14px; }
  > strong span { color: #85858b; font-size: 12px; margin-left: 3px; }
  @media (max-width: 900px) { padding: 0 16px; }
`;

export const TopbarBrand = styled.div`
  align-items: center;
  display: none;
  gap: 10px;
  min-width: 0;
  > strong { color: #292a2d; font-size: 15px; letter-spacing: -.015em; white-space: nowrap; }
  > strong span { color: #85858b; font-size: 12px; margin-left: 3px; }
  @media (max-width: 900px) { display: flex; }
`;

export const CompactMark = styled.span`
  align-items: center;
  background: #171717;
  border-radius: 8px;
  color: #fff;
  display: none;
  height: 30px;
  justify-content: center;
  width: 30px;
  svg { height: 19px; width: 19px; }
  @media (max-width: 900px) { display: flex; }
`;

export const MobileSettings = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: block;
    > button { min-height: 38px; padding: 7px 10px; }
  }
`;

export const NewChatNotice = styled.div`
  animation: notice-in 160ms ease-out;
  background: #202b3b;
  border-radius: 999px;
  box-shadow: 0 8px 28px rgb(15 23 42 / 16%);
  color: #fff;
  font-size: 12px;
  left: 50%;
  padding: 8px 13px;
  position: absolute;
  top: 72px;
  transform: translateX(-50%);
  z-index: 4;
  @keyframes notice-in { from { opacity: 0; transform: translate(-50%, -5px); } to { opacity: 1; transform: translate(-50%, 0); } }
`;

export const Chat = styled.div`
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
`;

export const Welcome = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 840px;
  min-height: 100%;
  padding: 24px clamp(20px, 5vw, 44px) 86px;
  text-align: center;
  width: 100%;
  h1 { color: #1d1e21; font-size: clamp(31px, 3vw, 40px); letter-spacing: -.04em; margin: 0 0 30px; }
  @media (max-width: 560px) { padding-inline: 14px; h1 { font-size: 30px; } }
`;

export const WelcomeComposer = styled.div`
  width: 100%;
`;

export const Suggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  justify-content: center;
  margin-top: 16px;
  button { background: #fff; border: 1px solid #dedee1; border-radius: 999px; color: #56575c; cursor: pointer; font-size: 12px; padding: 9px 13px; transition: background 140ms ease, border-color 140ms ease, transform 140ms ease; }
  button:hover { background: #f7f7f8; border-color: #c6c6ca; color: #252528; }
  button:active { transform: translateY(1px); }
`;

export const Disclosure = styled.small`
  color: #9b9ba1;
  font-size: 9px;
  margin-top: 17px;
`;

export const Messages = styled.div`
  margin: 0 auto;
  max-width: 760px;
  padding: 40px 26px 70px;
  width: 100%;
  @media (max-width: 560px) { padding-inline: 16px; }
`;

export const UserRow = styled.article`
  display: flex;
  justify-content: flex-end;
  margin: 0 0 34px 70px;
  > div { background: #f1f1f3; border-radius: 18px 18px 4px 18px; color: #303033; font-size: 14px; line-height: 1.55; max-width: 82%; padding: 10px 15px; }
`;

export const AssistantRow = styled.article`
  display: grid;
  gap: 14px;
  grid-template-columns: 30px minmax(0, 1fr);
  margin-bottom: 42px;
`;

export const AssistantMark = styled.span`
  align-items: center;
  background: #171717;
  border-radius: 9px;
  color: #fff;
  display: flex;
  height: 28px;
  justify-content: center;
  width: 28px;
  svg { height: 18px; width: 18px; }
`;

export const Answer = styled.div`
  color: #343438;
  min-width: 0;
  > strong { display: block; font-size: 12px; margin: 4px 0 11px; }
  p { font-size: 14px; line-height: 1.72; margin: 0 0 12px; }
  ul { font-size: 14px; line-height: 1.65; margin: 8px 0 17px; padding-left: 20px; }
  li { margin: 6px 0; padding-left: 3px; }
`;

export const AnswerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 16px;
  button { background: #fff; border: 1px solid #dedee1; border-radius: 8px; color: #65656a; cursor: pointer; font-size: 10px; padding: 7px 10px; }
  button:hover { background: #f7f7f8; border-color: #bfbfc4; color: #29292d; }
`;

export const Thinking = styled.div`
  align-items: center;
  color: #85858b;
  display: flex;
  font-size: 11px;
  gap: 5px;
  padding-top: 7px;
  i { animation: pulse 1.05s ease-in-out infinite; background: #687386; border-radius: 50%; height: 6px; width: 6px; }
  i:nth-child(2) { animation-delay: .16s; }
  i:nth-child(3) { animation-delay: .32s; }
  span { margin-left: 5px; }
  @keyframes pulse { 0%, 65%, 100% { opacity: .3; transform: translateY(0); } 32% { opacity: 1; transform: translateY(-4px); } }
  @media (prefers-reduced-motion: reduce) { i { animation: none; opacity: .7; } }
`;

export const ComposerArea = styled.div`
  background: linear-gradient(to top, #fff 78%, rgb(255 255 255 / 0));
  min-width: 0;
  padding: 20px clamp(14px, 4vw, 28px) 14px;
  > small { color: #a0a0a5; display: block; font-size: 9px; margin: 8px auto 0; max-width: 760px; text-align: center; }
`;

export const Composer = styled.form`
  align-items: end;
  background: #fff;
  border: 1px solid #d8d8dc;
  border-radius: 26px;
  box-shadow: 0 3px 12px rgb(0 0 0 / 7%);
  display: grid;
  gap: 8px;
  grid-template-columns: 38px minmax(0, 1fr) 40px;
  margin: 0 auto;
  max-width: 780px;
  min-width: 0;
  padding: 9px 10px;
  width: 100%;
  > button:first-child { background: transparent; border: 0; color: #737378; cursor: pointer; font-size: 22px; height: 38px; }
  textarea { border: 0; color: #28282b; font-size: 15px; line-height: 1.5; max-height: 130px; min-height: 38px; min-width: 0; outline: 0; padding: 8px 2px 6px; resize: none; width: 100%; }
  textarea::placeholder { color: #99999f; }
  &:focus-within { border-color: #aaaab0; box-shadow: 0 5px 18px rgb(0 0 0 / 9%); }
`;

export const SendButton = styled.button`
  align-items: center;
  background: #1d2939;
  border: 0;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 17px;
  height: 38px;
  justify-content: center;
  width: 38px;
  &:disabled { background: #d4d4d7; cursor: not-allowed; }
`;
