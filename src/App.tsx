/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { UploadSection } from './components/UploadSection';
import { TrainingInterface } from './components/TrainingInterface';
import { StudentDashboard } from './components/StudentDashboard';
import { InstallPWA } from './components/InstallPWA';
import { extractExercises, evaluateWriting, Exercise, Evaluation } from './services/gemini';
import { BookOpen, Plus, ShieldCheck, CheckCircle, Clock, WifiOff, LogIn, LogOut, Cloud, User as UserIcon, Mail, Users, GraduationCap, Menu, X, Search, Trash2 , Upload, ChevronRight} from 'lucide-react';
import { auth, loginWithGoogle, logout, db, OperationType, handleFirestoreError, updateUserRole, loginWithEmail, signUpWithEmail } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, updateDoc, onSnapshot, serverTimestamp, query, orderBy, where, deleteDoc } from 'firebase/firestore';
import { TeacherDashboard as AdminDashboardView } from './components/TeacherDashboard';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard as SuperAdminDashboardView } from './components/AdminDashboard';

interface SavedProgress {
  text: string;
  evaluation: Evaluation | null;
}

const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'default-1',
    title: 'Beschwerde: Sprachreise nach Berlin',
    situation: 'Sie haben eine zweiwöchige Sprachreise nach Berlin gebucht. In der Anzeige stand: "Zentrale Unterkunft, kleine Gruppen (max. 8 Personen), erfahrene Lehrer". Vor Ort war die Unterkunft jedoch 45 Minuten vom Zentrum entfernt, die Gruppe bestand aus 15 Personen und der Lehrer war oft unpünktlich.',
    content: 'Schreiben Sie eine Beschwerde an den Veranstalter "Global Languages". Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens\n- Erwartungen vs. Realité (Unterkunft, Gruppengröße)\n- Kritik am Unterricht\n- Forderung (z.B. Teilrückzahlung)',
    type: 'Beschwerde'
  },
  {
    id: 'default-2',
    title: 'Bitte um Informationen: Freiwilligenarbeit',
    situation: 'Sie interessieren sich für ein projet zur Freiwilligenarbeit im Umweltschutz in den Alpen. Sie haben eine Anzeige im Internet gesehen, aber es fehlen wichtige Details.',
    content: 'Schreiben Sie eine E-Mail an die Organisation "Alpen-Natur". Bitten Sie um Informationen zu folgenden Punkten:\n- Dauer des Projekts und tägliche Arbeitszeit\n- Unterkunft und Verpflegung\n- Voraussetzungen (Sprachkenntnisse, Erfahrung)\n- Kosten oder Aufwandsentschädigung',
    type: 'Information'
  },
  {
    id: 'default-3',
    title: 'Bewerbung um ein Praktikum',
    situation: 'Sie haben im Internet eine Anzeige für ein dreimonatiges Praktikum im Bereich Marketing bei der Firma "Mediadesign" in Hamburg gefunden.',
    content: 'Schreiben Sie Ihre Bewerbung. Behandeln Sie folgende Punkte:\n- Grund für Ihre Bewerbung\n- Ihre bisherigen Erfahrungen and Sprachkenntnisse\n- Warum Sie für dieses Unternehmen arbeiten möchten\n- Fragen zum genauen Arbeitsbeginn',
    type: 'Bewerbung'
  },
  {
    id: 'default-4',
    title: 'Beschwerde: Mietwagen im Urlaub',
    situation: 'Für Ihren einwöchigen Familienurlaub in Spanien haben Sie online bei "Rent-a-Car Premium" einen geräumigen SUV mit voll ausgestatteter Klimaanlage gebucht. Bei der Abholung am Flughafen erhielten Sie jedoch einen kleinen, dreitürigen Kleinwagen. Zudem funktionierte die Klimaanlage nicht, und der Kindersitz fehlte. Trotz mehrmaliger Bitten verweigerte der Kundenservice vor Ort jegliche Unterstützung oder einen Fahrzeugwechsel.',
    content: 'Schreiben Sie eine Beschwerde an die Zentrale von "Rent-a-Car Premium". Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens\n- Abweichungen zwischen Buchung und erhaltenem Fahrzeug\n- Mangelnde Ausstattung (Klimaanlage, Kindersitz) und die Folgen\n- Unkooperatives Verhalten des Kundenservices\n- Angemessene finanzielle Entschädigung',
    type: 'Beschwerde'
  },
  {
    id: 'default-5',
    title: 'Beschwerde: Festival "Rock am See"',
    situation: 'Sie haben für das zweitägige Musikfestival "Rock am See" teure VIP-Tickets erworben, die laut Veranstalter separaten Zugang, erstklassiges Catering, exklusiven VIP-Bereich nah an der Bühne und ein Treffen mit den Künstlern beinhalteten. Die Realität war enttäuschend: Es gab keinen VIP-Eingang, die Schlangen waren stundenlang, der VIP-Bereich war überfüllt und zwei Hauptbands traten ohne Ersatz nicht auf.',
    content: 'Schreiben Sie eine Beschwerde an die Eventagentur "SummerVibes GmbH". Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens\n- Fehlende vertraglich vereinbarte Leistungen (VIP-Vorteile)\n- Enttäuschung über das Catering und die Organisation\n- Ausfall der Künstler und unzureichende Kommunikation\n- Forderung auf Rückerstattung eines Teils des Ticketpreises',
    type: 'Beschwerde'
  },
  {
    id: 'default-6',
    title: 'Beschwerde: Online-Kauf eines Laptops',
    situation: 'Sie haben online über das Portal "Refurbished-Tech" ein generalüberholtes Notebook der Premiumklasse bestellt. Laut Beschreibung sollte das Gerät im Zustand "Wie neu" sein und inklusive Originalladegerät und Schutzhülle geliefert werden. Das gelieferte Notebook hatte jedoch deutliche Kratzer auf dem Bildschirm, die Akkulaufzeit lag unter 30 Minuten und das Zubehör fehlte komplett.',
    content: 'Schreiben Sie eine Beschwerde an "Refurbished-Tech Kundenservice". Behandeln Sie folgende Punkte:\n- Grund des Schreibens und Bestelldaten\n- Beschreibung der Mängel am Gerät\n- Fehlendes Zubehör (Ladegerät, Hülle)\n- Enttäuschung über die Qualitätsbeschreibung ("Wie neu")\n- Fristsetzung zur Nachbesserung, Umtausch oder Rückgabe des Geldes',
    type: 'Beschwerde'
  },
  {
    id: 'default-7',
    title: 'Bitte um Informationen: Intensivsprachkurs in Wien',
    situation: 'Sie planen, im kommenden Herbst Ihre Deutschkenntnisse zu vertiefen und sich auf die C1-Prüfung vorzubereiten. Sie stoßen auf das Angebot des "Dialog-Instituts in Wien". Das Online-Angebot klingt vielversprechend, lässt aber wesentliche organisatorische Details offen.',
    content: 'Schreiben Sie eine E-Mail an das "Dialog-Institut Wien". Bitten Sie um Informationen zu folgenden Punkten:\n- Genaue Unterrichtszeiten und Gruppengröße\n- Unterstützung bei der Wohnungssuche oder Unterkunftsmöglichkeiten\n- Spezifischer Ablauf der Vorbereitung auf die C1-Prüfung (Simulationsprüfungen)\n- Stornierungsbedingungen und Fristen bei Visumsproblemen',
    type: 'Information'
  },
  {
    id: 'default-8',
    title: 'Bitte um Informationen: Auslandspraktikum in New York',
    situation: 'Die Vermittlungsagentur "GlobalCareers" bietet sechsmonatige bezahlte Praktika im Bereich Event-Marketing und Kommunikation in New York an. Sie finden das Angebot äußerst attraktiv, benötigen jedoch klärende Details.',
    content: 'Schreiben Sie eine Anfrage-E-Mail an "GlobalCareers". Fragen Sie nach:\n- Kriterien für die Auswahl der Bewerber und notwendige Englischzertifikate\n- Durchschnittliche Höhe des Stipendiums / der Vergütung\n- Unterstützung bei der Beantragung des J-1 Visums\n- Vermittlungsgebühren und zusätzliche Kosten (z.B. Krankenversicherung)',
    type: 'Information'
  },
  {
    id: 'default-9',
    title: 'Bitte um Informationen: Messeteilnahme für Start-ups',
    situation: 'Sie vertreten das junge Food-Startup "ChocoBio" und möchten Ihr Produkt auf der Leitmesse "EcoFood Expo" in Köln präsentieren. Auf der Website finden Sie zwar das Anmeldeformular, aber keine Detailinformationen für Erstaussteller.',
    content: 'Schreiben Sie eine E-Mail an das Messeteam der "EcoFood Expo". Klären Sie folgende Punkte:\n- Kosten pro Quadratmeter für einen kleinen Ausstellungsstand\n- Möglichkeit der Beteiligung an der Startup-Area (Sonderkonditionen)\n- Zur Verfügung gestellte technische Ausstattung (Strom, Kühlgeräte)\n- Werbemöglichkeiten im offiziellen Messekatalog und auf der Website',
    type: 'Information'
  },
  {
    id: 'default-10',
    title: 'Bewerbung: Mitarbeiter an der Hotelrezeption',
    situation: 'Das Grand Hotel "Vier Jahreszeiten" in München sucht für die Sommersaison eine Aushilfe (m/w/d) an der Rezeption und für die Gästebetreuung. Vorausgesetzt werden verhandlungssichere Deutsch- und Englischkenntnisse sowie ein freundliches Auftreten.',
    content: 'Schreiben Sie Ihr Bewerbungsschreiben. Gehen Sie auf folgende Punkte ein:\n- Grund für Ihre Bewerbung und Bezugnahme auf die Stellenanzeige\n- Ihre Sprachkenntnisse und Ausbildung\n- Bisherige Kundenservice- oder Gastronomieerfahrungen\n- Motivation, für dieses renommierte Hotel zu arbeiten\n- Ihre zeitliche Verfügbarkeit im Sommer',
    type: 'Bewerbung'
  },
  {
    id: 'default-11',
    title: 'Bewerbung: Duales Studium "Tourismusmanagement"',
    situation: 'Sie interessieren sich für ein dreijähriges duales Studium im Bereich Tourismusmanagement mit einem Mix aus Theoriezeiten an der Hochschule und Praxisphasen bei der "Rheinland Reise Gruppe GmbH". Diese vergibt für das nächste Studienjahr zwei begehrte Plätze.',
    content: 'Schreiben Sie Ihre Bewerbung für das Duale Studium an die Personalabteilung der "Rheinland Reise Gruppe". Behandeln Sie folgende Punkte:\n- Warum Sie sich für den Studiengang Tourismusmanagement entschieden haben\n- Ihre schulischen Leistungen und relevanten Sprachkenntnisse (Deutsch, Englisch)\n- Erste Erfahrungen im Tourismus- oder Servicebereich\n- Warum Sie die Rheinland Reise Gruppe als Praxispartner wählen\n- Ihre Erwartungen an das duale System',
    type: 'Bewerbung'
  },
  {
    id: 'default-12',
    title: 'Bewerbung: Aushilfe in einer Buchhandlung',
    situation: 'Die traditionsreiche Buchhandlung "Buch & Kaffee" in Frankfurt sucht ab sofort eine studentische Aushilfe (m/w/d) für die Wochenenden (Samstage) zur Betreuung der Kunden und zur Pflege der Buchbestände.',
    content: 'Schreiben Sie Ihre Bewerbung an den Inhaber Herrn Peters. Behandeln Sie folgende Punkte:\n- Warum Sie in einer Buchhandlung arbeiten möchten\n- Ihre persönliche Lese-Affinität und Lieblingsgenres\n- Ihre Erfahrungen im Umgang mit Kunden (Freundlichkeit, Service)\n- Ihre Zuverlässigkeit und zeitliche Flexibilität am Samstag\n- Ihr gewünschter Arbeitsbeginn',
    type: 'Bewerbung'
  },
  {
    id: 'default-13',
    title: 'Beschwerde: Wellness-Wochenende',
    situation: 'Sie haben zur Entspannung ein "Premium-Wellness-Wochenende" im Hotel "Alpenoase" gebucht. Laut Prospekt: beheizter Infinity-Pool, ruhige Lage, 5-Sterne-Zimmerservice und drei Massagen inklusive. Vor Ort: Der Pool war wegen Bauarbeiten gesperrt, lauter Lärm im Hotel ab 7 Uhr morgens, der Zimmerservice unvollständig und es gab nur eine Massage, weil das Personal unterbesetzt war.',
    content: 'Schreiben Sie eine Beschwerde an die Hotelleitung. Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens\n- Kritik an den Wellness-Anlagen (Pool-Schließung)\n- Lärmbelästigung und mangelnder Service\n- Nicht erbrachte gebuchte Leistungen (Massagen)\n- Forderung nach einer angemessenen Entschädigung',
    type: 'Beschwerde'
  },
  {
    id: 'default-14',
    title: 'Bitte um Infos: Weiterbildung Projektmanagement',
    situation: 'Sie sind berufstätig im Bereich Logistik und möchten eine zertifizierte berufsbegleitende Weiterbildung im Bereich "Agiles Projektmanagement" absolvieren. Sie haben ein Angebot der Akademie "EduFuture" online gefunden.',
    content: 'Schreiben Sie eine E-Mail an das Sekretariat der Akademie "EduFuture". Klären Sie folgende Punkte:\n- Genaue Termine und Uhrzeiten (Abend- oder Wochenendkurse)\n- Anerkennung des Zertifikats (z.B. PMI oder Scrum Alliance)\n- Kosten und Förderungsmöglichkeiten (z.B. Bildungsgutschein)\n- Voraussetzungen für die Teilnahme an der Abschlussprüfung',
    type: 'Information'
  },
  {
    id: 'default-15',
    title: 'Bewerbung: Aushilfe im Fitnessstudio',
    situation: 'Das Fitnessstudio "Fit&Fun" in Ihrer Stadt sucht eine studentische Aushilfe (m/w/d) für die Anmeldung, die Getränkebar und die gelegentliche Betreuung der Trainingsfläche am Wochenende.',
    content: 'Schreiben Sie Ihre Bewerbung an den Studioleiter Herrn Müller. Behandeln Sie folgende Punkte:\n- Bezugnahme auf die Ausschreibung und Grund der Bewerbung\n- Ihre persönliche Sportbegeisterung und Fitnesskenntnisse\n- Erfahrungen im Umgang mit Kunden und Servicebereitschaft\n- Ihre zeitliche Verfügbarkeit am Wochenende\n- Ihr gewünschter Arbeitsbeginn',
    type: 'Bewerbung'
  },
  {
    id: 'default-16',
    title: 'Beschwerde: Online-Möbelbestellung',
    situation: 'Sie haben beim Online-Möbelhaus "WoodStyle" ein hochwertiges Ecksofa aus Echtleder bestellt. Die Lieferzeit sollte maximal 10 Werktage betragen. Das Sofa kam erst nach 6 Wochen an. Zudem hat es die falsche Farbe (Dunkelblau statt Cognac-Braun) und an der Rückseite befindet sich ein auffälliger Riss im Leder.',
    content: 'Schreiben Sie eine Beschwerde an den Kundenservice von "WoodStyle". Behandeln Sie folgende Punkte:\n- Grund und Bestelldaten des Schreibens\n- Kritik an der extremen Lieferverzögerung\n- Beschreibung der Mängel (Farbe, Lederriss)\n- Forderung auf Umtausch oder einen erheblichen Preisnachlass\n- Frist für die Rückmeldung',
    type: 'Beschwerde'
  },
  {
    id: 'default-17',
    title: 'Bitte um Infos: Veganes Catering für Firmenfeier',
    situation: 'Sie organisieren das jährliche Sommerfest für Ihr Unternehmen mit ca. 80 Mitarbeitern. Die Geschäftsleitung wünscht dieses Jahr ein vollständig veganes und nachhaltiges Speisenangebot. Sie interessieren sich für die Dienste von "Green Catering Hamburg".',
    content: 'Schreiben Sie eine Anfrage-E-Mail an das Catering-Team. Klären Sie folgende Punkte:\n- Vorschläge für ein veganes Buffet (Vorspeisen, Hauptspeisen, Desserts)\n- Berücksichtigung von weiteren Unverträglichkeiten (z.B. glutenfrei)\n- Bereitstellung von Geschirr, Besteck und Servicepersonal vor Ort\n- Preiskalkulation pro Person und Lieferbedingungen',
    type: 'Information'
  },
  {
    id: 'default-18',
    title: 'Bewerbung: Hundesitter in München',
    situation: 'Die Agentur "Paws & Friends" vermittelt qualifizierte und liebevolle Tierbetreuer an Hundebesitzer in München, die tagsüber arbeiten. Gesucht werden tierbegeisterte Menschen für Spaziergänge und Tagesbetreuung.',
    content: 'Schreiben Sie Ihre Bewerbung für die Aufnahme in die Betreuerkartei. Behandeln Sie folgende Punkte:\n- Motivation für die Arbeit als Hundesitter\n- Bisherige eigene Erfahrungen im Umgang mit Hunden (Rassen, Verhalten)\n- Zuverlässigkeit und Verhalten in stressigen oder unvorhergesehenen Situationen\n- Raumverhältnisse (Wohnung, Nähe zu Parks)\n- Ihre zeitliche Verfügbarkeit unter der Woche',
    type: 'Bewerbung'
  },
  {
    id: 'default-19',
    title: 'Beschwerde: Premium-Essenslieferdienst',
    situation: 'Sie haben für einen Jahrestag ein festliches Drei-Gänge-Menü für vier Personen beim Premium-Lieferdienst "GourmetExpress" bestellt. Gegen Aufpreis wurde eine minutengenaue Lieferung garantiert. Das Essen kam 90 Minuten zu spät, die Suppe war kalt und ausgelaufen, das Hauptgericht vertauscht (vegetarisch statt Rinderfilet) und das Dessert fehlte ganz.',
    content: 'Schreiben Sie eine Beschwerde an die Geschäftsführung von "GourmetExpress". Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens und Bestelldetails\n- Massive Lieferverzögerung trotz kostenpflichtiger Garantie\n- Kritik an Verpackung, Temperatur und fehlerhafter Lieferung\n- Enttäuschung über den misslungenen festlichen Abend\n- Forderung nach vollständiger Erstattung des Preises',
    type: 'Beschwerde'
  },
  {
    id: 'default-20',
    title: 'Bitte um Infos: Sommercamp für Kinder',
    situation: 'Sie möchten Ihren 10-jährigen Sohn für ein zweiwöchiges "Natur- und Abenteuercamp" in Thüringen anmelden, welches vom Verein "WildnisKids e.V." veranstaltet wird. Es bleiben jedoch wesentliche organisatorische Fragen offen.',
    content: 'Schreiben Sie eine E-Mail an den Veranstalter "WildnisKids e.V.". Bitten Sie um Auskunft zu:\n- Betreuerschlüssel (Verhältnis Betreuer zu Kindern) und Qualifikationen\n- Tagesablauf, Aktivitäten und Sicherheitsvorkehrungen bei schlechtem Wetter\n- Unterkunft (Zelte oder feste Häuser) und Verpflegung (Allergene, vegetarisch)\n- Rücktrittsbedingungen bei plötzlicher Erkrankung des Kindes',
    type: 'Information'
  },
  {
    id: 'default-21',
    title: 'Bewerbung: Social Media Assistant',
    situation: 'Das zukunftsorientierte Mode-Startup "StyleInspo" aus Berlin sucht einen Social Media Assistant (m/w/d) auf Minijob-Basis (10-15 Stunden/Woche). Aufgaben umfassen die Erstellung von Inhalten für Instagram, TikTok und das Beantworten von Community-Fragen.',
    content: 'Schreiben Sie Ihre Bewerbung an die Marketingleitung. Gehen Sie auf folgende Punkte ein:\n- Ihre Begeisterung für Mode und Social-Media-Plattformen\n- Erfahrungen im Bereich Content Creation (Fotos, Videos, Reels, Canva etc.)\n- Ihre Kommunikationsstärke und Deutschkenntnisse im Umgang mit Followern\n- Warum Sie speziell für das Startup "StyleInspo" arbeiten möchten\n- Ihre wöchentliche Verfügbarkeit und technisches Equipment',
    type: 'Bewerbung'
  },
  {
    id: 'default-22',
    title: 'Beschwerde: Konzertreise nach Hamburg',
    situation: 'Sie haben beim Reisebüro "KulturReisen" ein Paket gebucht, bestehend aus einer Hotelübernachtung in Hamburg und erstklassigen Eintrittskarten für ein Konzert in der Elbphilharmonie. Die Eintrittskarten wurden Ihnen trotz Zusage nicht ins Hotel geliefert, weshalb Sie das Konzert verpassten. Zudem war das Hotelzimmer schmutzig und laut.',
    content: 'Schreiben Sie eine Beschwerde an das Reisebüro "KulturReisen". Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens und Buchungsnummer\n- Nichtzustellung der Konzertkarten und das verpasste Event\n- Mängel des Hotelzimmers (Lärm, Hygiene)\n- Enttäuschung über den zerstörten Wochenendausflug\n- Forderung auf vollständige Erstattung des Reisepreises und Schadensersatz',
    type: 'Beschwerde'
  },
  {
    id: 'default-23',
    title: 'Bitte um Infos: Coworking Space Mitgliedschaft',
    situation: 'Sie arbeiten als freiberuflicher Softwareentwickler im Homeoffice und möchten ein professionelles Arbeitsumfeld nutzen. Sie interessieren sich für ein monatliches Abonnement im Coworking Center "Nexus Office" in Frankfurt.',
    content: 'Schreiben Sie eine E-Mail an die Centerleitung. Erkundigen Sie sich nach folgenden Punkten:\n- Unterschied zwischen "Flex Desk" (freier Tischwechsel) und "Dedicated Desk" (fester Arbeitsplatz)\n- Technische Infrastruktur (Internet-Geschwindigkeit, Druckernutzung, Kaffeeküche)\n- Zugangsmöglichkeiten am Wochenende und zu späten Abendstunden (Keycard)\n- Buchbarkeit von Meetingräumen für Kundentermine und Preisvorteile für Mitglieder',
    type: 'Information'
  },
  {
    id: 'default-24',
    title: 'Bewerbung: Kellner im italienischen Restaurant',
    situation: 'Das Restaurant "Bella Italia" in Köln sucht für die abendlichen Stoßzeiten und das Wochenende eine engagierte Servicekraft (m/w/d). Erfahrungen im Service sind gewünscht, aber keine zwingende Voraussetzung.',
    content: 'Schreiben Sie Ihre aussagekräftige Bewerbung an den Geschäftsführer Herrn Rossi. Behandeln Sie folgende Punkte:\n- Ihr Bezug zur Gastronomie und Grund der Bewerbung\n- Ihre Stärken im Servicebereich (Freundlichkeit, Stressresistenz, Teamfähigkeit)\n- Bisherige Tätigkeiten im Kundenkontakt oder in der Gastronomie\n- Ihre Sprachkenntnisse (Deutsch, Englisch, eventuell Italienisch)\n- Ihre zeitliche Flexibilität am Abend und am Wochenende',
    type: 'Bewerbung'
  },
  {
    id: 'default-25',
    title: 'Beschwerde: Fitnessstudio "VitalLife"',
    situation: 'Sie haben einen Jahresvertrag im Studio "VitalLife" unter der Bedingung abgeschlossen, dass Ihnen der Zutritt zum Saunabereich und die Teilnahme an Fitnesskursen jederzeit kostenlos zustehen. Seit drei Monaten ist die Sauna defekt. Außerdem wurden fast alle Pilates- und Yogakurse ohne Ersatz gestrichen. Trotzdem bucht das Studio den vollen Monatsbeitrag ab.',
    content: 'Schreiben Sie eine Beschwerde an den Kundenservice von "VitalLife". Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens und Mitgliedsnummer\n- Dauerhafter Ausfall des Saunabereichs und mangelnde Reparatur\n- Streichung der vertraglich vereinbarten Kurse\n- Forderung einer angemessenen Beitragsminderung für die Ausfallzeit\n- Fristsetzung zur Lösung oder Androhung einer außerordentlichen Kündigung',
    type: 'Beschwerde'
  },
  {
    id: 'default-26',
    title: 'Bitte um Infos: Deutschprüfungen für Mediziner',
    situation: 'Sie haben ein abgeschlossenes Medizinstudium im Ausland absolviert und möchten bald als Assistenzarzt in Deutschland arbeiten. Zur Beantragung der Approbation benötigen Sie die Fachsprachenprüfung (FSP). Sie interessieren sich für die Vorbereitungskurse des Anbieters "Med-Deutsch Akademie".',
    content: 'Schreiben Sie eine Anfrage-E-Mail an die Kursleitung der "Med-Deutsch Akademie". Fragen Sie nach:\n- Dauer, Startterminen und Preisen des speziellen FSP-Zertifikatskurses\n- Lerninhalten (Patientengespräche, Arztbriefe, medizinische Dokumentation)\n- Qualifikationen der Dozenten (Mediziner oder zertifizierte Sprachlehrer)\n- Möglichkeit eines Online- oder Hybridkurses und Bestehensquote der Teilnehmer',
    type: 'Information'
  },
  {
    id: 'default-27',
    title: 'Bewerbung: Mitarbeiter im Kundendienst',
    situation: 'Das E-Commerce-Unternehmen "EcoCart" vertreibt ökologische Haushaltswaren und sucht ab sofort Mitarbeiter (m/w/d) im Kundenservice für die schriftliche und telefonische Kundenbetreuung, vollständig im Homeoffice (Remote).',
    content: 'Schreiben Sie Ihre Bewerbung an die Personalabteilung von "EcoCart". Gehen Sie auf folgende Punkte ein:\n- Grund der Bewerbung und Ihre Identifikation mit ökologischen Produkten\n- Ihre Stärken in der schriftlichen und mündlichen Kommunikation (Freundlichkeit, Geduld)\n- Ihre Erfahrungen mit PC-Arbeit, Kundensystemen oder Office-Paketen\n- Ihr eingerichteter, ungestörter Heimarbeitsplatz mit stabiler Internetverbindung\n- Ihre Gehaltsvorstellung (Stundenlohn) und gewünschte Wochenarbeitszeit',
    type: 'Bewerbung'
  },
  {
    id: 'default-28',
    title: 'Beschwerde: Hotelaufenthalt "Seeblick"',
    situation: 'Sie haben für einen Erholungsurlaub ein Doppelzimmer mit Seeblick im Hotel "Seeblick" reserviert. Bei Ihrer Ankunft teilte man Ihnen mit, dass das Hotel überbucht sei. Sie mussten in ein kleineres Zimmer im Souterrain direkt neben der lauten Heizungsanlage umziehen. Der versprochene Seeblick fehlte, und das Frühstücksbuffet war ungenießbar.',
    content: 'Schreiben Sie eine Beschwerde an die Hoteldirektion. Behandeln Sie folgende Punkte:\n- Grund Ihres Schreibens und Buchungszeitraum\n- Kritik an der Überbuchung und der minderwertigen Ersatzunterkunft\n- Lärmbelästigung durch die Heizung und fehlende Erholung\n- Mangelnde Qualität der Verpflegung (Frühstück)\n- Forderung auf Rückerstattung der Preisdifferenz und angemessene Entschädigung',
    type: 'Beschwerde'
  },
  {
    id: 'default-29',
    title: 'Bitte um Infos: Kletterpark Teambuilding',
    situation: 'Sie sind Abteilungsleiter in einer IT-Firma mit 25 Mitarbeitern. Zur Stärkung des Teamgeists planen Sie einen Betriebsausflug in den "Abenteuer-Kletterwald Taunus". Sie möchten ein maßgeschneidertes Teambuilding-Programm buchen.',
    content: 'Schreiben Sie eine Anfrage an das Event-Team des Kletterwalds. Klären Sie folgende Punkte:\n- Spezielle Gruppen- und Teambuilding-Aktivitäten mit Trainerbegleitung\n- Sicherheitskonzept, notwendige Kleidung und Einweisung für Anfänger\n- Catering-Optionen (Grillplatz mieten, Catering-Service oder Restaurant vor Ort)\n- Gruppenrabatte und Stornierungsbedingungen bei starkem Regen',
    type: 'Information'
  },
  {
    id: 'default-30',
    title: 'Bewerbung: Event-Aushilfe auf Musikmesse',
    situation: 'Für die internationale Musikmesse "Musicon" in Frankfurt sucht der Veranstalter "MesseFrankfurt GmbH" kurzfristig zweisprachige Event-Aushilfen (m/w/d) für die Besucherregistrierung, Wegeleitung und Informationsstände.',
    content: 'Schreiben Sie Ihre Bewerbung für diesen Messejob. Behandeln Sie folgende Punkte:\n- Bezug auf die Stellenausschreibung und Motivation für die Mitarbeit auf der Musikmesse\n- Ihre Sprachkenntnisse (Deutsch, Englisch fließend, weitere Sprachen)\n- Ihre Kontaktfreudigkeit, Belastbarkeit bei hohem Besucheraufkommen und gepflegtes Auftreten\n- Erfahrungen aus früheren Messen, Promotionjobs oder dem Kundenservice\n- Bestätigung Ihrer uneingeschränkten Zugänglichkeit an allen vier Messetagen',
    type: 'Bewerbung'
  },
  {
    id: 'default-31',
    title: 'Beschwerde: Streamingdienst Abo-Abrechnung',
    situation: 'Sie nutzen seit einem Jahr den Streamingdienst "MoviePlus". Vor kurzem wurde ohne Ihre Zustimmung der Paketpreis um 50 % erhöht. Zudem wurde Ihnen trotz fristgerechter Kündigung des Premium-Zusatzpakets der Betrag für drei weitere Monate abgebucht. Der telefonische Support hat Ihr Anliegen ignoriert.',
    content: 'Schreiben Sie eine formelle Beschwerde an den Kundenservice von "MoviePlus". Behandeln Sie folgende Punkte:\n- Grund des Schreibens, Kundennummer und Vertragsdaten\n- Kritik an der unangekündigten Preiserhöhung\n- Rechtswidrige Abbuchung trotz nachweisbar fristgerechter Kündigung\n- Enttäuschung über die Servicequalität und Untätigkeit des telefonischen Supports\n- Forderung zur sofortigen Rücküberweisung des fälschlicherweise eingezogenen Geldes',
    type: 'Beschwerde'
  },
  {
    id: 'default-32',
    title: 'Bitte um Infos: Auslandssemester in Heidelberg',
    situation: 'Sie studieren Germanistik in Ihrem Heimatland und möchten im nächsten Frühjahr ein einsemestriges Erasmus-Auslandsstudium an der Universität Heidelberg absolvieren. Viele administrative Schritte sind noch unklar.',
    content: 'Schreiben Sie eine E-Mail an das Akademische Auslandsamt (AAA) der Universität Heidelberg. Fragen Sie nach:\n- Fristen für die Einreichung der Zulassungsunterlagen und Anerkennung von bisherigen Noten\n- Unterstützung bei der Vermittlung eines Zimmers in einem staatlichen Studentenwohnheim\n- Angebot von fachbegleitenden Deutschkursen für ausländische Studenten vor Semesterbeginn\n- Orientierungsangebote (Buddy-Programm, Einführungsveranstaltungen)',
    type: 'Information'
  },
  {
    id: 'default-33',
    title: 'Bewerbung: Werkstudent im IT-Support',
    situation: 'Das Software-Unternehmen "NetSolutions" in Stuttgart sucht einen Werkstudenten (m/w/d) für den hausinternen IT-Support und die Pflege der Netzwerksicherheit (16-20 Std./Woche).',
    content: 'Schreiben Sie ein aussagekräftiges Bewerbungsschreiben. Gehen Sie auf folgende Punkte ein:\n- Bezugnahme auf das Stellenangebot und Grund Ihrer Bewerbung\n- Ihr Studiengang (Informatik, Wirtschaftsinformatik o.Ä.) und aktuelles Semester\n- Praktische Kenntnisse in Betriebssystemen, Netzwerken, Hardware-Fehleranalyse\n- Ihre Arbeitsweise (selbstständig, zielstrebig, teamorientiert)\n- Ihre zeitliche Verfügbarkeit unter der Woche (Abstimmung mit Vorlesungszeiten)',
    type: 'Bewerbung'
  },
  {
    id: 'default-34',
    title: 'Beschwerde: Erlebnis-Gutschein "Ballonfahrt"',
    situation: 'Sie bekamen von Freunden einen Erlebnis-Gutschein für eine "Exklusive Ballonfahrt bei Sonnenaufgang über dem Bodensee mit Champagner-Picknick" von der Agentur "SkyAdventures". Der Termin wurde viermal wegen Kleinigkeiten abgesagt. Als die Fahrt stattfand, war es mittags, es ging über ein unschönes Industriegebiet, es gab 12 statt 2 Mitflieger und statt Champagner gab es Apfelschorle.',
    content: 'Schreiben Sie eine Beschwerde an die Zentrale von "SkyAdventures". Behandeln Sie folgende Punkte:\n- Grund des Schreibens und Gutschein-Nummer\n- Ärger über die extrem komplizierte und unkooperative Terminfindung\n- Abweichung der Realität vom Gutscheintext (Tageszeit, Route, Teilnehmerzahl)\n- Enttäuschung über das lieblose Picknick ohne versprochenen Champagner\n- Forderung auf teilweise Rückerstattung des Gutscheinwertes in bar',
    type: 'Beschwerde'
  },
  {
    id: 'default-35',
    title: 'Bitte um Infos: Franchise-Konzept Eröffnung',
    situation: 'Sie planen die Eröffnung eines eigenen, gesunden Bistros und interessieren sich sehr für das erfolgreiche vegane Franchise-Konzept von "BioSalad Organics". Sie verfügen über etwas Startkapital und gastronomische Erfahrung.',
    content: 'Schreiben Sie eine E-Mail an die Franchise-Zentrale der "BioSalad Organics GmbH". Klären Sie folgende Punkte:\n- Voraussetzungen (Eigenkapital, berufliche Qualifikationen, Standortbedingungen)\n- Struktur der Franchise-Gebühren (Einstiegsgebühr, monatliche Umsatzbeteiligung)\n- Unterstützung beim Marketing, Ladendesign, der Lieferkette und Mitarbeiterschulung\n- Zusendung von ausführlichem Informationsmaterial und Ablauf einer Bewerbung als Partner',
    type: 'Information'
  },
  {
    id: 'default-36',
    title: 'Bewerbung: Stadtführer in Berlin',
    situation: 'Die Tourismus-Agentur "BerlinExplorer" sucht für Stadtrundgänge sowie geführte Fahrradtouren durch Berlin-Mitte und Kreuzberg enthusiastische, offene und ortskundige Stadtführer (m/w/d) für die Wochenenden.',
    content: 'Schreiben Sie Ihre Bewerbung als Stadtführer an den Personalverantwortlichen. Behandeln Sie folgende Punkte:\n- Warum Sie Stadtführer in Berlin werden möchten und Ihre Verbindung zur Stadt\n- Ihre Ortskenntnisse in Berlin (Geschichte, Kultur, Geheimtipps)\n- Ihre Fremdsprachenkenntnisse (Deutsch verhandlungssicher, weitere Sprachen von Vorteil)\n- Erfahrungen im Vortragen vor größeren Gruppen (Präsentationen, offene Art)\n- Ihre zeitliche Verfügbarkeit am Wochenende und sportliche Fitness (Fahrradtouren)',
    type: 'Bewerbung'
  },
  {
    id: 'default-37',
    title: 'Beschwerde: Online-Fotobuch Druckfehler',
    situation: 'Sie haben über das Portal "PixPrint" ein hochwertiges, teures Hardcover-Fotobuch mit 100 Seiten als Geschenk für die Goldene Hochzeit Ihrer Großeltern bestellt. Bei der Lieferung stellten Sie fest: Der Bucheinband ist schief aufgeklebt, die Farben sind extrem dunkel und verwaschen, und auf 5 Seiten fehlt der gedruckte Text komplett, obwohl er im Vorschau-Editor korrekt angezeigt wurde.',
    content: 'Schreiben Sie eine Beschwerde an die Reklamationsabteilung von "PixPrint". Behandeln Sie folgende Punkte:\n- Grund des Schreibens, Kundennummer und Bestell-ID\n- Beschreibung der gravierenden Fehldrucke und Qualitätsmängel (Farbe, Einband)\n- Nicht-Abdruck der Texte als schwerer Mangel\n- Verlust des geplanten Geschenks und zeitlicher Druck wegen des Hochzeitstags\n- Forderung auf kostenlosen Neudruck innerhalb von 5 Tagen oder Erstattung der Kosten mit Entschädigung',
    type: 'Beschwerde'
  },
  {
    id: 'default-38',
    title: 'Bitte um Infos: Mitgliedschaft im Tennisclub',
    situation: 'Sie sind vor Kurzem in eine neue Stadt gezogen und möchten einem lokalen Tennisclub beitreten, um aktiv Sport zu treiben und Kontakte zu knüpfen. Sie sind am "Tennis-Club Rot-Weiß" interessiert.',
    content: 'Schreiben Sie eine E-Mail an den Vorstand des Tennis-Clubs. Erkundigen Sie sich nach:\n- Aufnahmegebühr und monatlichem/jährlichem Mitgliedsbeitrag (Ermäßigung für Studenten/Familien)\n- Ausstattung des Clubs (Anzahl der Außen- und Hallenplätze, Buchungssystem für Spielfelder)\n- Trainingsmöglichkeiten für Erwachsene (Gruppentraining mit professionellem Trainer, Spielstärkeneinstufung)\n- Clubleben, Turnieren für Freizeitsportler und Kennenlern-Treffs für neue Mitglieder',
    type: 'Information'
  },
  {
    id: 'default-39',
    title: 'Bewerbung: Rezeptionist in Jugendherberge',
    situation: 'Die Jugendherberge "CityHostel Dresden" sucht ab der kommenden Frühjahrssaison einen Rezeptionisten (m/w/d) in Teilzeit (20 Stunden/Woke) zur Betreuung internationaler Backpacker, Check-in/Check-out und Organisation kleiner Events.',
    content: 'Schreiben Sie Ihre Bewerbung für das CityHostel. Behandeln Sie folgende Punkte:\n- Ihre Motivation, in einem lebhaften, internationalen Hostel zu arbeiten\n- Erste Erfahrungen im Beherbergungsgewerbe oder im engen Kundenkontakt\n- Ausgeprägte Sprachkenntnisse (Deutsch verhandlungssicher, Englisch fließend, weitere Sprachen)\n- Ihre Computerkenntnisse (E-Mail, Buchungssoftware, Social Media)\n- Flexibilität bei Schichtarbeit (Früh-, Spät- und gelegentliche Wochenendschichten)',
    type: 'Bewerbung'
  }
];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('dia_exercises');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        const combined = [...parsed];

        return combined;
      }
    }
    return [];
  });

  const [progress, setProgress] = useState<Record<string, SavedProgress>>(() => {
    const saved = localStorage.getItem('dia_progress');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [submissions, setSubmissions] = useState<any[]>([]);

  
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Email login/signup states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailRole, setEmailRole] = useState<'student' | 'admin'>('student');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [adminCode, setAdminCode] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (isSignUp && !fullName) {
      alert("Veuillez saisir votre nom complet.");
      return;
    }
    if (isSignUp && emailRole === 'admin' && adminCode.trim().toUpperCase() !== 'B2ADMIN') {
      alert("Le code d'accès enseignant est incorrect. Veuillez utiliser le bon code pour créer un compte Prof (Ex: B2ADMIN).");
      return;
    }

    setAuthLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, fullName, emailRole);
      } else {
        await loginWithEmail(email, password);
      }
      // Reset form on success
      setEmail('');
      setPassword('');
      setFullName('');
      setAdminCode('');
      setShowEmailForm(false);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Sync Exercises from Firestore
  useEffect(() => {
    const q = query(collection(db, 'exercises'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const firestoreExercises: Exercise[] = [];
      snap.forEach(doc => {
        firestoreExercises.push(doc.data() as Exercise);
      });
      
      setExercises(prev => {
        const combined = [...firestoreExercises];

        localStorage.setItem('dia_exercises', JSON.stringify(combined));
        return combined;
      });
    }, (error) => {
      console.error("Error fetching exercises:", error);
    });

    return () => unsubscribe();
  }, []);

  // Sync Auth & Profile
  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setTimeout(() => setIsLoadingAuth(false), 3000);
      
      // Cleanup previous profile listener
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (u) {
        const subsQ = query(collection(db, 'submissions'), where('studentId', '==', u.uid), orderBy('createdAt', 'desc'));
        const unsubscribeSubs = onSnapshot(subsQ, (snap) => {
          const list: any[] = [];
          snap.forEach(d => list.push(d.data()));
          setSubmissions(list);
        });
        
        const profileRef = doc(db, 'users', u.uid);
        unsubscribeProfile = onSnapshot(profileRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (u.email === 'yombivictor@gmail.com' && data.role !== 'super_admin') {
              updateDoc(profileRef, { role: 'super_admin' }).catch(console.error);
              data.role = 'super_admin';
            }
            setUserProfile(data);
          } else {
            console.log("No profile found in Firestore for uid:", u.uid, ". Using local auth data as fallback...");
            const fallbackProfile = {
              uid: u.uid,
              email: u.email || '',
              displayName: u.displayName || u.email?.split('@')[0] || 'Utilisateur',
              photoURL: u.photoURL || null,
              role: u.email === 'yombivictor@gmail.com' ? 'super_admin' : 'student' as const,
              createdAt: new Date()
            };
            setUserProfile(fallbackProfile);
          }
          setIsLoadingAuth(false);
        }, (err) => {
          console.error("Profile sync error:", err);
          setIsLoadingAuth(false);
          handleFirestoreError(err, OperationType.GET, `users/${u.uid}`);
        });
      } else {
        setUserProfile(null);
        setIsLoadingAuth(false);
      }
    });
    
    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExercisesModalOpen, setIsExercisesModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const selectedExercise = useMemo(() => exercises.find(e => e.id === selectedId), [exercises, selectedId]);
  const currentProgress = selectedId ? progress[selectedId] : null;

  
  if (isLoadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-4 border-[#FF0000] border-t-transparent animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium animate-pulse">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }


  const selectExercise = (id: string | null, upload: boolean = false) => {
    setSelectedId(id);
    setIsUploading(upload);
    setIsMenuOpen(false);
  };

  const handleUpload = async (fileData: string, mimeType: string) => {
    if (!userProfile) return;
    setIsExtracting(true);
    try {
      const extracted = await extractExercises(fileData, mimeType);
      const newExercises = [];
      for (const ex of extracted) {
        const newEx = {
          ...ex,
          id: `uploaded-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date().toISOString()
        };
        newExercises.push(newEx);
        if (isOnline) {
          // Strictly map to 6 properties to ensure firestore rules validate
          const firestorePayload = {
            id: newEx.id,
            title: newEx.title || 'Sans titre',
            situation: newEx.situation || '',
            content: newEx.content || '',
            type: newEx.type || 'Inconnu',
            createdAt: newEx.createdAt
          };
          console.log("Saving to Firestore:", firestorePayload);
          await setDoc(doc(db, "exercises", newEx.id), firestorePayload);
        }
      }
      
      const updated = [...exercises, ...newExercises];
      setExercises(updated);
      localStorage.setItem('dia_exercises', JSON.stringify(updated));
      setIsUploading(false);
      if (newExercises.length > 0) {
        selectExercise(newExercises[0].id);
      }
      alert(`${newExercises.length} sujet(s) extrait(s) avec succès.`);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'extraction: " + (error instanceof Error ? error.message : "Erreur inconnue"));
    } finally {
      setIsExtracting(false);
    }
  };

  const onTextChange = (text: string) => {
    if (!selectedId || !user) return;
    const newProgress = { ...progress, [selectedId]: { ...progress[selectedId], text } };
    setProgress(newProgress);
    localStorage.setItem('dia_progress', JSON.stringify(newProgress));
    
    if (isOnline) {
      setDoc(doc(db, 'users', user.uid, 'progress', selectedId), { text, updatedAt: serverTimestamp() }, { merge: true })
        .catch(err => handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}/progress/${selectedId}`));
    }
  };

  const onEvaluate = async () => {
    if (!selectedExercise || !currentProgress?.text || !user || !userProfile) return;
    if (!isOnline) {
      alert("Connexion internet requise pour l'évaluation.");
      return;
    }
    
    setIsEvaluating(true);
    try {
      const result = await evaluateWriting(selectedExercise, currentProgress.text);
      const newProgress = { ...progress, [selectedId!]: { ...currentProgress, evaluation: result } };
      setProgress(newProgress);
      localStorage.setItem('dia_progress', JSON.stringify(newProgress));

      const submission = {
        studentId: user.uid,
        studentName: userProfile.displayName || user.email,
        exerciseId: selectedExercise.id,
        exerciseTitle: selectedExercise.title,
        text: currentProgress.text,
        evaluation: result,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(collection(db, 'submissions')), submission);
      
      await setDoc(doc(db, 'users', user.uid, 'progress', selectedId!), 
        { evaluation: result, updatedAt: serverTimestamp() }, 
        { merge: true }
      );
      
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erreur lors de l'évaluation.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const sortedExercises = exercises.sort((a, b) => a.title.localeCompare(b.title));
  const filteredExercises = sortedExercises.filter(ex => 
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans overflow-hidden">
      {/* Global Header */}
      <header className="h-16 shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF0000] flex items-center justify-center text-white font-black text-lg shadow-md">
            T
          </div>
          <h1 className="font-bold text-lg hidden sm:block tracking-tight">Telc Deutsch B2</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {!import.meta.env.VITE_GEMINI_API_KEY ? (
             <div className="hidden sm:flex px-2 py-1 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-[10px] text-red-700 dark:text-red-400 items-center gap-1 font-bold">
               <WifiOff className="w-3 h-3" /> Clé API manquante
             </div>
          ) : (
             <div className="hidden sm:flex px-2 py-1 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded text-[10px] text-green-600 dark:text-green-400 items-center gap-1 font-bold">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> IA Connectée
             </div>
          )}



          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold">{user?.displayName || 'Utilisateur'}</span>
              <span className="text-[9px] text-gray-500">{userProfile?.role === 'super_admin' ? 'Super Admin' : userProfile?.role === 'admin' ? 'Admin' : 'Étudiant'}</span>
            </div>
            
            <button 
              onClick={logout}
              className="p-1.5 sm:p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 overflow-y-auto bg-gray-50 dark:bg-gray-950 relative">
        <div className="h-full">
          {userProfile?.role === 'super_admin' && !isUploading && !selectedExercise ? (
            <SuperAdminDashboardView 
              exercises={exercises} 
              onUpload={handleUpload}
              isExtracting={isExtracting}
              isOnline={isOnline}
              deleteExercise={async (id) => {
                await deleteDoc(doc(db, "exercises", id));
              }}
            />
          ) : userProfile?.role === 'admin' && !isUploading && !selectedExercise ? (
            <AdminDashboardView />
          ) : isUploading ? (
            <div className="h-full flex items-center justify-center">
              <UploadSection onUpload={handleUpload} isExtracting={isExtracting} isOnline={isOnline} />
            </div>
          ) : selectedExercise ? (
            <TrainingInterface
              key={selectedExercise.id}
              exercise={selectedExercise}
              initialText={currentProgress?.text || ''}
              evaluation={currentProgress?.evaluation || null}
              onTextChange={onTextChange}
              onEvaluate={onEvaluate}
              isEvaluating={isEvaluating}
              onExit={() => selectExercise(null, false)}
              isOnline={isOnline}
              
              
              isTimerRunning={isTimerRunning}
              setIsTimerRunning={setIsTimerRunning}
              teachers={teachers}
              user={user}
              lastTeacherId={userProfile?.lastTeacherId}
            />
          ) : (
            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#FF0000]" />
                    Sujets d'entraînement ({exercises.length})
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Sélectionnez un sujet pour commencer l'épreuve de rédaction.</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:flex-initial sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Rechercher un sujet..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                    />
                  </div>
                  <button 
                    onClick={() => selectExercise(null, true)}
                    className="p-2 sm:px-4 sm:py-2 bg-[#FF0000] hover:bg-red-650 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Nouveau sujet</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredExercises.map((ex) => (
                  <div 
                    key={ex.id}
                    onClick={() => selectExercise(ex.id)}
                    className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-5 hover:border-[#FF0000] hover:shadow-md transition-all cursor-pointer flex flex-col h-[180px]"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-md capitalize">
                        {ex.type}
                      </span>
                      {progress[ex.id]?.evaluation && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                          <CheckCircle className="w-3 h-3" /> Terminé
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-[#FF0000] transition-colors mb-2">
                      {ex.title}
                    </h3>
                    
                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                      <span>B2 Telc Niveau</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#FF0000]" />
                    </div>
                  </div>
                ))}
                
                {filteredExercises.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-white/50 dark:bg-gray-900/50">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun sujet trouvé.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Exercises Modal Overlay */}
      {isExercisesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-full flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#FF0000]" /> 
                Sélectionner une épreuve
              </h2>
              <button 
                onClick={() => setIsExercisesModalOpen(false)}
                className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-950">
              {/* Toolbar in Modal */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
                <div className="relative w-full sm:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un sujet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setIsExercisesModalOpen(false);
                      selectExercise(null, true);
                    }}
                    disabled={!isOnline || (userProfile?.role !== 'super_admin' && userProfile?.role !== 'admin')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-white rounded-xl transition-colors font-medium text-sm shadow-sm ${(userProfile?.role === 'super_admin' || userProfile?.role === 'admin') ? 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600' : 'hidden'}`}
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                  
                  {/* Admin actions inside modal */}
                  {userProfile?.role === 'super_admin' && (
                    <button 
                      onClick={() => {
                        setIsExercisesModalOpen(false);
                        setIsUploading(false);
                        selectExercise(null);
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl transition-colors font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" /> Dashboard
                    </button>
                  )}
                  {userProfile?.role === 'admin' && (
                    <button 
                      onClick={() => {
                        setIsExercisesModalOpen(false);
                        setIsUploading(false);
                        selectExercise(null);
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl transition-colors font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" /> Dashboard Prof
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of exercises */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map(ex => {
                  const prog = progress[ex.id];
                  const isDone = !!prog?.evaluation;
                  const hasStarted = !!prog?.text;
                  const isSelected = selectedId === ex.id && !isUploading;
                  
                  return (
                    <div
                      key={ex.id}
                      onClick={() => {
                        selectExercise(ex.id);
                        setIsExercisesModalOpen(false);
                      }}
                      className={`group cursor-pointer relative bg-white dark:bg-gray-900 border rounded-2xl p-5 transition-all duration-200 hover:shadow-md ${isSelected ? 'border-[#FF0000] ring-1 ring-[#FF0000]' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">
                          {ex.title}
                        </h3>
                        <div className="shrink-0 flex items-center">
                          {isDone ? (
                            <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                          ) : hasStarted ? (
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-full">
                              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                          ) : null}
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 inline-block" />
                        {ex.type}
                      </p>
                      
                      <div className="mt-auto">
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${isDone ? 'w-full bg-green-500' : hasStarted ? 'w-1/2 bg-orange-500' : 'w-0'}`}
                          />
                        </div>
                      </div>

                      {(userProfile?.role === 'admin' || userProfile?.role === 'super_admin') && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Supprimer cet exercice pour tout le monde ?")) {
                              deleteDoc(doc(db, "exercises", ex.id));
                            }
                          }}
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 bg-white dark:bg-gray-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all"
                          title="Supprimer l'exercice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredExercises.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-lg font-medium text-gray-500">
                    {sortedExercises.length === 0 ? "Aucun exercice sauvegardé." : "Aucun sujet trouvé."}
                  </p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center text-xs text-gray-500">
               <span>{filteredExercises.length} épreuves disponibles</span>
               
               {/* Role Switcher in modal footer if admin/student */}
               <div className="flex items-center gap-2">
                 {userProfile?.role === 'admin' ? (
                   <button 
                     onClick={() => user && updateUserRole(user.uid, 'student')}
                     className="py-1 px-3 rounded-lg font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-[#FF0000] hover:border-[#FF0000] transition-colors flex items-center gap-1.5"
                   >
                     <Users className="w-3.5 h-3.5" /> Vue Étudiant
                   </button>
                 ) : userProfile?.role === 'student' ? (
                   <button
                     onClick={() => {
                       if (user) {
                         const code = prompt("Code d'accès enseignant :");
                         if (code && code.trim().toUpperCase() === "B2ADMIN") {
                           updateUserRole(user.uid, 'admin');
                           alert("Rôle Admin activé !");
                         }
                       }
                     }}
                     className="py-1 px-2 font-medium text-gray-400 hover:text-indigo-500 transition-colors"
                   >
                     Déverrouiller Admin
                   </button>
                 ) : null}
               </div>
            </div>
          </div>
        </div>
      )}
      
      <InstallPWA />
    </div>
  );
}

export default App;

