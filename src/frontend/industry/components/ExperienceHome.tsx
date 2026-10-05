// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ApiGateway from '../../gateways/Api.gateway';
import ProductPrice from '../../components/ProductPrice';
import { useCurrency } from '../../providers/Currency.provider';
import { CypressFields } from '../../utils/enums/CypressFields';
import { useIndustry } from '../IndustryProvider';
import { presentSupportedProducts } from '../adapters/productPresentation';
import { recordIndustryEvent, withIndustrySpan } from '../telemetry';
import ExperienceActionDialog from './ExperienceActionDialog';
import ExperienceArtwork from './ExperienceArtwork';
import * as S from './IndustryExperience.styled';

type ActionIcon = 'calendar' | 'card' | 'claim' | 'document' | 'message' | 'plus' | 'transfer';

const portalActions: Record<string, { icon: ActionIcon; label: string; detail: string }[]> = {
  banking: [
    { icon: 'transfer', label: 'Move money', detail: 'Transfer between accounts' },
    { icon: 'card', label: 'Manage cards', detail: 'Controls and statements' },
    { icon: 'plus', label: 'Deposit a check', detail: 'Mobile deposit' },
  ],
  healthcare: [
    { icon: 'calendar', label: 'Schedule a visit', detail: 'Primary and specialty care' },
    { icon: 'message', label: 'Message care team', detail: 'Secure conversations' },
    { icon: 'document', label: 'Health records', detail: 'Results and visit notes' },
  ],
  insurance: [
    { icon: 'claim', label: 'Start a claim', detail: 'We’ll guide each step' },
    { icon: 'document', label: 'Policy documents', detail: 'ID cards and coverage' },
    { icon: 'message', label: 'Talk to an advisor', detail: 'Get personal support' },
  ],
};

function relativeTravelDate(daysFromToday: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

function createInitialTravelSearch() {
  return {
    depart: relativeTravelDate(14),
    destination: 'San Francisco (SFO)',
    origin: 'New York (NYC)',
    returnDate: relativeTravelDate(21),
    travelers: '1',
  };
}

const flightTimes = [
  ['8:10 AM', '11:26 AM'],
  ['9:35 AM', '2:18 PM'],
  ['1:20 PM', '4:42 PM'],
  ['3:45 PM', '9:08 PM'],
];

function airportCode(value: string): string {
  return value.match(/\(([A-Z]{3})\)/)?.[1] || value.trim().slice(0, 3).toUpperCase();
}

function ActionGlyph({ icon }: { icon: ActionIcon }) {
  const paths: Record<ActionIcon, React.ReactNode> = {
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 9h16M8 13h3M8 16h6"/></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></>,
    claim: <><path d="M12 3 20 6v6c0 5-3 8-8 10-5-2-8-5-8-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
    document: <><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/></>,
    message: <><path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/></>,
    plus: <><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/></>,
    transfer: <><path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[icon]}</svg>;
}

function collectionDescription(industryId: string): string {
  if (industryId === 'banking') return 'Choose an upcoming payment to review amount, source account, and timing.';
  if (industryId === 'healthcare') return 'Review recent statements and resolve a balance through the secure payment flow.';
  return 'Review active policies and optional protection designed around your household.';
}

function rowAction(industryId: string): string {
  if (industryId === 'banking') return 'Pay bill';
  if (industryId === 'healthcare') return 'View statement';
  return 'Review coverage';
}

function supportCopy(industryId: string): { title: string; body: string; action: string } {
  if (industryId === 'banking') return { title: 'Financial guidance when you need it', body: 'Schedule time with a Harbor specialist or start a secure conversation.', action: 'Contact support' };
  if (industryId === 'healthcare') return { title: 'Need help with your care?', body: 'Connect with your care team for scheduling, billing, or records support.', action: 'Get patient support' };
  return { title: 'Claims support, day or night', body: 'Start a claim online or connect with an Evergreen specialist for help.', action: 'View claims center' };
}

export default function ExperienceHome() {
  const { industry, industryHref } = useIndustry();
  const { selectedCurrency } = useCurrency();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [initialTravelSearch] = useState(createInitialTravelSearch);
  const [travelForm, setTravelForm] = useState(initialTravelSearch);
  const [travelSearch, setTravelSearch] = useState(initialTravelSearch);
  const [isTravelSearching, setIsTravelSearching] = useState(false);
  const closeAction = useCallback(() => setActiveAction(null), []);

  useEffect(() => {
    setSearch('');
    setCategory('All');
    setActiveAction(null);
    const nextTravelSearch = createInitialTravelSearch();
    setTravelForm(nextTravelSearch);
    setTravelSearch(nextTravelSearch);
    recordIndustryEvent(industry.id, industry.primaryJourney, 'home_viewed');
  }, [industry.id]);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', selectedCurrency, 'industry', industry.id],
    queryFn: () => withIndustrySpan(
      industry.id,
      industry.primaryJourney,
      'records_load',
      () => ApiGateway.listProducts(selectedCurrency)
    ),
    enabled: Boolean(selectedCurrency),
    retry: false,
  });
  const presentedProducts = useMemo(() => presentSupportedProducts(products, industry), [industry, products]);
  const categories = useMemo(() => ['All', ...new Set(presentedProducts.map(product => product.category))], [presentedProducts]);
  const visibleProducts = presentedProducts.filter(product => {
    const matchesCategory = category === 'All' || product.category === category;
    const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return matchesCategory && haystack.includes(search.trim().toLowerCase());
  });

  const runTravelSearch = async (event: FormEvent) => {
    event.preventDefault();
    setIsTravelSearching(true);
    try {
      await withIndustrySpan(
        industry.id,
        industry.primaryJourney,
        'search_submit',
        () => ApiGateway.listProducts(selectedCurrency)
      );
      setTravelSearch({ ...travelForm });
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } finally {
      setIsTravelSearching(false);
    }
  };

  const swapTravelRoute = () => {
    setTravelForm(current => ({ ...current, destination: current.origin, origin: current.destination }));
    recordIndustryEvent(industry.id, industry.primaryJourney, 'route_swap');
  };

  const support = supportCopy(industry.id);

  return (
    <S.Page $colors={industry.colors} data-cy={CypressFields.HomePage}>
      {industry.id === 'travel' ? (
        <S.TravelHero $colors={industry.colors}>
          <S.Content>
            <S.TravelHeroGrid>
              <S.TravelHeroCopy>
                <S.Kicker $colors={industry.colors}>{industry.hero.kicker}</S.Kicker>
                <h1>{industry.hero.title}</h1>
                <p>{industry.hero.description}</p>
              </S.TravelHeroCopy>
              <S.TravelHeroMedia>
                <img alt="Travel destinations and an airplane journey" src={industry.heroImage} />
              </S.TravelHeroMedia>
            </S.TravelHeroGrid>
            <S.TravelSearchPanel $colors={industry.colors} onSubmit={event => void runTravelSearch(event)}>
              <S.TravelModes aria-label="Search type">
                <button aria-pressed="true" type="button"><ActionGlyph icon="transfer" />Flights</button>
                <button aria-pressed="false" onClick={() => setActiveAction('Search stays')} type="button">Stays</button>
                <button aria-pressed="false" onClick={() => setActiveAction('Search cars')} type="button">Cars</button>
              </S.TravelModes>
              <S.TravelMeta><span>Round trip</span><span>Economy</span></S.TravelMeta>
              <S.TravelFields>
                <label><small>From</small><input aria-label="Origin" onChange={event => setTravelForm(current => ({ ...current, origin: event.target.value }))} value={travelForm.origin} /></label>
                <S.Swap aria-label="Swap origin and destination" data-cy={CypressFields.TravelSwap} onClick={swapTravelRoute} type="button">⇄</S.Swap>
                <label><small>To</small><input aria-label="Destination" onChange={event => setTravelForm(current => ({ ...current, destination: event.target.value }))} value={travelForm.destination} /></label>
                <label><small>Depart</small><input aria-label="Departure date" onChange={event => setTravelForm(current => ({ ...current, depart: event.target.value }))} value={travelForm.depart} /></label>
                <label><small>Return</small><input aria-label="Return date" onChange={event => setTravelForm(current => ({ ...current, returnDate: event.target.value }))} value={travelForm.returnDate} /></label>
                <label><small>Travelers</small><select aria-label="Travelers" onChange={event => setTravelForm(current => ({ ...current, travelers: event.target.value }))} value={travelForm.travelers}><option value="1">1 adult</option><option value="2">2 adults</option></select></label>
                <S.TravelSubmit data-cy={CypressFields.TravelSearch} disabled={isTravelSearching} $colors={industry.colors} type="submit">{isTravelSearching ? 'Searching…' : 'Search flights'}</S.TravelSubmit>
              </S.TravelFields>
            </S.TravelSearchPanel>
          </S.Content>
        </S.TravelHero>
      ) : (
        <S.PortalHero $colors={industry.colors}>
          <S.Content>
            <S.PortalHeroGrid>
              <S.PortalHeroCopy>
                <S.Kicker $colors={industry.colors}>{industry.hero.kicker}</S.Kicker>
                <h1>{industry.hero.title}</h1>
                <p>{industry.hero.description}</p>
                <S.PrimaryLink $colors={industry.colors} href={industryHref('/', 'collection')}>{industry.hero.action}</S.PrimaryLink>
              </S.PortalHeroCopy>
              <S.PortalHeroMedia $colors={industry.colors}>
                <img alt="" src={industry.heroImage} />
              </S.PortalHeroMedia>
            </S.PortalHeroGrid>
            <S.QuickActions>
              {(portalActions[industry.id] || []).map(action => (
                <S.QuickAction $colors={industry.colors} key={action.label} onClick={() => setActiveAction(action.label)} type="button">
                  <S.ActionIcon $colors={industry.colors}><ActionGlyph icon={action.icon} /></S.ActionIcon>
                  <span><strong>{action.label}</strong><small>{action.detail}</small></span>
                  <i>→</i>
                </S.QuickAction>
              ))}
            </S.QuickActions>
          </S.Content>
        </S.PortalHero>
      )}

      <S.Content>
        <S.Stats $flush={industry.id === 'travel'}>
          {industry.stats.map(stat => (
            <S.Stat $colors={industry.colors} key={stat.label}>
              <span>{stat.label}</span>
              <strong>{industry.id === 'travel' && stat.label === 'Flexible dates' ? `${travelSearch.depart}–${travelSearch.returnDate}` : stat.value}</strong>
              <small>{stat.detail}</small>
            </S.Stat>
          ))}
        </S.Stats>

        <S.Section id="collection">
          <S.SectionHeader>
            <div>
              {industry.id === 'travel' ? <S.ResultEyebrow>{travelSearch.origin} to {travelSearch.destination} · Round trip</S.ResultEyebrow> : null}
              <h2>{industry.terminology.collection}</h2>
              <p>{industry.id === 'travel' ? `${travelSearch.depart} – ${travelSearch.returnDate} · ${travelSearch.travelers} ${travelSearch.travelers === '1' ? 'traveler' : 'travelers'} · Economy` : collectionDescription(industry.id)}</p>
            </div>
            <S.Search
              aria-label={`Search ${industry.terminology.items}`}
              $colors={industry.colors}
              data-cy={CypressFields.IndustrySearch}
              onChange={event => setSearch(event.target.value)}
              placeholder={industry.id === 'travel' ? 'Filter airlines or routes' : `Search ${industry.terminology.items}`}
              value={search}
            />
          </S.SectionHeader>
          <S.Filters aria-label="Filter by category">
            {categories.map(value => (
              <S.Filter
                $active={category === value}
                $colors={industry.colors}
                key={value}
                onClick={() => setCategory(value)}
                type="button"
              >
                {value}
              </S.Filter>
            ))}
          </S.Filters>

          {isLoading ? <S.Loading>Loading options…</S.Loading> : null}
          {error ? <S.ErrorMessage role="alert">The requested records could not be loaded. Try again or inspect the frontend records trace.</S.ErrorMessage> : null}
          {!isLoading && !error && industry.id === 'travel' ? (
            <S.FlightList data-cy={CypressFields.ProductList}>
              {visibleProducts.map((product, index) => (
                <S.FlightLink href={industryHref(`/product/${product.id}`)} key={product.id}>
                  <S.FlightCard $colors={industry.colors} data-cy={CypressFields.ProductCard}>
                    <S.FlightImage $position={product.imagePosition} $src={product.image!} />
                    <S.FlightDetails>
                      <S.FlightBrand><span>{product.name.slice(0, 1)}</span><strong>{product.name}</strong><small>{index % 2 ? 'Operated with a trusted partner' : 'Roam recommended'}</small></S.FlightBrand>
                      <S.FlightRoute>{airportCode(travelSearch.origin)} {flightTimes[index][0]} → {airportCode(travelSearch.destination)} {flightTimes[index][1]}</S.FlightRoute>
                      <p>{product.description}</p>
                      <S.FlightBadges><span>{product.category}</span><span>Carry-on included</span><span>{index % 2 ? 'Free changes' : 'Seat choice'}</span></S.FlightBadges>
                    </S.FlightDetails>
                    <S.FlightPrice $colors={industry.colors}>
                      <small>Round trip</small>
                      <strong><ProductPrice price={product.backend.priceUsd!} /></strong>
                      <span>Select flight</span>
                    </S.FlightPrice>
                  </S.FlightCard>
                </S.FlightLink>
              ))}
            </S.FlightList>
          ) : null}
          {!isLoading && !error && industry.id !== 'travel' ? (
            <S.ProductGrid $layout={industry.layout} data-cy={CypressFields.ProductList}>
              {visibleProducts.map(product => (
                <S.ProductLink href={industryHref(`/product/${product.id}`)} key={product.id}>
                  <S.ProductCard $colors={industry.colors} $layout={industry.layout} data-cy={CypressFields.ProductCard}>
                    <ExperienceArtwork colors={industry.colors} compact kind={product.artwork} />
                    <S.CardBody $layout={industry.layout}>
                      <S.Eyebrow $colors={industry.colors}>{product.eyebrow}</S.Eyebrow>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </S.CardBody>
                    <S.CardFooter $colors={industry.colors} $layout={industry.layout}>
                      <strong><ProductPrice price={product.backend.priceUsd!} /></strong>
                      <span>{rowAction(industry.id)} →</span>
                    </S.CardFooter>
                  </S.ProductCard>
                </S.ProductLink>
              ))}
            </S.ProductGrid>
          ) : null}
          {!isLoading && !error && visibleProducts.length === 0 ? (
            <S.Empty $colors={industry.colors}><h1>No matches</h1><p>Try a different search or category.</p></S.Empty>
          ) : null}
        </S.Section>

        {industry.activity.length > 0 && (
          <S.Section id="activity">
            <S.SectionHeader><div><h2>{industry.id === 'travel' ? 'Plan with confidence' : 'Recent activity'}</h2><p>{industry.id === 'travel' ? 'Useful details for a smoother trip.' : 'The latest updates from your account.'}</p></div></S.SectionHeader>
            <S.ActivityGrid>
              <S.Panel $colors={industry.colors}>
                <h3>{industry.id === 'travel' ? 'Destination guides' : industry.id === 'healthcare' ? 'Care timeline' : industry.id === 'insurance' ? 'Policy updates' : 'Account activity'}</h3>
                {industry.activity.map(item => (
                  <S.ActivityRow $colors={industry.colors} key={item.title}>
                    <div><strong>{item.title}</strong><small>{item.detail}</small></div>
                    <span>{item.status}</span>
                  </S.ActivityRow>
                ))}
              </S.Panel>
              <S.SupportPanel $colors={industry.colors}>
                <S.ActionIcon $colors={industry.colors}><ActionGlyph icon="message" /></S.ActionIcon>
                <h3>{industry.id === 'travel' ? 'Trip support from search to landing' : support.title}</h3>
                <p>{industry.id === 'travel' ? 'Manage itinerary details and get help throughout the demo booking flow.' : support.body}</p>
                <button onClick={() => setActiveAction(industry.id === 'travel' ? 'Visit help center' : support.action)} type="button">{industry.id === 'travel' ? 'Visit help center' : support.action}</button>
              </S.SupportPanel>
            </S.ActivityGrid>
          </S.Section>
        )}
        <S.Notice $colors={industry.colors}>{industry.demoNotice}</S.Notice>
      </S.Content>
      <ExperienceActionDialog action={activeAction} onClose={closeAction} />
    </S.Page>
  );
}
