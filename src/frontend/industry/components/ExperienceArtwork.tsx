// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { ArtworkKind, IndustryColors } from '../types';
import * as S from './IndustryExperience.styled';

interface ExperienceArtworkProps {
  kind: ArtworkKind;
  colors: IndustryColors;
  compact?: boolean;
  large?: boolean;
  image?: string;
  imagePosition?: string;
}

const paths: Record<ArtworkKind, React.ReactNode> = {
  telescope: <><path d="M42 25l43 15-5 13-43-15z"/><path d="M62 45 45 78M68 47l7 31M55 51l-4 27"/></>,
  headphones: <><path d="M31 60V49a29 29 0 0 1 58 0v11"/><rect x="24" y="55" width="17" height="30" rx="8"/><rect x="79" y="55" width="17" height="30" rx="8"/></>,
  camera: <><rect x="23" y="35" width="74" height="52" rx="10"/><circle cx="60" cy="61" r="16"/><path d="M39 35l7-11h27l8 11"/></>,
  speaker: <><rect x="35" y="19" width="50" height="82" rx="10"/><circle cx="60" cy="69" r="19"/><circle cx="60" cy="38" r="8"/></>,
  watch: <><rect x="37" y="29" width="46" height="62" rx="13"/><path d="M46 29l4-18h20l4 18M46 91l4 18h20l4-18"/><path d="M60 45v18l12 7"/></>,
  utility: <><path d="M34 101V48l26-26 26 26v53"/><path d="M48 101V70h24v31M60 22V10"/></>,
  card: <><rect x="18" y="30" width="84" height="60" rx="10"/><path d="M18 49h84M31 70h24"/></>,
  mobile: <><rect x="38" y="12" width="44" height="96" rx="10"/><path d="M52 25h16M56 95h8"/></>,
  insurance: <><path d="M60 12 96 26v28c0 25-14 43-36 54-22-11-36-29-36-54V26z"/><path d="m43 60 11 11 23-26"/></>,
  clinic: <><rect x="22" y="30" width="76" height="72" rx="8"/><path d="M48 30V18h24v12M60 47v35M43 64h34"/></>,
  dental: <><path d="M37 20c-13 5-14 25-7 39 7 15 10 42 20 42 7 0 5-24 10-24s3 24 10 24c10 0 13-27 20-42 7-14 6-34-7-39-10-4-15 5-23 5s-13-9-23-5z"/></>,
  therapy: <><circle cx="60" cy="31" r="14"/><path d="M60 45v29M33 62h54M42 108l18-34 18 34"/></>,
  lab: <><path d="M45 14h30M52 14v31L28 91c-4 8 1 17 10 17h44c9 0 14-9 10-17L68 45V14"/><path d="M40 77h40"/></>,
  coast: <><circle cx="83" cy="31" r="13"/><path d="M12 76c18-15 29 15 47 0s29 15 49 0M12 93c18-15 29 15 47 0s29 15 49 0"/></>,
  mountain: <><path d="m10 101 34-62 16 24 13-21 37 59z"/><path d="m36 54 8 11 7-12"/></>,
  city: <><path d="M18 105V48h28v57M46 105V22h31v83M77 105V58h25v47M28 61h8M28 75h8M56 38h10M56 54h10M56 70h10M87 72h7"/></>,
  island: <><path d="M15 97c20-12 70-12 90 0M59 86c0-24 8-42 24-55M79 33c-10-7-22-7-32 0M82 32c9-8 19-9 29-4M60 86c-11-10-24-13-38-8"/></>,
  laptop: <><rect x="26" y="20" width="68" height="55" rx="6"/><path d="M15 89h90l-8 12H23z"/></>,
  chair: <><path d="M34 20v44h52V20M31 64h58v18H31zM41 82v25M79 82v25"/></>,
  conference: <><rect x="22" y="29" width="76" height="57" rx="8"/><circle cx="60" cy="51" r="9"/><path d="M43 75c4-10 30-10 34 0M16 99h88"/></>,
  security: <><path d="M60 12 96 27v29c0 24-13 41-36 53-23-12-36-29-36-53V27z"/><rect x="45" y="50" width="30" height="26" rx="5"/><path d="M51 50v-7a9 9 0 0 1 18 0v7"/></>,
  auto: <><path d="m25 73 7-24c2-7 7-11 14-11h28c7 0 12 4 14 11l7 24"/><path d="M20 72h80v22H20zM31 94v10M89 94v10M35 80h1M84 80h1M39 57h42"/></>,
  home: <><path d="m18 59 42-36 42 36M29 53v52h62V53M49 105V72h22v33"/><path d="M77 35V21h12v25"/></>,
  identity: <><rect x="20" y="27" width="80" height="66" rx="10"/><circle cx="45" cy="53" r="10"/><path d="M29 80c4-13 28-13 32 0M68 48h20M68 62h20M68 76h13"/></>,
  roadside: <><path d="M25 93h70M34 93l8-58h36l8 58M47 57h26M52 77h16"/><path d="M60 35V19M51 27h18"/></>,
};

export default function ExperienceArtwork({ kind, colors, compact = false, large = false, image, imagePosition }: ExperienceArtworkProps) {
  return (
    <S.Artwork $colors={colors} $compact={compact} $large={large} aria-hidden="true">
      {image ? (
        <S.ArtworkPhoto $position={imagePosition} $src={image} />
      ) : (
        <svg viewBox="0 0 120 120" role="presentation">
          {paths[kind]}
        </svg>
      )}
    </S.Artwork>
  );
}
