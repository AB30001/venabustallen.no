/**
 * Rewrite NordExplore articles with richer researched copy (same slugs/links).
 * Usage: node --env-file=.env.local scripts/rewrite-nordexplore-articles.mjs
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "thxhf26m",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN,
  useCdn: false
});

const HOME = "https://www.nordexplore.com/";
const ALTA =
  "https://www.nordexplore.com/experiences/horseback-riding-204916P3";
const CHILDREN =
  "https://www.nordexplore.com/experiences/childrens-riding-on-fokhol-grd-5561420P2";
const SLEIGH =
  "https://www.nordexplore.com/experiences/experience-carriage-and-sleigh-rides-on-fokhol-grd-5561420P1";

function key() {
  return Math.random().toString(36).slice(2, 10);
}

function plain(text, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }]
  };
}

function rich(parts, style = "normal") {
  const markDefs = [];
  const children = [];
  for (const part of parts) {
    if (typeof part === "string") {
      children.push({ _type: "span", _key: key(), text: part, marks: [] });
      continue;
    }
    const markKey = key();
    markDefs.push({
      _type: "link",
      _key: markKey,
      href: part.href,
      blank: true
    });
    children.push({
      _type: "span",
      _key: key(),
      text: part.text,
      marks: [markKey]
    });
  }
  return { _type: "block", _key: key(), style, markDefs, children };
}

const fokholBody = [
  plain(
    "Fokhol Gård ligger i Stange Vestbygd i Innlandet – et stykke jordbrukslandskap med jorder, skogkanter og den typen stille som passer godt for familier som vil møte hest uten stress. Her drives hestene ikke som sportshester på bane, men som arbeidshester: rolige, vant til mennesker, og brukt i gårdsarbeid gjennom året. Det merkes når du kommer på besøk. Tempo er lavt, forventningene er realistiske, og opplevelsene er bygget rundt trygghet og nærkontakt – ikke adrenalin."
  ),
  plain(
    "Hvis du planlegger en dagstur fra Oslo-området, Mjøsa-regionen eller et opphold i Innlandet, er Fokhol et konkret svar på spørsmålet «hvor kan barna ri trygt – og hva gjør vi hvis noen i familien heller vil sitte i vogn?» Gården dekker begge deler, og du kan booke opplevelsene samlet via NordExplore."
  ),
  plain("Arbeidshester, ikke show", "h2"),
  plain(
    "På Fokhol er hestene en del av gårdsdriften. Om vinteren trenes de blant annet med trekk og slede; om sommeren kan de bidra i hage- og jordarbeid. Det er en annen kultur enn ridesenter med mange byttende ryttere. For besøkende betyr det ofte mer forutsigbare, «kaldhodede» hester – Ardenner-type arbeidshest med rolig sinn – som tåler nye fjes, barnelyder og stopp-og-start langs gårdsveien."
  ),
  plain(
    "Det er også derfor stedet fungerer godt for førstegangsryttere: du blir ikke presset inn i en konkurranselogikk. Du får en guidet, kort og oversiktlig opplevelse der sikkerhet og glede kommer først."
  ),
  plain("Barneridning på Fokhol Gård", "h2"),
  plain(
    "Barneridningen er laget for hele familien, men med barnet i fokus. Opplevelsen varer typisk rundt én time i NordExplore-oppføringen, og inkluderer utstyr til hesten samt ridetjelm til rytteren. Du møter opp på parkeringsplassen ved gården – enkelt å finne, og praktisk når du har barnevogn, søsken og sekk med ekstra klær."
  ),
  plain(
    "Hestene beskrives som rolige arbeidshingster/arbeidshester egnet for nybegynnere og små hesteentusiaster. Det betyr ikke at «alle barn kan alt»: voksne bør fortsatt følge anvisninger, holde ro rundt hesten, og være ærlig om barnets alder, høyde og eventuelle frykt. Mange gårder ber om at et barn som trenger følgehest har en voksen som leder – sjekk alltid detaljene på bookingsiden før du kommer."
  ),
  rich([
    "Vil du se prisnivå, ledige tider og eksakte vilkår, book direkte via ",
    {
      text: "barneridning på Fokhol Gård hos NordExplore",
      href: CHILDREN
    },
    ". Der får du mobilbillett, engelsk/norsk informasjon og tydelig avbestillingsfrist (vanligvis full refusjon ved avbestilling minst 24 timer før)."
  ]),
  plain("Praktiske tips til barneridning", "h2"),
  plain(
    "Kle barnet i lukkede sko (ikke sandal), lange bukser og gjerne lag-på-lag. Hjelm skal sitte riktig – be om hjelp hvis den vipper. La barnet hilse på hesten i ro før oppsitting. Ta bilder etter at hesten er i gang, ikke midt i påstigning. Og husk: ryttere med ryggproblemer eller graviditet frarådes ofte – det står også i opplevelsesvilkårene."
  ),
  plain(
    "Har du flere barn, planlegg logistikk på forhånd. Noen ganger trengs én voksen per hest. Det er bedre å booke riktig antall plasser enn å håpe på ledig kapasitet i døra."
  ),
  plain("Vogn om sommeren, kane om vinteren", "h2"),
  plain(
    "Ikke alle i familien vil ri – og det er helt greit. Fokhol tilbyr også vogn- og kanefart gjennom Stange-landskapet: klapring av hover på sommersti, eller knirk og snøknase under meiene om vinteren. Opplevelsen er satt opp som omtrent én time, med varm drikke inkludert i NordExplore-beskrivelsen, og den passer både par, familier og små lag som vil ha noe felles uten å sitte i sal."
  ),
  plain(
    "Om sommeren er det vogn gjennom jorder og skogkanter. Om vinteren blir det kanefart når snøen ligger – ofte med pledd og varm kaffe eller te. På gården finnes også andre ting å gjøre etterpå: lekeplass om sommeren, akebakke om vinteren, og dyr som gjerne får besøk. Det gjør det lettere å bygge en halv eller hel dag rundt hesteopplevelsen, ikke bare en rask «innom og ut»-stopp."
  ),
  rich([
    "Book ",
    {
      text: "vogn- og kanefart på Fokhol Gård",
      href: SLEIGH
    },
    " via NordExplore når du vil ha den sesongriktige varianten samlet på én side. Der står også møtepunkt (gårdsparkering), tilgjengelighet og avbestillingsregler."
  ]),
  plain("Hvem passer Fokhol for?", "h2"),
  plain(
    "Barnefamilier som vil ha en rolig intro til hest. Besteforeldre som vil være med uten å ri. Par som vil ha en stille vintertur med kane. Og folk som er nysgjerrige på arbeidshestkulturen – hvordan hest fortsatt kan ha en rolle i norsk gårdsdrift, ikke bare i ridesport."
  ),
  plain(
    "Det passer dårligere hvis du jakter høy fart, dressurøvelser eller lange fjellritt. Da finnes andre typer turer andre steder i landet. Fokhols styrke er nærhet, ro og familievennlighet i et ekte gårds­miljø."
  ),
  plain("Slik booker du smart", "h2"),
  plain(
    "Bestill i god tid i høysesong (helger, ferier, snørike perioder). Les hva som er inkludert: hjelm og utstyr på ridning, drikke på vogn/kane. Sjekk vær: arrangører kan avlyse ved dårlig føre – da er det greit å ha fleksible planer for resten av dagen i Stange/Hamar-området."
  ),
  rich([
    "NordExplore er et praktisk sted å starte når du vil sammenligne norske opplevelser uten å jakte telefonnumre. Begynn gjerne på ",
    { text: "nordexplore.com", href: HOME },
    ", finn Fokhol-opplevelsene, og velg den kombinasjonen som passer alderen og været – ridning for barna, vogn eller kane for resten av følget."
  ]),
  plain(
    "Kort oppsummert: Fokhol Gård gir to tydelige innganger til hest – én i sal for de små, én i vogn eller kane for alle. Begge er jordnære, sesongbevisste og enkle å booke når du tar veien om Stange."
  )
];

const altaBody = [
  plain(
    "Å ri i Alta er noe annet enn en vanlig skogstur sørpå. Du er i Finnmark, like ved Altaelva, med arktisk lys, vidstrakt natur og – om vinteren – snødekte stier der trærne henger lavt over stien. Her handler ridningen om landskap og stillhet like mye som om teknikk. For mange er det nettopp kontrasten som sitter igjen: hestens pust i kald luft, knirk fra snø, og følelsen av å være langt fra bystøy selv om gården bare ligger omtrent ti minutter fra Alta sentrum."
  ),
  plain(
    "Opplevelsen som bookes via NordExplore tar deg til Flatmoen – en familie­drevet arktisk ranch/gård med villmark i flere retninger. Det er ikke et stort internasjonalt ridesenter. Det er et lite, personlig oppsett der guiden matcher hest og tempo til gruppen."
  ),
  plain("Flatmoen: arktisk ranch utenfor Alta", "h2"),
  plain(
    "Flatmoen Farm ligger i rolige omgivelser nær Alta. Mange turer inkluderer henting fra overnattingsstedet ditt, slik at du slipper å finne frem alene første gang. På gården hilser du på hestene, får en kort intro til hvordan de ulike individene fungerer, og så legger dere ut – til skog, sti og elvenære partier, avhengig av sesong og føre."
  ),
  plain(
    "Hestene i området inkluderer gjerne norske fjordhester og mer allsidige typer (blant annet quarter horse i Flatmoens eget tilbud). For deg som rytter betyr det stabile, hardføre dyr vant til nordnorsk vær – ikke glatte konkurransebaner. Om vinteren er skogen ofte kjent for elg; er du heldig, får du et glimt. Om sommeren kan midnattssol og elvelandskap dominere opplevelsen."
  ),
  plain("Hva NordExplore-turen faktisk er", "h2"),
  plain(
    "I NordExplore-oppføringen er horseback riding i Alta satt opp som en omtrent to timers opplevelse, med engelsk som språk, mobilbillett og alle avgifter inkludert. Anmelder­snittet ligger høyt (rundt 4,7 av 5 basert på et tjuetalls anmeldelser på tilknyttede plattformer), og de fleste anbefaler turen. Det er et nyttig signal hvis du vil unngå «tomme» turistfeller – men les fortsatt detaljene: nivå, alder, og hva som skjer ved dårlig vær."
  ),
  rich([
    "Når du er klar til å se ledige datoer og booke, gå direkte til ",
    { text: "hesteridning i Alta hos NordExplore", href: ALTA },
    ". Der finner du også avbestillingsfrist (vanligvis full refusjon minst 24 timer før) og eventuelle advarsler – for eksempel at turen ikke anbefales ved ryggskader eller graviditet, og at du bør ha middels fysisk form."
  ]),
  plain("Nybegynner eller erfaren – tempoet tilpasses", "h2"),
  plain(
    "En av de viktigste tingene med denne typen arktisk ridning er at gruppen ofte er liten, og at guiden kan holde skritt for nybegynnere, eller øke til trav og galopp hvis alle i følget mestrer det og underlaget tillater det. Det er ærlig sagt bedre enn å love «galopp for alle» på glatt vinterføre."
  ),
  plain(
    "Har du aldri ridd før: si ifra. Du får hjelp med sal, stigbøyler og balanse. Har du ridd mye: vær like tydelig – da kan turen bli mer aktiv, men fortsatt innenfor det som er trygt i skog og snø. Målet er ikke konkurranse; målet er å oppleve Alta på hesteryggen uten å ødelegge turen for resten av gruppen."
  ),
  plain("Vinter, snø og nordlys-sesong", "h2"),
  plain(
    "Vinterridning i Finnmark er sjeldnere enn sommerturer lenger sør – nettopp derfor føles det spesielt. Stiene kan være smale, snøen demper lyd, og kulda krever mer av deg som rytter: votter som funker med tøyler, varme lag under jakke, og gjerne et ekstra ullag hvis dere stopper ved et gapahuk eller bål for kaffe underveis (noe lignende turer i området ofte inkluderer)."
  ),
  plain(
    "I nordlys­sesongen (grovt sett høst til tidlig vår) er Alta et kjent utgangspunkt. Selve standardrideturen garanterer ikke nordlys – det er vær og solaktivitet – men kombinasjonen av mørketid, lite lysforurensning og tid ute øker sjansen for at kvelden føles magisk uansett. Noen lokal­tilbydere har også egne kveldsturer med middag; sjekk hva som ligger i den konkrete NordExplore-pakken du booker, så du ikke blander produkter."
  ),
  plain("Sommer og midnattssol", "h2"),
  plain(
    "Om sommeren endres hele rytmen. Det blir lysere, mygg kan være et tema nær vann, og turene kan følge elvelandskap med et mykere preg. Altaelva og omlandet gir en annen type «wow» enn snøskogen: grønt, vidde­følelse og lange kvelder. Uansett sesong: spør om fottøy, hjelm og om det finnes ekstra jakke på gården hvis været snur."
  ),
  plain("Slik forbereder du deg", "h2"),
  plain(
    "Bruk lukkede sko med litt hæl om mulig. Lange bukser. Lag-på-lag. Hansker. Solbriller om vinteren (snørefleks). Ta med vannflaske hvis du tåler kulde på den. Fortell om allergier, frykt eller tidligere fall. Og møt opp i tide – arktiske opplegg kjører ofte stramt for å treffe lys og føre."
  ),
  plain(
    "Offentlig transport nevnes som mulig nærliggende i opplevelses­infoen, men i praksis er det enklest med henting/taxi/leiebil første gang du skal til gården. Alta har flyplass og godt turist­grunnlag, så logistikken er overkommelig sammenlignet med mer isolerte vidde­turer."
  ),
  plain("Hvorfor booke via NordExplore?", "h2"),
  plain(
    "Du får én tydelig produktside med varighet, språk, vilkår og avbestilling – nyttig når du planlegger reise til Nord-Norge og skal stable flere aktiviteter. Det sparer deg for frem-og-tilbake på e-post, særlig hvis du booker fra utlandet."
  ),
  rich([
    "Utforsk flere norske naturopplevelser på ",
    { text: "NordExplore sin forside", href: HOME },
    ", eller gå rett til Alta-ridningen når datoene er klare. Enten du kommer for snøskogen, elgen, midnattssolen eller bare for å sitte i sal i Finnmark: dette er ridning der stedet er hovedpersonen – og hesten er måten du kommer inn i det på."
  ])
];

async function main() {
  if (!process.env.SANITY_API_WRITE_TOKEN && !process.env.SANITY_AUTH_TOKEN) {
    throw new Error("Missing token");
  }

  await client
    .patch("post-nordexplore-fokhol")
    .set({
      title: "Ridning for barn og hestekjøring på Fokhol Gård i Stange",
      excerpt:
        "Grundig guide til barneridning og vogn-/kanefart på Fokhol Gård i Stange: arbeidshester, tips til familier, sesong og booking via NordExplore.",
      body: fokholBody
    })
    .commit();
  console.log("Updated Fokhol article");

  await client
    .patch("post-nordexplore-alta")
    .set({
      title: "Hesteridning i Alta – arktisk ridetur på Flatmoen",
      excerpt:
        "Dybdeguide til hesteridning i Alta via Flatmoen: vinterskog, tempo etter nivå, forberedelser og booking av horseback riding hos NordExplore.",
      body: altaBody
    })
    .commit();
  console.log("Updated Alta article");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
