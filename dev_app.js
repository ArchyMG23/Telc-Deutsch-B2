import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=a3e6033d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=a3e6033d"; const useState = __vite__cjsImport1_react["useState"]; const useEffect = __vite__cjsImport1_react["useEffect"]; const useCallback = __vite__cjsImport1_react["useCallback"]; const useMemo = __vite__cjsImport1_react["useMemo"];
import { UploadSection } from "/src/components/UploadSection.tsx";
import { TrainingInterface } from "/src/components/TrainingInterface.tsx";
import { StudentDashboard } from "/src/components/StudentDashboard.tsx";
import { InstallPWA } from "/src/components/InstallPWA.tsx";
import { extractExercises, evaluateWriting } from "/src/services/gemini.ts";
import { Plus, CheckCircle, Clock, WifiOff, LogIn, LogOut, Cloud, User as UserIcon, Users, Menu, X, Search } from "/node_modules/.vite/deps/lucide-react.js?v=9bd12c6a";
import { auth, loginWithGoogle, logout, db, OperationType, handleFirestoreError, updateUserRole, loginWithEmail, signUpWithEmail } from "/src/lib/firebase.ts";
import { onAuthStateChanged } from "/node_modules/.vite/deps/firebase_auth.js?v=ead926f0";
import { collection, doc, setDoc, onSnapshot, serverTimestamp, query, orderBy, where } from "/node_modules/.vite/deps/firebase_firestore.js?v=92cffc81";
import { TeacherDashboard } from "/src/components/TeacherDashboard.tsx";
const DEFAULT_EXERCISES = [
  {
    id: "default-1",
    title: "Beschwerde: Sprachreise nach Berlin",
    situation: 'Sie haben eine zweiwöchige Sprachreise nach Berlin gebucht. In der Anzeige stand: "Zentrale Unterkunft, kleine Gruppen (max. 8 Personen), erfahrene Lehrer". Vor Ort war die Unterkunft jedoch 45 Minuten vom Zentrum entfernt, die Gruppe bestand aus 15 Personen und der Lehrer war oft unpünktlich.',
    content: 'Schreiben Sie eine Beschwerde an den Veranstalter "Global Languages". Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens\n- Erwartungen vs. Realité (Unterkunft, Gruppengröße)\n- Kritik am Unterricht\n- Forderung (z.B. Teilrückzahlung)',
    type: "Beschwerde"
  },
  {
    id: "default-2",
    title: "Bitte um Informationen: Freiwilligenarbeit",
    situation: "Sie interessieren sich für ein projet zur Freiwilligenarbeit im Umweltschutz in den Alpen. Sie haben eine Anzeige im Internet gesehen, aber es fehlen wichtige Details.",
    content: 'Schreiben Sie eine E-Mail an die Organisation "Alpen-Natur". Bitten Sie um Informationen zu folgenden Punkten:\n- Dauer des Projekts und tägliche Arbeitszeit\n- Unterkunft und Verpflegung\n- Voraussetzungen (Sprachkenntnisse, Erfahrung)\n- Kosten oder Aufwandsentschädigung',
    type: "Information"
  },
  {
    id: "default-3",
    title: "Bewerbung um ein Praktikum",
    situation: 'Sie haben im Internet eine Anzeige für ein dreimonatiges Praktikum im Bereich Marketing bei der Firma "Mediadesign" in Hamburg gefunden.',
    content: "Schreiben Sie Ihre Bewerbung. Behandeln Sie folgende Punkte:\n- Grund für Ihre Bewerbung\n- Ihre bisherigen Erfahrungen and Sprachkenntnisse\n- Warum Sie für dieses Unternehmen arbeiten möchten\n- Fragen zum genauen Arbeitsbeginn",
    type: "Bewerbung"
  },
  {
    id: "default-4",
    title: "Beschwerde: Mietwagen im Urlaub",
    situation: 'Für Ihren einwöchigen Familienurlaub in Spanien haben Sie online bei "Rent-a-Car Premium" einen geräumigen SUV mit voll ausgestatteter Klimaanlage gebucht. Bei der Abholung am Flughafen erhielten Sie jedoch einen kleinen, dreitürigen Kleinwagen. Zudem funktionierte die Klimaanlage nicht, und der Kindersitz fehlte. Trotz mehrmaliger Bitten verweigerte der Kundenservice vor Ort jegliche Unterstützung oder einen Fahrzeugwechsel.',
    content: 'Schreiben Sie eine Beschwerde an die Zentrale von "Rent-a-Car Premium". Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens\n- Abweichungen zwischen Buchung und erhaltenem Fahrzeug\n- Mangelnde Ausstattung (Klimaanlage, Kindersitz) und die Folgen\n- Unkooperatives Verhalten des Kundenservices\n- Angemessene finanzielle Entschädigung',
    type: "Beschwerde"
  },
  {
    id: "default-5",
    title: 'Beschwerde: Festival "Rock am See"',
    situation: 'Sie haben für das zweitägige Musikfestival "Rock am See" teure VIP-Tickets erworben, die laut Veranstalter separaten Zugang, erstklassiges Catering, exklusiven VIP-Bereich nah an der Bühne und ein Treffen mit den Künstlern beinhalteten. Die Realität war enttäuschend: Es gab keinen VIP-Eingang, die Schlangen waren stundenlang, der VIP-Bereich war überfüllt und zwei Hauptbands traten ohne Ersatz nicht auf.',
    content: 'Schreiben Sie eine Beschwerde an die Eventagentur "SummerVibes GmbH". Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens\n- Fehlende vertraglich vereinbarte Leistungen (VIP-Vorteile)\n- Enttäuschung über das Catering und die Organisation\n- Ausfall der Künstler und unzureichende Kommunikation\n- Forderung auf Rückerstattung eines Teils des Ticketpreises',
    type: "Beschwerde"
  },
  {
    id: "default-6",
    title: "Beschwerde: Online-Kauf eines Laptops",
    situation: 'Sie haben online über das Portal "Refurbished-Tech" ein generalüberholtes Notebook der Premiumklasse bestellt. Laut Beschreibung sollte das Gerät im Zustand "Wie neu" sein und inklusive Originalladegerät und Schutzhülle geliefert werden. Das gelieferte Notebook hatte jedoch deutliche Kratzer auf dem Bildschirm, die Akkulaufzeit lag unter 30 Minuten und das Zubehör fehlte komplett.',
    content: 'Schreiben Sie eine Beschwerde an "Refurbished-Tech Kundenservice". Behandeln Sie folgende Punkte:\n- Grund des Schreibens und Bestelldaten\n- Beschreibung der Mängel am Gerät\n- Fehlendes Zubehör (Ladegerät, Hülle)\n- Enttäuschung über die Qualitätsbeschreibung ("Wie neu")\n- Fristsetzung zur Nachbesserung, Umtausch oder Rückgabe des Geldes',
    type: "Beschwerde"
  },
  {
    id: "default-7",
    title: "Bitte um Informationen: Intensivsprachkurs in Wien",
    situation: 'Sie planen, im kommenden Herbst Ihre Deutschkenntnisse zu vertiefen und sich auf die C1-Prüfung vorzubereiten. Sie stoßen auf das Angebot des "Dialog-Instituts in Wien". Das Online-Angebot klingt vielversprechend, lässt aber wesentliche organisatorische Details offen.',
    content: 'Schreiben Sie eine E-Mail an das "Dialog-Institut Wien". Bitten Sie um Informationen zu folgenden Punkten:\n- Genaue Unterrichtszeiten und Gruppengröße\n- Unterstützung bei der Wohnungssuche oder Unterkunftsmöglichkeiten\n- Spezifischer Ablauf der Vorbereitung auf die C1-Prüfung (Simulationsprüfungen)\n- Stornierungsbedingungen und Fristen bei Visumsproblemen',
    type: "Information"
  },
  {
    id: "default-8",
    title: "Bitte um Informationen: Auslandspraktikum in New York",
    situation: 'Die Vermittlungsagentur "GlobalCareers" bietet sechsmonatige bezahlte Praktika im Bereich Event-Marketing und Kommunikation in New York an. Sie finden das Angebot äußerst attraktiv, benötigen jedoch klärende Details.',
    content: 'Schreiben Sie eine Anfrage-E-Mail an "GlobalCareers". Fragen Sie nach:\n- Kriterien für die Auswahl der Bewerber und notwendige Englischzertifikate\n- Durchschnittliche Höhe des Stipendiums / der Vergütung\n- Unterstützung bei der Beantragung des J-1 Visums\n- Vermittlungsgebühren und zusätzliche Kosten (z.B. Krankenversicherung)',
    type: "Information"
  },
  {
    id: "default-9",
    title: "Bitte um Informationen: Messeteilnahme für Start-ups",
    situation: 'Sie vertreten das junge Food-Startup "ChocoBio" und möchten Ihr Produkt auf der Leitmesse "EcoFood Expo" in Köln präsentieren. Auf der Website finden Sie zwar das Anmeldeformular, aber keine Detailinformationen für Erstaussteller.',
    content: 'Schreiben Sie eine E-Mail an das Messeteam der "EcoFood Expo". Klären Sie folgende Punkte:\n- Kosten pro Quadratmeter für einen kleinen Ausstellungsstand\n- Möglichkeit der Beteiligung an der Startup-Area (Sonderkonditionen)\n- Zur Verfügung gestellte technische Ausstattung (Strom, Kühlgeräte)\n- Werbemöglichkeiten im offiziellen Messekatalog und auf der Website',
    type: "Information"
  },
  {
    id: "default-10",
    title: "Bewerbung: Mitarbeiter an der Hotelrezeption",
    situation: 'Das Grand Hotel "Vier Jahreszeiten" in München sucht für die Sommersaison eine Aushilfe (m/w/d) an der Rezeption und für die Gästebetreuung. Vorausgesetzt werden verhandlungssichere Deutsch- und Englischkenntnisse sowie ein freundliches Auftreten.',
    content: "Schreiben Sie Ihr Bewerbungsschreiben. Gehen Sie auf folgende Punkte ein:\n- Grund für Ihre Bewerbung und Bezugnahme auf die Stellenanzeige\n- Ihre Sprachkenntnisse und Ausbildung\n- Bisherige Kundenservice- oder Gastronomieerfahrungen\n- Motivation, für dieses renommierte Hotel zu arbeiten\n- Ihre zeitliche Verfügbarkeit im Sommer",
    type: "Bewerbung"
  },
  {
    id: "default-11",
    title: 'Bewerbung: Duales Studium "Tourismusmanagement"',
    situation: 'Sie interessieren sich für ein dreijähriges duales Studium im Bereich Tourismusmanagement mit einem Mix aus Theoriezeiten an der Hochschule und Praxisphasen bei der "Rheinland Reise Gruppe GmbH". Diese vergibt für das nächste Studienjahr zwei begehrte Plätze.',
    content: 'Schreiben Sie Ihre Bewerbung für das Duale Studium an die Personalabteilung der "Rheinland Reise Gruppe". Behandeln Sie folgende Punkte:\n- Warum Sie sich für den Studiengang Tourismusmanagement entschieden haben\n- Ihre schulischen Leistungen und relevanten Sprachkenntnisse (Deutsch, Englisch)\n- Erste Erfahrungen im Tourismus- oder Servicebereich\n- Warum Sie die Rheinland Reise Gruppe als Praxispartner wählen\n- Ihre Erwartungen an das duale System',
    type: "Bewerbung"
  },
  {
    id: "default-12",
    title: "Bewerbung: Aushilfe in einer Buchhandlung",
    situation: 'Die traditionsreiche Buchhandlung "Buch & Kaffee" in Frankfurt sucht ab sofort eine studentische Aushilfe (m/w/d) für die Wochenenden (Samstage) zur Betreuung der Kunden und zur Pflege der Buchbestände.',
    content: "Schreiben Sie Ihre Bewerbung an den Inhaber Herrn Peters. Behandeln Sie folgende Punkte:\n- Warum Sie in einer Buchhandlung arbeiten möchten\n- Ihre persönliche Lese-Affinität und Lieblingsgenres\n- Ihre Erfahrungen im Umgang mit Kunden (Freundlichkeit, Service)\n- Ihre Zuverlässigkeit und zeitliche Flexibilität am Samstag\n- Ihr gewünschter Arbeitsbeginn",
    type: "Bewerbung"
  },
  {
    id: "default-13",
    title: "Beschwerde: Wellness-Wochenende",
    situation: 'Sie haben zur Entspannung ein "Premium-Wellness-Wochenende" im Hotel "Alpenoase" gebucht. Laut Prospekt: beheizter Infinity-Pool, ruhige Lage, 5-Sterne-Zimmerservice und drei Massagen inklusive. Vor Ort: Der Pool war wegen Bauarbeiten gesperrt, lauter Lärm im Hotel ab 7 Uhr morgens, der Zimmerservice unvollständig und es gab nur eine Massage, weil das Personal unterbesetzt war.',
    content: "Schreiben Sie eine Beschwerde an die Hotelleitung. Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens\n- Kritik an den Wellness-Anlagen (Pool-Schließung)\n- Lärmbelästigung und mangelnder Service\n- Nicht erbrachte gebuchte Leistungen (Massagen)\n- Forderung nach einer angemessenen Entschädigung",
    type: "Beschwerde"
  },
  {
    id: "default-14",
    title: "Bitte um Infos: Weiterbildung Projektmanagement",
    situation: 'Sie sind berufstätig im Bereich Logistik und möchten eine zertifizierte berufsbegleitende Weiterbildung im Bereich "Agiles Projektmanagement" absolvieren. Sie haben ein Angebot der Akademie "EduFuture" online gefunden.',
    content: 'Schreiben Sie eine E-Mail an das Sekretariat der Akademie "EduFuture". Klären Sie folgende Punkte:\n- Genaue Termine und Uhrzeiten (Abend- oder Wochenendkurse)\n- Anerkennung des Zertifikats (z.B. PMI oder Scrum Alliance)\n- Kosten und Förderungsmöglichkeiten (z.B. Bildungsgutschein)\n- Voraussetzungen für die Teilnahme an der Abschlussprüfung',
    type: "Information"
  },
  {
    id: "default-15",
    title: "Bewerbung: Aushilfe im Fitnessstudio",
    situation: 'Das Fitnessstudio "Fit&Fun" in Ihrer Stadt sucht eine studentische Aushilfe (m/w/d) für die Anmeldung, die Getränkebar und die gelegentliche Betreuung der Trainingsfläche am Wochenende.',
    content: "Schreiben Sie Ihre Bewerbung an den Studioleiter Herrn Müller. Behandeln Sie folgende Punkte:\n- Bezugnahme auf die Ausschreibung und Grund der Bewerbung\n- Ihre persönliche Sportbegeisterung und Fitnesskenntnisse\n- Erfahrungen im Umgang mit Kunden und Servicebereitschaft\n- Ihre zeitliche Verfügbarkeit am Wochenende\n- Ihr gewünschter Arbeitsbeginn",
    type: "Bewerbung"
  },
  {
    id: "default-16",
    title: "Beschwerde: Online-Möbelbestellung",
    situation: 'Sie haben beim Online-Möbelhaus "WoodStyle" ein hochwertiges Ecksofa aus Echtleder bestellt. Die Lieferzeit sollte maximal 10 Werktage betragen. Das Sofa kam erst nach 6 Wochen an. Zudem hat es die falsche Farbe (Dunkelblau statt Cognac-Braun) und an der Rückseite befindet sich ein auffälliger Riss im Leder.',
    content: 'Schreiben Sie eine Beschwerde an den Kundenservice von "WoodStyle". Behandeln Sie folgende Punkte:\n- Grund und Bestelldaten des Schreibens\n- Kritik an der extremen Lieferverzögerung\n- Beschreibung der Mängel (Farbe, Lederriss)\n- Forderung auf Umtausch oder einen erheblichen Preisnachlass\n- Frist für die Rückmeldung',
    type: "Beschwerde"
  },
  {
    id: "default-17",
    title: "Bitte um Infos: Veganes Catering für Firmenfeier",
    situation: 'Sie organisieren das jährliche Sommerfest für Ihr Unternehmen mit ca. 80 Mitarbeitern. Die Geschäftsleitung wünscht dieses Jahr ein vollständig veganes und nachhaltiges Speisenangebot. Sie interessieren sich für die Dienste von "Green Catering Hamburg".',
    content: "Schreiben Sie eine Anfrage-E-Mail an das Catering-Team. Klären Sie folgende Punkte:\n- Vorschläge für ein veganes Buffet (Vorspeisen, Hauptspeisen, Desserts)\n- Berücksichtigung von weiteren Unverträglichkeiten (z.B. glutenfrei)\n- Bereitstellung von Geschirr, Besteck und Servicepersonal vor Ort\n- Preiskalkulation pro Person und Lieferbedingungen",
    type: "Information"
  },
  {
    id: "default-18",
    title: "Bewerbung: Hundesitter in München",
    situation: 'Die Agentur "Paws & Friends" vermittelt qualifizierte und liebevolle Tierbetreuer an Hundebesitzer in München, die tagsüber arbeiten. Gesucht werden tierbegeisterte Menschen für Spaziergänge und Tagesbetreuung.',
    content: "Schreiben Sie Ihre Bewerbung für die Aufnahme in die Betreuerkartei. Behandeln Sie folgende Punkte:\n- Motivation für die Arbeit als Hundesitter\n- Bisherige eigene Erfahrungen im Umgang mit Hunden (Rassen, Verhalten)\n- Zuverlässigkeit und Verhalten in stressigen oder unvorhergesehenen Situationen\n- Raumverhältnisse (Wohnung, Nähe zu Parks)\n- Ihre zeitliche Verfügbarkeit unter der Woche",
    type: "Bewerbung"
  },
  {
    id: "default-19",
    title: "Beschwerde: Premium-Essenslieferdienst",
    situation: 'Sie haben für einen Jahrestag ein festliches Drei-Gänge-Menü für vier Personen beim Premium-Lieferdienst "GourmetExpress" bestellt. Gegen Aufpreis wurde eine minutengenaue Lieferung garantiert. Das Essen kam 90 Minuten zu spät, die Suppe war kalt und ausgelaufen, das Hauptgericht vertauscht (vegetarisch statt Rinderfilet) und das Dessert fehlte ganz.',
    content: 'Schreiben Sie eine Beschwerde an die Geschäftsführung von "GourmetExpress". Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens und Bestelldetails\n- Massive Lieferverzögerung trotz kostenpflichtiger Garantie\n- Kritik an Verpackung, Temperatur und fehlerhafter Lieferung\n- Enttäuschung über den misslungenen festlichen Abend\n- Forderung nach vollständiger Erstattung des Preises',
    type: "Beschwerde"
  },
  {
    id: "default-20",
    title: "Bitte um Infos: Sommercamp für Kinder",
    situation: 'Sie möchten Ihren 10-jährigen Sohn für ein zweiwöchiges "Natur- und Abenteuercamp" in Thüringen anmelden, welches vom Verein "WildnisKids e.V." veranstaltet wird. Es bleiben jedoch wesentliche organisatorische Fragen offen.',
    content: 'Schreiben Sie eine E-Mail an den Veranstalter "WildnisKids e.V.". Bitten Sie um Auskunft zu:\n- Betreuerschlüssel (Verhältnis Betreuer zu Kindern) und Qualifikationen\n- Tagesablauf, Aktivitäten und Sicherheitsvorkehrungen bei schlechtem Wetter\n- Unterkunft (Zelte oder feste Häuser) und Verpflegung (Allergene, vegetarisch)\n- Rücktrittsbedingungen bei plötzlicher Erkrankung des Kindes',
    type: "Information"
  },
  {
    id: "default-21",
    title: "Bewerbung: Social Media Assistant",
    situation: 'Das zukunftsorientierte Mode-Startup "StyleInspo" aus Berlin sucht einen Social Media Assistant (m/w/d) auf Minijob-Basis (10-15 Stunden/Woche). Aufgaben umfassen die Erstellung von Inhalten für Instagram, TikTok und das Beantworten von Community-Fragen.',
    content: 'Schreiben Sie Ihre Bewerbung an die Marketingleitung. Gehen Sie auf folgende Punkte ein:\n- Ihre Begeisterung für Mode und Social-Media-Plattformen\n- Erfahrungen im Bereich Content Creation (Fotos, Videos, Reels, Canva etc.)\n- Ihre Kommunikationsstärke und Deutschkenntnisse im Umgang mit Followern\n- Warum Sie speziell für das Startup "StyleInspo" arbeiten möchten\n- Ihre wöchentliche Verfügbarkeit und technisches Equipment',
    type: "Bewerbung"
  },
  {
    id: "default-22",
    title: "Beschwerde: Konzertreise nach Hamburg",
    situation: 'Sie haben beim Reisebüro "KulturReisen" ein Paket gebucht, bestehend aus einer Hotelübernachtung in Hamburg und erstklassigen Eintrittskarten für ein Konzert in der Elbphilharmonie. Die Eintrittskarten wurden Ihnen trotz Zusage nicht ins Hotel geliefert, weshalb Sie das Konzert verpassten. Zudem war das Hotelzimmer schmutzig und laut.',
    content: 'Schreiben Sie eine Beschwerde an das Reisebüro "KulturReisen". Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens und Buchungsnummer\n- Nichtzustellung der Konzertkarten und das verpasste Event\n- Mängel des Hotelzimmers (Lärm, Hygiene)\n- Enttäuschung über den zerstörten Wochenendausflug\n- Forderung auf vollständige Erstattung des Reisepreises und Schadensersatz',
    type: "Beschwerde"
  },
  {
    id: "default-23",
    title: "Bitte um Infos: Coworking Space Mitgliedschaft",
    situation: 'Sie arbeiten als freiberuflicher Softwareentwickler im Homeoffice und möchten ein professionelles Arbeitsumfeld nutzen. Sie interessieren sich für ein monatliches Abonnement im Coworking Center "Nexus Office" in Frankfurt.',
    content: 'Schreiben Sie eine E-Mail an die Centerleitung. Erkundigen Sie sich nach folgenden Punkten:\n- Unterschied zwischen "Flex Desk" (freier Tischwechsel) und "Dedicated Desk" (fester Arbeitsplatz)\n- Technische Infrastruktur (Internet-Geschwindigkeit, Druckernutzung, Kaffeeküche)\n- Zugangsmöglichkeiten am Wochenende und zu späten Abendstunden (Keycard)\n- Buchbarkeit von Meetingräumen für Kundentermine und Preisvorteile für Mitglieder',
    type: "Information"
  },
  {
    id: "default-24",
    title: "Bewerbung: Kellner im italienischen Restaurant",
    situation: 'Das Restaurant "Bella Italia" in Köln sucht für die abendlichen Stoßzeiten und das Wochenende eine engagierte Servicekraft (m/w/d). Erfahrungen im Service sind gewünscht, aber keine zwingende Voraussetzung.',
    content: "Schreiben Sie Ihre aussagekräftige Bewerbung an den Geschäftsführer Herrn Rossi. Behandeln Sie folgende Punkte:\n- Ihr Bezug zur Gastronomie und Grund der Bewerbung\n- Ihre Stärken im Servicebereich (Freundlichkeit, Stressresistenz, Teamfähigkeit)\n- Bisherige Tätigkeiten im Kundenkontakt oder in der Gastronomie\n- Ihre Sprachkenntnisse (Deutsch, Englisch, eventuell Italienisch)\n- Ihre zeitliche Flexibilität am Abend und am Wochenende",
    type: "Bewerbung"
  },
  {
    id: "default-25",
    title: 'Beschwerde: Fitnessstudio "VitalLife"',
    situation: 'Sie haben einen Jahresvertrag im Studio "VitalLife" unter der Bedingung abgeschlossen, dass Ihnen der Zutritt zum Saunabereich und die Teilnahme an Fitnesskursen jederzeit kostenlos zustehen. Seit drei Monaten ist die Sauna defekt. Außerdem wurden fast alle Pilates- und Yogakurse ohne Ersatz gestrichen. Trotzdem bucht das Studio den vollen Monatsbeitrag ab.',
    content: 'Schreiben Sie eine Beschwerde an den Kundenservice von "VitalLife". Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens und Mitgliedsnummer\n- Dauerhafter Ausfall des Saunabereichs und mangelnde Reparatur\n- Streichung der vertraglich vereinbarten Kurse\n- Forderung einer angemessenen Beitragsminderung für die Ausfallzeit\n- Fristsetzung zur Lösung oder Androhung einer außerordentlichen Kündigung',
    type: "Beschwerde"
  },
  {
    id: "default-26",
    title: "Bitte um Infos: Deutschprüfungen für Mediziner",
    situation: 'Sie haben ein abgeschlossenes Medizinstudium im Ausland absolviert und möchten bald als Assistenzarzt in Deutschland arbeiten. Zur Beantragung der Approbation benötigen Sie die Fachsprachenprüfung (FSP). Sie interessieren sich für die Vorbereitungskurse des Anbieters "Med-Deutsch Akademie".',
    content: 'Schreiben Sie eine Anfrage-E-Mail an die Kursleitung der "Med-Deutsch Akademie". Fragen Sie nach:\n- Dauer, Startterminen und Preisen des speziellen FSP-Zertifikatskurses\n- Lerninhalten (Patientengespräche, Arztbriefe, medizinische Dokumentation)\n- Qualifikationen der Dozenten (Mediziner oder zertifizierte Sprachlehrer)\n- Möglichkeit eines Online- oder Hybridkurses und Bestehensquote der Teilnehmer',
    type: "Information"
  },
  {
    id: "default-27",
    title: "Bewerbung: Mitarbeiter im Kundendienst",
    situation: 'Das E-Commerce-Unternehmen "EcoCart" vertreibt ökologische Haushaltswaren und sucht ab sofort Mitarbeiter (m/w/d) im Kundenservice für die schriftliche und telefonische Kundenbetreuung, vollständig im Homeoffice (Remote).',
    content: 'Schreiben Sie Ihre Bewerbung an die Personalabteilung von "EcoCart". Gehen Sie auf folgende Punkte ein:\n- Grund der Bewerbung und Ihre Identifikation mit ökologischen Produkten\n- Ihre Stärken in der schriftlichen und mündlichen Kommunikation (Freundlichkeit, Geduld)\n- Ihre Erfahrungen mit PC-Arbeit, Kundensystemen oder Office-Paketen\n- Ihr eingerichteter, ungestörter Heimarbeitsplatz mit stabiler Internetverbindung\n- Ihre Gehaltsvorstellung (Stundenlohn) und gewünschte Wochenarbeitszeit',
    type: "Bewerbung"
  },
  {
    id: "default-28",
    title: 'Beschwerde: Hotelaufenthalt "Seeblick"',
    situation: 'Sie haben für einen Erholungsurlaub ein Doppelzimmer mit Seeblick im Hotel "Seeblick" reserviert. Bei Ihrer Ankunft teilte man Ihnen mit, dass das Hotel überbucht sei. Sie mussten in ein kleineres Zimmer im Souterrain direkt neben der lauten Heizungsanlage umziehen. Der versprochene Seeblick fehlte, und das Frühstücksbuffet war ungenießbar.',
    content: "Schreiben Sie eine Beschwerde an die Hoteldirektion. Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens und Buchungszeitraum\n- Kritik an der Überbuchung und der minderwertigen Ersatzunterkunft\n- Lärmbelästigung durch die Heizung und fehlende Erholung\n- Mangelnde Qualität der Verpflegung (Frühstück)\n- Forderung auf Rückerstattung der Preisdifferenz und angemessene Entschädigung",
    type: "Beschwerde"
  },
  {
    id: "default-29",
    title: "Bitte um Infos: Kletterpark Teambuilding",
    situation: 'Sie sind Abteilungsleiter in einer IT-Firma mit 25 Mitarbeitern. Zur Stärkung des Teamgeists planen Sie einen Betriebsausflug in den "Abenteuer-Kletterwald Taunus". Sie möchten ein maßgeschneidertes Teambuilding-Programm buchen.',
    content: "Schreiben Sie eine Anfrage an das Event-Team des Kletterwalds. Klären Sie folgende Punkte:\n- Spezielle Gruppen- und Teambuilding-Aktivitäten mit Trainerbegleitung\n- Sicherheitskonzept, notwendige Kleidung und Einweisung für Anfänger\n- Catering-Optionen (Grillplatz mieten, Catering-Service oder Restaurant vor Ort)\n- Gruppenrabatte und Stornierungsbedingungen bei starkem Regen",
    type: "Information"
  },
  {
    id: "default-30",
    title: "Bewerbung: Event-Aushilfe auf Musikmesse",
    situation: 'Für die internationale Musikmesse "Musicon" in Frankfurt sucht der Veranstalter "MesseFrankfurt GmbH" kurzfristig zweisprachige Event-Aushilfen (m/w/d) für die Besucherregistrierung, Wegeleitung und Informationsstände.',
    content: "Schreiben Sie Ihre Bewerbung für diesen Messejob. Behandeln Sie folgende Punkte:\n- Bezug auf die Stellenausschreibung und Motivation für die Mitarbeit auf der Musikmesse\n- Ihre Sprachkenntnisse (Deutsch, Englisch fließend, weitere Sprachen)\n- Ihre Kontaktfreudigkeit, Belastbarkeit bei hohem Besucheraufkommen und gepflegtes Auftreten\n- Erfahrungen aus früheren Messen, Promotionjobs oder dem Kundenservice\n- Bestätigung Ihrer uneingeschränkten Zugänglichkeit an allen vier Messetagen",
    type: "Bewerbung"
  },
  {
    id: "default-31",
    title: "Beschwerde: Streamingdienst Abo-Abrechnung",
    situation: 'Sie nutzen seit einem Jahr den Streamingdienst "MoviePlus". Vor kurzem wurde ohne Ihre Zustimmung der Paketpreis um 50 % erhöht. Zudem wurde Ihnen trotz fristgerechter Kündigung des Premium-Zusatzpakets der Betrag für drei weitere Monate abgebucht. Der telefonische Support hat Ihr Anliegen ignoriert.',
    content: 'Schreiben Sie eine formelle Beschwerde an den Kundenservice von "MoviePlus". Behandeln Sie folgende Punkte:\n- Grund des Schreibens, Kundennummer und Vertragsdaten\n- Kritik an der unangekündigten Preiserhöhung\n- Rechtswidrige Abbuchung trotz nachweisbar fristgerechter Kündigung\n- Enttäuschung über die Servicequalität und Untätigkeit des telefonischen Supports\n- Forderung zur sofortigen Rücküberweisung des fälschlicherweise eingezogenen Geldes',
    type: "Beschwerde"
  },
  {
    id: "default-32",
    title: "Bitte um Infos: Auslandssemester in Heidelberg",
    situation: "Sie studieren Germanistik in Ihrem Heimatland und möchten im nächsten Frühjahr ein einsemestriges Erasmus-Auslandsstudium an der Universität Heidelberg absolvieren. Viele administrative Schritte sind noch unklar.",
    content: "Schreiben Sie eine E-Mail an das Akademische Auslandsamt (AAA) der Universität Heidelberg. Fragen Sie nach:\n- Fristen für die Einreichung der Zulassungsunterlagen und Anerkennung von bisherigen Noten\n- Unterstützung bei der Vermittlung eines Zimmers in einem staatlichen Studentenwohnheim\n- Angebot von fachbegleitenden Deutschkursen für ausländische Studenten vor Semesterbeginn\n- Orientierungsangebote (Buddy-Programm, Einführungsveranstaltungen)",
    type: "Information"
  },
  {
    id: "default-33",
    title: "Bewerbung: Werkstudent im IT-Support",
    situation: 'Das Software-Unternehmen "NetSolutions" in Stuttgart sucht einen Werkstudenten (m/w/d) für den hausinternen IT-Support und die Pflege der Netzwerksicherheit (16-20 Std./Woche).',
    content: "Schreiben Sie ein aussagekräftiges Bewerbungsschreiben. Gehen Sie auf folgende Punkte ein:\n- Bezugnahme auf das Stellenangebot und Grund Ihrer Bewerbung\n- Ihr Studiengang (Informatik, Wirtschaftsinformatik o.Ä.) und aktuelles Semester\n- Praktische Kenntnisse in Betriebssystemen, Netzwerken, Hardware-Fehleranalyse\n- Ihre Arbeitsweise (selbstständig, zielstrebig, teamorientiert)\n- Ihre zeitliche Verfügbarkeit unter der Woche (Abstimmung mit Vorlesungszeiten)",
    type: "Bewerbung"
  },
  {
    id: "default-34",
    title: 'Beschwerde: Erlebnis-Gutschein "Ballonfahrt"',
    situation: 'Sie bekamen von Freunden einen Erlebnis-Gutschein für eine "Exklusive Ballonfahrt bei Sonnenaufgang über dem Bodensee mit Champagner-Picknick" von der Agentur "SkyAdventures". Der Termin wurde viermal wegen Kleinigkeiten abgesagt. Als die Fahrt stattfand, war es mittags, es ging über ein unschönes Industriegebiet, es gab 12 statt 2 Mitflieger und statt Champagner gab es Apfelschorle.',
    content: 'Schreiben Sie eine Beschwerde an die Zentrale von "SkyAdventures". Behandeln Sie folgende Punkte:\n- Grund des Schreibens und Gutschein-Nummer\n- Ärger über die extrem komplizierte und unkooperative Terminfindung\n- Abweichung der Realität vom Gutscheintext (Tageszeit, Route, Teilnehmerzahl)\n- Enttäuschung über das lieblose Picknick ohne versprochenen Champagner\n- Forderung auf teilweise Rückerstattung des Gutscheinwertes in bar',
    type: "Beschwerde"
  },
  {
    id: "default-35",
    title: "Bitte um Infos: Franchise-Konzept Eröffnung",
    situation: 'Sie planen die Eröffnung eines eigenen, gesunden Bistros und interessieren sich sehr für das erfolgreiche vegane Franchise-Konzept von "BioSalad Organics". Sie verfügen über etwas Startkapital und gastronomische Erfahrung.',
    content: 'Schreiben Sie eine E-Mail an die Franchise-Zentrale der "BioSalad Organics GmbH". Klären Sie folgende Punkte:\n- Voraussetzungen (Eigenkapital, berufliche Qualifikationen, Standortbedingungen)\n- Struktur der Franchise-Gebühren (Einstiegsgebühr, monatliche Umsatzbeteiligung)\n- Unterstützung beim Marketing, Ladendesign, der Lieferkette und Mitarbeiterschulung\n- Zusendung von ausführlichem Informationsmaterial und Ablauf einer Bewerbung als Partner',
    type: "Information"
  },
  {
    id: "default-36",
    title: "Bewerbung: Stadtführer in Berlin",
    situation: 'Die Tourismus-Agentur "BerlinExplorer" sucht für Stadtrundgänge sowie geführte Fahrradtouren durch Berlin-Mitte und Kreuzberg enthusiastische, offene und ortskundige Stadtführer (m/w/d) für die Wochenenden.',
    content: "Schreiben Sie Ihre Bewerbung als Stadtführer an den Personalverantwortlichen. Behandeln Sie folgende Punkte:\n- Warum Sie Stadtführer in Berlin werden möchten und Ihre Verbindung zur Stadt\n- Ihre Ortskenntnisse in Berlin (Geschichte, Kultur, Geheimtipps)\n- Ihre Fremdsprachenkenntnisse (Deutsch verhandlungssicher, weitere Sprachen von Vorteil)\n- Erfahrungen im Vortragen vor größeren Gruppen (Präsentationen, offene Art)\n- Ihre zeitliche Verfügbarkeit am Wochenende und sportliche Fitness (Fahrradtouren)",
    type: "Bewerbung"
  },
  {
    id: "default-37",
    title: "Beschwerde: Online-Fotobuch Druckfehler",
    situation: 'Sie haben über das Portal "PixPrint" ein hochwertiges, teures Hardcover-Fotobuch mit 100 Seiten als Geschenk für die Goldene Hochzeit Ihrer Großeltern bestellt. Bei der Lieferung stellten Sie fest: Der Bucheinband ist schief aufgeklebt, die Farben sind extrem dunkel und verwaschen, und auf 5 Seiten fehlt der gedruckte Text komplett, obwohl er im Vorschau-Editor korrekt angezeigt wurde.',
    content: 'Schreiben Sie eine Beschwerde an die Reklamationsabteilung von "PixPrint". Behandeln Sie folgende Punkte:\n- Grund des Schreibens, Kundennummer und Bestell-ID\n- Beschreibung der gravierenden Fehldrucke und Qualitätsmängel (Farbe, Einband)\n- Nicht-Abdruck der Texte als schwerer Mangel\n- Verlust des geplanten Geschenks und zeitlicher Druck wegen des Hochzeitstags\n- Forderung auf kostenlosen Neudruck innerhalb von 5 Tagen oder Erstattung der Kosten mit Entschädigung',
    type: "Beschwerde"
  },
  {
    id: "default-38",
    title: "Bitte um Infos: Mitgliedschaft im Tennisclub",
    situation: 'Sie sind vor Kurzem in eine neue Stadt gezogen und möchten einem lokalen Tennisclub beitreten, um aktiv Sport zu treiben und Kontakte zu knüpfen. Sie sind am "Tennis-Club Rot-Weiß" interessiert.',
    content: "Schreiben Sie eine E-Mail an den Vorstand des Tennis-Clubs. Erkundigen Sie sich nach:\n- Aufnahmegebühr und monatlichem/jährlichem Mitgliedsbeitrag (Ermäßigung für Studenten/Familien)\n- Ausstattung des Clubs (Anzahl der Außen- und Hallenplätze, Buchungssystem für Spielfelder)\n- Trainingsmöglichkeiten für Erwachsene (Gruppentraining mit professionellem Trainer, Spielstärkeneinstufung)\n- Clubleben, Turnieren für Freizeitsportler und Kennenlern-Treffs für neue Mitglieder",
    type: "Information"
  },
  {
    id: "default-39",
    title: "Bewerbung: Rezeptionist in Jugendherberge",
    situation: 'Die Jugendherberge "CityHostel Dresden" sucht ab der kommenden Frühjahrssaison einen Rezeptionisten (m/w/d) in Teilzeit (20 Stunden/Woke) zur Betreuung internationaler Backpacker, Check-in/Check-out und Organisation kleiner Events.',
    content: "Schreiben Sie Ihre Bewerbung für das CityHostel. Behandeln Sie folgende Punkte:\n- Ihre Motivation, in einem lebhaften, internationalen Hostel zu arbeiten\n- Erste Erfahrungen im Beherbergungsgewerbe oder im engen Kundenkontakt\n- Ausgeprägte Sprachkenntnisse (Deutsch verhandlungssicher, Englisch fließend, weitere Sprachen)\n- Ihre Computerkenntnisse (E-Mail, Buchungssoftware, Social Media)\n- Flexibilität bei Schichtarbeit (Früh-, Spät- und gelegentliche Wochenendschichten)",
    type: "Bewerbung"
  }
];
export default function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem("dia_exercises");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        const combined = [...parsed];
        DEFAULT_EXERCISES.forEach((def) => {
          if (!combined.some((c) => c.id === def.id)) {
            combined.push(def);
          }
        });
        return combined;
      }
    }
    return DEFAULT_EXERCISES;
  });
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("dia_progress");
    return saved ? JSON.parse(saved) : {};
  });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailRole, setEmailRole] = useState("student");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [teacherCode, setTeacherCode] = useState("");
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (isSignUp && !fullName) {
      alert("Veuillez saisir votre nom complet.");
      return;
    }
    if (isSignUp && emailRole === "teacher" && teacherCode.trim().toUpperCase() !== "B2PROF") {
      alert("Le code d'accès enseignant est incorrect. Veuillez utiliser le bon code pour créer un compte Prof (Ex: B2PROF).");
      return;
    }
    setAuthLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, fullName, emailRole);
      } else {
        await loginWithEmail(email, password);
      }
      setEmail("");
      setPassword("");
      setFullName("");
      setTeacherCode("");
      setShowEmailForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };
  useEffect(() => {
    let unsubscribeProfile = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
      if (u) {
        const profileRef = doc(db, "users", u.uid);
        unsubscribeProfile = onSnapshot(profileRef, (snap) => {
          if (snap.exists()) {
            setUserProfile(snap.data());
          } else {
            console.log("No profile found in Firestore for uid:", u.uid, ". Using local auth data as fallback...");
            const fallbackProfile = {
              uid: u.uid,
              email: u.email || "",
              displayName: u.displayName || u.email?.split("@")[0] || "Utilisateur",
              photoURL: u.photoURL || null,
              role: "student",
              createdAt: /* @__PURE__ */ new Date()
            };
            setUserProfile(fallbackProfile);
          }
        }, (err) => {
          console.error("Profile sync error:", err);
          handleFirestoreError(err, OperationType.GET, `users/${u.uid}`);
        });
      } else {
        setUserProfile(null);
      }
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users"), where("role", "==", "teacher"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc2) => list.push(doc2.data()));
      setTeachers(list);
    });
    return () => unsubscribe();
  }, [user]);
  useEffect(() => {
    const q = query(collection(db, "exercises"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cloudExercises = [];
      snapshot.forEach((doc2) => {
        cloudExercises.push(doc2.data());
      });
      setExercises((prev) => {
        const combined = [...cloudExercises];
        DEFAULT_EXERCISES.forEach((def) => {
          if (!combined.find((c) => c.id === def.id)) {
            combined.push(def);
          }
        });
        prev.forEach((ex) => {
          if (!combined.find((c) => c.id === ex.id)) {
            combined.push(ex);
          }
        });
        return combined;
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "exercises");
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "users", user.uid, "progress"), (snapshot) => {
      const cloudProgress = {};
      snapshot.forEach((doc2) => {
        const data = doc2.data();
        if (data.evaluation) {
          cloudProgress[doc2.id] = {
            text: data.text,
            evaluation: data.evaluation
          };
        }
      });
      setProgress((prev) => {
        const updated = { ...prev };
        Object.entries(cloudProgress).forEach(([id, val]) => {
          updated[id] = val;
        });
        return updated;
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/progress`);
    });
    return () => unsubscribe();
  }, [user]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const selectExercise = async (id, forceUploadView = false) => {
    const activeProgress = selectedId ? progress[selectedId] : null;
    const hasUnsavedDraft = activeProgress && !activeProgress.evaluation && (activeProgress.text && activeProgress.text.trim().length > 0 || isTimerRunning);
    if (hasUnsavedDraft) {
      if (!confirm("Attention : Votre rédaction en cours n'a pas été évaluée et sera PERDUE si vous quittez ou changez de sujet. Voulez-vous continuer ?")) {
        return;
      }
      setProgress((prev) => {
        const updated = { ...prev };
        delete updated[selectedId];
        return updated;
      });
    }
    setSelectedId(id);
    setIsUploading(forceUploadView);
    setIsSidebarOpen(false);
    setIsTimerRunning(false);
  };
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const activeProgress = selectedId ? progress[selectedId] : null;
      const hasUnsavedDraft = activeProgress && !activeProgress.evaluation && (activeProgress.text && activeProgress.text.trim().length > 0 || isTimerRunning);
      if (hasUnsavedDraft) {
        e.preventDefault();
        e.returnValue = "Attention : Votre rédaction en cours n'a pas été évaluée et sera perdue si vous fermez l'application.";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [selectedId, progress, isTimerRunning]);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  useEffect(() => {
    localStorage.setItem("dia_exercises", JSON.stringify(exercises));
  }, [exercises]);
  useEffect(() => {
    const cleanProgress = {};
    for (const [id, value] of Object.entries(progress)) {
      if (value.evaluation) {
        cleanProgress[id] = value;
      }
    }
    localStorage.setItem("dia_progress", JSON.stringify(cleanProgress));
  }, [progress]);
  useEffect(() => {
    if (!user) return;
    const syncLocalExercises = async () => {
      const customLocalExercises = exercises.filter((ex) => !ex.id.startsWith("default-"));
      for (const ex of customLocalExercises) {
        const cleanId = ex.id.replace(new RegExp("[^a-zA-Z0-9_\\-]", "g"), "_").substring(0, 100) || `ex_${Date.now()}`;
        try {
          const exRef = doc(db, "exercises", cleanId);
          await setDoc(exRef, {
            id: cleanId,
            title: ex.title || "Sujet sans titre",
            situation: ex.situation || "",
            content: ex.content || "",
            type: ex.type || "Beschwerde",
            createdAt: serverTimestamp()
          }, { merge: true });
        } catch (err) {
          console.warn("Silent sync error for exercise:", cleanId, err);
        }
      }
    };
    const timer = setTimeout(() => {
      syncLocalExercises();
    }, 2500);
    return () => clearTimeout(timer);
  }, [user, exercises]);
  const handleUpload = useCallback(async (fileData, mimeType) => {
    setIsExtracting(true);
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("La clé API Gemini (GEMINI_API_KEY) est manquante.");
      }
      const extracted = await extractExercises(fileData, mimeType);
      const uniqueExtracted = extracted.filter(
        (ex, index, self) => index === self.findIndex((t) => t.title === ex.title && t.situation === ex.situation)
      );
      const newExercises = uniqueExtracted.filter(
        (ex) => !exercises.some((p) => p.title === ex.title && p.situation === ex.situation)
      );
      const sanitizedExtracted = newExercises.map((ex) => {
        const cleanId = `ex_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        return {
          id: cleanId,
          title: ex.title || "Sujet sans titre",
          situation: ex.situation || "",
          content: ex.content || "",
          type: ex.type || "Beschwerde"
        };
      });
      if (user && sanitizedExtracted.length > 0) {
        for (const ex of sanitizedExtracted) {
          const exRef = doc(db, "exercises", ex.id);
          await setDoc(exRef, {
            id: ex.id,
            title: ex.title,
            situation: ex.situation,
            content: ex.content,
            type: ex.type,
            createdAt: serverTimestamp()
          });
        }
      }
      if (sanitizedExtracted.length > 0) {
        setExercises((prev) => [...sanitizedExtracted, ...prev]);
        setSelectedId(sanitizedExtracted[0].id);
      } else if (extracted.length > 0) {
        const existing = exercises.find((p) => p.title === extracted[0].title && p.situation === extracted[0].situation);
        if (existing) {
          setSelectedId(existing.id);
        }
        alert("Les sujets trouvés dans ce document existent déjà dans l'application.");
      } else {
        alert("Aucun exercice n'a été trouvé dans ce document.");
      }
      setIsUploading(false);
    } catch (error) {
      console.error(error);
      alert(`Erreur lors de l'extraction: ${error.message || "Erreur inconnue"}`);
    } finally {
      setIsExtracting(false);
    }
  }, [user, exercises]);
  const handleTextChange = useCallback((id, text) => {
    setProgress((prev) => {
      if (prev[id]?.text === text) return prev;
      return {
        ...prev,
        [id]: { ...prev[id] || { evaluation: null }, text }
      };
    });
  }, []);
  const handleEvaluate = useCallback(async (id, text) => {
    const exercise = exercises.find((e) => e.id === id);
    if (!exercise) return;
    setIsEvaluating(true);
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("La clé API Gemini (GEMINI_API_KEY) est manquante.");
      }
      const result = await evaluateWriting(exercise, text);
      if (user) {
        const progRef = doc(db, "users", user.uid, "progress", id);
        await setDoc(progRef, {
          exerciseId: id,
          text,
          evaluation: result,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
      setProgress((prev) => ({
        ...prev,
        [id]: { text, evaluation: result }
      }));
    } catch (error) {
      console.error(error);
      alert(`Erreur lors de l'évaluation: ${error.message || "Erreur inconnue"}`);
    } finally {
      setIsEvaluating(false);
    }
  }, [exercises, user]);
  const sortedExercises = useMemo(() => {
    return [...exercises].sort((a, b) => {
      const isDefaultA = a.id.startsWith("default-");
      const isDefaultB = b.id.startsWith("default-");
      if (isDefaultA && isDefaultB) {
        const numA = parseInt(a.id.replace("default-", ""), 10);
        const numB = parseInt(b.id.replace("default-", ""), 10);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.id.localeCompare(b.id);
      }
      if (isDefaultA && !isDefaultB) return -1;
      if (!isDefaultA && isDefaultB) return 1;
      const titleCompare = (a.title || "").localeCompare(b.title || "");
      if (titleCompare !== 0) return titleCompare;
      return a.id.localeCompare(b.id);
    });
  }, [exercises]);
  const filteredExercises = useMemo(() => {
    return sortedExercises.filter(
      (ex) => ex.title.toLowerCase().includes(searchTerm.toLowerCase()) || ex.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedExercises, searchTerm]);
  const selectedExercise = sortedExercises.find((e) => e.id === selectedId);
  const currentProgress = selectedId ? progress[selectedId] : null;
  const onTextChange = useMemo(() => {
    if (!selectedId) return () => {
    };
    return (text) => handleTextChange(selectedId, text);
  }, [selectedId, handleTextChange]);
  const onEvaluate = useMemo(() => {
    if (!selectedId) return () => {
    };
    return (text) => handleEvaluate(selectedId, text);
  }, [selectedId, handleEvaluate]);
  return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col h-[100dvh] bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans overflow-hidden", children: [
    !isOnline && /* @__PURE__ */ jsxDEV("div", { className: "bg-orange-500 text-white px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 shrink-0", children: [
      /* @__PURE__ */ jsxDEV(WifiOff, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 768,
        columnNumber: 11
      }, this),
      "Mode hors-ligne actif. Vous pouvez continuer à écrire, mais l'extraction et l'évaluation nécessitent une connexion."
    ] }, void 0, true, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 767,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "md:hidden relative z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setIsSidebarOpen(true),
          className: "p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
          "aria-label": "Ouvrir le menu",
          children: /* @__PURE__ */ jsxDEV(Menu, { className: "w-6 h-6" }, void 0, false, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 780,
            columnNumber: 11
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 775,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-sm tracking-widest text-[#FF0000]", children: "Schreiben" }, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 782,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "w-9" }, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 783,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 774,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-1 min-h-0 overflow-hidden", children: [
      isSidebarOpen && /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: "fixed inset-0 bg-black/50 z-40 md:hidden",
          onClick: () => setIsSidebarOpen(false)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 789,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: `fixed inset-y-0 left-0 w-4/5 max-w-[320px] md:w-80 md:max-w-none border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-gray-900 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex transition-transform duration-300 ease-in-out shrink-0`, children: [
        /* @__PURE__ */ jsxDEV("div", { className: "p-6 border-b border-gray-200 dark:border-gray-800", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxDEV("h1", { className: "text-xl font-bold tracking-tight text-[#FF0000]", children: "Schreiben" }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 799,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setIsSidebarOpen(false),
                className: "md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors",
                "aria-label": "Fermer le menu",
                children: /* @__PURE__ */ jsxDEV(X, { className: "w-5 h-5" }, void 0, false, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 805,
                  columnNumber: 17
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 800,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 798,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "mb-6", children: user ? /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden", children: user.photoURL ? /* @__PURE__ */ jsxDEV("img", { src: user.photoURL, alt: user.displayName || "", className: "w-full h-full object-cover", referrerPolicy: "no-referrer" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 816,
                columnNumber: 25
              }, this) : /* @__PURE__ */ jsxDEV(UserIcon, { className: "w-5 h-5 text-gray-400" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 818,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 814,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-semibold truncate leading-none mb-1", children: user.displayName || "Utilisateur" }, void 0, false, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 822,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxDEV(Cloud, { className: "w-2 h-2" }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 824,
                    columnNumber: 25
                  }, this),
                  " ",
                  userProfile?.role === "teacher" ? "Enseignant" : "Étudiant"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 823,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 821,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 813,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mb-3", children: userProfile?.role === "teacher" ? /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => user && updateUserRole(user.uid, "student"),
                className: "w-full py-1.5 px-3 rounded-lg text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-750 hover:bg-[#FF0000] hover:text-white transition-colors flex items-center justify-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxDEV(Users, { className: "w-3.5 h-3.5" }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 836,
                    columnNumber: 25
                  }, this),
                  " Basculer en vue Étudiant"
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 832,
                columnNumber: 23
              },
              this
            ) : /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  if (user) {
                    const code = prompt("Veuillez saisir le code d'accès enseignant pour activer le rôle de 'Prof' :");
                    if (code === null) return;
                    if (code.trim().toUpperCase() === "B2PROF") {
                      updateUserRole(user.uid, "teacher");
                      alert("Rôle Enseignant activé !");
                    } else {
                      alert("Code d'accès enseignant incorrect.");
                    }
                  }
                },
                className: "w-full py-1 px-2 text-[9px] font-medium text-gray-400 hover:text-[#FF0000] hover:underline transition-all text-center",
                children: "⚠️ Déverrouiller l'accès Enseignant"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 839,
                columnNumber: 23
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 830,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: logout,
                className: "w-full py-1.5 px-3 text-xs flex items-center justify-center gap-2 text-gray-500 hover:text-red-500 transition-colors border border-gray-100 dark:border-gray-700 rounded-lg",
                children: [
                  /* @__PURE__ */ jsxDEV(LogOut, { className: "w-3 h-3" }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 863,
                    columnNumber: 21
                  }, this),
                  " Déconnexion"
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 859,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 812,
            columnNumber: 17
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: !showEmailForm ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: loginWithGoogle,
                className: "w-full py-2 px-3 bg-[#FF0000] text-white rounded-lg hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs font-medium",
                children: [
                  /* @__PURE__ */ jsxDEV(LogIn, { className: "w-3 h-3" }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 874,
                    columnNumber: 25
                  }, this),
                  "Continuer avec Google"
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 870,
                columnNumber: 23
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    setShowEmailForm(true);
                    setIsSignUp(false);
                  },
                  className: "hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors",
                  children: "Se connecter"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 879,
                  columnNumber: 25
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("span", { children: "•" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 885,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    setShowEmailForm(true);
                    setIsSignUp(true);
                  },
                  className: "hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors",
                  children: "Créer un compte"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 886,
                  columnNumber: 25
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 878,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 869,
            columnNumber: 21
          }, this) : /* @__PURE__ */ jsxDEV("form", { onSubmit: handleEmailAuth, className: "space-y-2.5 p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-left", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-1.5", children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-[11px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider", children: isSignUp ? "Créer un compte" : "Connexion Email" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 897,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => setShowEmailForm(false),
                  className: "text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white underline font-medium",
                  children: "Retour"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 900,
                  columnNumber: 25
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 896,
              columnNumber: 23
            }, this),
            isSignUp && /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-[9px] uppercase font-bold text-gray-400 block", children: "Nom complet" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 911,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "text",
                  className: "w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-[#FF0000]",
                  placeholder: "Ex: Victor Y.",
                  value: fullName,
                  onChange: (e) => setFullName(e.target.value),
                  required: true
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 912,
                  columnNumber: 27
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 910,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-[9px] uppercase font-bold text-gray-400 block", children: "Email" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 924,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "email",
                  className: "w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-[#FF0000]",
                  placeholder: "exemple@email.com",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  required: true
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 925,
                  columnNumber: 25
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 923,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-[9px] uppercase font-bold text-gray-400 block", children: "Mot de passe" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 936,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "password",
                  className: "w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-[#FF0000]",
                  placeholder: "••••••••",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  required: true,
                  minLength: 6
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 937,
                  columnNumber: 25
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 935,
              columnNumber: 23
            }, this),
            isSignUp && /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-[9px] uppercase font-bold text-gray-400 block", children: "Votre rôle" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 950,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => setEmailRole("student"),
                    className: `flex-1 py-1 rounded text-[10px] font-bold border transition-colors ${emailRole === "student" ? "bg-[#FF0000] text-white border-transparent" : "bg-gray-100 dark:bg-gray-700 text-gray-500 border-gray-250 dark:border-transparent"}`,
                    children: "Élève"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 952,
                    columnNumber: 29
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => setEmailRole("teacher"),
                    className: `flex-1 py-1 rounded text-[10px] font-bold border transition-colors ${emailRole === "teacher" ? "bg-indigo-600 text-white border-transparent" : "bg-gray-100 dark:bg-gray-700 text-gray-500 border-gray-250 dark:border-transparent"}`,
                    children: "Prof"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 959,
                    columnNumber: 29
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 951,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 949,
              columnNumber: 25
            }, this),
            isSignUp && emailRole === "teacher" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5 animate-fadeIn", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-[9px] uppercase font-bold text-amber-500 block", children: "Code d'accès enseignant" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 972,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "text",
                  className: "w-full text-xs p-2 border border-amber-300 dark:border-amber-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-indigo-600 font-mono",
                  placeholder: "Entrez le code Prof (ex: B2PROF)",
                  value: teacherCode,
                  onChange: (e) => setTeacherCode(e.target.value),
                  required: true
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 973,
                  columnNumber: 27
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 971,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "submit",
                disabled: authLoading,
                className: "w-full py-2 px-3 bg-[#FF0000] text-white rounded-lg font-bold text-xs hover:bg-red-600 disabled:opacity-50 transition-colors shadow-sm shadow-red-500/10",
                children: authLoading ? "En cours..." : isSignUp ? "S'inscrire et se connecter" : "Se connecter"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 984,
                columnNumber: 23
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("div", { className: "text-center pt-1 border-t border-gray-100 dark:border-gray-700/50", children: /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                onClick: () => {
                  setIsSignUp(!isSignUp);
                  setPassword("");
                },
                className: "text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white underline font-medium",
                children: isSignUp ? "Déjà membre ? Connectez-vous" : "Pas de compte ? Inscrivez-vous"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 993,
                columnNumber: 25
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 992,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 895,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 867,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 810,
            columnNumber: 13
          }, this),
          !process.env.GEMINI_API_KEY ? /* @__PURE__ */ jsxDEV("div", { className: "mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-400", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "font-bold mb-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDEV(WifiOff, { className: "w-3 h-3" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 1010,
                columnNumber: 19
              }, this),
              " Clé API manquante"
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 1009,
              columnNumber: 17
            }, this),
            "L'IA ne fonctionnera pas. Ajoutez ",
            /* @__PURE__ */ jsxDEV("strong", { children: "GEMINI_API_KEY" }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 1012,
              columnNumber: 51
            }, this),
            " dans vos variables d'environnement."
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 1008,
            columnNumber: 15
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "mb-4 p-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg text-[10px] text-green-600 dark:text-green-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 1016,
              columnNumber: 17
            }, this),
            "IA Connectée (Gemini 3.5 Flash)"
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 1015,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => selectExercise(null, true),
              disabled: !isOnline,
              className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer mb-4",
              title: !isOnline ? "Connexion internet requise" : "",
              children: [
                /* @__PURE__ */ jsxDEV(Plus, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 1027,
                  columnNumber: 15
                }, this),
                "Ajouter un sujet"
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 1021,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsxDEV(Search, { className: "h-4 w-4 text-gray-400" }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 1032,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 1031,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "text",
                placeholder: "Rechercher un sujet...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] transition-colors"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 1034,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 1030,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(InstallPWA, {}, void 0, false, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 1042,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 797,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto p-4 space-y-2", children: [
          filteredExercises.map((ex) => {
            const prog = progress[ex.id];
            const isDone = !!prog?.evaluation;
            const hasStarted = !!prog?.text;
            return /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => selectExercise(ex.id),
                className: "w-full text-left p-4 rounded-xl border transition-all " + (selectedId === ex.id && !isUploading ? "bg-white dark:bg-gray-800 border-[#FF0000] shadow-sm" : "bg-transparent border-transparent hover:bg-gray-200/50 dark:hover:bg-gray-800/50"),
                children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
                    /* @__PURE__ */ jsxDEV("h3", { className: "font-semibold truncate text-sm", children: ex.title }, void 0, false, {
                      fileName: "/app/applet/src/App.tsx",
                      lineNumber: 1062,
                      columnNumber: 21
                    }, this),
                    isDone ? /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-4 h-4 text-green-500 shrink-0 mt-0.5" }, void 0, false, {
                      fileName: "/app/applet/src/App.tsx",
                      lineNumber: 1064,
                      columnNumber: 23
                    }, this) : hasStarted ? /* @__PURE__ */ jsxDEV(Clock, { className: "w-4 h-4 text-orange-500 shrink-0 mt-0.5" }, void 0, false, {
                      fileName: "/app/applet/src/App.tsx",
                      lineNumber: 1066,
                      columnNumber: 23
                    }, this) : null
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 1061,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 truncate mb-3", children: ex.type }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 1069,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV(
                    "div",
                    {
                      className: `h-full transition-all duration-500 ${isDone ? "w-full bg-green-500" : hasStarted ? "w-1/2 bg-orange-500" : "w-0"}`
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/App.tsx",
                      lineNumber: 1073,
                      columnNumber: 21
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 1072,
                    columnNumber: 19
                  }, this)
                ]
              },
              ex.id,
              true,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 1051,
                columnNumber: 17
              },
              this
            );
          }),
          filteredExercises.length === 0 && /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500 text-center mt-10", children: sortedExercises.length === 0 ? "Aucun exercice sauvegardé." : "Aucun sujet trouvé." }, void 0, false, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 1081,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 1044,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 796,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col min-h-0 overflow-hidden", children: userProfile?.role === "teacher" ? /* @__PURE__ */ jsxDEV(TeacherDashboard, {}, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 1091,
        columnNumber: 13
      }, this) : isUploading ? /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(UploadSection, { onUpload: handleUpload, isExtracting, isOnline }, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 1094,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 1093,
        columnNumber: 13
      }, this) : selectedExercise ? /* @__PURE__ */ jsxDEV(
        TrainingInterface,
        {
          exercise: selectedExercise,
          initialText: currentProgress?.text || "",
          evaluation: currentProgress?.evaluation || null,
          onTextChange,
          onEvaluate,
          isEvaluating,
          isOnline,
          isTimerRunning,
          setIsTimerRunning,
          teachers,
          user,
          lastTeacherId: userProfile?.lastTeacherId,
          onExit: () => selectExercise(null)
        },
        selectedExercise.id,
        false,
        {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 1097,
          columnNumber: 13
        },
        this
      ) : /* @__PURE__ */ jsxDEV(
        StudentDashboard,
        {
          exercises: sortedExercises,
          progress,
          user,
          userProfile,
          onSelectExercise: (id) => selectExercise(id),
          onStartUpload: () => {
            setIsUploading(true);
            setSelectedId(null);
          }
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 1114,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 1089,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 786,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/App.tsx",
    lineNumber: 764,
    columnNumber: 5
  }, this);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlQ2FsbGJhY2ssIHVzZU1lbW8sIHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFVwbG9hZFNlY3Rpb24gfSBmcm9tICcuL2NvbXBvbmVudHMvVXBsb2FkU2VjdGlvbic7XG5pbXBvcnQgeyBUcmFpbmluZ0ludGVyZmFjZSB9IGZyb20gJy4vY29tcG9uZW50cy9UcmFpbmluZ0ludGVyZmFjZSc7XG5pbXBvcnQgeyBTdHVkZW50RGFzaGJvYXJkIH0gZnJvbSAnLi9jb21wb25lbnRzL1N0dWRlbnREYXNoYm9hcmQnO1xuaW1wb3J0IHsgSW5zdGFsbFBXQSB9IGZyb20gJy4vY29tcG9uZW50cy9JbnN0YWxsUFdBJztcbmltcG9ydCB7IGV4dHJhY3RFeGVyY2lzZXMsIGV2YWx1YXRlV3JpdGluZywgRXhlcmNpc2UsIEV2YWx1YXRpb24gfSBmcm9tICcuL3NlcnZpY2VzL2dlbWluaSc7XG5pbXBvcnQgeyBQbHVzLCBDaGVja0NpcmNsZSwgQ2xvY2ssIFdpZmlPZmYsIExvZ0luLCBMb2dPdXQsIENsb3VkLCBVc2VyIGFzIFVzZXJJY29uLCBNYWlsLCBVc2VycywgR3JhZHVhdGlvbkNhcCwgTWVudSwgWCwgU2VhcmNoIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcbmltcG9ydCB7IGF1dGgsIGxvZ2luV2l0aEdvb2dsZSwgbG9nb3V0LCBkYiwgT3BlcmF0aW9uVHlwZSwgaGFuZGxlRmlyZXN0b3JlRXJyb3IsIHVwZGF0ZVVzZXJSb2xlLCBsb2dpbldpdGhFbWFpbCwgc2lnblVwV2l0aEVtYWlsIH0gZnJvbSAnLi9saWIvZmlyZWJhc2UnO1xuaW1wb3J0IHsgb25BdXRoU3RhdGVDaGFuZ2VkLCBVc2VyIH0gZnJvbSAnZmlyZWJhc2UvYXV0aCc7XG5pbXBvcnQgeyBjb2xsZWN0aW9uLCBkb2MsIHNldERvYywgdXBkYXRlRG9jLCBvblNuYXBzaG90LCBzZXJ2ZXJUaW1lc3RhbXAsIHF1ZXJ5LCBvcmRlckJ5LCB3aGVyZSwgZGVsZXRlRG9jIH0gZnJvbSAnZmlyZWJhc2UvZmlyZXN0b3JlJztcbmltcG9ydCB7IFRlYWNoZXJEYXNoYm9hcmQgfSBmcm9tICcuL2NvbXBvbmVudHMvVGVhY2hlckRhc2hib2FyZCc7XG5cbmludGVyZmFjZSBTYXZlZFByb2dyZXNzIHtcbiAgdGV4dDogc3RyaW5nO1xuICBldmFsdWF0aW9uOiBFdmFsdWF0aW9uIHwgbnVsbDtcbn1cblxuY29uc3QgREVGQVVMVF9FWEVSQ0lTRVM6IEV4ZXJjaXNlW10gPSBbXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtMScsXG4gICAgdGl0bGU6ICdCZXNjaHdlcmRlOiBTcHJhY2hyZWlzZSBuYWNoIEJlcmxpbicsXG4gICAgc2l0dWF0aW9uOiAnU2llIGhhYmVuIGVpbmUgendlaXfDtmNoaWdlIFNwcmFjaHJlaXNlIG5hY2ggQmVybGluIGdlYnVjaHQuIEluIGRlciBBbnplaWdlIHN0YW5kOiBcIlplbnRyYWxlIFVudGVya3VuZnQsIGtsZWluZSBHcnVwcGVuIChtYXguIDggUGVyc29uZW4pLCBlcmZhaHJlbmUgTGVocmVyXCIuIFZvciBPcnQgd2FyIGRpZSBVbnRlcmt1bmZ0IGplZG9jaCA0NSBNaW51dGVuIHZvbSBaZW50cnVtIGVudGZlcm50LCBkaWUgR3J1cHBlIGJlc3RhbmQgYXVzIDE1IFBlcnNvbmVuIHVuZCBkZXIgTGVocmVyIHdhciBvZnQgdW5ww7xua3RsaWNoLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgZWluZSBCZXNjaHdlcmRlIGFuIGRlbiBWZXJhbnN0YWx0ZXIgXCJHbG9iYWwgTGFuZ3VhZ2VzXCIuIEJlaGFuZGVsbiBTaWUgZm9sZ2VuZGUgUHVua3RlOlxcbi0gR3J1bmQgSWhyZXMgU2NocmVpYmVuc1xcbi0gRXJ3YXJ0dW5nZW4gdnMuIFJlYWxpdMOpIChVbnRlcmt1bmZ0LCBHcnVwcGVuZ3LDtsOfZSlcXG4tIEtyaXRpayBhbSBVbnRlcnJpY2h0XFxuLSBGb3JkZXJ1bmcgKHouQi4gVGVpbHLDvGNremFobHVuZyknLFxuICAgIHR5cGU6ICdCZXNjaHdlcmRlJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdkZWZhdWx0LTInLFxuICAgIHRpdGxlOiAnQml0dGUgdW0gSW5mb3JtYXRpb25lbjogRnJlaXdpbGxpZ2VuYXJiZWl0JyxcbiAgICBzaXR1YXRpb246ICdTaWUgaW50ZXJlc3NpZXJlbiBzaWNoIGbDvHIgZWluIHByb2pldCB6dXIgRnJlaXdpbGxpZ2VuYXJiZWl0IGltIFVtd2VsdHNjaHV0eiBpbiBkZW4gQWxwZW4uIFNpZSBoYWJlbiBlaW5lIEFuemVpZ2UgaW0gSW50ZXJuZXQgZ2VzZWhlbiwgYWJlciBlcyBmZWhsZW4gd2ljaHRpZ2UgRGV0YWlscy4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIGVpbmUgRS1NYWlsIGFuIGRpZSBPcmdhbmlzYXRpb24gXCJBbHBlbi1OYXR1clwiLiBCaXR0ZW4gU2llIHVtIEluZm9ybWF0aW9uZW4genUgZm9sZ2VuZGVuIFB1bmt0ZW46XFxuLSBEYXVlciBkZXMgUHJvamVrdHMgdW5kIHTDpGdsaWNoZSBBcmJlaXRzemVpdFxcbi0gVW50ZXJrdW5mdCB1bmQgVmVycGZsZWd1bmdcXG4tIFZvcmF1c3NldHp1bmdlbiAoU3ByYWNoa2VubnRuaXNzZSwgRXJmYWhydW5nKVxcbi0gS29zdGVuIG9kZXIgQXVmd2FuZHNlbnRzY2jDpGRpZ3VuZycsXG4gICAgdHlwZTogJ0luZm9ybWF0aW9uJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdkZWZhdWx0LTMnLFxuICAgIHRpdGxlOiAnQmV3ZXJidW5nIHVtIGVpbiBQcmFrdGlrdW0nLFxuICAgIHNpdHVhdGlvbjogJ1NpZSBoYWJlbiBpbSBJbnRlcm5ldCBlaW5lIEFuemVpZ2UgZsO8ciBlaW4gZHJlaW1vbmF0aWdlcyBQcmFrdGlrdW0gaW0gQmVyZWljaCBNYXJrZXRpbmcgYmVpIGRlciBGaXJtYSBcIk1lZGlhZGVzaWduXCIgaW4gSGFtYnVyZyBnZWZ1bmRlbi4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIElocmUgQmV3ZXJidW5nLiBCZWhhbmRlbG4gU2llIGZvbGdlbmRlIFB1bmt0ZTpcXG4tIEdydW5kIGbDvHIgSWhyZSBCZXdlcmJ1bmdcXG4tIElocmUgYmlzaGVyaWdlbiBFcmZhaHJ1bmdlbiBhbmQgU3ByYWNoa2VubnRuaXNzZVxcbi0gV2FydW0gU2llIGbDvHIgZGllc2VzIFVudGVybmVobWVuIGFyYmVpdGVuIG3DtmNodGVuXFxuLSBGcmFnZW4genVtIGdlbmF1ZW4gQXJiZWl0c2JlZ2lubicsXG4gICAgdHlwZTogJ0Jld2VyYnVuZydcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC00JyxcbiAgICB0aXRsZTogJ0Jlc2Nod2VyZGU6IE1pZXR3YWdlbiBpbSBVcmxhdWInLFxuICAgIHNpdHVhdGlvbjogJ0bDvHIgSWhyZW4gZWlud8O2Y2hpZ2VuIEZhbWlsaWVudXJsYXViIGluIFNwYW5pZW4gaGFiZW4gU2llIG9ubGluZSBiZWkgXCJSZW50LWEtQ2FyIFByZW1pdW1cIiBlaW5lbiBnZXLDpHVtaWdlbiBTVVYgbWl0IHZvbGwgYXVzZ2VzdGF0dGV0ZXIgS2xpbWFhbmxhZ2UgZ2VidWNodC4gQmVpIGRlciBBYmhvbHVuZyBhbSBGbHVnaGFmZW4gZXJoaWVsdGVuIFNpZSBqZWRvY2ggZWluZW4ga2xlaW5lbiwgZHJlaXTDvHJpZ2VuIEtsZWlud2FnZW4uIFp1ZGVtIGZ1bmt0aW9uaWVydGUgZGllIEtsaW1hYW5sYWdlIG5pY2h0LCB1bmQgZGVyIEtpbmRlcnNpdHogZmVobHRlLiBUcm90eiBtZWhybWFsaWdlciBCaXR0ZW4gdmVyd2VpZ2VydGUgZGVyIEt1bmRlbnNlcnZpY2Ugdm9yIE9ydCBqZWdsaWNoZSBVbnRlcnN0w7x0enVuZyBvZGVyIGVpbmVuIEZhaHJ6ZXVnd2VjaHNlbC4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIGVpbmUgQmVzY2h3ZXJkZSBhbiBkaWUgWmVudHJhbGUgdm9uIFwiUmVudC1hLUNhciBQcmVtaXVtXCIuIEJlaGFuZGVsbiBTaWUgZm9sZ2VuZGUgUHVua3RlOlxcbi0gR3J1bmQgSWhyZXMgU2NocmVpYmVuc1xcbi0gQWJ3ZWljaHVuZ2VuIHp3aXNjaGVuIEJ1Y2h1bmcgdW5kIGVyaGFsdGVuZW0gRmFocnpldWdcXG4tIE1hbmdlbG5kZSBBdXNzdGF0dHVuZyAoS2xpbWFhbmxhZ2UsIEtpbmRlcnNpdHopIHVuZCBkaWUgRm9sZ2VuXFxuLSBVbmtvb3BlcmF0aXZlcyBWZXJoYWx0ZW4gZGVzIEt1bmRlbnNlcnZpY2VzXFxuLSBBbmdlbWVzc2VuZSBmaW5hbnppZWxsZSBFbnRzY2jDpGRpZ3VuZycsXG4gICAgdHlwZTogJ0Jlc2Nod2VyZGUnXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtNScsXG4gICAgdGl0bGU6ICdCZXNjaHdlcmRlOiBGZXN0aXZhbCBcIlJvY2sgYW0gU2VlXCInLFxuICAgIHNpdHVhdGlvbjogJ1NpZSBoYWJlbiBmw7xyIGRhcyB6d2VpdMOkZ2lnZSBNdXNpa2Zlc3RpdmFsIFwiUm9jayBhbSBTZWVcIiB0ZXVyZSBWSVAtVGlja2V0cyBlcndvcmJlbiwgZGllIGxhdXQgVmVyYW5zdGFsdGVyIHNlcGFyYXRlbiBadWdhbmcsIGVyc3RrbGFzc2lnZXMgQ2F0ZXJpbmcsIGV4a2x1c2l2ZW4gVklQLUJlcmVpY2ggbmFoIGFuIGRlciBCw7xobmUgdW5kIGVpbiBUcmVmZmVuIG1pdCBkZW4gS8O8bnN0bGVybiBiZWluaGFsdGV0ZW4uIERpZSBSZWFsaXTDpHQgd2FyIGVudHTDpHVzY2hlbmQ6IEVzIGdhYiBrZWluZW4gVklQLUVpbmdhbmcsIGRpZSBTY2hsYW5nZW4gd2FyZW4gc3R1bmRlbmxhbmcsIGRlciBWSVAtQmVyZWljaCB3YXIgw7xiZXJmw7xsbHQgdW5kIHp3ZWkgSGF1cHRiYW5kcyB0cmF0ZW4gb2huZSBFcnNhdHogbmljaHQgYXVmLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgZWluZSBCZXNjaHdlcmRlIGFuIGRpZSBFdmVudGFnZW50dXIgXCJTdW1tZXJWaWJlcyBHbWJIXCIuIEJlaGFuZGVsbiBTaWUgZm9sZ2VuZGUgUHVua3RlOlxcbi0gR3J1bmQgSWhyZXMgU2NocmVpYmVuc1xcbi0gRmVobGVuZGUgdmVydHJhZ2xpY2ggdmVyZWluYmFydGUgTGVpc3R1bmdlbiAoVklQLVZvcnRlaWxlKVxcbi0gRW50dMOkdXNjaHVuZyDDvGJlciBkYXMgQ2F0ZXJpbmcgdW5kIGRpZSBPcmdhbmlzYXRpb25cXG4tIEF1c2ZhbGwgZGVyIEvDvG5zdGxlciB1bmQgdW56dXJlaWNoZW5kZSBLb21tdW5pa2F0aW9uXFxuLSBGb3JkZXJ1bmcgYXVmIFLDvGNrZXJzdGF0dHVuZyBlaW5lcyBUZWlscyBkZXMgVGlja2V0cHJlaXNlcycsXG4gICAgdHlwZTogJ0Jlc2Nod2VyZGUnXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtNicsXG4gICAgdGl0bGU6ICdCZXNjaHdlcmRlOiBPbmxpbmUtS2F1ZiBlaW5lcyBMYXB0b3BzJyxcbiAgICBzaXR1YXRpb246ICdTaWUgaGFiZW4gb25saW5lIMO8YmVyIGRhcyBQb3J0YWwgXCJSZWZ1cmJpc2hlZC1UZWNoXCIgZWluIGdlbmVyYWzDvGJlcmhvbHRlcyBOb3RlYm9vayBkZXIgUHJlbWl1bWtsYXNzZSBiZXN0ZWxsdC4gTGF1dCBCZXNjaHJlaWJ1bmcgc29sbHRlIGRhcyBHZXLDpHQgaW0gWnVzdGFuZCBcIldpZSBuZXVcIiBzZWluIHVuZCBpbmtsdXNpdmUgT3JpZ2luYWxsYWRlZ2Vyw6R0IHVuZCBTY2h1dHpow7xsbGUgZ2VsaWVmZXJ0IHdlcmRlbi4gRGFzIGdlbGllZmVydGUgTm90ZWJvb2sgaGF0dGUgamVkb2NoIGRldXRsaWNoZSBLcmF0emVyIGF1ZiBkZW0gQmlsZHNjaGlybSwgZGllIEFra3VsYXVmemVpdCBsYWcgdW50ZXIgMzAgTWludXRlbiB1bmQgZGFzIFp1YmVow7ZyIGZlaGx0ZSBrb21wbGV0dC4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIGVpbmUgQmVzY2h3ZXJkZSBhbiBcIlJlZnVyYmlzaGVkLVRlY2ggS3VuZGVuc2VydmljZVwiLiBCZWhhbmRlbG4gU2llIGZvbGdlbmRlIFB1bmt0ZTpcXG4tIEdydW5kIGRlcyBTY2hyZWliZW5zIHVuZCBCZXN0ZWxsZGF0ZW5cXG4tIEJlc2NocmVpYnVuZyBkZXIgTcOkbmdlbCBhbSBHZXLDpHRcXG4tIEZlaGxlbmRlcyBadWJlaMO2ciAoTGFkZWdlcsOkdCwgSMO8bGxlKVxcbi0gRW50dMOkdXNjaHVuZyDDvGJlciBkaWUgUXVhbGl0w6R0c2Jlc2NocmVpYnVuZyAoXCJXaWUgbmV1XCIpXFxuLSBGcmlzdHNldHp1bmcgenVyIE5hY2hiZXNzZXJ1bmcsIFVtdGF1c2NoIG9kZXIgUsO8Y2tnYWJlIGRlcyBHZWxkZXMnLFxuICAgIHR5cGU6ICdCZXNjaHdlcmRlJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdkZWZhdWx0LTcnLFxuICAgIHRpdGxlOiAnQml0dGUgdW0gSW5mb3JtYXRpb25lbjogSW50ZW5zaXZzcHJhY2hrdXJzIGluIFdpZW4nLFxuICAgIHNpdHVhdGlvbjogJ1NpZSBwbGFuZW4sIGltIGtvbW1lbmRlbiBIZXJic3QgSWhyZSBEZXV0c2Noa2VubnRuaXNzZSB6dSB2ZXJ0aWVmZW4gdW5kIHNpY2ggYXVmIGRpZSBDMS1QcsO8ZnVuZyB2b3J6dWJlcmVpdGVuLiBTaWUgc3Rvw59lbiBhdWYgZGFzIEFuZ2Vib3QgZGVzIFwiRGlhbG9nLUluc3RpdHV0cyBpbiBXaWVuXCIuIERhcyBPbmxpbmUtQW5nZWJvdCBrbGluZ3QgdmllbHZlcnNwcmVjaGVuZCwgbMOkc3N0IGFiZXIgd2VzZW50bGljaGUgb3JnYW5pc2F0b3Jpc2NoZSBEZXRhaWxzIG9mZmVuLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgZWluZSBFLU1haWwgYW4gZGFzIFwiRGlhbG9nLUluc3RpdHV0IFdpZW5cIi4gQml0dGVuIFNpZSB1bSBJbmZvcm1hdGlvbmVuIHp1IGZvbGdlbmRlbiBQdW5rdGVuOlxcbi0gR2VuYXVlIFVudGVycmljaHRzemVpdGVuIHVuZCBHcnVwcGVuZ3LDtsOfZVxcbi0gVW50ZXJzdMO8dHp1bmcgYmVpIGRlciBXb2hudW5nc3N1Y2hlIG9kZXIgVW50ZXJrdW5mdHNtw7ZnbGljaGtlaXRlblxcbi0gU3BlemlmaXNjaGVyIEFibGF1ZiBkZXIgVm9yYmVyZWl0dW5nIGF1ZiBkaWUgQzEtUHLDvGZ1bmcgKFNpbXVsYXRpb25zcHLDvGZ1bmdlbilcXG4tIFN0b3JuaWVydW5nc2JlZGluZ3VuZ2VuIHVuZCBGcmlzdGVuIGJlaSBWaXN1bXNwcm9ibGVtZW4nLFxuICAgIHR5cGU6ICdJbmZvcm1hdGlvbidcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC04JyxcbiAgICB0aXRsZTogJ0JpdHRlIHVtIEluZm9ybWF0aW9uZW46IEF1c2xhbmRzcHJha3Rpa3VtIGluIE5ldyBZb3JrJyxcbiAgICBzaXR1YXRpb246ICdEaWUgVmVybWl0dGx1bmdzYWdlbnR1ciBcIkdsb2JhbENhcmVlcnNcIiBiaWV0ZXQgc2VjaHNtb25hdGlnZSBiZXphaGx0ZSBQcmFrdGlrYSBpbSBCZXJlaWNoIEV2ZW50LU1hcmtldGluZyB1bmQgS29tbXVuaWthdGlvbiBpbiBOZXcgWW9yayBhbi4gU2llIGZpbmRlbiBkYXMgQW5nZWJvdCDDpHXDn2Vyc3QgYXR0cmFrdGl2LCBiZW7DtnRpZ2VuIGplZG9jaCBrbMOkcmVuZGUgRGV0YWlscy4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIGVpbmUgQW5mcmFnZS1FLU1haWwgYW4gXCJHbG9iYWxDYXJlZXJzXCIuIEZyYWdlbiBTaWUgbmFjaDpcXG4tIEtyaXRlcmllbiBmw7xyIGRpZSBBdXN3YWhsIGRlciBCZXdlcmJlciB1bmQgbm90d2VuZGlnZSBFbmdsaXNjaHplcnRpZmlrYXRlXFxuLSBEdXJjaHNjaG5pdHRsaWNoZSBIw7ZoZSBkZXMgU3RpcGVuZGl1bXMgLyBkZXIgVmVyZ8O8dHVuZ1xcbi0gVW50ZXJzdMO8dHp1bmcgYmVpIGRlciBCZWFudHJhZ3VuZyBkZXMgSi0xIFZpc3Vtc1xcbi0gVmVybWl0dGx1bmdzZ2Viw7xocmVuIHVuZCB6dXPDpHR6bGljaGUgS29zdGVuICh6LkIuIEtyYW5rZW52ZXJzaWNoZXJ1bmcpJyxcbiAgICB0eXBlOiAnSW5mb3JtYXRpb24nXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtOScsXG4gICAgdGl0bGU6ICdCaXR0ZSB1bSBJbmZvcm1hdGlvbmVuOiBNZXNzZXRlaWxuYWhtZSBmw7xyIFN0YXJ0LXVwcycsXG4gICAgc2l0dWF0aW9uOiAnU2llIHZlcnRyZXRlbiBkYXMganVuZ2UgRm9vZC1TdGFydHVwIFwiQ2hvY29CaW9cIiB1bmQgbcO2Y2h0ZW4gSWhyIFByb2R1a3QgYXVmIGRlciBMZWl0bWVzc2UgXCJFY29Gb29kIEV4cG9cIiBpbiBLw7ZsbiBwcsOkc2VudGllcmVuLiBBdWYgZGVyIFdlYnNpdGUgZmluZGVuIFNpZSB6d2FyIGRhcyBBbm1lbGRlZm9ybXVsYXIsIGFiZXIga2VpbmUgRGV0YWlsaW5mb3JtYXRpb25lbiBmw7xyIEVyc3RhdXNzdGVsbGVyLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgZWluZSBFLU1haWwgYW4gZGFzIE1lc3NldGVhbSBkZXIgXCJFY29Gb29kIEV4cG9cIi4gS2zDpHJlbiBTaWUgZm9sZ2VuZGUgUHVua3RlOlxcbi0gS29zdGVuIHBybyBRdWFkcmF0bWV0ZXIgZsO8ciBlaW5lbiBrbGVpbmVuIEF1c3N0ZWxsdW5nc3N0YW5kXFxuLSBNw7ZnbGljaGtlaXQgZGVyIEJldGVpbGlndW5nIGFuIGRlciBTdGFydHVwLUFyZWEgKFNvbmRlcmtvbmRpdGlvbmVuKVxcbi0gWnVyIFZlcmbDvGd1bmcgZ2VzdGVsbHRlIHRlY2huaXNjaGUgQXVzc3RhdHR1bmcgKFN0cm9tLCBLw7xobGdlcsOkdGUpXFxuLSBXZXJiZW3DtmdsaWNoa2VpdGVuIGltIG9mZml6aWVsbGVuIE1lc3Nla2F0YWxvZyB1bmQgYXVmIGRlciBXZWJzaXRlJyxcbiAgICB0eXBlOiAnSW5mb3JtYXRpb24nXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtMTAnLFxuICAgIHRpdGxlOiAnQmV3ZXJidW5nOiBNaXRhcmJlaXRlciBhbiBkZXIgSG90ZWxyZXplcHRpb24nLFxuICAgIHNpdHVhdGlvbjogJ0RhcyBHcmFuZCBIb3RlbCBcIlZpZXIgSmFocmVzemVpdGVuXCIgaW4gTcO8bmNoZW4gc3VjaHQgZsO8ciBkaWUgU29tbWVyc2Fpc29uIGVpbmUgQXVzaGlsZmUgKG0vdy9kKSBhbiBkZXIgUmV6ZXB0aW9uIHVuZCBmw7xyIGRpZSBHw6RzdGViZXRyZXV1bmcuIFZvcmF1c2dlc2V0enQgd2VyZGVuIHZlcmhhbmRsdW5nc3NpY2hlcmUgRGV1dHNjaC0gdW5kIEVuZ2xpc2Noa2VubnRuaXNzZSBzb3dpZSBlaW4gZnJldW5kbGljaGVzIEF1ZnRyZXRlbi4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIElociBCZXdlcmJ1bmdzc2NocmVpYmVuLiBHZWhlbiBTaWUgYXVmIGZvbGdlbmRlIFB1bmt0ZSBlaW46XFxuLSBHcnVuZCBmw7xyIElocmUgQmV3ZXJidW5nIHVuZCBCZXp1Z25haG1lIGF1ZiBkaWUgU3RlbGxlbmFuemVpZ2VcXG4tIElocmUgU3ByYWNoa2VubnRuaXNzZSB1bmQgQXVzYmlsZHVuZ1xcbi0gQmlzaGVyaWdlIEt1bmRlbnNlcnZpY2UtIG9kZXIgR2FzdHJvbm9taWVlcmZhaHJ1bmdlblxcbi0gTW90aXZhdGlvbiwgZsO8ciBkaWVzZXMgcmVub21taWVydGUgSG90ZWwgenUgYXJiZWl0ZW5cXG4tIElocmUgemVpdGxpY2hlIFZlcmbDvGdiYXJrZWl0IGltIFNvbW1lcicsXG4gICAgdHlwZTogJ0Jld2VyYnVuZydcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC0xMScsXG4gICAgdGl0bGU6ICdCZXdlcmJ1bmc6IER1YWxlcyBTdHVkaXVtIFwiVG91cmlzbXVzbWFuYWdlbWVudFwiJyxcbiAgICBzaXR1YXRpb246ICdTaWUgaW50ZXJlc3NpZXJlbiBzaWNoIGbDvHIgZWluIGRyZWlqw6RocmlnZXMgZHVhbGVzIFN0dWRpdW0gaW0gQmVyZWljaCBUb3VyaXNtdXNtYW5hZ2VtZW50IG1pdCBlaW5lbSBNaXggYXVzIFRoZW9yaWV6ZWl0ZW4gYW4gZGVyIEhvY2hzY2h1bGUgdW5kIFByYXhpc3BoYXNlbiBiZWkgZGVyIFwiUmhlaW5sYW5kIFJlaXNlIEdydXBwZSBHbWJIXCIuIERpZXNlIHZlcmdpYnQgZsO8ciBkYXMgbsOkY2hzdGUgU3R1ZGllbmphaHIgendlaSBiZWdlaHJ0ZSBQbMOkdHplLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgSWhyZSBCZXdlcmJ1bmcgZsO8ciBkYXMgRHVhbGUgU3R1ZGl1bSBhbiBkaWUgUGVyc29uYWxhYnRlaWx1bmcgZGVyIFwiUmhlaW5sYW5kIFJlaXNlIEdydXBwZVwiLiBCZWhhbmRlbG4gU2llIGZvbGdlbmRlIFB1bmt0ZTpcXG4tIFdhcnVtIFNpZSBzaWNoIGbDvHIgZGVuIFN0dWRpZW5nYW5nIFRvdXJpc211c21hbmFnZW1lbnQgZW50c2NoaWVkZW4gaGFiZW5cXG4tIElocmUgc2NodWxpc2NoZW4gTGVpc3R1bmdlbiB1bmQgcmVsZXZhbnRlbiBTcHJhY2hrZW5udG5pc3NlIChEZXV0c2NoLCBFbmdsaXNjaClcXG4tIEVyc3RlIEVyZmFocnVuZ2VuIGltIFRvdXJpc211cy0gb2RlciBTZXJ2aWNlYmVyZWljaFxcbi0gV2FydW0gU2llIGRpZSBSaGVpbmxhbmQgUmVpc2UgR3J1cHBlIGFscyBQcmF4aXNwYXJ0bmVyIHfDpGhsZW5cXG4tIElocmUgRXJ3YXJ0dW5nZW4gYW4gZGFzIGR1YWxlIFN5c3RlbScsXG4gICAgdHlwZTogJ0Jld2VyYnVuZydcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC0xMicsXG4gICAgdGl0bGU6ICdCZXdlcmJ1bmc6IEF1c2hpbGZlIGluIGVpbmVyIEJ1Y2hoYW5kbHVuZycsXG4gICAgc2l0dWF0aW9uOiAnRGllIHRyYWRpdGlvbnNyZWljaGUgQnVjaGhhbmRsdW5nIFwiQnVjaCAmIEthZmZlZVwiIGluIEZyYW5rZnVydCBzdWNodCBhYiBzb2ZvcnQgZWluZSBzdHVkZW50aXNjaGUgQXVzaGlsZmUgKG0vdy9kKSBmw7xyIGRpZSBXb2NoZW5lbmRlbiAoU2Ftc3RhZ2UpIHp1ciBCZXRyZXV1bmcgZGVyIEt1bmRlbiB1bmQgenVyIFBmbGVnZSBkZXIgQnVjaGJlc3TDpG5kZS4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIElocmUgQmV3ZXJidW5nIGFuIGRlbiBJbmhhYmVyIEhlcnJuIFBldGVycy4gQmVoYW5kZWxuIFNpZSBmb2xnZW5kZSBQdW5rdGU6XFxuLSBXYXJ1bSBTaWUgaW4gZWluZXIgQnVjaGhhbmRsdW5nIGFyYmVpdGVuIG3DtmNodGVuXFxuLSBJaHJlIHBlcnPDtm5saWNoZSBMZXNlLUFmZmluaXTDpHQgdW5kIExpZWJsaW5nc2dlbnJlc1xcbi0gSWhyZSBFcmZhaHJ1bmdlbiBpbSBVbWdhbmcgbWl0IEt1bmRlbiAoRnJldW5kbGljaGtlaXQsIFNlcnZpY2UpXFxuLSBJaHJlIFp1dmVybMOkc3NpZ2tlaXQgdW5kIHplaXRsaWNoZSBGbGV4aWJpbGl0w6R0IGFtIFNhbXN0YWdcXG4tIElociBnZXfDvG5zY2h0ZXIgQXJiZWl0c2JlZ2lubicsXG4gICAgdHlwZTogJ0Jld2VyYnVuZydcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC0xMycsXG4gICAgdGl0bGU6ICdCZXNjaHdlcmRlOiBXZWxsbmVzcy1Xb2NoZW5lbmRlJyxcbiAgICBzaXR1YXRpb246ICdTaWUgaGFiZW4genVyIEVudHNwYW5udW5nIGVpbiBcIlByZW1pdW0tV2VsbG5lc3MtV29jaGVuZW5kZVwiIGltIEhvdGVsIFwiQWxwZW5vYXNlXCIgZ2VidWNodC4gTGF1dCBQcm9zcGVrdDogYmVoZWl6dGVyIEluZmluaXR5LVBvb2wsIHJ1aGlnZSBMYWdlLCA1LVN0ZXJuZS1aaW1tZXJzZXJ2aWNlIHVuZCBkcmVpIE1hc3NhZ2VuIGlua2x1c2l2ZS4gVm9yIE9ydDogRGVyIFBvb2wgd2FyIHdlZ2VuIEJhdWFyYmVpdGVuIGdlc3BlcnJ0LCBsYXV0ZXIgTMOkcm0gaW0gSG90ZWwgYWIgNyBVaHIgbW9yZ2VucywgZGVyIFppbW1lcnNlcnZpY2UgdW52b2xsc3TDpG5kaWcgdW5kIGVzIGdhYiBudXIgZWluZSBNYXNzYWdlLCB3ZWlsIGRhcyBQZXJzb25hbCB1bnRlcmJlc2V0enQgd2FyLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgZWluZSBCZXNjaHdlcmRlIGFuIGRpZSBIb3RlbGxlaXR1bmcuIEJlaGFuZGVsbiBTaWUgZm9sZ2VuZGUgUHVua3RlOlxcbi0gR3J1bmQgSWhyZXMgU2NocmVpYmVuc1xcbi0gS3JpdGlrIGFuIGRlbiBXZWxsbmVzcy1BbmxhZ2VuIChQb29sLVNjaGxpZcOfdW5nKVxcbi0gTMOkcm1iZWzDpHN0aWd1bmcgdW5kIG1hbmdlbG5kZXIgU2VydmljZVxcbi0gTmljaHQgZXJicmFjaHRlIGdlYnVjaHRlIExlaXN0dW5nZW4gKE1hc3NhZ2VuKVxcbi0gRm9yZGVydW5nIG5hY2ggZWluZXIgYW5nZW1lc3NlbmVuIEVudHNjaMOkZGlndW5nJyxcbiAgICB0eXBlOiAnQmVzY2h3ZXJkZSdcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC0xNCcsXG4gICAgdGl0bGU6ICdCaXR0ZSB1bSBJbmZvczogV2VpdGVyYmlsZHVuZyBQcm9qZWt0bWFuYWdlbWVudCcsXG4gICAgc2l0dWF0aW9uOiAnU2llIHNpbmQgYmVydWZzdMOkdGlnIGltIEJlcmVpY2ggTG9naXN0aWsgdW5kIG3DtmNodGVuIGVpbmUgemVydGlmaXppZXJ0ZSBiZXJ1ZnNiZWdsZWl0ZW5kZSBXZWl0ZXJiaWxkdW5nIGltIEJlcmVpY2ggXCJBZ2lsZXMgUHJvamVrdG1hbmFnZW1lbnRcIiBhYnNvbHZpZXJlbi4gU2llIGhhYmVuIGVpbiBBbmdlYm90IGRlciBBa2FkZW1pZSBcIkVkdUZ1dHVyZVwiIG9ubGluZSBnZWZ1bmRlbi4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIGVpbmUgRS1NYWlsIGFuIGRhcyBTZWtyZXRhcmlhdCBkZXIgQWthZGVtaWUgXCJFZHVGdXR1cmVcIi4gS2zDpHJlbiBTaWUgZm9sZ2VuZGUgUHVua3RlOlxcbi0gR2VuYXVlIFRlcm1pbmUgdW5kIFVocnplaXRlbiAoQWJlbmQtIG9kZXIgV29jaGVuZW5ka3Vyc2UpXFxuLSBBbmVya2VubnVuZyBkZXMgWmVydGlmaWthdHMgKHouQi4gUE1JIG9kZXIgU2NydW0gQWxsaWFuY2UpXFxuLSBLb3N0ZW4gdW5kIEbDtnJkZXJ1bmdzbcO2Z2xpY2hrZWl0ZW4gKHouQi4gQmlsZHVuZ3NndXRzY2hlaW4pXFxuLSBWb3JhdXNzZXR6dW5nZW4gZsO8ciBkaWUgVGVpbG5haG1lIGFuIGRlciBBYnNjaGx1c3NwcsO8ZnVuZycsXG4gICAgdHlwZTogJ0luZm9ybWF0aW9uJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdkZWZhdWx0LTE1JyxcbiAgICB0aXRsZTogJ0Jld2VyYnVuZzogQXVzaGlsZmUgaW0gRml0bmVzc3N0dWRpbycsXG4gICAgc2l0dWF0aW9uOiAnRGFzIEZpdG5lc3NzdHVkaW8gXCJGaXQmRnVuXCIgaW4gSWhyZXIgU3RhZHQgc3VjaHQgZWluZSBzdHVkZW50aXNjaGUgQXVzaGlsZmUgKG0vdy9kKSBmw7xyIGRpZSBBbm1lbGR1bmcsIGRpZSBHZXRyw6Rua2ViYXIgdW5kIGRpZSBnZWxlZ2VudGxpY2hlIEJldHJldXVuZyBkZXIgVHJhaW5pbmdzZmzDpGNoZSBhbSBXb2NoZW5lbmRlLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgSWhyZSBCZXdlcmJ1bmcgYW4gZGVuIFN0dWRpb2xlaXRlciBIZXJybiBNw7xsbGVyLiBCZWhhbmRlbG4gU2llIGZvbGdlbmRlIFB1bmt0ZTpcXG4tIEJlenVnbmFobWUgYXVmIGRpZSBBdXNzY2hyZWlidW5nIHVuZCBHcnVuZCBkZXIgQmV3ZXJidW5nXFxuLSBJaHJlIHBlcnPDtm5saWNoZSBTcG9ydGJlZ2Vpc3RlcnVuZyB1bmQgRml0bmVzc2tlbm50bmlzc2VcXG4tIEVyZmFocnVuZ2VuIGltIFVtZ2FuZyBtaXQgS3VuZGVuIHVuZCBTZXJ2aWNlYmVyZWl0c2NoYWZ0XFxuLSBJaHJlIHplaXRsaWNoZSBWZXJmw7xnYmFya2VpdCBhbSBXb2NoZW5lbmRlXFxuLSBJaHIgZ2V3w7xuc2NodGVyIEFyYmVpdHNiZWdpbm4nLFxuICAgIHR5cGU6ICdCZXdlcmJ1bmcnXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtMTYnLFxuICAgIHRpdGxlOiAnQmVzY2h3ZXJkZTogT25saW5lLU3DtmJlbGJlc3RlbGx1bmcnLFxuICAgIHNpdHVhdGlvbjogJ1NpZSBoYWJlbiBiZWltIE9ubGluZS1Nw7ZiZWxoYXVzIFwiV29vZFN0eWxlXCIgZWluIGhvY2h3ZXJ0aWdlcyBFY2tzb2ZhIGF1cyBFY2h0bGVkZXIgYmVzdGVsbHQuIERpZSBMaWVmZXJ6ZWl0IHNvbGx0ZSBtYXhpbWFsIDEwIFdlcmt0YWdlIGJldHJhZ2VuLiBEYXMgU29mYSBrYW0gZXJzdCBuYWNoIDYgV29jaGVuIGFuLiBadWRlbSBoYXQgZXMgZGllIGZhbHNjaGUgRmFyYmUgKER1bmtlbGJsYXUgc3RhdHQgQ29nbmFjLUJyYXVuKSB1bmQgYW4gZGVyIFLDvGNrc2VpdGUgYmVmaW5kZXQgc2ljaCBlaW4gYXVmZsOkbGxpZ2VyIFJpc3MgaW0gTGVkZXIuJyxcbiAgICBjb250ZW50OiAnU2NocmVpYmVuIFNpZSBlaW5lIEJlc2Nod2VyZGUgYW4gZGVuIEt1bmRlbnNlcnZpY2Ugdm9uIFwiV29vZFN0eWxlXCIuIEJlaGFuZGVsbiBTaWUgZm9sZ2VuZGUgUHVua3RlOlxcbi0gR3J1bmQgdW5kIEJlc3RlbGxkYXRlbiBkZXMgU2NocmVpYmVuc1xcbi0gS3JpdGlrIGFuIGRlciBleHRyZW1lbiBMaWVmZXJ2ZXJ6w7ZnZXJ1bmdcXG4tIEJlc2NocmVpYnVuZyBkZXIgTcOkbmdlbCAoRmFyYmUsIExlZGVycmlzcylcXG4tIEZvcmRlcnVuZyBhdWYgVW10YXVzY2ggb2RlciBlaW5lbiBlcmhlYmxpY2hlbiBQcmVpc25hY2hsYXNzXFxuLSBGcmlzdCBmw7xyIGRpZSBSw7xja21lbGR1bmcnLFxuICAgIHR5cGU6ICdCZXNjaHdlcmRlJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdkZWZhdWx0LTE3JyxcbiAgICB0aXRsZTogJ0JpdHRlIHVtIEluZm9zOiBWZWdhbmVzIENhdGVyaW5nIGbDvHIgRmlybWVuZmVpZXInLFxuICAgIHNpdHVhdGlvbjogJ1NpZSBvcmdhbmlzaWVyZW4gZGFzIGrDpGhybGljaGUgU29tbWVyZmVzdCBmw7xyIElociBVbnRlcm5laG1lbiBtaXQgY2EuIDgwIE1pdGFyYmVpdGVybi4gRGllIEdlc2Now6RmdHNsZWl0dW5nIHfDvG5zY2h0IGRpZXNlcyBKYWhyIGVpbiB2b2xsc3TDpG5kaWcgdmVnYW5lcyB1bmQgbmFjaGhhbHRpZ2VzIFNwZWlzZW5hbmdlYm90LiBTaWUgaW50ZXJlc3NpZXJlbiBzaWNoIGbDvHIgZGllIERpZW5zdGUgdm9uIFwiR3JlZW4gQ2F0ZXJpbmcgSGFtYnVyZ1wiLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgZWluZSBBbmZyYWdlLUUtTWFpbCBhbiBkYXMgQ2F0ZXJpbmctVGVhbS4gS2zDpHJlbiBTaWUgZm9sZ2VuZGUgUHVua3RlOlxcbi0gVm9yc2NobMOkZ2UgZsO8ciBlaW4gdmVnYW5lcyBCdWZmZXQgKFZvcnNwZWlzZW4sIEhhdXB0c3BlaXNlbiwgRGVzc2VydHMpXFxuLSBCZXLDvGNrc2ljaHRpZ3VuZyB2b24gd2VpdGVyZW4gVW52ZXJ0csOkZ2xpY2hrZWl0ZW4gKHouQi4gZ2x1dGVuZnJlaSlcXG4tIEJlcmVpdHN0ZWxsdW5nIHZvbiBHZXNjaGlyciwgQmVzdGVjayB1bmQgU2VydmljZXBlcnNvbmFsIHZvciBPcnRcXG4tIFByZWlza2Fsa3VsYXRpb24gcHJvIFBlcnNvbiB1bmQgTGllZmVyYmVkaW5ndW5nZW4nLFxuICAgIHR5cGU6ICdJbmZvcm1hdGlvbidcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC0xOCcsXG4gICAgdGl0bGU6ICdCZXdlcmJ1bmc6IEh1bmRlc2l0dGVyIGluIE3DvG5jaGVuJyxcbiAgICBzaXR1YXRpb246ICdEaWUgQWdlbnR1ciBcIlBhd3MgJiBGcmllbmRzXCIgdmVybWl0dGVsdCBxdWFsaWZpemllcnRlIHVuZCBsaWViZXZvbGxlIFRpZXJiZXRyZXVlciBhbiBIdW5kZWJlc2l0emVyIGluIE3DvG5jaGVuLCBkaWUgdGFnc8O8YmVyIGFyYmVpdGVuLiBHZXN1Y2h0IHdlcmRlbiB0aWVyYmVnZWlzdGVydGUgTWVuc2NoZW4gZsO8ciBTcGF6aWVyZ8OkbmdlIHVuZCBUYWdlc2JldHJldXVuZy4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIElocmUgQmV3ZXJidW5nIGbDvHIgZGllIEF1Zm5haG1lIGluIGRpZSBCZXRyZXVlcmthcnRlaS4gQmVoYW5kZWxuIFNpZSBmb2xnZW5kZSBQdW5rdGU6XFxuLSBNb3RpdmF0aW9uIGbDvHIgZGllIEFyYmVpdCBhbHMgSHVuZGVzaXR0ZXJcXG4tIEJpc2hlcmlnZSBlaWdlbmUgRXJmYWhydW5nZW4gaW0gVW1nYW5nIG1pdCBIdW5kZW4gKFJhc3NlbiwgVmVyaGFsdGVuKVxcbi0gWnV2ZXJsw6Rzc2lna2VpdCB1bmQgVmVyaGFsdGVuIGluIHN0cmVzc2lnZW4gb2RlciB1bnZvcmhlcmdlc2VoZW5lbiBTaXR1YXRpb25lblxcbi0gUmF1bXZlcmjDpGx0bmlzc2UgKFdvaG51bmcsIE7DpGhlIHp1IFBhcmtzKVxcbi0gSWhyZSB6ZWl0bGljaGUgVmVyZsO8Z2JhcmtlaXQgdW50ZXIgZGVyIFdvY2hlJyxcbiAgICB0eXBlOiAnQmV3ZXJidW5nJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdkZWZhdWx0LTE5JyxcbiAgICB0aXRsZTogJ0Jlc2Nod2VyZGU6IFByZW1pdW0tRXNzZW5zbGllZmVyZGllbnN0JyxcbiAgICBzaXR1YXRpb246ICdTaWUgaGFiZW4gZsO8ciBlaW5lbiBKYWhyZXN0YWcgZWluIGZlc3RsaWNoZXMgRHJlaS1Hw6RuZ2UtTWVuw7wgZsO8ciB2aWVyIFBlcnNvbmVuIGJlaW0gUHJlbWl1bS1MaWVmZXJkaWVuc3QgXCJHb3VybWV0RXhwcmVzc1wiIGJlc3RlbGx0LiBHZWdlbiBBdWZwcmVpcyB3dXJkZSBlaW5lIG1pbnV0ZW5nZW5hdWUgTGllZmVydW5nIGdhcmFudGllcnQuIERhcyBFc3NlbiBrYW0gOTAgTWludXRlbiB6dSBzcMOkdCwgZGllIFN1cHBlIHdhciBrYWx0IHVuZCBhdXNnZWxhdWZlbiwgZGFzIEhhdXB0Z2VyaWNodCB2ZXJ0YXVzY2h0ICh2ZWdldGFyaXNjaCBzdGF0dCBSaW5kZXJmaWxldCkgdW5kIGRhcyBEZXNzZXJ0IGZlaGx0ZSBnYW56LicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgZWluZSBCZXNjaHdlcmRlIGFuIGRpZSBHZXNjaMOkZnRzZsO8aHJ1bmcgdm9uIFwiR291cm1ldEV4cHJlc3NcIi4gQmVoYW5kZWxuIFNpZSBmb2xnZW5kZSBQdW5rdGU6XFxuLSBHcnVuZCBJaHJlcyBTY2hyZWliZW5zIHVuZCBCZXN0ZWxsZGV0YWlsc1xcbi0gTWFzc2l2ZSBMaWVmZXJ2ZXJ6w7ZnZXJ1bmcgdHJvdHoga29zdGVucGZsaWNodGlnZXIgR2FyYW50aWVcXG4tIEtyaXRpayBhbiBWZXJwYWNrdW5nLCBUZW1wZXJhdHVyIHVuZCBmZWhsZXJoYWZ0ZXIgTGllZmVydW5nXFxuLSBFbnR0w6R1c2NodW5nIMO8YmVyIGRlbiBtaXNzbHVuZ2VuZW4gZmVzdGxpY2hlbiBBYmVuZFxcbi0gRm9yZGVydW5nIG5hY2ggdm9sbHN0w6RuZGlnZXIgRXJzdGF0dHVuZyBkZXMgUHJlaXNlcycsXG4gICAgdHlwZTogJ0Jlc2Nod2VyZGUnXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtMjAnLFxuICAgIHRpdGxlOiAnQml0dGUgdW0gSW5mb3M6IFNvbW1lcmNhbXAgZsO8ciBLaW5kZXInLFxuICAgIHNpdHVhdGlvbjogJ1NpZSBtw7ZjaHRlbiBJaHJlbiAxMC1qw6RocmlnZW4gU29obiBmw7xyIGVpbiB6d2Vpd8O2Y2hpZ2VzIFwiTmF0dXItIHVuZCBBYmVudGV1ZXJjYW1wXCIgaW4gVGjDvHJpbmdlbiBhbm1lbGRlbiwgd2VsY2hlcyB2b20gVmVyZWluIFwiV2lsZG5pc0tpZHMgZS5WLlwiIHZlcmFuc3RhbHRldCB3aXJkLiBFcyBibGVpYmVuIGplZG9jaCB3ZXNlbnRsaWNoZSBvcmdhbmlzYXRvcmlzY2hlIEZyYWdlbiBvZmZlbi4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIGVpbmUgRS1NYWlsIGFuIGRlbiBWZXJhbnN0YWx0ZXIgXCJXaWxkbmlzS2lkcyBlLlYuXCIuIEJpdHRlbiBTaWUgdW0gQXVza3VuZnQgenU6XFxuLSBCZXRyZXVlcnNjaGzDvHNzZWwgKFZlcmjDpGx0bmlzIEJldHJldWVyIHp1IEtpbmRlcm4pIHVuZCBRdWFsaWZpa2F0aW9uZW5cXG4tIFRhZ2VzYWJsYXVmLCBBa3Rpdml0w6R0ZW4gdW5kIFNpY2hlcmhlaXRzdm9ya2VocnVuZ2VuIGJlaSBzY2hsZWNodGVtIFdldHRlclxcbi0gVW50ZXJrdW5mdCAoWmVsdGUgb2RlciBmZXN0ZSBIw6R1c2VyKSB1bmQgVmVycGZsZWd1bmcgKEFsbGVyZ2VuZSwgdmVnZXRhcmlzY2gpXFxuLSBSw7xja3RyaXR0c2JlZGluZ3VuZ2VuIGJlaSBwbMO2dHpsaWNoZXIgRXJrcmFua3VuZyBkZXMgS2luZGVzJyxcbiAgICB0eXBlOiAnSW5mb3JtYXRpb24nXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtMjEnLFxuICAgIHRpdGxlOiAnQmV3ZXJidW5nOiBTb2NpYWwgTWVkaWEgQXNzaXN0YW50JyxcbiAgICBzaXR1YXRpb246ICdEYXMgenVrdW5mdHNvcmllbnRpZXJ0ZSBNb2RlLVN0YXJ0dXAgXCJTdHlsZUluc3BvXCIgYXVzIEJlcmxpbiBzdWNodCBlaW5lbiBTb2NpYWwgTWVkaWEgQXNzaXN0YW50IChtL3cvZCkgYXVmIE1pbmlqb2ItQmFzaXMgKDEwLTE1IFN0dW5kZW4vV29jaGUpLiBBdWZnYWJlbiB1bWZhc3NlbiBkaWUgRXJzdGVsbHVuZyB2b24gSW5oYWx0ZW4gZsO8ciBJbnN0YWdyYW0sIFRpa1RvayB1bmQgZGFzIEJlYW50d29ydGVuIHZvbiBDb21tdW5pdHktRnJhZ2VuLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgSWhyZSBCZXdlcmJ1bmcgYW4gZGllIE1hcmtldGluZ2xlaXR1bmcuIEdlaGVuIFNpZSBhdWYgZm9sZ2VuZGUgUHVua3RlIGVpbjpcXG4tIElocmUgQmVnZWlzdGVydW5nIGbDvHIgTW9kZSB1bmQgU29jaWFsLU1lZGlhLVBsYXR0Zm9ybWVuXFxuLSBFcmZhaHJ1bmdlbiBpbSBCZXJlaWNoIENvbnRlbnQgQ3JlYXRpb24gKEZvdG9zLCBWaWRlb3MsIFJlZWxzLCBDYW52YSBldGMuKVxcbi0gSWhyZSBLb21tdW5pa2F0aW9uc3N0w6Rya2UgdW5kIERldXRzY2hrZW5udG5pc3NlIGltIFVtZ2FuZyBtaXQgRm9sbG93ZXJuXFxuLSBXYXJ1bSBTaWUgc3BlemllbGwgZsO8ciBkYXMgU3RhcnR1cCBcIlN0eWxlSW5zcG9cIiBhcmJlaXRlbiBtw7ZjaHRlblxcbi0gSWhyZSB3w7ZjaGVudGxpY2hlIFZlcmbDvGdiYXJrZWl0IHVuZCB0ZWNobmlzY2hlcyBFcXVpcG1lbnQnLFxuICAgIHR5cGU6ICdCZXdlcmJ1bmcnXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtMjInLFxuICAgIHRpdGxlOiAnQmVzY2h3ZXJkZTogS29uemVydHJlaXNlIG5hY2ggSGFtYnVyZycsXG4gICAgc2l0dWF0aW9uOiAnU2llIGhhYmVuIGJlaW0gUmVpc2Viw7xybyBcIkt1bHR1clJlaXNlblwiIGVpbiBQYWtldCBnZWJ1Y2h0LCBiZXN0ZWhlbmQgYXVzIGVpbmVyIEhvdGVsw7xiZXJuYWNodHVuZyBpbiBIYW1idXJnIHVuZCBlcnN0a2xhc3NpZ2VuIEVpbnRyaXR0c2thcnRlbiBmw7xyIGVpbiBLb256ZXJ0IGluIGRlciBFbGJwaGlsaGFybW9uaWUuIERpZSBFaW50cml0dHNrYXJ0ZW4gd3VyZGVuIElobmVuIHRyb3R6IFp1c2FnZSBuaWNodCBpbnMgSG90ZWwgZ2VsaWVmZXJ0LCB3ZXNoYWxiIFNpZSBkYXMgS29uemVydCB2ZXJwYXNzdGVuLiBadWRlbSB3YXIgZGFzIEhvdGVsemltbWVyIHNjaG11dHppZyB1bmQgbGF1dC4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIGVpbmUgQmVzY2h3ZXJkZSBhbiBkYXMgUmVpc2Viw7xybyBcIkt1bHR1clJlaXNlblwiLiBCZWhhbmRlbG4gU2llIGZvbGdlbmRlIFB1bmt0ZTpcXG4tIEdydW5kIElocmVzIFNjaHJlaWJlbnMgdW5kIEJ1Y2h1bmdzbnVtbWVyXFxuLSBOaWNodHp1c3RlbGx1bmcgZGVyIEtvbnplcnRrYXJ0ZW4gdW5kIGRhcyB2ZXJwYXNzdGUgRXZlbnRcXG4tIE3DpG5nZWwgZGVzIEhvdGVsemltbWVycyAoTMOkcm0sIEh5Z2llbmUpXFxuLSBFbnR0w6R1c2NodW5nIMO8YmVyIGRlbiB6ZXJzdMO2cnRlbiBXb2NoZW5lbmRhdXNmbHVnXFxuLSBGb3JkZXJ1bmcgYXVmIHZvbGxzdMOkbmRpZ2UgRXJzdGF0dHVuZyBkZXMgUmVpc2VwcmVpc2VzIHVuZCBTY2hhZGVuc2Vyc2F0eicsXG4gICAgdHlwZTogJ0Jlc2Nod2VyZGUnXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtMjMnLFxuICAgIHRpdGxlOiAnQml0dGUgdW0gSW5mb3M6IENvd29ya2luZyBTcGFjZSBNaXRnbGllZHNjaGFmdCcsXG4gICAgc2l0dWF0aW9uOiAnU2llIGFyYmVpdGVuIGFscyBmcmVpYmVydWZsaWNoZXIgU29mdHdhcmVlbnR3aWNrbGVyIGltIEhvbWVvZmZpY2UgdW5kIG3DtmNodGVuIGVpbiBwcm9mZXNzaW9uZWxsZXMgQXJiZWl0c3VtZmVsZCBudXR6ZW4uIFNpZSBpbnRlcmVzc2llcmVuIHNpY2ggZsO8ciBlaW4gbW9uYXRsaWNoZXMgQWJvbm5lbWVudCBpbSBDb3dvcmtpbmcgQ2VudGVyIFwiTmV4dXMgT2ZmaWNlXCIgaW4gRnJhbmtmdXJ0LicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgZWluZSBFLU1haWwgYW4gZGllIENlbnRlcmxlaXR1bmcuIEVya3VuZGlnZW4gU2llIHNpY2ggbmFjaCBmb2xnZW5kZW4gUHVua3RlbjpcXG4tIFVudGVyc2NoaWVkIHp3aXNjaGVuIFwiRmxleCBEZXNrXCIgKGZyZWllciBUaXNjaHdlY2hzZWwpIHVuZCBcIkRlZGljYXRlZCBEZXNrXCIgKGZlc3RlciBBcmJlaXRzcGxhdHopXFxuLSBUZWNobmlzY2hlIEluZnJhc3RydWt0dXIgKEludGVybmV0LUdlc2Nod2luZGlna2VpdCwgRHJ1Y2tlcm51dHp1bmcsIEthZmZlZWvDvGNoZSlcXG4tIFp1Z2FuZ3Ntw7ZnbGljaGtlaXRlbiBhbSBXb2NoZW5lbmRlIHVuZCB6dSBzcMOkdGVuIEFiZW5kc3R1bmRlbiAoS2V5Y2FyZClcXG4tIEJ1Y2hiYXJrZWl0IHZvbiBNZWV0aW5ncsOkdW1lbiBmw7xyIEt1bmRlbnRlcm1pbmUgdW5kIFByZWlzdm9ydGVpbGUgZsO8ciBNaXRnbGllZGVyJyxcbiAgICB0eXBlOiAnSW5mb3JtYXRpb24nXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtMjQnLFxuICAgIHRpdGxlOiAnQmV3ZXJidW5nOiBLZWxsbmVyIGltIGl0YWxpZW5pc2NoZW4gUmVzdGF1cmFudCcsXG4gICAgc2l0dWF0aW9uOiAnRGFzIFJlc3RhdXJhbnQgXCJCZWxsYSBJdGFsaWFcIiBpbiBLw7ZsbiBzdWNodCBmw7xyIGRpZSBhYmVuZGxpY2hlbiBTdG/Dn3plaXRlbiB1bmQgZGFzIFdvY2hlbmVuZGUgZWluZSBlbmdhZ2llcnRlIFNlcnZpY2VrcmFmdCAobS93L2QpLiBFcmZhaHJ1bmdlbiBpbSBTZXJ2aWNlIHNpbmQgZ2V3w7xuc2NodCwgYWJlciBrZWluZSB6d2luZ2VuZGUgVm9yYXVzc2V0enVuZy4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIElocmUgYXVzc2FnZWtyw6RmdGlnZSBCZXdlcmJ1bmcgYW4gZGVuIEdlc2Now6RmdHNmw7xocmVyIEhlcnJuIFJvc3NpLiBCZWhhbmRlbG4gU2llIGZvbGdlbmRlIFB1bmt0ZTpcXG4tIElociBCZXp1ZyB6dXIgR2FzdHJvbm9taWUgdW5kIEdydW5kIGRlciBCZXdlcmJ1bmdcXG4tIElocmUgU3TDpHJrZW4gaW0gU2VydmljZWJlcmVpY2ggKEZyZXVuZGxpY2hrZWl0LCBTdHJlc3NyZXNpc3RlbnosIFRlYW1mw6RoaWdrZWl0KVxcbi0gQmlzaGVyaWdlIFTDpHRpZ2tlaXRlbiBpbSBLdW5kZW5rb250YWt0IG9kZXIgaW4gZGVyIEdhc3Ryb25vbWllXFxuLSBJaHJlIFNwcmFjaGtlbm50bmlzc2UgKERldXRzY2gsIEVuZ2xpc2NoLCBldmVudHVlbGwgSXRhbGllbmlzY2gpXFxuLSBJaHJlIHplaXRsaWNoZSBGbGV4aWJpbGl0w6R0IGFtIEFiZW5kIHVuZCBhbSBXb2NoZW5lbmRlJyxcbiAgICB0eXBlOiAnQmV3ZXJidW5nJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdkZWZhdWx0LTI1JyxcbiAgICB0aXRsZTogJ0Jlc2Nod2VyZGU6IEZpdG5lc3NzdHVkaW8gXCJWaXRhbExpZmVcIicsXG4gICAgc2l0dWF0aW9uOiAnU2llIGhhYmVuIGVpbmVuIEphaHJlc3ZlcnRyYWcgaW0gU3R1ZGlvIFwiVml0YWxMaWZlXCIgdW50ZXIgZGVyIEJlZGluZ3VuZyBhYmdlc2NobG9zc2VuLCBkYXNzIElobmVuIGRlciBadXRyaXR0IHp1bSBTYXVuYWJlcmVpY2ggdW5kIGRpZSBUZWlsbmFobWUgYW4gRml0bmVzc2t1cnNlbiBqZWRlcnplaXQga29zdGVubG9zIHp1c3RlaGVuLiBTZWl0IGRyZWkgTW9uYXRlbiBpc3QgZGllIFNhdW5hIGRlZmVrdC4gQXXDn2VyZGVtIHd1cmRlbiBmYXN0IGFsbGUgUGlsYXRlcy0gdW5kIFlvZ2FrdXJzZSBvaG5lIEVyc2F0eiBnZXN0cmljaGVuLiBUcm90emRlbSBidWNodCBkYXMgU3R1ZGlvIGRlbiB2b2xsZW4gTW9uYXRzYmVpdHJhZyBhYi4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIGVpbmUgQmVzY2h3ZXJkZSBhbiBkZW4gS3VuZGVuc2VydmljZSB2b24gXCJWaXRhbExpZmVcIi4gQmVoYW5kZWxuIFNpZSBmb2xnZW5kZSBQdW5rdGU6XFxuLSBHcnVuZCBJaHJlcyBTY2hyZWliZW5zIHVuZCBNaXRnbGllZHNudW1tZXJcXG4tIERhdWVyaGFmdGVyIEF1c2ZhbGwgZGVzIFNhdW5hYmVyZWljaHMgdW5kIG1hbmdlbG5kZSBSZXBhcmF0dXJcXG4tIFN0cmVpY2h1bmcgZGVyIHZlcnRyYWdsaWNoIHZlcmVpbmJhcnRlbiBLdXJzZVxcbi0gRm9yZGVydW5nIGVpbmVyIGFuZ2VtZXNzZW5lbiBCZWl0cmFnc21pbmRlcnVuZyBmw7xyIGRpZSBBdXNmYWxsemVpdFxcbi0gRnJpc3RzZXR6dW5nIHp1ciBMw7ZzdW5nIG9kZXIgQW5kcm9odW5nIGVpbmVyIGF1w59lcm9yZGVudGxpY2hlbiBLw7xuZGlndW5nJyxcbiAgICB0eXBlOiAnQmVzY2h3ZXJkZSdcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC0yNicsXG4gICAgdGl0bGU6ICdCaXR0ZSB1bSBJbmZvczogRGV1dHNjaHByw7xmdW5nZW4gZsO8ciBNZWRpemluZXInLFxuICAgIHNpdHVhdGlvbjogJ1NpZSBoYWJlbiBlaW4gYWJnZXNjaGxvc3NlbmVzIE1lZGl6aW5zdHVkaXVtIGltIEF1c2xhbmQgYWJzb2x2aWVydCB1bmQgbcO2Y2h0ZW4gYmFsZCBhbHMgQXNzaXN0ZW56YXJ6dCBpbiBEZXV0c2NobGFuZCBhcmJlaXRlbi4gWnVyIEJlYW50cmFndW5nIGRlciBBcHByb2JhdGlvbiBiZW7DtnRpZ2VuIFNpZSBkaWUgRmFjaHNwcmFjaGVucHLDvGZ1bmcgKEZTUCkuIFNpZSBpbnRlcmVzc2llcmVuIHNpY2ggZsO8ciBkaWUgVm9yYmVyZWl0dW5nc2t1cnNlIGRlcyBBbmJpZXRlcnMgXCJNZWQtRGV1dHNjaCBBa2FkZW1pZVwiLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgZWluZSBBbmZyYWdlLUUtTWFpbCBhbiBkaWUgS3Vyc2xlaXR1bmcgZGVyIFwiTWVkLURldXRzY2ggQWthZGVtaWVcIi4gRnJhZ2VuIFNpZSBuYWNoOlxcbi0gRGF1ZXIsIFN0YXJ0dGVybWluZW4gdW5kIFByZWlzZW4gZGVzIHNwZXppZWxsZW4gRlNQLVplcnRpZmlrYXRza3Vyc2VzXFxuLSBMZXJuaW5oYWx0ZW4gKFBhdGllbnRlbmdlc3Byw6RjaGUsIEFyenRicmllZmUsIG1lZGl6aW5pc2NoZSBEb2t1bWVudGF0aW9uKVxcbi0gUXVhbGlmaWthdGlvbmVuIGRlciBEb3plbnRlbiAoTWVkaXppbmVyIG9kZXIgemVydGlmaXppZXJ0ZSBTcHJhY2hsZWhyZXIpXFxuLSBNw7ZnbGljaGtlaXQgZWluZXMgT25saW5lLSBvZGVyIEh5YnJpZGt1cnNlcyB1bmQgQmVzdGVoZW5zcXVvdGUgZGVyIFRlaWxuZWhtZXInLFxuICAgIHR5cGU6ICdJbmZvcm1hdGlvbidcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC0yNycsXG4gICAgdGl0bGU6ICdCZXdlcmJ1bmc6IE1pdGFyYmVpdGVyIGltIEt1bmRlbmRpZW5zdCcsXG4gICAgc2l0dWF0aW9uOiAnRGFzIEUtQ29tbWVyY2UtVW50ZXJuZWhtZW4gXCJFY29DYXJ0XCIgdmVydHJlaWJ0IMO2a29sb2dpc2NoZSBIYXVzaGFsdHN3YXJlbiB1bmQgc3VjaHQgYWIgc29mb3J0IE1pdGFyYmVpdGVyIChtL3cvZCkgaW0gS3VuZGVuc2VydmljZSBmw7xyIGRpZSBzY2hyaWZ0bGljaGUgdW5kIHRlbGVmb25pc2NoZSBLdW5kZW5iZXRyZXV1bmcsIHZvbGxzdMOkbmRpZyBpbSBIb21lb2ZmaWNlIChSZW1vdGUpLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgSWhyZSBCZXdlcmJ1bmcgYW4gZGllIFBlcnNvbmFsYWJ0ZWlsdW5nIHZvbiBcIkVjb0NhcnRcIi4gR2VoZW4gU2llIGF1ZiBmb2xnZW5kZSBQdW5rdGUgZWluOlxcbi0gR3J1bmQgZGVyIEJld2VyYnVuZyB1bmQgSWhyZSBJZGVudGlmaWthdGlvbiBtaXQgw7Zrb2xvZ2lzY2hlbiBQcm9kdWt0ZW5cXG4tIElocmUgU3TDpHJrZW4gaW4gZGVyIHNjaHJpZnRsaWNoZW4gdW5kIG3DvG5kbGljaGVuIEtvbW11bmlrYXRpb24gKEZyZXVuZGxpY2hrZWl0LCBHZWR1bGQpXFxuLSBJaHJlIEVyZmFocnVuZ2VuIG1pdCBQQy1BcmJlaXQsIEt1bmRlbnN5c3RlbWVuIG9kZXIgT2ZmaWNlLVBha2V0ZW5cXG4tIElociBlaW5nZXJpY2h0ZXRlciwgdW5nZXN0w7ZydGVyIEhlaW1hcmJlaXRzcGxhdHogbWl0IHN0YWJpbGVyIEludGVybmV0dmVyYmluZHVuZ1xcbi0gSWhyZSBHZWhhbHRzdm9yc3RlbGx1bmcgKFN0dW5kZW5sb2huKSB1bmQgZ2V3w7xuc2NodGUgV29jaGVuYXJiZWl0c3plaXQnLFxuICAgIHR5cGU6ICdCZXdlcmJ1bmcnXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtMjgnLFxuICAgIHRpdGxlOiAnQmVzY2h3ZXJkZTogSG90ZWxhdWZlbnRoYWx0IFwiU2VlYmxpY2tcIicsXG4gICAgc2l0dWF0aW9uOiAnU2llIGhhYmVuIGbDvHIgZWluZW4gRXJob2x1bmdzdXJsYXViIGVpbiBEb3BwZWx6aW1tZXIgbWl0IFNlZWJsaWNrIGltIEhvdGVsIFwiU2VlYmxpY2tcIiByZXNlcnZpZXJ0LiBCZWkgSWhyZXIgQW5rdW5mdCB0ZWlsdGUgbWFuIElobmVuIG1pdCwgZGFzcyBkYXMgSG90ZWwgw7xiZXJidWNodCBzZWkuIFNpZSBtdXNzdGVuIGluIGVpbiBrbGVpbmVyZXMgWmltbWVyIGltIFNvdXRlcnJhaW4gZGlyZWt0IG5lYmVuIGRlciBsYXV0ZW4gSGVpenVuZ3NhbmxhZ2UgdW16aWVoZW4uIERlciB2ZXJzcHJvY2hlbmUgU2VlYmxpY2sgZmVobHRlLCB1bmQgZGFzIEZyw7xoc3TDvGNrc2J1ZmZldCB3YXIgdW5nZW5pZcOfYmFyLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgZWluZSBCZXNjaHdlcmRlIGFuIGRpZSBIb3RlbGRpcmVrdGlvbi4gQmVoYW5kZWxuIFNpZSBmb2xnZW5kZSBQdW5rdGU6XFxuLSBHcnVuZCBJaHJlcyBTY2hyZWliZW5zIHVuZCBCdWNodW5nc3plaXRyYXVtXFxuLSBLcml0aWsgYW4gZGVyIMOcYmVyYnVjaHVuZyB1bmQgZGVyIG1pbmRlcndlcnRpZ2VuIEVyc2F0enVudGVya3VuZnRcXG4tIEzDpHJtYmVsw6RzdGlndW5nIGR1cmNoIGRpZSBIZWl6dW5nIHVuZCBmZWhsZW5kZSBFcmhvbHVuZ1xcbi0gTWFuZ2VsbmRlIFF1YWxpdMOkdCBkZXIgVmVycGZsZWd1bmcgKEZyw7xoc3TDvGNrKVxcbi0gRm9yZGVydW5nIGF1ZiBSw7xja2Vyc3RhdHR1bmcgZGVyIFByZWlzZGlmZmVyZW56IHVuZCBhbmdlbWVzc2VuZSBFbnRzY2jDpGRpZ3VuZycsXG4gICAgdHlwZTogJ0Jlc2Nod2VyZGUnXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtMjknLFxuICAgIHRpdGxlOiAnQml0dGUgdW0gSW5mb3M6IEtsZXR0ZXJwYXJrIFRlYW1idWlsZGluZycsXG4gICAgc2l0dWF0aW9uOiAnU2llIHNpbmQgQWJ0ZWlsdW5nc2xlaXRlciBpbiBlaW5lciBJVC1GaXJtYSBtaXQgMjUgTWl0YXJiZWl0ZXJuLiBadXIgU3TDpHJrdW5nIGRlcyBUZWFtZ2Vpc3RzIHBsYW5lbiBTaWUgZWluZW4gQmV0cmllYnNhdXNmbHVnIGluIGRlbiBcIkFiZW50ZXVlci1LbGV0dGVyd2FsZCBUYXVudXNcIi4gU2llIG3DtmNodGVuIGVpbiBtYcOfZ2VzY2huZWlkZXJ0ZXMgVGVhbWJ1aWxkaW5nLVByb2dyYW1tIGJ1Y2hlbi4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIGVpbmUgQW5mcmFnZSBhbiBkYXMgRXZlbnQtVGVhbSBkZXMgS2xldHRlcndhbGRzLiBLbMOkcmVuIFNpZSBmb2xnZW5kZSBQdW5rdGU6XFxuLSBTcGV6aWVsbGUgR3J1cHBlbi0gdW5kIFRlYW1idWlsZGluZy1Ba3Rpdml0w6R0ZW4gbWl0IFRyYWluZXJiZWdsZWl0dW5nXFxuLSBTaWNoZXJoZWl0c2tvbnplcHQsIG5vdHdlbmRpZ2UgS2xlaWR1bmcgdW5kIEVpbndlaXN1bmcgZsO8ciBBbmbDpG5nZXJcXG4tIENhdGVyaW5nLU9wdGlvbmVuIChHcmlsbHBsYXR6IG1pZXRlbiwgQ2F0ZXJpbmctU2VydmljZSBvZGVyIFJlc3RhdXJhbnQgdm9yIE9ydClcXG4tIEdydXBwZW5yYWJhdHRlIHVuZCBTdG9ybmllcnVuZ3NiZWRpbmd1bmdlbiBiZWkgc3RhcmtlbSBSZWdlbicsXG4gICAgdHlwZTogJ0luZm9ybWF0aW9uJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdkZWZhdWx0LTMwJyxcbiAgICB0aXRsZTogJ0Jld2VyYnVuZzogRXZlbnQtQXVzaGlsZmUgYXVmIE11c2lrbWVzc2UnLFxuICAgIHNpdHVhdGlvbjogJ0bDvHIgZGllIGludGVybmF0aW9uYWxlIE11c2lrbWVzc2UgXCJNdXNpY29uXCIgaW4gRnJhbmtmdXJ0IHN1Y2h0IGRlciBWZXJhbnN0YWx0ZXIgXCJNZXNzZUZyYW5rZnVydCBHbWJIXCIga3VyemZyaXN0aWcgendlaXNwcmFjaGlnZSBFdmVudC1BdXNoaWxmZW4gKG0vdy9kKSBmw7xyIGRpZSBCZXN1Y2hlcnJlZ2lzdHJpZXJ1bmcsIFdlZ2VsZWl0dW5nIHVuZCBJbmZvcm1hdGlvbnNzdMOkbmRlLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgSWhyZSBCZXdlcmJ1bmcgZsO8ciBkaWVzZW4gTWVzc2Vqb2IuIEJlaGFuZGVsbiBTaWUgZm9sZ2VuZGUgUHVua3RlOlxcbi0gQmV6dWcgYXVmIGRpZSBTdGVsbGVuYXVzc2NocmVpYnVuZyB1bmQgTW90aXZhdGlvbiBmw7xyIGRpZSBNaXRhcmJlaXQgYXVmIGRlciBNdXNpa21lc3NlXFxuLSBJaHJlIFNwcmFjaGtlbm50bmlzc2UgKERldXRzY2gsIEVuZ2xpc2NoIGZsaWXDn2VuZCwgd2VpdGVyZSBTcHJhY2hlbilcXG4tIElocmUgS29udGFrdGZyZXVkaWdrZWl0LCBCZWxhc3RiYXJrZWl0IGJlaSBob2hlbSBCZXN1Y2hlcmF1ZmtvbW1lbiB1bmQgZ2VwZmxlZ3RlcyBBdWZ0cmV0ZW5cXG4tIEVyZmFocnVuZ2VuIGF1cyBmcsO8aGVyZW4gTWVzc2VuLCBQcm9tb3Rpb25qb2JzIG9kZXIgZGVtIEt1bmRlbnNlcnZpY2VcXG4tIEJlc3TDpHRpZ3VuZyBJaHJlciB1bmVpbmdlc2NocsOkbmt0ZW4gWnVnw6RuZ2xpY2hrZWl0IGFuIGFsbGVuIHZpZXIgTWVzc2V0YWdlbicsXG4gICAgdHlwZTogJ0Jld2VyYnVuZydcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC0zMScsXG4gICAgdGl0bGU6ICdCZXNjaHdlcmRlOiBTdHJlYW1pbmdkaWVuc3QgQWJvLUFicmVjaG51bmcnLFxuICAgIHNpdHVhdGlvbjogJ1NpZSBudXR6ZW4gc2VpdCBlaW5lbSBKYWhyIGRlbiBTdHJlYW1pbmdkaWVuc3QgXCJNb3ZpZVBsdXNcIi4gVm9yIGt1cnplbSB3dXJkZSBvaG5lIElocmUgWnVzdGltbXVuZyBkZXIgUGFrZXRwcmVpcyB1bSA1MCAlIGVyaMO2aHQuIFp1ZGVtIHd1cmRlIElobmVuIHRyb3R6IGZyaXN0Z2VyZWNodGVyIEvDvG5kaWd1bmcgZGVzIFByZW1pdW0tWnVzYXR6cGFrZXRzIGRlciBCZXRyYWcgZsO8ciBkcmVpIHdlaXRlcmUgTW9uYXRlIGFiZ2VidWNodC4gRGVyIHRlbGVmb25pc2NoZSBTdXBwb3J0IGhhdCBJaHIgQW5saWVnZW4gaWdub3JpZXJ0LicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgZWluZSBmb3JtZWxsZSBCZXNjaHdlcmRlIGFuIGRlbiBLdW5kZW5zZXJ2aWNlIHZvbiBcIk1vdmllUGx1c1wiLiBCZWhhbmRlbG4gU2llIGZvbGdlbmRlIFB1bmt0ZTpcXG4tIEdydW5kIGRlcyBTY2hyZWliZW5zLCBLdW5kZW5udW1tZXIgdW5kIFZlcnRyYWdzZGF0ZW5cXG4tIEtyaXRpayBhbiBkZXIgdW5hbmdla8O8bmRpZ3RlbiBQcmVpc2VyaMO2aHVuZ1xcbi0gUmVjaHRzd2lkcmlnZSBBYmJ1Y2h1bmcgdHJvdHogbmFjaHdlaXNiYXIgZnJpc3RnZXJlY2h0ZXIgS8O8bmRpZ3VuZ1xcbi0gRW50dMOkdXNjaHVuZyDDvGJlciBkaWUgU2VydmljZXF1YWxpdMOkdCB1bmQgVW50w6R0aWdrZWl0IGRlcyB0ZWxlZm9uaXNjaGVuIFN1cHBvcnRzXFxuLSBGb3JkZXJ1bmcgenVyIHNvZm9ydGlnZW4gUsO8Y2vDvGJlcndlaXN1bmcgZGVzIGbDpGxzY2hsaWNoZXJ3ZWlzZSBlaW5nZXpvZ2VuZW4gR2VsZGVzJyxcbiAgICB0eXBlOiAnQmVzY2h3ZXJkZSdcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC0zMicsXG4gICAgdGl0bGU6ICdCaXR0ZSB1bSBJbmZvczogQXVzbGFuZHNzZW1lc3RlciBpbiBIZWlkZWxiZXJnJyxcbiAgICBzaXR1YXRpb246ICdTaWUgc3R1ZGllcmVuIEdlcm1hbmlzdGlrIGluIElocmVtIEhlaW1hdGxhbmQgdW5kIG3DtmNodGVuIGltIG7DpGNoc3RlbiBGcsO8aGphaHIgZWluIGVpbnNlbWVzdHJpZ2VzIEVyYXNtdXMtQXVzbGFuZHNzdHVkaXVtIGFuIGRlciBVbml2ZXJzaXTDpHQgSGVpZGVsYmVyZyBhYnNvbHZpZXJlbi4gVmllbGUgYWRtaW5pc3RyYXRpdmUgU2Nocml0dGUgc2luZCBub2NoIHVua2xhci4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIGVpbmUgRS1NYWlsIGFuIGRhcyBBa2FkZW1pc2NoZSBBdXNsYW5kc2FtdCAoQUFBKSBkZXIgVW5pdmVyc2l0w6R0IEhlaWRlbGJlcmcuIEZyYWdlbiBTaWUgbmFjaDpcXG4tIEZyaXN0ZW4gZsO8ciBkaWUgRWlucmVpY2h1bmcgZGVyIFp1bGFzc3VuZ3N1bnRlcmxhZ2VuIHVuZCBBbmVya2VubnVuZyB2b24gYmlzaGVyaWdlbiBOb3Rlblxcbi0gVW50ZXJzdMO8dHp1bmcgYmVpIGRlciBWZXJtaXR0bHVuZyBlaW5lcyBaaW1tZXJzIGluIGVpbmVtIHN0YWF0bGljaGVuIFN0dWRlbnRlbndvaG5oZWltXFxuLSBBbmdlYm90IHZvbiBmYWNoYmVnbGVpdGVuZGVuIERldXRzY2hrdXJzZW4gZsO8ciBhdXNsw6RuZGlzY2hlIFN0dWRlbnRlbiB2b3IgU2VtZXN0ZXJiZWdpbm5cXG4tIE9yaWVudGllcnVuZ3NhbmdlYm90ZSAoQnVkZHktUHJvZ3JhbW0sIEVpbmbDvGhydW5nc3ZlcmFuc3RhbHR1bmdlbiknLFxuICAgIHR5cGU6ICdJbmZvcm1hdGlvbidcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC0zMycsXG4gICAgdGl0bGU6ICdCZXdlcmJ1bmc6IFdlcmtzdHVkZW50IGltIElULVN1cHBvcnQnLFxuICAgIHNpdHVhdGlvbjogJ0RhcyBTb2Z0d2FyZS1VbnRlcm5laG1lbiBcIk5ldFNvbHV0aW9uc1wiIGluIFN0dXR0Z2FydCBzdWNodCBlaW5lbiBXZXJrc3R1ZGVudGVuIChtL3cvZCkgZsO8ciBkZW4gaGF1c2ludGVybmVuIElULVN1cHBvcnQgdW5kIGRpZSBQZmxlZ2UgZGVyIE5ldHp3ZXJrc2ljaGVyaGVpdCAoMTYtMjAgU3RkLi9Xb2NoZSkuJyxcbiAgICBjb250ZW50OiAnU2NocmVpYmVuIFNpZSBlaW4gYXVzc2FnZWtyw6RmdGlnZXMgQmV3ZXJidW5nc3NjaHJlaWJlbi4gR2VoZW4gU2llIGF1ZiBmb2xnZW5kZSBQdW5rdGUgZWluOlxcbi0gQmV6dWduYWhtZSBhdWYgZGFzIFN0ZWxsZW5hbmdlYm90IHVuZCBHcnVuZCBJaHJlciBCZXdlcmJ1bmdcXG4tIElociBTdHVkaWVuZ2FuZyAoSW5mb3JtYXRpaywgV2lydHNjaGFmdHNpbmZvcm1hdGlrIG8uw4QuKSB1bmQgYWt0dWVsbGVzIFNlbWVzdGVyXFxuLSBQcmFrdGlzY2hlIEtlbm50bmlzc2UgaW4gQmV0cmllYnNzeXN0ZW1lbiwgTmV0endlcmtlbiwgSGFyZHdhcmUtRmVobGVyYW5hbHlzZVxcbi0gSWhyZSBBcmJlaXRzd2Vpc2UgKHNlbGJzdHN0w6RuZGlnLCB6aWVsc3RyZWJpZywgdGVhbW9yaWVudGllcnQpXFxuLSBJaHJlIHplaXRsaWNoZSBWZXJmw7xnYmFya2VpdCB1bnRlciBkZXIgV29jaGUgKEFic3RpbW11bmcgbWl0IFZvcmxlc3VuZ3N6ZWl0ZW4pJyxcbiAgICB0eXBlOiAnQmV3ZXJidW5nJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdkZWZhdWx0LTM0JyxcbiAgICB0aXRsZTogJ0Jlc2Nod2VyZGU6IEVybGVibmlzLUd1dHNjaGVpbiBcIkJhbGxvbmZhaHJ0XCInLFxuICAgIHNpdHVhdGlvbjogJ1NpZSBiZWthbWVuIHZvbiBGcmV1bmRlbiBlaW5lbiBFcmxlYm5pcy1HdXRzY2hlaW4gZsO8ciBlaW5lIFwiRXhrbHVzaXZlIEJhbGxvbmZhaHJ0IGJlaSBTb25uZW5hdWZnYW5nIMO8YmVyIGRlbSBCb2RlbnNlZSBtaXQgQ2hhbXBhZ25lci1QaWNrbmlja1wiIHZvbiBkZXIgQWdlbnR1ciBcIlNreUFkdmVudHVyZXNcIi4gRGVyIFRlcm1pbiB3dXJkZSB2aWVybWFsIHdlZ2VuIEtsZWluaWdrZWl0ZW4gYWJnZXNhZ3QuIEFscyBkaWUgRmFocnQgc3RhdHRmYW5kLCB3YXIgZXMgbWl0dGFncywgZXMgZ2luZyDDvGJlciBlaW4gdW5zY2jDtm5lcyBJbmR1c3RyaWVnZWJpZXQsIGVzIGdhYiAxMiBzdGF0dCAyIE1pdGZsaWVnZXIgdW5kIHN0YXR0IENoYW1wYWduZXIgZ2FiIGVzIEFwZmVsc2Nob3JsZS4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIGVpbmUgQmVzY2h3ZXJkZSBhbiBkaWUgWmVudHJhbGUgdm9uIFwiU2t5QWR2ZW50dXJlc1wiLiBCZWhhbmRlbG4gU2llIGZvbGdlbmRlIFB1bmt0ZTpcXG4tIEdydW5kIGRlcyBTY2hyZWliZW5zIHVuZCBHdXRzY2hlaW4tTnVtbWVyXFxuLSDDhHJnZXIgw7xiZXIgZGllIGV4dHJlbSBrb21wbGl6aWVydGUgdW5kIHVua29vcGVyYXRpdmUgVGVybWluZmluZHVuZ1xcbi0gQWJ3ZWljaHVuZyBkZXIgUmVhbGl0w6R0IHZvbSBHdXRzY2hlaW50ZXh0IChUYWdlc3plaXQsIFJvdXRlLCBUZWlsbmVobWVyemFobClcXG4tIEVudHTDpHVzY2h1bmcgw7xiZXIgZGFzIGxpZWJsb3NlIFBpY2tuaWNrIG9obmUgdmVyc3Byb2NoZW5lbiBDaGFtcGFnbmVyXFxuLSBGb3JkZXJ1bmcgYXVmIHRlaWx3ZWlzZSBSw7xja2Vyc3RhdHR1bmcgZGVzIEd1dHNjaGVpbndlcnRlcyBpbiBiYXInLFxuICAgIHR5cGU6ICdCZXNjaHdlcmRlJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdkZWZhdWx0LTM1JyxcbiAgICB0aXRsZTogJ0JpdHRlIHVtIEluZm9zOiBGcmFuY2hpc2UtS29uemVwdCBFcsO2ZmZudW5nJyxcbiAgICBzaXR1YXRpb246ICdTaWUgcGxhbmVuIGRpZSBFcsO2ZmZudW5nIGVpbmVzIGVpZ2VuZW4sIGdlc3VuZGVuIEJpc3Ryb3MgdW5kIGludGVyZXNzaWVyZW4gc2ljaCBzZWhyIGbDvHIgZGFzIGVyZm9sZ3JlaWNoZSB2ZWdhbmUgRnJhbmNoaXNlLUtvbnplcHQgdm9uIFwiQmlvU2FsYWQgT3JnYW5pY3NcIi4gU2llIHZlcmbDvGdlbiDDvGJlciBldHdhcyBTdGFydGthcGl0YWwgdW5kIGdhc3Ryb25vbWlzY2hlIEVyZmFocnVuZy4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIGVpbmUgRS1NYWlsIGFuIGRpZSBGcmFuY2hpc2UtWmVudHJhbGUgZGVyIFwiQmlvU2FsYWQgT3JnYW5pY3MgR21iSFwiLiBLbMOkcmVuIFNpZSBmb2xnZW5kZSBQdW5rdGU6XFxuLSBWb3JhdXNzZXR6dW5nZW4gKEVpZ2Vua2FwaXRhbCwgYmVydWZsaWNoZSBRdWFsaWZpa2F0aW9uZW4sIFN0YW5kb3J0YmVkaW5ndW5nZW4pXFxuLSBTdHJ1a3R1ciBkZXIgRnJhbmNoaXNlLUdlYsO8aHJlbiAoRWluc3RpZWdzZ2Viw7xociwgbW9uYXRsaWNoZSBVbXNhdHpiZXRlaWxpZ3VuZylcXG4tIFVudGVyc3TDvHR6dW5nIGJlaW0gTWFya2V0aW5nLCBMYWRlbmRlc2lnbiwgZGVyIExpZWZlcmtldHRlIHVuZCBNaXRhcmJlaXRlcnNjaHVsdW5nXFxuLSBadXNlbmR1bmcgdm9uIGF1c2bDvGhybGljaGVtIEluZm9ybWF0aW9uc21hdGVyaWFsIHVuZCBBYmxhdWYgZWluZXIgQmV3ZXJidW5nIGFscyBQYXJ0bmVyJyxcbiAgICB0eXBlOiAnSW5mb3JtYXRpb24nXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtMzYnLFxuICAgIHRpdGxlOiAnQmV3ZXJidW5nOiBTdGFkdGbDvGhyZXIgaW4gQmVybGluJyxcbiAgICBzaXR1YXRpb246ICdEaWUgVG91cmlzbXVzLUFnZW50dXIgXCJCZXJsaW5FeHBsb3JlclwiIHN1Y2h0IGbDvHIgU3RhZHRydW5kZ8OkbmdlIHNvd2llIGdlZsO8aHJ0ZSBGYWhycmFkdG91cmVuIGR1cmNoIEJlcmxpbi1NaXR0ZSB1bmQgS3JldXpiZXJnIGVudGh1c2lhc3Rpc2NoZSwgb2ZmZW5lIHVuZCBvcnRza3VuZGlnZSBTdGFkdGbDvGhyZXIgKG0vdy9kKSBmw7xyIGRpZSBXb2NoZW5lbmRlbi4nLFxuICAgIGNvbnRlbnQ6ICdTY2hyZWliZW4gU2llIElocmUgQmV3ZXJidW5nIGFscyBTdGFkdGbDvGhyZXIgYW4gZGVuIFBlcnNvbmFsdmVyYW50d29ydGxpY2hlbi4gQmVoYW5kZWxuIFNpZSBmb2xnZW5kZSBQdW5rdGU6XFxuLSBXYXJ1bSBTaWUgU3RhZHRmw7xocmVyIGluIEJlcmxpbiB3ZXJkZW4gbcO2Y2h0ZW4gdW5kIElocmUgVmVyYmluZHVuZyB6dXIgU3RhZHRcXG4tIElocmUgT3J0c2tlbm50bmlzc2UgaW4gQmVybGluIChHZXNjaGljaHRlLCBLdWx0dXIsIEdlaGVpbXRpcHBzKVxcbi0gSWhyZSBGcmVtZHNwcmFjaGVua2VubnRuaXNzZSAoRGV1dHNjaCB2ZXJoYW5kbHVuZ3NzaWNoZXIsIHdlaXRlcmUgU3ByYWNoZW4gdm9uIFZvcnRlaWwpXFxuLSBFcmZhaHJ1bmdlbiBpbSBWb3J0cmFnZW4gdm9yIGdyw7bDn2VyZW4gR3J1cHBlbiAoUHLDpHNlbnRhdGlvbmVuLCBvZmZlbmUgQXJ0KVxcbi0gSWhyZSB6ZWl0bGljaGUgVmVyZsO8Z2JhcmtlaXQgYW0gV29jaGVuZW5kZSB1bmQgc3BvcnRsaWNoZSBGaXRuZXNzIChGYWhycmFkdG91cmVuKScsXG4gICAgdHlwZTogJ0Jld2VyYnVuZydcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVmYXVsdC0zNycsXG4gICAgdGl0bGU6ICdCZXNjaHdlcmRlOiBPbmxpbmUtRm90b2J1Y2ggRHJ1Y2tmZWhsZXInLFxuICAgIHNpdHVhdGlvbjogJ1NpZSBoYWJlbiDDvGJlciBkYXMgUG9ydGFsIFwiUGl4UHJpbnRcIiBlaW4gaG9jaHdlcnRpZ2VzLCB0ZXVyZXMgSGFyZGNvdmVyLUZvdG9idWNoIG1pdCAxMDAgU2VpdGVuIGFscyBHZXNjaGVuayBmw7xyIGRpZSBHb2xkZW5lIEhvY2h6ZWl0IElocmVyIEdyb8OfZWx0ZXJuIGJlc3RlbGx0LiBCZWkgZGVyIExpZWZlcnVuZyBzdGVsbHRlbiBTaWUgZmVzdDogRGVyIEJ1Y2hlaW5iYW5kIGlzdCBzY2hpZWYgYXVmZ2VrbGVidCwgZGllIEZhcmJlbiBzaW5kIGV4dHJlbSBkdW5rZWwgdW5kIHZlcndhc2NoZW4sIHVuZCBhdWYgNSBTZWl0ZW4gZmVobHQgZGVyIGdlZHJ1Y2t0ZSBUZXh0IGtvbXBsZXR0LCBvYndvaGwgZXIgaW0gVm9yc2NoYXUtRWRpdG9yIGtvcnJla3QgYW5nZXplaWd0IHd1cmRlLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgZWluZSBCZXNjaHdlcmRlIGFuIGRpZSBSZWtsYW1hdGlvbnNhYnRlaWx1bmcgdm9uIFwiUGl4UHJpbnRcIi4gQmVoYW5kZWxuIFNpZSBmb2xnZW5kZSBQdW5rdGU6XFxuLSBHcnVuZCBkZXMgU2NocmVpYmVucywgS3VuZGVubnVtbWVyIHVuZCBCZXN0ZWxsLUlEXFxuLSBCZXNjaHJlaWJ1bmcgZGVyIGdyYXZpZXJlbmRlbiBGZWhsZHJ1Y2tlIHVuZCBRdWFsaXTDpHRzbcOkbmdlbCAoRmFyYmUsIEVpbmJhbmQpXFxuLSBOaWNodC1BYmRydWNrIGRlciBUZXh0ZSBhbHMgc2Nod2VyZXIgTWFuZ2VsXFxuLSBWZXJsdXN0IGRlcyBnZXBsYW50ZW4gR2VzY2hlbmtzIHVuZCB6ZWl0bGljaGVyIERydWNrIHdlZ2VuIGRlcyBIb2NoemVpdHN0YWdzXFxuLSBGb3JkZXJ1bmcgYXVmIGtvc3Rlbmxvc2VuIE5ldWRydWNrIGlubmVyaGFsYiB2b24gNSBUYWdlbiBvZGVyIEVyc3RhdHR1bmcgZGVyIEtvc3RlbiBtaXQgRW50c2Now6RkaWd1bmcnLFxuICAgIHR5cGU6ICdCZXNjaHdlcmRlJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdkZWZhdWx0LTM4JyxcbiAgICB0aXRsZTogJ0JpdHRlIHVtIEluZm9zOiBNaXRnbGllZHNjaGFmdCBpbSBUZW5uaXNjbHViJyxcbiAgICBzaXR1YXRpb246ICdTaWUgc2luZCB2b3IgS3VyemVtIGluIGVpbmUgbmV1ZSBTdGFkdCBnZXpvZ2VuIHVuZCBtw7ZjaHRlbiBlaW5lbSBsb2thbGVuIFRlbm5pc2NsdWIgYmVpdHJldGVuLCB1bSBha3RpdiBTcG9ydCB6dSB0cmVpYmVuIHVuZCBLb250YWt0ZSB6dSBrbsO8cGZlbi4gU2llIHNpbmQgYW0gXCJUZW5uaXMtQ2x1YiBSb3QtV2Vpw59cIiBpbnRlcmVzc2llcnQuJyxcbiAgICBjb250ZW50OiAnU2NocmVpYmVuIFNpZSBlaW5lIEUtTWFpbCBhbiBkZW4gVm9yc3RhbmQgZGVzIFRlbm5pcy1DbHVicy4gRXJrdW5kaWdlbiBTaWUgc2ljaCBuYWNoOlxcbi0gQXVmbmFobWVnZWLDvGhyIHVuZCBtb25hdGxpY2hlbS9qw6RocmxpY2hlbSBNaXRnbGllZHNiZWl0cmFnIChFcm3DpMOfaWd1bmcgZsO8ciBTdHVkZW50ZW4vRmFtaWxpZW4pXFxuLSBBdXNzdGF0dHVuZyBkZXMgQ2x1YnMgKEFuemFobCBkZXIgQXXDn2VuLSB1bmQgSGFsbGVucGzDpHR6ZSwgQnVjaHVuZ3NzeXN0ZW0gZsO8ciBTcGllbGZlbGRlcilcXG4tIFRyYWluaW5nc23DtmdsaWNoa2VpdGVuIGbDvHIgRXJ3YWNoc2VuZSAoR3J1cHBlbnRyYWluaW5nIG1pdCBwcm9mZXNzaW9uZWxsZW0gVHJhaW5lciwgU3BpZWxzdMOkcmtlbmVpbnN0dWZ1bmcpXFxuLSBDbHVibGViZW4sIFR1cm5pZXJlbiBmw7xyIEZyZWl6ZWl0c3BvcnRsZXIgdW5kIEtlbm5lbmxlcm4tVHJlZmZzIGbDvHIgbmV1ZSBNaXRnbGllZGVyJyxcbiAgICB0eXBlOiAnSW5mb3JtYXRpb24nXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RlZmF1bHQtMzknLFxuICAgIHRpdGxlOiAnQmV3ZXJidW5nOiBSZXplcHRpb25pc3QgaW4gSnVnZW5kaGVyYmVyZ2UnLFxuICAgIHNpdHVhdGlvbjogJ0RpZSBKdWdlbmRoZXJiZXJnZSBcIkNpdHlIb3N0ZWwgRHJlc2RlblwiIHN1Y2h0IGFiIGRlciBrb21tZW5kZW4gRnLDvGhqYWhyc3NhaXNvbiBlaW5lbiBSZXplcHRpb25pc3RlbiAobS93L2QpIGluIFRlaWx6ZWl0ICgyMCBTdHVuZGVuL1dva2UpIHp1ciBCZXRyZXV1bmcgaW50ZXJuYXRpb25hbGVyIEJhY2twYWNrZXIsIENoZWNrLWluL0NoZWNrLW91dCB1bmQgT3JnYW5pc2F0aW9uIGtsZWluZXIgRXZlbnRzLicsXG4gICAgY29udGVudDogJ1NjaHJlaWJlbiBTaWUgSWhyZSBCZXdlcmJ1bmcgZsO8ciBkYXMgQ2l0eUhvc3RlbC4gQmVoYW5kZWxuIFNpZSBmb2xnZW5kZSBQdW5rdGU6XFxuLSBJaHJlIE1vdGl2YXRpb24sIGluIGVpbmVtIGxlYmhhZnRlbiwgaW50ZXJuYXRpb25hbGVuIEhvc3RlbCB6dSBhcmJlaXRlblxcbi0gRXJzdGUgRXJmYWhydW5nZW4gaW0gQmVoZXJiZXJndW5nc2dld2VyYmUgb2RlciBpbSBlbmdlbiBLdW5kZW5rb250YWt0XFxuLSBBdXNnZXByw6RndGUgU3ByYWNoa2VubnRuaXNzZSAoRGV1dHNjaCB2ZXJoYW5kbHVuZ3NzaWNoZXIsIEVuZ2xpc2NoIGZsaWXDn2VuZCwgd2VpdGVyZSBTcHJhY2hlbilcXG4tIElocmUgQ29tcHV0ZXJrZW5udG5pc3NlIChFLU1haWwsIEJ1Y2h1bmdzc29mdHdhcmUsIFNvY2lhbCBNZWRpYSlcXG4tIEZsZXhpYmlsaXTDpHQgYmVpIFNjaGljaHRhcmJlaXQgKEZyw7xoLSwgU3DDpHQtIHVuZCBnZWxlZ2VudGxpY2hlIFdvY2hlbmVuZHNjaGljaHRlbiknLFxuICAgIHR5cGU6ICdCZXdlcmJ1bmcnXG4gIH1cbl07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCgpIHtcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gdXNlU3RhdGU8VXNlciB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbdXNlclByb2ZpbGUsIHNldFVzZXJQcm9maWxlXSA9IHVzZVN0YXRlPGFueT4obnVsbCk7XG4gIGNvbnN0IFt0ZWFjaGVycywgc2V0VGVhY2hlcnNdID0gdXNlU3RhdGU8YW55W10+KFtdKTtcbiAgY29uc3QgW2V4ZXJjaXNlcywgc2V0RXhlcmNpc2VzXSA9IHVzZVN0YXRlPEV4ZXJjaXNlW10+KCgpID0+IHtcbiAgICBjb25zdCBzYXZlZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkaWFfZXhlcmNpc2VzJyk7XG4gICAgaWYgKHNhdmVkKSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHNhdmVkKTtcbiAgICAgIGlmIChwYXJzZWQubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjb21iaW5lZCA9IFsuLi5wYXJzZWRdO1xuICAgICAgICBERUZBVUxUX0VYRVJDSVNFUy5mb3JFYWNoKGRlZiA9PiB7XG4gICAgICAgICAgaWYgKCFjb21iaW5lZC5zb21lKGMgPT4gYy5pZCA9PT0gZGVmLmlkKSkge1xuICAgICAgICAgICAgY29tYmluZWQucHVzaChkZWYpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb21iaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIERFRkFVTFRfRVhFUkNJU0VTO1xuICB9KTtcbiAgY29uc3QgW3Byb2dyZXNzLCBzZXRQcm9ncmVzc10gPSB1c2VTdGF0ZTxSZWNvcmQ8c3RyaW5nLCBTYXZlZFByb2dyZXNzPj4oKCkgPT4ge1xuICAgIGNvbnN0IHNhdmVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2RpYV9wcm9ncmVzcycpO1xuICAgIHJldHVybiBzYXZlZCA/IEpTT04ucGFyc2Uoc2F2ZWQpIDoge307XG4gIH0pO1xuICBcbiAgY29uc3QgW2lzVGltZXJSdW5uaW5nLCBzZXRJc1RpbWVyUnVubmluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtpc1NpZGViYXJPcGVuLCBzZXRJc1NpZGViYXJPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICAvLyBFbWFpbCBsb2dpbi9zaWdudXAgc3RhdGVzXG4gIGNvbnN0IFtlbWFpbCwgc2V0RW1haWxdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbcGFzc3dvcmQsIHNldFBhc3N3b3JkXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2Z1bGxOYW1lLCBzZXRGdWxsTmFtZV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtlbWFpbFJvbGUsIHNldEVtYWlsUm9sZV0gPSB1c2VTdGF0ZTwnc3R1ZGVudCcgfCAndGVhY2hlcic+KCdzdHVkZW50Jyk7XG4gIGNvbnN0IFtzaG93RW1haWxGb3JtLCBzZXRTaG93RW1haWxGb3JtXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzU2lnblVwLCBzZXRJc1NpZ25VcF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFthdXRoTG9hZGluZywgc2V0QXV0aExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbdGVhY2hlckNvZGUsIHNldFRlYWNoZXJDb2RlXSA9IHVzZVN0YXRlKCcnKTtcblxuICBjb25zdCBoYW5kbGVFbWFpbEF1dGggPSBhc3luYyAoZTogUmVhY3QuRm9ybUV2ZW50KSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICghZW1haWwgfHwgIXBhc3N3b3JkKSB7XG4gICAgICBhbGVydChcIlZldWlsbGV6IHJlbXBsaXIgdG91cyBsZXMgY2hhbXBzIG9ibGlnYXRvaXJlcy5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc1NpZ25VcCAmJiAhZnVsbE5hbWUpIHtcbiAgICAgIGFsZXJ0KFwiVmV1aWxsZXogc2Fpc2lyIHZvdHJlIG5vbSBjb21wbGV0LlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlzU2lnblVwICYmIGVtYWlsUm9sZSA9PT0gJ3RlYWNoZXInICYmIHRlYWNoZXJDb2RlLnRyaW0oKS50b1VwcGVyQ2FzZSgpICE9PSAnQjJQUk9GJykge1xuICAgICAgYWxlcnQoXCJMZSBjb2RlIGQnYWNjw6hzIGVuc2VpZ25hbnQgZXN0IGluY29ycmVjdC4gVmV1aWxsZXogdXRpbGlzZXIgbGUgYm9uIGNvZGUgcG91ciBjcsOpZXIgdW4gY29tcHRlIFByb2YgKEV4OiBCMlBST0YpLlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZXRBdXRoTG9hZGluZyh0cnVlKTtcbiAgICB0cnkge1xuICAgICAgaWYgKGlzU2lnblVwKSB7XG4gICAgICAgIGF3YWl0IHNpZ25VcFdpdGhFbWFpbChlbWFpbCwgcGFzc3dvcmQsIGZ1bGxOYW1lLCBlbWFpbFJvbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgbG9naW5XaXRoRW1haWwoZW1haWwsIHBhc3N3b3JkKTtcbiAgICAgIH1cbiAgICAgIC8vIFJlc2V0IGZvcm0gb24gc3VjY2Vzc1xuICAgICAgc2V0RW1haWwoJycpO1xuICAgICAgc2V0UGFzc3dvcmQoJycpO1xuICAgICAgc2V0RnVsbE5hbWUoJycpO1xuICAgICAgc2V0VGVhY2hlckNvZGUoJycpO1xuICAgICAgc2V0U2hvd0VtYWlsRm9ybShmYWxzZSk7XG4gICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0QXV0aExvYWRpbmcoZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICAvLyBTeW5jIEF1dGggJiBQcm9maWxlXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IHVuc3Vic2NyaWJlUHJvZmlsZTogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdCB1bnN1YnNjcmliZUF1dGggPSBvbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aCwgKHUpID0+IHtcbiAgICAgIHNldFVzZXIodSk7XG4gICAgICBcbiAgICAgIC8vIENsZWFudXAgcHJldmlvdXMgcHJvZmlsZSBsaXN0ZW5lclxuICAgICAgaWYgKHVuc3Vic2NyaWJlUHJvZmlsZSkge1xuICAgICAgICB1bnN1YnNjcmliZVByb2ZpbGUoKTtcbiAgICAgICAgdW5zdWJzY3JpYmVQcm9maWxlID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHUpIHtcbiAgICAgICAgY29uc3QgcHJvZmlsZVJlZiA9IGRvYyhkYiwgJ3VzZXJzJywgdS51aWQpO1xuICAgICAgICB1bnN1YnNjcmliZVByb2ZpbGUgPSBvblNuYXBzaG90KHByb2ZpbGVSZWYsIChzbmFwKSA9PiB7XG4gICAgICAgICAgaWYgKHNuYXAuZXhpc3RzKCkpIHtcbiAgICAgICAgICAgIHNldFVzZXJQcm9maWxlKHNuYXAuZGF0YSgpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBwcm9maWxlIGZvdW5kIGluIEZpcmVzdG9yZSBmb3IgdWlkOlwiLCB1LnVpZCwgXCIuIFVzaW5nIGxvY2FsIGF1dGggZGF0YSBhcyBmYWxsYmFjay4uLlwiKTtcbiAgICAgICAgICAgIGNvbnN0IGZhbGxiYWNrUHJvZmlsZSA9IHtcbiAgICAgICAgICAgICAgdWlkOiB1LnVpZCxcbiAgICAgICAgICAgICAgZW1haWw6IHUuZW1haWwgfHwgJycsXG4gICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiB1LmRpc3BsYXlOYW1lIHx8IHUuZW1haWw/LnNwbGl0KCdAJylbMF0gfHwgJ1V0aWxpc2F0ZXVyJyxcbiAgICAgICAgICAgICAgcGhvdG9VUkw6IHUucGhvdG9VUkwgfHwgbnVsbCxcbiAgICAgICAgICAgICAgcm9sZTogJ3N0dWRlbnQnIGFzIGNvbnN0LFxuICAgICAgICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzZXRVc2VyUHJvZmlsZShmYWxsYmFja1Byb2ZpbGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJQcm9maWxlIHN5bmMgZXJyb3I6XCIsIGVycik7XG4gICAgICAgICAgaGFuZGxlRmlyZXN0b3JlRXJyb3IoZXJyLCBPcGVyYXRpb25UeXBlLkdFVCwgYHVzZXJzLyR7dS51aWR9YCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VXNlclByb2ZpbGUobnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdW5zdWJzY3JpYmVBdXRoKCk7XG4gICAgICBpZiAodW5zdWJzY3JpYmVQcm9maWxlKSB1bnN1YnNjcmliZVByb2ZpbGUoKTtcbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgLy8gRmV0Y2ggVGVhY2hlcnNcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXVzZXIpIHJldHVybjtcbiAgICBjb25zdCBxID0gcXVlcnkoY29sbGVjdGlvbihkYiwgJ3VzZXJzJyksIHdoZXJlKCdyb2xlJywgJz09JywgJ3RlYWNoZXInKSk7XG4gICAgY29uc3QgdW5zdWJzY3JpYmUgPSBvblNuYXBzaG90KHEsIChzbmFwc2hvdCkgPT4ge1xuICAgICAgY29uc3QgbGlzdDogYW55W10gPSBbXTtcbiAgICAgIHNuYXBzaG90LmZvckVhY2goZG9jID0+IGxpc3QucHVzaChkb2MuZGF0YSgpKSk7XG4gICAgICBzZXRUZWFjaGVycyhsaXN0KTtcbiAgICB9KTtcbiAgICByZXR1cm4gKCkgPT4gdW5zdWJzY3JpYmUoKTtcbiAgfSwgW3VzZXJdKTtcblxuICAvLyBTeW5jIGV4ZXJjaXNlcyBmcm9tIGdsb2JhbCBjb2xsZWN0aW9uXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcSA9IHF1ZXJ5KGNvbGxlY3Rpb24oZGIsICdleGVyY2lzZXMnKSwgb3JkZXJCeSgnY3JlYXRlZEF0JywgJ2Rlc2MnKSk7XG4gICAgY29uc3QgdW5zdWJzY3JpYmUgPSBvblNuYXBzaG90KHEsIChzbmFwc2hvdCkgPT4ge1xuICAgICAgY29uc3QgY2xvdWRFeGVyY2lzZXM6IEV4ZXJjaXNlW10gPSBbXTtcbiAgICAgIHNuYXBzaG90LmZvckVhY2goKGRvYykgPT4ge1xuICAgICAgICBjbG91ZEV4ZXJjaXNlcy5wdXNoKGRvYy5kYXRhKCkgYXMgRXhlcmNpc2UpO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHNldEV4ZXJjaXNlcyhwcmV2ID0+IHtcbiAgICAgICAgY29uc3QgY29tYmluZWQgPSBbLi4uY2xvdWRFeGVyY2lzZXNdO1xuICAgICAgICBcbiAgICAgICAgLy8gRW5zdXJlIGRlZmF1bHRzIGFyZSBwcmVzZW50XG4gICAgICAgIERFRkFVTFRfRVhFUkNJU0VTLmZvckVhY2goZGVmID0+IHtcbiAgICAgICAgICBpZiAoIWNvbWJpbmVkLmZpbmQoYyA9PiBjLmlkID09PSBkZWYuaWQpKSB7XG4gICAgICAgICAgICBjb21iaW5lZC5wdXNoKGRlZik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBLZWVwIGxvY2FsIG1hbnVhbCB1cGxvYWRzIHRoYXQgaGF2ZW4ndCBoaXQgdGhlIGNsb3VkIHlldFxuICAgICAgICBwcmV2LmZvckVhY2goZXggPT4ge1xuICAgICAgICAgIGlmICghY29tYmluZWQuZmluZChjID0+IGMuaWQgPT09IGV4LmlkKSkge1xuICAgICAgICAgICAgY29tYmluZWQucHVzaChleCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY29tYmluZWQ7XG4gICAgICB9KTtcbiAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgIGhhbmRsZUZpcmVzdG9yZUVycm9yKGVycm9yLCBPcGVyYXRpb25UeXBlLkxJU1QsICdleGVyY2lzZXMnKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB1bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgLy8gU3luYyBwcm9ncmVzcyBmcm9tIEZpcmVzdG9yZSAocmVzdG9yZSBvbmx5IGZpbmlzaGVkL2V2YWx1YXRlZCBleGVyY2lzZXMpXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCF1c2VyKSByZXR1cm47XG5cbiAgICBjb25zdCB1bnN1YnNjcmliZSA9IG9uU25hcHNob3QoY29sbGVjdGlvbihkYiwgJ3VzZXJzJywgdXNlci51aWQsICdwcm9ncmVzcycpLCAoc25hcHNob3QpID0+IHtcbiAgICAgIGNvbnN0IGNsb3VkUHJvZ3Jlc3M6IFJlY29yZDxzdHJpbmcsIFNhdmVkUHJvZ3Jlc3M+ID0ge307XG4gICAgICBzbmFwc2hvdC5mb3JFYWNoKChkb2MpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGRvYy5kYXRhKCk7XG4gICAgICAgIC8vIE9ubHkgbG9hZCBpZiBldmFsdWF0aW9uIGV4aXN0cyAodW5jb21wbGV0ZWQgZHJhZnRzIG11c3Qgbm90IGJlIGxvYWRlZC9yZXN0b3JlZClcbiAgICAgICAgaWYgKGRhdGEuZXZhbHVhdGlvbikge1xuICAgICAgICAgIGNsb3VkUHJvZ3Jlc3NbZG9jLmlkXSA9IHtcbiAgICAgICAgICAgIHRleHQ6IGRhdGEudGV4dCxcbiAgICAgICAgICAgIGV2YWx1YXRpb246IGRhdGEuZXZhbHVhdGlvblxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBzZXRQcm9ncmVzcyhwcmV2ID0+IHtcbiAgICAgICAgLy8gQnVpbGQgYSBzdGF0ZSB3aGVyZSB3ZSBvdmVyd3JpdGUvcG9wdWxhdGUgd2l0aCBjbG91ZCBjb21wbGV0ZWQgZXZhbHVhdGlvbnMgXG4gICAgICAgIGNvbnN0IHVwZGF0ZWQgPSB7IC4uLnByZXYgfTtcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY2xvdWRQcm9ncmVzcykuZm9yRWFjaCgoW2lkLCB2YWxdKSA9PiB7XG4gICAgICAgICAgdXBkYXRlZFtpZF0gPSB2YWw7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdXBkYXRlZDtcbiAgICAgIH0pO1xuICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgaGFuZGxlRmlyZXN0b3JlRXJyb3IoZXJyb3IsIE9wZXJhdGlvblR5cGUuTElTVCwgYHVzZXJzLyR7dXNlci51aWR9L3Byb2dyZXNzYCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4gdW5zdWJzY3JpYmUoKTtcbiAgfSwgW3VzZXJdKTtcblxuICBjb25zdCBbc2VsZWN0ZWRJZCwgc2V0U2VsZWN0ZWRJZF0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW3NlYXJjaFRlcm0sIHNldFNlYXJjaFRlcm1dID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG5cbiAgY29uc3Qgc2VsZWN0RXhlcmNpc2UgPSBhc3luYyAoaWQ6IHN0cmluZyB8IG51bGwsIGZvcmNlVXBsb2FkVmlldyA9IGZhbHNlKSA9PiB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgZXhlcmNpc2UgaGFzIHdyaXR0ZW4gdGV4dCB3aXRob3V0IGV2YWx1YXRpb24gKHZvbGF0aWxlIGRyYWZ0KVxuICAgIGNvbnN0IGFjdGl2ZVByb2dyZXNzID0gc2VsZWN0ZWRJZCA/IHByb2dyZXNzW3NlbGVjdGVkSWRdIDogbnVsbDtcbiAgICBjb25zdCBoYXNVbnNhdmVkRHJhZnQgPSBhY3RpdmVQcm9ncmVzcyAmJiAhYWN0aXZlUHJvZ3Jlc3MuZXZhbHVhdGlvbiAmJiAoKGFjdGl2ZVByb2dyZXNzLnRleHQgJiYgYWN0aXZlUHJvZ3Jlc3MudGV4dC50cmltKCkubGVuZ3RoID4gMCkgfHwgaXNUaW1lclJ1bm5pbmcpO1xuXG4gICAgaWYgKGhhc1Vuc2F2ZWREcmFmdCkge1xuICAgICAgaWYgKCFjb25maXJtKFwiQXR0ZW50aW9uIDogVm90cmUgcsOpZGFjdGlvbiBlbiBjb3VycyBuJ2EgcGFzIMOpdMOpIMOpdmFsdcOpZSBldCBzZXJhIFBFUkRVRSBzaSB2b3VzIHF1aXR0ZXogb3UgY2hhbmdleiBkZSBzdWpldC4gVm91bGV6LXZvdXMgY29udGludWVyID9cIikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gSW1tZWRpYXRlbHkgY2xlYXIgdGhlIHZvbGF0aWxlIGRyYWZ0IGZyb20gc3RhdGVcbiAgICAgIHNldFByb2dyZXNzKHByZXYgPT4ge1xuICAgICAgICBjb25zdCB1cGRhdGVkID0geyAuLi5wcmV2IH07XG4gICAgICAgIGRlbGV0ZSB1cGRhdGVkW3NlbGVjdGVkSWQhXTtcbiAgICAgICAgcmV0dXJuIHVwZGF0ZWQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXRTZWxlY3RlZElkKGlkKTtcbiAgICBzZXRJc1VwbG9hZGluZyhmb3JjZVVwbG9hZFZpZXcpO1xuICAgIHNldElzU2lkZWJhck9wZW4oZmFsc2UpO1xuICAgIHNldElzVGltZXJSdW5uaW5nKGZhbHNlKTsgLy8gUmVzZXQgdGltZXIgYWN0aXZlIHN0YXRlIG9uIGV4ZXJjaXNlIHN3YXBcbiAgfTtcblxuICBjb25zdCBbaXNVcGxvYWRpbmcsIHNldElzVXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzRXh0cmFjdGluZywgc2V0SXNFeHRyYWN0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzRXZhbHVhdGluZywgc2V0SXNFdmFsdWF0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzT25saW5lLCBzZXRJc09ubGluZV0gPSB1c2VTdGF0ZShuYXZpZ2F0b3Iub25MaW5lKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGhhbmRsZUJlZm9yZVVubG9hZCA9IChlOiBCZWZvcmVVbmxvYWRFdmVudCkgPT4ge1xuICAgICAgY29uc3QgYWN0aXZlUHJvZ3Jlc3MgPSBzZWxlY3RlZElkID8gcHJvZ3Jlc3Nbc2VsZWN0ZWRJZF0gOiBudWxsO1xuICAgICAgY29uc3QgaGFzVW5zYXZlZERyYWZ0ID0gYWN0aXZlUHJvZ3Jlc3MgJiYgIWFjdGl2ZVByb2dyZXNzLmV2YWx1YXRpb24gJiYgKChhY3RpdmVQcm9ncmVzcy50ZXh0ICYmIGFjdGl2ZVByb2dyZXNzLnRleHQudHJpbSgpLmxlbmd0aCA+IDApIHx8IGlzVGltZXJSdW5uaW5nKTtcbiAgICAgIFxuICAgICAgaWYgKGhhc1Vuc2F2ZWREcmFmdCkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUucmV0dXJuVmFsdWUgPSBcIkF0dGVudGlvbiA6IFZvdHJlIHLDqWRhY3Rpb24gZW4gY291cnMgbidhIHBhcyDDqXTDqSDDqXZhbHXDqWUgZXQgc2VyYSBwZXJkdWUgc2kgdm91cyBmZXJtZXogbCdhcHBsaWNhdGlvbi5cIjtcbiAgICAgICAgcmV0dXJuIGUucmV0dXJuVmFsdWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCBoYW5kbGVCZWZvcmVVbmxvYWQpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgaGFuZGxlQmVmb3JlVW5sb2FkKTtcbiAgICB9O1xuICB9LCBbc2VsZWN0ZWRJZCwgcHJvZ3Jlc3MsIGlzVGltZXJSdW5uaW5nXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBoYW5kbGVPbmxpbmUgPSAoKSA9PiBzZXRJc09ubGluZSh0cnVlKTtcbiAgICBjb25zdCBoYW5kbGVPZmZsaW5lID0gKCkgPT4gc2V0SXNPbmxpbmUoZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIGhhbmRsZU9ubGluZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCBoYW5kbGVPZmZsaW5lKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb25saW5lJywgaGFuZGxlT25saW5lKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgaGFuZGxlT2ZmbGluZSk7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2RpYV9leGVyY2lzZXMnLCBKU09OLnN0cmluZ2lmeShleGVyY2lzZXMpKTtcbiAgfSwgW2V4ZXJjaXNlc10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gT25seSBzYXZlIHByb2dyZXNzIHRvIGxvY2FsU3RvcmFnZSBpZiBpdCBoYXMgYW4gZXZhbHVhdGlvbiFcbiAgICBjb25zdCBjbGVhblByb2dyZXNzOiBSZWNvcmQ8c3RyaW5nLCBTYXZlZFByb2dyZXNzPiA9IHt9O1xuICAgIGZvciAoY29uc3QgW2lkLCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocHJvZ3Jlc3MpKSB7XG4gICAgICBpZiAodmFsdWUuZXZhbHVhdGlvbikge1xuICAgICAgICBjbGVhblByb2dyZXNzW2lkXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZGlhX3Byb2dyZXNzJywgSlNPTi5zdHJpbmdpZnkoY2xlYW5Qcm9ncmVzcykpO1xuICB9LCBbcHJvZ3Jlc3NdKTtcblxuICAvLyBTeW5jaHJvbmlzZSBsb2NhbCBjdXN0b20gZXhlcmNpc2VzIHRvIEZpcmVzdG9yZSB1cG9uIGxvZ2luXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCF1c2VyKSByZXR1cm47XG4gICAgXG4gICAgY29uc3Qgc3luY0xvY2FsRXhlcmNpc2VzID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgY3VzdG9tTG9jYWxFeGVyY2lzZXMgPSBleGVyY2lzZXMuZmlsdGVyKGV4ID0+ICFleC5pZC5zdGFydHNXaXRoKCdkZWZhdWx0LScpKTtcbiAgICAgIGZvciAoY29uc3QgZXggb2YgY3VzdG9tTG9jYWxFeGVyY2lzZXMpIHtcbiAgICAgICAgLy8gU2FuaXRpemUgZmlyc3QgdG8gcHJvdGVjdCBhZ2FpbnN0IElEL2tleXMgZmlyZXN0b3JlIHJ1bGVzXG4gICAgICAgIGNvbnN0IGNsZWFuSWQgPSBleC5pZC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJbXmEtekEtWjAtOV9cXFxcLV1cIiwgXCJnXCIpLCAnXycpLnN1YnN0cmluZygwLCAxMDApIHx8IGBleF8ke0RhdGUubm93KCl9YDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBleFJlZiA9IGRvYyhkYiwgJ2V4ZXJjaXNlcycsIGNsZWFuSWQpO1xuICAgICAgICAgIGF3YWl0IHNldERvYyhleFJlZiwge1xuICAgICAgICAgICAgaWQ6IGNsZWFuSWQsXG4gICAgICAgICAgICB0aXRsZTogZXgudGl0bGUgfHwgJ1N1amV0IHNhbnMgdGl0cmUnLFxuICAgICAgICAgICAgc2l0dWF0aW9uOiBleC5zaXR1YXRpb24gfHwgJycsXG4gICAgICAgICAgICBjb250ZW50OiBleC5jb250ZW50IHx8ICcnLFxuICAgICAgICAgICAgdHlwZTogZXgudHlwZSB8fCAnQmVzY2h3ZXJkZScsXG4gICAgICAgICAgICBjcmVhdGVkQXQ6IHNlcnZlclRpbWVzdGFtcCgpXG4gICAgICAgICAgfSwgeyBtZXJnZTogdHJ1ZSB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiU2lsZW50IHN5bmMgZXJyb3IgZm9yIGV4ZXJjaXNlOlwiLCBjbGVhbklkLCBlcnIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFJ1biBzeW5jIGFmdGVyIGEgYnJpZWYgZGVsYXkgdG8gYXZvaWQgcmFjZSBjb25kaXRpb25zXG4gICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHN5bmNMb2NhbEV4ZXJjaXNlcygpO1xuICAgIH0sIDI1MDApO1xuXG4gICAgcmV0dXJuICgpID0+IGNsZWFyVGltZW91dCh0aW1lcik7XG4gIH0sIFt1c2VyLCBleGVyY2lzZXNdKTtcblxuICBjb25zdCBoYW5kbGVVcGxvYWQgPSB1c2VDYWxsYmFjayhhc3luYyAoZmlsZURhdGE6IHN0cmluZywgbWltZVR5cGU6IHN0cmluZykgPT4ge1xuICAgIHNldElzRXh0cmFjdGluZyh0cnVlKTtcbiAgICB0cnkge1xuICAgICAgaWYgKCFwcm9jZXNzLmVudi5HRU1JTklfQVBJX0tFWSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMYSBjbMOpIEFQSSBHZW1pbmkgKEdFTUlOSV9BUElfS0VZKSBlc3QgbWFucXVhbnRlLlwiKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGV4dHJhY3RlZCA9IGF3YWl0IGV4dHJhY3RFeGVyY2lzZXMoZmlsZURhdGEsIG1pbWVUeXBlKTtcbiAgICAgIFxuICAgICAgLy8gRmlsdGVyIG91dCBkdXBsaWNhdGVzIHdpdGhpbiB0aGUgbmV3bHkgZXh0cmFjdGVkXG4gICAgICBjb25zdCB1bmlxdWVFeHRyYWN0ZWQgPSBleHRyYWN0ZWQuZmlsdGVyKChleCwgaW5kZXgsIHNlbGYpID0+IFxuICAgICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKHQpID0+IHQudGl0bGUgPT09IGV4LnRpdGxlICYmIHQuc2l0dWF0aW9uID09PSBleC5zaXR1YXRpb24pXG4gICAgICApO1xuXG4gICAgICAvLyBGaWx0ZXIgYWdhaW5zdCBleGlzdGluZyBleGVyY2lzZXMgdG8gcHJldmVudCBkdXBsaWNhdGVzXG4gICAgICBjb25zdCBuZXdFeGVyY2lzZXMgPSB1bmlxdWVFeHRyYWN0ZWQuZmlsdGVyKGV4ID0+IFxuICAgICAgICAhZXhlcmNpc2VzLnNvbWUocCA9PiBwLnRpdGxlID09PSBleC50aXRsZSAmJiBwLnNpdHVhdGlvbiA9PT0gZXguc2l0dWF0aW9uKVxuICAgICAgKTtcbiAgICAgIFxuICAgICAgY29uc3Qgc2FuaXRpemVkRXh0cmFjdGVkID0gbmV3RXhlcmNpc2VzLm1hcChleCA9PiB7XG4gICAgICAgIGNvbnN0IGNsZWFuSWQgPSBgZXhfJHtEYXRlLm5vdygpfV8ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCA5KX1gO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBjbGVhbklkLFxuICAgICAgICAgIHRpdGxlOiBleC50aXRsZSB8fCAnU3VqZXQgc2FucyB0aXRyZScsXG4gICAgICAgICAgc2l0dWF0aW9uOiBleC5zaXR1YXRpb24gfHwgJycsXG4gICAgICAgICAgY29udGVudDogZXguY29udGVudCB8fCAnJyxcbiAgICAgICAgICB0eXBlOiBleC50eXBlIHx8ICdCZXNjaHdlcmRlJ1xuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFNhdmUgdG8gZ2xvYmFsIGV4ZXJjaXNlcyBpZiBsb2dnZWQgaW5cbiAgICAgIGlmICh1c2VyICYmIHNhbml0aXplZEV4dHJhY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAoY29uc3QgZXggb2Ygc2FuaXRpemVkRXh0cmFjdGVkKSB7XG4gICAgICAgICAgY29uc3QgZXhSZWYgPSBkb2MoZGIsICdleGVyY2lzZXMnLCBleC5pZCk7XG4gICAgICAgICAgYXdhaXQgc2V0RG9jKGV4UmVmLCB7XG4gICAgICAgICAgICBpZDogZXguaWQsXG4gICAgICAgICAgICB0aXRsZTogZXgudGl0bGUsXG4gICAgICAgICAgICBzaXR1YXRpb246IGV4LnNpdHVhdGlvbixcbiAgICAgICAgICAgIGNvbnRlbnQ6IGV4LmNvbnRlbnQsXG4gICAgICAgICAgICB0eXBlOiBleC50eXBlLFxuICAgICAgICAgICAgY3JlYXRlZEF0OiBzZXJ2ZXJUaW1lc3RhbXAoKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzYW5pdGl6ZWRFeHRyYWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICBzZXRFeGVyY2lzZXMocHJldiA9PiBbLi4uc2FuaXRpemVkRXh0cmFjdGVkLCAuLi5wcmV2XSk7XG4gICAgICAgIHNldFNlbGVjdGVkSWQoc2FuaXRpemVkRXh0cmFjdGVkWzBdLmlkKTtcbiAgICAgIH0gZWxzZSBpZiAoZXh0cmFjdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gRmluZCBhbiBleGlzdGluZyBvbmUgdGhhdCBtYXRjaGVzIHdoYXQgd2FzIGV4dHJhY3RlZFxuICAgICAgICBjb25zdCBleGlzdGluZyA9IGV4ZXJjaXNlcy5maW5kKHAgPT4gcC50aXRsZSA9PT0gZXh0cmFjdGVkWzBdLnRpdGxlICYmIHAuc2l0dWF0aW9uID09PSBleHRyYWN0ZWRbMF0uc2l0dWF0aW9uKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgc2V0U2VsZWN0ZWRJZChleGlzdGluZy5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgYWxlcnQoXCJMZXMgc3VqZXRzIHRyb3V2w6lzIGRhbnMgY2UgZG9jdW1lbnQgZXhpc3RlbnQgZMOpasOgIGRhbnMgbCdhcHBsaWNhdGlvbi5cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydChcIkF1Y3VuIGV4ZXJjaWNlIG4nYSDDqXTDqSB0cm91dsOpIGRhbnMgY2UgZG9jdW1lbnQuXCIpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBzZXRJc1VwbG9hZGluZyhmYWxzZSk7XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICBhbGVydChgRXJyZXVyIGxvcnMgZGUgbCdleHRyYWN0aW9uOiAke2Vycm9yLm1lc3NhZ2UgfHwgXCJFcnJldXIgaW5jb25udWVcIn1gKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0SXNFeHRyYWN0aW5nKGZhbHNlKTtcbiAgICB9XG4gIH0sIFt1c2VyLCBleGVyY2lzZXNdKTtcblxuICBjb25zdCBoYW5kbGVUZXh0Q2hhbmdlID0gdXNlQ2FsbGJhY2soKGlkOiBzdHJpbmcsIHRleHQ6IHN0cmluZykgPT4ge1xuICAgIC8vIE9ubHkgdXBkYXRlIHN0YXRlIGluIHRlbXBvcmFyeS92b2xhdGlsZSBtZW1vcnkgZm9yIHR5cGluZyBmZWVkYmFja1xuICAgIHNldFByb2dyZXNzKHByZXYgPT4ge1xuICAgICAgaWYgKHByZXZbaWRdPy50ZXh0ID09PSB0ZXh0KSByZXR1cm4gcHJldjtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnByZXYsXG4gICAgICAgIFtpZF06IHsgLi4uKHByZXZbaWRdIHx8IHsgZXZhbHVhdGlvbjogbnVsbCB9KSwgdGV4dCB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgaGFuZGxlRXZhbHVhdGUgPSB1c2VDYWxsYmFjayhhc3luYyAoaWQ6IHN0cmluZywgdGV4dDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgZXhlcmNpc2UgPSBleGVyY2lzZXMuZmluZChlID0+IGUuaWQgPT09IGlkKTtcbiAgICBpZiAoIWV4ZXJjaXNlKSByZXR1cm47XG4gICAgXG4gICAgc2V0SXNFdmFsdWF0aW5nKHRydWUpO1xuICAgIHRyeSB7XG4gICAgICBpZiAoIXByb2Nlc3MuZW52LkdFTUlOSV9BUElfS0VZKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxhIGNsw6kgQVBJIEdlbWluaSAoR0VNSU5JX0FQSV9LRVkpIGVzdCBtYW5xdWFudGUuXCIpO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZXZhbHVhdGVXcml0aW5nKGV4ZXJjaXNlLCB0ZXh0KTtcbiAgICAgIFxuICAgICAgLy8gU2F2ZSB0byBGaXJlc3RvcmUgaWYgbG9nZ2VkIGluXG4gICAgICBpZiAodXNlcikge1xuICAgICAgICBjb25zdCBwcm9nUmVmID0gZG9jKGRiLCAndXNlcnMnLCB1c2VyLnVpZCwgJ3Byb2dyZXNzJywgaWQpO1xuICAgICAgICBhd2FpdCBzZXREb2MocHJvZ1JlZiwge1xuICAgICAgICAgIGV4ZXJjaXNlSWQ6IGlkLFxuICAgICAgICAgIHRleHQsXG4gICAgICAgICAgZXZhbHVhdGlvbjogcmVzdWx0LFxuICAgICAgICAgIHVwZGF0ZWRBdDogc2VydmVyVGltZXN0YW1wKClcbiAgICAgICAgfSwgeyBtZXJnZTogdHJ1ZSB9KTtcbiAgICAgIH1cblxuICAgICAgc2V0UHJvZ3Jlc3MocHJldiA9PiAoe1xuICAgICAgICAuLi5wcmV2LFxuICAgICAgICBbaWRdOiB7IHRleHQsIGV2YWx1YXRpb246IHJlc3VsdCB9XG4gICAgICB9KSk7XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICBhbGVydChgRXJyZXVyIGxvcnMgZGUgbCfDqXZhbHVhdGlvbjogJHtlcnJvci5tZXNzYWdlIHx8IFwiRXJyZXVyIGluY29ubnVlXCJ9YCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldElzRXZhbHVhdGluZyhmYWxzZSk7XG4gICAgfVxuICB9LCBbZXhlcmNpc2VzLCB1c2VyXSk7XG5cbiAgY29uc3Qgc29ydGVkRXhlcmNpc2VzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIFsuLi5leGVyY2lzZXNdLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGNvbnN0IGlzRGVmYXVsdEEgPSBhLmlkLnN0YXJ0c1dpdGgoJ2RlZmF1bHQtJyk7XG4gICAgICBjb25zdCBpc0RlZmF1bHRCID0gYi5pZC5zdGFydHNXaXRoKCdkZWZhdWx0LScpO1xuXG4gICAgICBpZiAoaXNEZWZhdWx0QSAmJiBpc0RlZmF1bHRCKSB7XG4gICAgICAgIGNvbnN0IG51bUEgPSBwYXJzZUludChhLmlkLnJlcGxhY2UoJ2RlZmF1bHQtJywgJycpLCAxMCk7XG4gICAgICAgIGNvbnN0IG51bUIgPSBwYXJzZUludChiLmlkLnJlcGxhY2UoJ2RlZmF1bHQtJywgJycpLCAxMCk7XG4gICAgICAgIGlmICghaXNOYU4obnVtQSkgJiYgIWlzTmFOKG51bUIpKSB7XG4gICAgICAgICAgcmV0dXJuIG51bUEgLSBudW1CO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhLmlkLmxvY2FsZUNvbXBhcmUoYi5pZCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChpc0RlZmF1bHRBICYmICFpc0RlZmF1bHRCKSByZXR1cm4gLTE7XG4gICAgICBpZiAoIWlzRGVmYXVsdEEgJiYgaXNEZWZhdWx0QikgcmV0dXJuIDE7XG5cbiAgICAgIC8vIEN1c3RvbSBvbmVzOiBzb3J0IGFscGhhYmV0aWNhbGx5IGJ5IHRpdGxlLCB0aGVuIGNsZWFuIElEXG4gICAgICBjb25zdCB0aXRsZUNvbXBhcmUgPSAoYS50aXRsZSB8fCAnJykubG9jYWxlQ29tcGFyZShiLnRpdGxlIHx8ICcnKTtcbiAgICAgIGlmICh0aXRsZUNvbXBhcmUgIT09IDApIHJldHVybiB0aXRsZUNvbXBhcmU7XG4gICAgICByZXR1cm4gYS5pZC5sb2NhbGVDb21wYXJlKGIuaWQpO1xuICAgIH0pO1xuICB9LCBbZXhlcmNpc2VzXSk7XG5cbiAgY29uc3QgZmlsdGVyZWRFeGVyY2lzZXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gc29ydGVkRXhlcmNpc2VzLmZpbHRlcihleCA9PiBcbiAgICAgIGV4LnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpKSB8fCBcbiAgICAgIGV4LnR5cGUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hUZXJtLnRvTG93ZXJDYXNlKCkpXG4gICAgKTtcbiAgfSwgW3NvcnRlZEV4ZXJjaXNlcywgc2VhcmNoVGVybV0pO1xuXG4gIGNvbnN0IHNlbGVjdGVkRXhlcmNpc2UgPSBzb3J0ZWRFeGVyY2lzZXMuZmluZChlID0+IGUuaWQgPT09IHNlbGVjdGVkSWQpO1xuICBjb25zdCBjdXJyZW50UHJvZ3Jlc3MgPSBzZWxlY3RlZElkID8gcHJvZ3Jlc3Nbc2VsZWN0ZWRJZF0gOiBudWxsO1xuXG4gIC8vIE1lbW9pemUgaGFuZGxlcnMgdGhhdCBkZXBlbmQgb24gdGhlIHNlbGVjdGVkIGV4ZXJjaXNlIGlkIHRvIHByZXZlbnQgaW5maW5pdGUgbG9vcHMgaW4gVHJhaW5pbmdJbnRlcmZhY2VcbiAgY29uc3Qgb25UZXh0Q2hhbmdlID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFzZWxlY3RlZElkKSByZXR1cm4gKCkgPT4ge307XG4gICAgcmV0dXJuICh0ZXh0OiBzdHJpbmcpID0+IGhhbmRsZVRleHRDaGFuZ2Uoc2VsZWN0ZWRJZCwgdGV4dCk7XG4gIH0sIFtzZWxlY3RlZElkLCBoYW5kbGVUZXh0Q2hhbmdlXSk7XG5cbiAgY29uc3Qgb25FdmFsdWF0ZSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghc2VsZWN0ZWRJZCkgcmV0dXJuICgpID0+IHt9O1xuICAgIHJldHVybiAodGV4dDogc3RyaW5nKSA9PiBoYW5kbGVFdmFsdWF0ZShzZWxlY3RlZElkLCB0ZXh0KTtcbiAgfSwgW3NlbGVjdGVkSWQsIGhhbmRsZUV2YWx1YXRlXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaC1bMTAwZHZoXSBiZy13aGl0ZSBkYXJrOmJnLWdyYXktOTUwIHRleHQtZ3JheS05MDAgZGFyazp0ZXh0LWdyYXktMTAwIGZvbnQtc2FucyBvdmVyZmxvdy1oaWRkZW5cIj5cbiAgICAgIHsvKiBPZmZsaW5lIEJhbm5lciAqL31cbiAgICAgIHshaXNPbmxpbmUgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLW9yYW5nZS01MDAgdGV4dC13aGl0ZSBweC00IHB5LTIgdGV4dC1zbSBmb250LW1lZGl1bSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMiBzaHJpbmstMFwiPlxuICAgICAgICAgIDxXaWZpT2ZmIGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPlxuICAgICAgICAgIE1vZGUgaG9ycy1saWduZSBhY3RpZi4gVm91cyBwb3V2ZXogY29udGludWVyIMOgIMOpY3JpcmUsIG1haXMgbCdleHRyYWN0aW9uIGV0IGwnw6l2YWx1YXRpb24gbsOpY2Vzc2l0ZW50IHVuZSBjb25uZXhpb24uXG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgey8qIE1vYmlsZSBIZWFkZXIgQmFubmVyICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZDpoaWRkZW4gcmVsYXRpdmUgei0zMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHgtNCBweS0zIGJnLXdoaXRlIGRhcms6YmctZ3JheS05MDAgYm9yZGVyLWIgYm9yZGVyLWdyYXktMjAwIGRhcms6Ym9yZGVyLWdyYXktODAwIHNocmluay0wXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc1NpZGViYXJPcGVuKHRydWUpfVxuICAgICAgICAgIGNsYXNzTmFtZT1cInAtMS41IHJvdW5kZWQtbGcgdGV4dC1ncmF5LTUwMCBkYXJrOnRleHQtZ3JheS00MDAgaG92ZXI6YmctZ3JheS0xMDAgZGFyazpob3ZlcjpiZy1ncmF5LTgwMCB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgICAgYXJpYS1sYWJlbD1cIk91dnJpciBsZSBtZW51XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxNZW51IGNsYXNzTmFtZT1cInctNiBoLTZcIiAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtc20gdHJhY2tpbmctd2lkZXN0IHRleHQtWyNGRjAwMDBdXCI+U2NocmVpYmVuPC9zcGFuPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctOVwiIC8+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtMSBtaW4taC0wIG92ZXJmbG93LWhpZGRlblwiPlxuICAgICAgICB7LyogU2lkZWJhciBiYWNrZHJvcCBmb3IgbW9iaWxlICovfVxuICAgICAgICB7aXNTaWRlYmFyT3BlbiAmJiAoXG4gICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgYmctYmxhY2svNTAgei00MCBtZDpoaWRkZW5cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNTaWRlYmFyT3BlbihmYWxzZSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogU2lkZWJhciAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BmaXhlZCBpbnNldC15LTAgbGVmdC0wIHctNC81IG1heC13LVszMjBweF0gbWQ6dy04MCBtZDptYXgtdy1ub25lIGJvcmRlci1yIGJvcmRlci1ncmF5LTIwMCBkYXJrOmJvcmRlci1ncmF5LTgwMCBmbGV4IGZsZXgtY29sIGJnLWdyYXktNTAgZGFyazpiZy1ncmF5LTkwMCB6LTUwIHRyYW5zZm9ybSAke2lzU2lkZWJhck9wZW4gPyAndHJhbnNsYXRlLXgtMCcgOiAnLXRyYW5zbGF0ZS14LWZ1bGwnfSBtZDp0cmFuc2xhdGUteC0wIG1kOnJlbGF0aXZlIG1kOmZsZXggdHJhbnNpdGlvbi10cmFuc2Zvcm0gZHVyYXRpb24tMzAwIGVhc2UtaW4tb3V0IHNocmluay0wYH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTYgYm9yZGVyLWIgYm9yZGVyLWdyYXktMjAwIGRhcms6Ym9yZGVyLWdyYXktODAwXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi00XCI+XG4gICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LXhsIGZvbnQtYm9sZCB0cmFja2luZy10aWdodCB0ZXh0LVsjRkYwMDAwXVwiPlNjaHJlaWJlbjwvaDE+XG4gICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNTaWRlYmFyT3BlbihmYWxzZSl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWQ6aGlkZGVuIHAtMS41IHJvdW5kZWQtbGcgdGV4dC1ncmF5LTQwMCBob3ZlcjpiZy1ncmF5LTIwMCBkYXJrOmhvdmVyOmJnLWdyYXktODAwIHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiRmVybWVyIGxlIG1lbnVcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFggY2xhc3NOYW1lPVwidy01IGgtNVwiIC8+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHsvKiBVc2VyIFNlc3Npb24gYW5kIENsb3VkIFN5bmMgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTZcIj5cbiAgICAgICAgICAgICAge3VzZXIgPyAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTMgYmctd2hpdGUgZGFyazpiZy1ncmF5LTgwMCByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItZ3JheS03MDAgc2hhZG93LXNtXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIG1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEwIGgtMTAgcm91bmRlZC1mdWxsIGJnLWdyYXktMTAwIGRhcms6YmctZ3JheS03MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgICAgICAgICAgICAge3VzZXIucGhvdG9VUkwgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17dXNlci5waG90b1VSTH0gYWx0PXt1c2VyLmRpc3BsYXlOYW1lIHx8ICcnfSBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlclwiIHJlZmVycmVyUG9saWN5PVwibm8tcmVmZXJyZXJcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8VXNlckljb24gY2xhc3NOYW1lPVwidy01IGgtNSB0ZXh0LWdyYXktNDAwXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgbWluLXctMFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1zZW1pYm9sZCB0cnVuY2F0ZSBsZWFkaW5nLW5vbmUgbWItMVwiPnt1c2VyLmRpc3BsYXlOYW1lIHx8ICdVdGlsaXNhdGV1cid9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtZ3JlZW4tNjAwIGRhcms6dGV4dC1ncmVlbi00MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxDbG91ZCBjbGFzc05hbWU9XCJ3LTIgaC0yXCIgLz4ge3VzZXJQcm9maWxlPy5yb2xlID09PSAndGVhY2hlcicgPyAnRW5zZWlnbmFudCcgOiAnw4l0dWRpYW50J31cbiAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIHsvKiBSb2xlIFN3aXRjaGVyICovfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIHt1c2VyUHJvZmlsZT8ucm9sZSA9PT0gJ3RlYWNoZXInID8gKFxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB1c2VyICYmIHVwZGF0ZVVzZXJSb2xlKHVzZXIudWlkLCAnc3R1ZGVudCcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB5LTEuNSBweC0zIHJvdW5kZWQtbGcgdGV4dC1bMTBweF0gZm9udC1ib2xkIGJnLWdyYXktMTAwIGRhcms6YmctZ3JheS03MDAgdGV4dC1ncmF5LTc1MCBob3ZlcjpiZy1bI0ZGMDAwMF0gaG92ZXI6dGV4dC13aGl0ZSB0cmFuc2l0aW9uLWNvbG9ycyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMS41XCJcbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VXNlcnMgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPiBCYXNjdWxlciBlbiB2dWUgw4l0dWRpYW50XG4gICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvZGUgPSBwcm9tcHQoXCJWZXVpbGxleiBzYWlzaXIgbGUgY29kZSBkJ2FjY8OocyBlbnNlaWduYW50IHBvdXIgYWN0aXZlciBsZSByw7RsZSBkZSAnUHJvZicgOlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29kZSA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2RlLnRyaW0oKS50b1VwcGVyQ2FzZSgpID09PSBcIkIyUFJPRlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVVc2VyUm9sZSh1c2VyLnVpZCwgJ3RlYWNoZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiUsO0bGUgRW5zZWlnbmFudCBhY3RpdsOpICFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiQ29kZSBkJ2FjY8OocyBlbnNlaWduYW50IGluY29ycmVjdC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB5LTEgcHgtMiB0ZXh0LVs5cHhdIGZvbnQtbWVkaXVtIHRleHQtZ3JheS00MDAgaG92ZXI6dGV4dC1bI0ZGMDAwMF0gaG92ZXI6dW5kZXJsaW5lIHRyYW5zaXRpb24tYWxsIHRleHQtY2VudGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICDimqDvuI8gRMOpdmVycm91aWxsZXIgbCdhY2PDqHMgRW5zZWlnbmFudFxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2xvZ291dH1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB5LTEuNSBweC0zIHRleHQteHMgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTIgdGV4dC1ncmF5LTUwMCBob3Zlcjp0ZXh0LXJlZC01MDAgdHJhbnNpdGlvbi1jb2xvcnMgYm9yZGVyIGJvcmRlci1ncmF5LTEwMCBkYXJrOmJvcmRlci1ncmF5LTcwMCByb3VuZGVkLWxnXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPExvZ091dCBjbGFzc05hbWU9XCJ3LTMgaC0zXCIgLz4gRMOpY29ubmV4aW9uXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktM1wiPlxuICAgICAgICAgICAgICAgICAgeyFzaG93RW1haWxGb3JtID8gKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtsb2dpbldpdGhHb29nbGV9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcHktMiBweC0zIGJnLVsjRkYwMDAwXSB0ZXh0LXdoaXRlIHJvdW5kZWQtbGcgaG92ZXI6YmctcmVkLTYwMCB0cmFuc2l0aW9uLWFsbCBhY3RpdmU6c2NhbGUtOTUgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTIgdGV4dC14cyBmb250LW1lZGl1bVwiXG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPExvZ0luIGNsYXNzTmFtZT1cInctMyBoLTNcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgQ29udGludWVyIGF2ZWMgR29vZ2xlXG4gICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMiB0ZXh0LXhzIHRleHQtZ3JheS01MDAgZGFyazp0ZXh0LWdyYXktNDAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgc2V0U2hvd0VtYWlsRm9ybSh0cnVlKTsgc2V0SXNTaWduVXAoZmFsc2UpOyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJob3Zlcjp0ZXh0LWdyYXktOTAwIGRhcms6aG92ZXI6dGV4dC1ncmF5LTEwMCBob3Zlcjp1bmRlcmxpbmUgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICBTZSBjb25uZWN0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+4oCiPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHNldFNob3dFbWFpbEZvcm0odHJ1ZSk7IHNldElzU2lnblVwKHRydWUpOyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJob3Zlcjp0ZXh0LWdyYXktOTAwIGRhcms6aG92ZXI6dGV4dC1ncmF5LTEwMCBob3Zlcjp1bmRlcmxpbmUgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICBDcsOpZXIgdW4gY29tcHRlXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlRW1haWxBdXRofSBjbGFzc05hbWU9XCJzcGFjZS15LTIuNSBwLTMuNSBiZy13aGl0ZSBkYXJrOmJnLWdyYXktODAwIHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBkYXJrOmJvcmRlci1ncmF5LTcwMCBzaGFkb3ctc20gdGV4dC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gYm9yZGVyLWIgYm9yZGVyLWdyYXktMTAwIGRhcms6Ym9yZGVyLWdyYXktNzAwIHBiLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtWzExcHhdIGZvbnQtYm9sZCB0ZXh0LWdyYXktODAwIGRhcms6dGV4dC1ncmF5LTIwMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2lzU2lnblVwID8gXCJDcsOpZXIgdW4gY29tcHRlXCIgOiBcIkNvbm5leGlvbiBFbWFpbFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNob3dFbWFpbEZvcm0oZmFsc2UpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LWdyYXktNTAwIGhvdmVyOnRleHQtZ3JheS05MDAgZGFyazpob3Zlcjp0ZXh0LXdoaXRlIHVuZGVybGluZSBmb250LW1lZGl1bVwiXG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJldG91clxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICB7aXNTaWduVXAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bOXB4XSB1cHBlcmNhc2UgZm9udC1ib2xkIHRleHQtZ3JheS00MDAgYmxvY2tcIj5Ob20gY29tcGxldDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgdGV4dC14cyBwLTIgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBkYXJrOmJvcmRlci1ncmF5LTcwMCByb3VuZGVkLWxnIGJnLWdyYXktNTAgZGFyazpiZy1ncmF5LTkwMCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLVsjRkYwMDAwXVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFeDogVmljdG9yIFkuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17ZnVsbE5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRGdWxsTmFtZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bOXB4XSB1cHBlcmNhc2UgZm9udC1ib2xkIHRleHQtZ3JheS00MDAgYmxvY2tcIj5FbWFpbDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImVtYWlsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHRleHQteHMgcC0yIGJvcmRlciBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItZ3JheS03MDAgcm91bmRlZC1sZyBiZy1ncmF5LTUwIGRhcms6YmctZ3JheS05MDAgZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOmJvcmRlci1bI0ZGMDAwMF1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImV4ZW1wbGVAZW1haWwuY29tXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2VtYWlsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEVtYWlsKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bOXB4XSB1cHBlcmNhc2UgZm9udC1ib2xkIHRleHQtZ3JheS00MDAgYmxvY2tcIj5Nb3QgZGUgcGFzc2U8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCB0ZXh0LXhzIHAtMiBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGRhcms6Ym9yZGVyLWdyYXktNzAwIHJvdW5kZWQtbGcgYmctZ3JheS01MCBkYXJrOmJnLWdyYXktOTAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItWyNGRjAwMDBdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLigKLigKLigKLigKLigKLigKLigKLigKJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0UGFzc3dvcmQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5MZW5ndGg9ezZ9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAge2lzU2lnblVwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVs5cHhdIHVwcGVyY2FzZSBmb250LWJvbGQgdGV4dC1ncmF5LTQwMCBibG9ja1wiPlZvdHJlIHLDtGxlPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRFbWFpbFJvbGUoJ3N0dWRlbnQnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGZsZXgtMSBweS0xIHJvdW5kZWQgdGV4dC1bMTBweF0gZm9udC1ib2xkIGJvcmRlciB0cmFuc2l0aW9uLWNvbG9ycyAke2VtYWlsUm9sZSA9PT0gJ3N0dWRlbnQnID8gJ2JnLVsjRkYwMDAwXSB0ZXh0LXdoaXRlIGJvcmRlci10cmFuc3BhcmVudCcgOiAnYmctZ3JheS0xMDAgZGFyazpiZy1ncmF5LTcwMCB0ZXh0LWdyYXktNTAwIGJvcmRlci1ncmF5LTI1MCBkYXJrOmJvcmRlci10cmFuc3BhcmVudCd9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICDDiWzDqHZlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRFbWFpbFJvbGUoJ3RlYWNoZXInKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGZsZXgtMSBweS0xIHJvdW5kZWQgdGV4dC1bMTBweF0gZm9udC1ib2xkIGJvcmRlciB0cmFuc2l0aW9uLWNvbG9ycyAke2VtYWlsUm9sZSA9PT0gJ3RlYWNoZXInID8gJ2JnLWluZGlnby02MDAgdGV4dC13aGl0ZSBib3JkZXItdHJhbnNwYXJlbnQnIDogJ2JnLWdyYXktMTAwIGRhcms6YmctZ3JheS03MDAgdGV4dC1ncmF5LTUwMCBib3JkZXItZ3JheS0yNTAgZGFyazpib3JkZXItdHJhbnNwYXJlbnQnfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgICAgICB7aXNTaWduVXAgJiYgZW1haWxSb2xlID09PSAndGVhY2hlcicgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTAuNSBhbmltYXRlLWZhZGVJblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bOXB4XSB1cHBlcmNhc2UgZm9udC1ib2xkIHRleHQtYW1iZXItNTAwIGJsb2NrXCI+Q29kZSBkJ2FjY8OocyBlbnNlaWduYW50PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCB0ZXh0LXhzIHAtMiBib3JkZXIgYm9yZGVyLWFtYmVyLTMwMCBkYXJrOmJvcmRlci1hbWJlci03MDAgcm91bmRlZC1sZyBiZy1ncmF5LTUwIGRhcms6YmctZ3JheS05MDAgZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOmJvcmRlci1pbmRpZ28tNjAwIGZvbnQtbW9ub1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRyZXogbGUgY29kZSBQcm9mIChleDogQjJQUk9GKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RlYWNoZXJDb2RlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0VGVhY2hlckNvZGUoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInN1Ym1pdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17YXV0aExvYWRpbmd9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcHktMiBweC0zIGJnLVsjRkYwMDAwXSB0ZXh0LXdoaXRlIHJvdW5kZWQtbGcgZm9udC1ib2xkIHRleHQteHMgaG92ZXI6YmctcmVkLTYwMCBkaXNhYmxlZDpvcGFjaXR5LTUwIHRyYW5zaXRpb24tY29sb3JzIHNoYWRvdy1zbSBzaGFkb3ctcmVkLTUwMC8xMFwiXG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge2F1dGhMb2FkaW5nID8gXCJFbiBjb3Vycy4uLlwiIDogaXNTaWduVXAgPyBcIlMnaW5zY3JpcmUgZXQgc2UgY29ubmVjdGVyXCIgOiBcIlNlIGNvbm5lY3RlclwifVxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBwdC0xIGJvcmRlci10IGJvcmRlci1ncmF5LTEwMCBkYXJrOmJvcmRlci1ncmF5LTcwMC81MFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyBzZXRJc1NpZ25VcCghaXNTaWduVXApOyBzZXRQYXNzd29yZCgnJyk7IH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtZ3JheS01MDAgaG92ZXI6dGV4dC1ncmF5LTkwMCBkYXJrOmhvdmVyOnRleHQtd2hpdGUgdW5kZXJsaW5lIGZvbnQtbWVkaXVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2lzU2lnblVwID8gXCJEw6lqw6AgbWVtYnJlID8gQ29ubmVjdGV6LXZvdXNcIiA6IFwiUGFzIGRlIGNvbXB0ZSA/IEluc2NyaXZlei12b3VzXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7IXByb2Nlc3MuZW52LkdFTUlOSV9BUElfS0VZID8gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTQgcC0zIGJnLXJlZC0xMDAgZGFyazpiZy1yZWQtOTAwLzMwIGJvcmRlciBib3JkZXItcmVkLTIwMCBkYXJrOmJvcmRlci1yZWQtODAwIHJvdW5kZWQtbGcgdGV4dC14cyB0ZXh0LXJlZC03MDAgZGFyazp0ZXh0LXJlZC00MDBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvbnQtYm9sZCBtYi0xIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xXCI+XG4gICAgICAgICAgICAgICAgICA8V2lmaU9mZiBjbGFzc05hbWU9XCJ3LTMgaC0zXCIgLz4gQ2zDqSBBUEkgbWFucXVhbnRlXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgTCdJQSBuZSBmb25jdGlvbm5lcmEgcGFzLiBBam91dGV6IDxzdHJvbmc+R0VNSU5JX0FQSV9LRVk8L3N0cm9uZz4gZGFucyB2b3MgdmFyaWFibGVzIGQnZW52aXJvbm5lbWVudC5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTQgcC0yIGJnLWdyZWVuLTUwIGRhcms6YmctZ3JlZW4tOTAwLzIwIGJvcmRlciBib3JkZXItZ3JlZW4tMTAwIGRhcms6Ym9yZGVyLWdyZWVuLTkwMC8zMCByb3VuZGVkLWxnIHRleHQtWzEwcHhdIHRleHQtZ3JlZW4tNjAwIGRhcms6dGV4dC1ncmVlbi00MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMS41IGgtMS41IHJvdW5kZWQtZnVsbCBiZy1ncmVlbi01MDAgYW5pbWF0ZS1wdWxzZVwiIC8+XG4gICAgICAgICAgICAgICAgSUEgQ29ubmVjdMOpZSAoR2VtaW5pIDMuNSBGbGFzaClcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNlbGVjdEV4ZXJjaXNlKG51bGwsIHRydWUpfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWlzT25saW5lfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTIgcHgtNCBweS0yIGJnLWdyYXktOTAwIGRhcms6YmctZ3JheS0xMDAgdGV4dC13aGl0ZSBkYXJrOnRleHQtZ3JheS05MDAgcm91bmRlZC1sZyBob3ZlcjpiZy1ncmF5LTgwMCBkYXJrOmhvdmVyOmJnLWdyYXktMjAwIGRpc2FibGVkOm9wYWNpdHktNTAgZGlzYWJsZWQ6Y3Vyc29yLW5vdC1hbGxvd2VkIHRyYW5zaXRpb24tY29sb3JzIGZvbnQtbWVkaXVtIGN1cnNvci1wb2ludGVyIG1iLTRcIlxuICAgICAgICAgICAgICB0aXRsZT17IWlzT25saW5lID8gXCJDb25uZXhpb24gaW50ZXJuZXQgcmVxdWlzZVwiIDogXCJcIn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFBsdXMgY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+XG4gICAgICAgICAgICAgIEFqb3V0ZXIgdW4gc3VqZXRcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LXktMCBsZWZ0LTAgcGwtMyBmbGV4IGl0ZW1zLWNlbnRlciBwb2ludGVyLWV2ZW50cy1ub25lXCI+XG4gICAgICAgICAgICAgICAgPFNlYXJjaCBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtZ3JheS00MDBcIiAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUmVjaGVyY2hlciB1biBzdWpldC4uLlwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFRlcm19XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRTZWFyY2hUZXJtKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcGwtMTAgcHItNCBweS0yIGJvcmRlciBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItZ3JheS04MDAgcm91bmRlZC1sZyBiZy1ncmF5LTUwIGRhcms6YmctZ3JheS05MDAgdGV4dC1zbSBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLVsjRkYwMDAwXSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1bI0ZGMDAwMF0gdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8SW5zdGFsbFBXQSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIG92ZXJmbG93LXktYXV0byBwLTQgc3BhY2UteS0yXCI+XG4gICAgICAgICAgICB7ZmlsdGVyZWRFeGVyY2lzZXMubWFwKGV4ID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgcHJvZyA9IHByb2dyZXNzW2V4LmlkXTtcbiAgICAgICAgICAgICAgY29uc3QgaXNEb25lID0gISFwcm9nPy5ldmFsdWF0aW9uO1xuICAgICAgICAgICAgICBjb25zdCBoYXNTdGFydGVkID0gISFwcm9nPy50ZXh0O1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBrZXk9e2V4LmlkfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2VsZWN0RXhlcmNpc2UoZXguaWQpfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtcbiAgICAgICAgICAgICAgICAgICAgXCJ3LWZ1bGwgdGV4dC1sZWZ0IHAtNCByb3VuZGVkLXhsIGJvcmRlciB0cmFuc2l0aW9uLWFsbCBcIiArXG4gICAgICAgICAgICAgICAgICAgIChzZWxlY3RlZElkID09PSBleC5pZCAmJiAhaXNVcGxvYWRpbmdcbiAgICAgICAgICAgICAgICAgICAgICA/ICdiZy13aGl0ZSBkYXJrOmJnLWdyYXktODAwIGJvcmRlci1bI0ZGMDAwMF0gc2hhZG93LXNtJ1xuICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXRyYW5zcGFyZW50IGJvcmRlci10cmFuc3BhcmVudCBob3ZlcjpiZy1ncmF5LTIwMC81MCBkYXJrOmhvdmVyOmJnLWdyYXktODAwLzUwJylcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQganVzdGlmeS1iZXR3ZWVuIGdhcC0yIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImZvbnQtc2VtaWJvbGQgdHJ1bmNhdGUgdGV4dC1zbVwiPntleC50aXRsZX08L2gzPlxuICAgICAgICAgICAgICAgICAgICB7aXNEb25lID8gKFxuICAgICAgICAgICAgICAgICAgICAgIDxDaGVja0NpcmNsZSBjbGFzc05hbWU9XCJ3LTQgaC00IHRleHQtZ3JlZW4tNTAwIHNocmluay0wIG10LTAuNVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICkgOiBoYXNTdGFydGVkID8gKFxuICAgICAgICAgICAgICAgICAgICAgIDxDbG9jayBjbGFzc05hbWU9XCJ3LTQgaC00IHRleHQtb3JhbmdlLTUwMCBzaHJpbmstMCBtdC0wLjVcIiAvPlxuICAgICAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwIGRhcms6dGV4dC1ncmF5LTQwMCB0cnVuY2F0ZSBtYi0zXCI+e2V4LnR5cGV9PC9wPlxuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICB7LyogUHJvZ3Jlc3MgQmFyICovfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTEgdy1mdWxsIGJnLWdyYXktMjAwIGRhcms6YmctZ3JheS03MDAgcm91bmRlZC1mdWxsIG92ZXJmbG93LWhpZGRlblwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IFxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGgtZnVsbCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi01MDAgJHtpc0RvbmUgPyAndy1mdWxsIGJnLWdyZWVuLTUwMCcgOiBoYXNTdGFydGVkID8gJ3ctMS8yIGJnLW9yYW5nZS01MDAnIDogJ3ctMCd9YH1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICB7ZmlsdGVyZWRFeGVyY2lzZXMubGVuZ3RoID09PSAwICYmIChcbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNTAwIHRleHQtY2VudGVyIG10LTEwXCI+XG4gICAgICAgICAgICAgICAge3NvcnRlZEV4ZXJjaXNlcy5sZW5ndGggPT09IDAgPyBcIkF1Y3VuIGV4ZXJjaWNlIHNhdXZlZ2FyZMOpLlwiIDogXCJBdWN1biBzdWpldCB0cm91dsOpLlwifVxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogTWFpbiBDb250ZW50ICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBmbGV4IGZsZXgtY29sIG1pbi1oLTAgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAge3VzZXJQcm9maWxlPy5yb2xlID09PSAndGVhY2hlcicgPyAoXG4gICAgICAgICAgICA8VGVhY2hlckRhc2hib2FyZCAvPlxuICAgICAgICAgICkgOiBpc1VwbG9hZGluZyA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIG92ZXJmbG93LXktYXV0byBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICAgICAgICA8VXBsb2FkU2VjdGlvbiBvblVwbG9hZD17aGFuZGxlVXBsb2FkfSBpc0V4dHJhY3Rpbmc9e2lzRXh0cmFjdGluZ30gaXNPbmxpbmU9e2lzT25saW5lfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IHNlbGVjdGVkRXhlcmNpc2UgPyAoXG4gICAgICAgICAgICA8VHJhaW5pbmdJbnRlcmZhY2VcbiAgICAgICAgICAgICAga2V5PXtzZWxlY3RlZEV4ZXJjaXNlLmlkfVxuICAgICAgICAgICAgICBleGVyY2lzZT17c2VsZWN0ZWRFeGVyY2lzZX1cbiAgICAgICAgICAgICAgaW5pdGlhbFRleHQ9e2N1cnJlbnRQcm9ncmVzcz8udGV4dCB8fCAnJ31cbiAgICAgICAgICAgICAgZXZhbHVhdGlvbj17Y3VycmVudFByb2dyZXNzPy5ldmFsdWF0aW9uIHx8IG51bGx9XG4gICAgICAgICAgICAgIG9uVGV4dENoYW5nZT17b25UZXh0Q2hhbmdlfVxuICAgICAgICAgICAgICBvbkV2YWx1YXRlPXtvbkV2YWx1YXRlfVxuICAgICAgICAgICAgICBpc0V2YWx1YXRpbmc9e2lzRXZhbHVhdGluZ31cbiAgICAgICAgICAgICAgaXNPbmxpbmU9e2lzT25saW5lfVxuICAgICAgICAgICAgICBpc1RpbWVyUnVubmluZz17aXNUaW1lclJ1bm5pbmd9XG4gICAgICAgICAgICAgIHNldElzVGltZXJSdW5uaW5nPXtzZXRJc1RpbWVyUnVubmluZ31cbiAgICAgICAgICAgICAgdGVhY2hlcnM9e3RlYWNoZXJzfVxuICAgICAgICAgICAgICB1c2VyPXt1c2VyfVxuICAgICAgICAgICAgICBsYXN0VGVhY2hlcklkPXt1c2VyUHJvZmlsZT8ubGFzdFRlYWNoZXJJZH1cbiAgICAgICAgICAgICAgb25FeGl0PXsoKSA9PiBzZWxlY3RFeGVyY2lzZShudWxsKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxTdHVkZW50RGFzaGJvYXJkXG4gICAgICAgICAgICAgIGV4ZXJjaXNlcz17c29ydGVkRXhlcmNpc2VzfVxuICAgICAgICAgICAgICBwcm9ncmVzcz17cHJvZ3Jlc3N9XG4gICAgICAgICAgICAgIHVzZXI9e3VzZXJ9XG4gICAgICAgICAgICAgIHVzZXJQcm9maWxlPXt1c2VyUHJvZmlsZX1cbiAgICAgICAgICAgICAgb25TZWxlY3RFeGVyY2lzZT17KGlkKSA9PiBzZWxlY3RFeGVyY2lzZShpZCl9XG4gICAgICAgICAgICAgIG9uU3RhcnRVcGxvYWQ9eygpID0+IHsgc2V0SXNVcGxvYWRpbmcodHJ1ZSk7IHNldFNlbGVjdGVkSWQobnVsbCk7IH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibWFwcGluZ3MiOiJBQSt2QlU7QUEvdkJWO0FBQUE7QUFBQTtBQUFBO0FBS0EsU0FBZ0IsVUFBVSxXQUFXLGFBQWEsZUFBdUI7QUFDekUsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyx5QkFBeUI7QUFDbEMsU0FBUyx3QkFBd0I7QUFDakMsU0FBUyxrQkFBa0I7QUFDM0IsU0FBUyxrQkFBa0IsdUJBQTZDO0FBQ3hFLFNBQVMsTUFBTSxhQUFhLE9BQU8sU0FBUyxPQUFPLFFBQVEsT0FBTyxRQUFRLFVBQWdCLE9BQXNCLE1BQU0sR0FBRyxjQUFjO0FBQ3ZJLFNBQVMsTUFBTSxpQkFBaUIsUUFBUSxJQUFJLGVBQWUsc0JBQXNCLGdCQUFnQixnQkFBZ0IsdUJBQXVCO0FBQ3hJLFNBQVMsMEJBQWdDO0FBQ3pDLFNBQVMsWUFBWSxLQUFLLFFBQW1CLFlBQVksaUJBQWlCLE9BQU8sU0FBUyxhQUF3QjtBQUNsSCxTQUFTLHdCQUF3QjtBQU9qQyxNQUFNLG9CQUFnQztBQUFBLEVBQ3BDO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxXQUFXO0FBQUEsSUFDWCxTQUFTO0FBQUEsSUFDVCxNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLFdBQVc7QUFBQSxJQUNYLFNBQVM7QUFBQSxJQUNULE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsV0FBVztBQUFBLElBQ1gsU0FBUztBQUFBLElBQ1QsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxXQUFXO0FBQUEsSUFDWCxTQUFTO0FBQUEsSUFDVCxNQUFNO0FBQUEsRUFD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QUFBQSxjQXhCSyxHQUFHO0FBQUEsY0FEVjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBMEJBO0FBQUEsVUFFSixDQUFDO0FBQUEsVUFDQSxrQkFBa0IsV0FBVyxLQUM1Qix1QkFBQyxPQUFFLFdBQVUsMkNBQ1YsMEJBQWdCLFdBQVcsSUFBSSwrQkFBK0IseUJBRGpFO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBRUE7QUFBQSxhQXZDSjtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBeUNBO0FBQUEsV0FqU0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQWtTQTtBQUFBLE1BR0EsdUJBQUMsU0FBSSxXQUFVLGdEQUNaLHVCQUFhLFNBQVMsWUFDckIsdUJBQUMsc0JBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFrQixJQUNoQixjQUNGLHVCQUFDLFNBQUksV0FBVSwyREFDYixpQ0FBQyxpQkFBYyxVQUFVLGNBQWMsY0FBNEIsWUFBbkU7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUF1RixLQUR6RjtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBRUEsSUFDRSxtQkFDRjtBQUFBLFFBQUM7QUFBQTtBQUFBLFVBRUMsVUFBVTtBQUFBLFVBQ1YsYUFBYSxpQkFBaUIsUUFBUTtBQUFBLFVBQ3RDLFlBQVksaUJBQWlCLGNBQWM7QUFBQSxVQUMzQztBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBLGVBQWUsYUFBYTtBQUFBLFVBQzVCLFFBQVEsTUFBTSxlQUFlLElBQUk7QUFBQTtBQUFBLFFBYjVCLGlCQUFpQjtBQUFBLFFBRHhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFlQSxJQUVBO0FBQUEsUUFBQztBQUFBO0FBQUEsVUFDQyxXQUFXO0FBQUEsVUFDWDtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQSxrQkFBa0IsQ0FBQyxPQUFPLGVBQWUsRUFBRTtBQUFBLFVBQzNDLGVBQWUsTUFBTTtBQUFFLDJCQUFlLElBQUk7QUFBRywwQkFBYyxJQUFJO0FBQUEsVUFBRztBQUFBO0FBQUEsUUFOcEU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BT0EsS0FoQ0o7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQWtDQTtBQUFBLFNBalZGO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FrVkE7QUFBQSxPQXhXRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBeVdBO0FBRUo7IiwibmFtZXMiOlsiZG9jIl19