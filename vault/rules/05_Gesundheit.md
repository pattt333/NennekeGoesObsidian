---
id: rule.gesundheit
title: "Gesundheit"
type: rule
tags:
  - gesundheit-md
---
<!-- Source: Chapters/05_Gesundheit.tex -->

# Gesundheit

## Designprinzipien

### Verletzungen

Gesundheit soll nicht nur zwischen „kampffähig“ und „kampfunfähig“ unterscheiden.

Mit zunehmenden Verletzungen soll die Leistungsfähigkeit eines Charakters schrittweise sinken.

Zusätzlich sollen besonders schwere einzelne Treffer unmittelbare Nachteile verursachen können, sodass ein massiver Treffer auch bei einem ansonsten noch relativ gesunden Charakter spürbar bleibt.

Langfristige Abnutzung und die Folgen eines schweren Einzelereignisses sollen dabei als zwei unterschiedliche Aspekte von Verletzungen erkennbar bleiben.

### Schaden über Zeit

Wiederkehrende oder andauernde Schadenseffekte sollen nach einer gemeinsamen Grundmechanik funktionieren.

Unterschiedliche Schadensarten sollen sich hauptsächlich durch Ursache, Entfernung oder besondere Wechselwirkungen unterscheiden und nicht jeweils ein eigenes Ablaufsystem benötigen.

### Rüstung

Rüstung soll eine nachvollziehbare Abwägung zwischen Schutz und Einschränkung darstellen.

Mehr Schutz soll die Folgen von Schaden reduzieren, dafür aber einen spielerisch relevanten Preis besitzen.

### Rast und Heilung

Erholung soll über klar definierte Rastphasen abgewickelt werden und nicht davon abhängen, jede einzelne Stunde der Spielwelt zu simulieren.

Rast soll gleichzeitig der gemeinsame Rahmen für Regeneration und längerfristige Tätigkeiten sein.

Heilkundige Fähigkeiten sollen Verletzungen nicht durch ein paralleles Gesundheitssystem behandeln, sondern auf bestehende Zustände und Regenerationsmechanismen einwirken.

### Schadensquellen

Umwelteinflüsse und andere Schadensquellen sollen soweit möglich bestehende Gesundheitsmechanismen verwenden, statt eigene Folgen zu erfinden.


Schartige Klingen, heimtückische Gifte oder wilde Schneestürme – in Aventurien geht es häufig um Leben und Tod. Auf den nächsten Seiten erfährst du, wie sich diese Strapazen auf deinen Charakter auswirken und wie er sich wieder erholen kann.

Schaden kann Einschränkungen nach sich ziehen, die zuerst zu Wundabzügen, dann zur Kampfunfähigkeit und schließlich zum Tod führen. Schwere Treffer sind dabei besonders gefährlich, da sie heimtückische Wundschmerzeffekte verursachen können.

Eine gute Rüstung kann dagegen dein Leben retten, indem sie den auf dich gerichteten Schaden reduziert, bis du mit Hilfe deiner natürlichen Regeneration oder einer fähigen Heilkundigen wieder auf die Beine kommst. Zuletzt findest du die Regeln zu Schadensquellen außerhalb von Kämpfen, wie Stürzen, extremen Temperaturen, Giften und körperlichen Strapazen.

<a id="sec-lebenspunkte"></a>

## Lebenspunkte (LeP)

Deine Lebenspunkte (LeP) berechnen sich wie folgt: LeP = 60+KO*5+HS*10. Die Lebenspunkte hängen also neben dem Grundwert von 60 LeP von der Konstitution (KO) und der [Heldenstufe (HS)](03_Eigenschaften.md#sec-abgwerte) ab, welche wiederum von den aktuell maximal verfügbaren Erfahrungspunkten (EP) abhängt.

Wenn du 0 Lebenspunkte erreichst liegst du im Sterben. Du hast KO/2 KR Zeit, um stabilisiert zu werden. Bis dahin kommst du immer als Letzter in jeder Kampfrunde an die Reihe. Schafft es jemand, dich zu stabilisieren, wird der Sterbeprozess aufgehalten und alle über die Zeit wirkenden Schadenseffekte werden eingestellt - du bleibst jedoch vorerst kampfunfähig. Erreicht dich die Hilfe zu spät, hauchst du dein Leben aus. \\
Sollten deine LeP unter einen Wert von (-2)*KO fallen, stirbst du ohne Chance auf Stabilisierung.

Trefferpunkte (TP) werden durch deinen Rüstungsschutz (RS) direkt verringert und richten weniger Schaden an dir an. Schadenspunkte (SP) ignorieren deine Rüstung und richten ihren vollen Schaden an deinen LeP an. Heilpunkte (HP) heilen deinen Charakter um die angegeben Punkte.

> Valeria (KO 3) hat in diesem Kampf schon viel einstecken müssen (noch 10 LeP übrig) und ist daher leichte Beute für den Alligator, dessen Biss 11 TP verursacht. Valerias Stoffrüstung verleiht ihr eine RS von 1, dadurch macht der Biss nur noch 10 TP Schaden. Valeria konnte sich bis jetzt bei Bewusstsein halten. Durch den Biss erreicht sie jedoch 0 LeP und fällt unweigerlich in Ohnmacht und liegt im Sterben. Ein Verbündeter hat 2 KR (KO/2, wie üblich aufgerundet) Zeit, um damit anzufangen sie zu stabilisieren.

> Sollte Valeria vor dem Alligatorbiss nur noch über 2 LeP verfügt haben, würde der Biss sie auf -8 LeP bringen, was mehr als ihre doppelten KO unter 0 ist ((-8)<(-2)*KO) und sie sofort tötet, ohne die Chance stabilisiert zu werden. Hier hilft nur noch eine durch einen Schicksalspunkt ausgelöste göttliche Wendung, um einem ansonsten sicheren Ende zu entgehen.

<a id="sec-dots"></a>

## Schaden über Zeit (DoT)

Schaden über Zeit kann aus verschiedenen Quellen stammen, die in die folgenden Kategorien eingeteilt sind: **Blutung**, **Brennen**, **Gift**, **Krankheit** und **Erfrieren**.
Jede DoT-Kategorie funktioniert nach denselben Grundregeln:
- **Getrennte Kategorien:** Jede DoT-Kategorie wird unabhängig voneinander behandelt. Ein Charakter kann gleichzeitig Stacks aus mehreren Kategorien haben
- **Maximale Stacks:** Bis zu 5 Stacks pro Kategorie können gleichzeitig auf einem Charakter aktiv sein
- **Dauer:** Stacks halten 3 Kampfrunden im Kampf und 15min außerhalb des Kampfes. Sollten die Stacks nicht aufgefrischt werden, verfallen ALLE Stacks nach Ablauf der Dauer
- **Schaden:** Jeder Stack verursacht 2 Schadenspunkte
- **Auffrischung:** Wird ein neuer Stack derselben Kategorie hinzugefügt (auch wenn das Maximum bereits erreicht ist), wird die Wirkungsdauer aller Stacks dieser Kategorie auf 3 Kampfrunden zurückgesetzt

Die unterschiedlichen Kategorien-DoTs können ganz oder teilweise durch bestimmte Talente oder Gegenstände entfernt werden. Brennen kann meist durch Ausklopfen, Rollen oder Wasser entfernt werden, Erfrieren geht mit Wärme wieder weg und Blutungen lassen sich durch eine Heilkundeprobe und eine Bandage stoppen. Nur Gifte und Krankheiten benötigen Tinkturen, Kräuter oder Antidots, um entfernt zu werden.

> Miraj wird von einem Feuerelementar angegriffen. Jeder Angriff des Elementars hat als Nebeneffekt, dass Miraj einen Stack Brennen bekommt.
> Miraj hat bereits 2 Stacks Brennen, die folglich am Ende jeder KR 2*2 = 4 SP verursachen. Da das Elementar in den letzten Runden andere Aktionen ausgeführt hatte und auch sonst nichts an Miraj Brennen Stacks verursacht hat, sind die Stacks aktuell nur noch 1KR aktiv. Jetzt greift es ihn jedoch wieder an und es verursacht einen neuen Stack Brennen. Dadurch leidet Miraj nun unter 3 Stacks Brennen zugleich (also 6 SP am Ende jeder KR) und auch die Wirkungsdauer aller Stacks wird wieder auf 3KR zurückgesetzt.

> Um alle Stacks loszuwerden entschließt sich Miraj, sich in einen nahegelegenen Bach zu werfen. Seine Stacks verschwinden sogleich, dafür liegt er jetzt knietief im Wasser und befindet sich dadurch in einer schlechteren Position zum Elementar.

<a id="sec-lebensbalken"></a>

## Lebensbalken, Wundfreisegment und Segmente

Stellst du dir deine Lebenspunkte auf einem kontinuierlichen Lebensbalken vor, so wird dieser für die Anwendung von Effekten wie Wundschmerz, Wundabzügen sowie Blutung in 8 Segmente unterteilt. Die erstens 6 Segmente (von Links) sind genauso groß wie dein LAW (Lebenspunkteabschnittwert) angibt, sie sind also genau gleich groß (LAW = max LeP / 8 (aufgerundet)). Die letzten beide Segmente (Wundfreisegment) ergeben sich aus dem Rest von LeP - 6*LAW. Hier siehst Du Beispiele für Charaktere mit 100, 150 und 200 LeP. Dabei wird (wie üblich) aufgerundet.

| **Segment** | 1. f89883 | 2. f89883 | 3. f89883 | 4. f89883 | 5. fffea1 | 6. fffea1 | 7.+8. Wundfreisegment 80fa99 | LAW |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **50 LeP** | 1-7 | 8-14 | 15-21 | 22-28 | 29-35 | 36-42 | 43-50 | 7 |
| **100 LeP** | 1-13 | 14-26 | 27-39 | 40-52 | 53-65 | 66-78 | 79-100 | 13 |
| **150 LeP** | 1-19 | 20-38 | 39-57 | 58-76 | 77-95 | 96-114 | 115-150 | 19 |
| **200 LeP** | 1-25 | 26-50 | 51-75 | 76-100 | 101-125 | 126-150 | 151-200 | 25 |

Auf diesem in acht Sektionen unterteilten Lebensbalken wird der erhaltene Schaden von rechts nach links von den vorhandenen LeP abgezogen. Entsprechend der Sektionen treten die im Folgenden beschriebenen Effekte, wie [Wundabzüge](05_Gesundheit.md#sec-wundabzuge), [Blutungen und Tod](05_Gesundheit.md#sec-blutungentod) ein. [Wundschmerz](05_Gesundheit.md#sec-wundschmerz) orientiert sich dagegen direkt am auf einen Schlag erlittenen Schaden, unabhängig von den Sektionen.

<a id="sec-wundschmerz"></a>

### Wundschmerz

Wenn dein Charakter auf einen Schlag mindestens 2*LAW seiner maximalen LeP verliert, muss er sofort eine Eigenschaftsprobe (20, I) ablegen. Erleidet er auf einen Schlag sogar mehr als 2*LAW seiner maximalen LeP an Schaden, steigt die Schwierigkeit der Probe um -4 für jedes weitere LAW an Schaden.

> Harak (70LeP, LAW = 9) rennt durch einen Schwarm Schmetterlinge mit rasiermesserscharfen Flügeln. Die bunt funkelnden Insekten verursachen 18 SP an Haraks Kopf (1W6 = 6, siehe nächstes Kapitel), woraufhin Haraks Spieler eine MU-Probe (20, I) ablegen muss. Die Probe ist geschafft und Harak ist nichts weiter geschehen. Direkt hinter dem Schmetterlingschwarm erwartet ihn jedoch ein Stammeskrieger mit einem Speer, dessen Angrif Harak nicht ausweichen kann. Der Speer verursacht 39SP am Bauch (1W6 = 4) und Haraks Spieler muss eine KO-Probe ablegen.

> Deren zusätzliche Erschwernis berechnet sich, indem 2*LAW vom Schadenswert abgezogen werden (39-2*9 = 21) und dann überprüft wird, wie häufig der Rest (= 21) LAW überschreiten würde (1*LAW = 9, 2*LAW = 18, 3*LAW = 27). Die Probe geht also gegen die 20+2*4 = 28.

> Man könnte natürlich auch rechnen: (Schaden-2*LAW)/LAW und ausnahmsweise abrunden. (39-2*9)/9 = 2,333... -> 2*(-4) Erschwernis.

Misslingt die Probe treten je nach Trefferzone unterschiedliche Effekte auf. Auf welche Eigenschaft geprobt werden muss und wie die Wundschmerzeffekte ausfallen wird gleich im Kapitel [Trefferzonen](05_Gesundheit.md#sec-trefferzonen) beschrieben.

<a id="sec-trefferzonen"></a>

### Trefferzonen

Auf welche Eigenschaft bei Wundschmerz geprobt werden muss, hängt von der betroffenen Trefferzone ab. Jeder Charakter hat 6 Trefferzonen: Kopf, Brust, Bauch, Schwertarm, Schildarm und Beine.

Mit dem Basismanöver [Gezielter Schlag](06_kampf/kampfmanover/Basismanover.md#subsubsec-gezielterschlag) bzw. [Gezielter Schuss](06_kampf/kampfmanover/Fernkampf_Basismanover.md#subsubsec-gezielterschuss) kann ein Charakter eine Trefferzone als Ziel aussuchen, ansonsten wird die Trefferzone mit einem 1W6 zufällig bestimmt (s.u.).

| **Zone** | **Probe** | **W6** | **Wundeffekt** |
| --- | --- | --- | --- |
| **Kopf** | MU | 6 | Betäubt: Bis zum Ende seiner nächsten KR kampfunfähig |
| **Brust** | KO | 5 | Organtreffer: Das Opfer erleidet 2 Stacks Blutung |
| **Bauch** | KO | 4 | Organtreffer: Das Opfer erleidet 2 Stacks Blutung |
| **Schildarm** | KK | 3 | Entwaffnet: Die mit dieser Hand geführte Waffe fällt zu Boden. |
| **Schwertarm** | KK | 2 | Entwaffnet: Die mit dieser Hand geführte Waffe fällt zu Boden. |
| **Beine** | GE | 1 | Sturz: Das Opfer stürzt und befindet sich in [sehr unvorteilhafter Position](06_kampf/Angriff_Verteidigung.md#subsec-modsimkampf) |

<a id="sec-wundabzuge"></a>

### Wundabzüge

Nachdem dein Charakter weniger LeP als in seinem Wundfreisegment zur Verfügung stehen übrig hat, erhält er in jedem Segment einen kumulativen Malus von -2. Dieser Malus wirkt auf sämtliche Proben und so lange, bis er wieder geheilt wurde.

| **Segment** | 1. f89883 | 2. f89883 | 3. f89883 | 4. f89883 | 5. fffea1 | 6. fffea1 | 2|c|7.+8. Wundfreisegment 80fa99 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Wundabzüge** | -12 | -10 | -8 | -6 | -4 | -2 | - |

> Hat zum Beispiel ein Held mit 150 Max.-LeP (siehe [oben](05_Gesundheit.md#sec-lebensbalken)) nach einigen Verletzungen (in Summe 56 SP erhalten) nur noch 94 LeP übrig, befindet sich sein Lebensbalken im 5. Segment und er hätte -4 Erschwernisse auf alle Proben.
| **Segment** | 1. f89883 | 2. f89883 | 3. f89883 | 4. f89883 | 5. fffea1 | 6. fffea1 | 7.+8. Wundfreisegment 80fa99 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **150 LeP** | 1-19 | 20-38 | 39-57 | 58-76 | 77-95 DD27F5 | 96-114 | 115-150 |


<a id="sec-blutungentod"></a>

### Blutungen und Tod

Blutungen drohen dem Charakter, wenn er sein Wundfreisegment und 2 weitere Segmente seines [Lebensbalkens](05_Gesundheit.md#sec-lebensbalken) verloren hat. Dann muss eine Probe auf **Selbstbeherrschung (Zähigkeit) (12,I)** abgelegt werden. Bei Misslingen erleidet der Charakter 3 Stacks Blutung. Sobald weiterer Schaden seinen Lebensbalken in eine weitere Sektion schrumpfen lässt, muss die Probe wiederholt werden und der Charakter erhält bei Misslingen der Probe weitere 3 Stacks Blutung bis zu einem Maximum von 5 Stacks.

> Ihre Probe auf Selbstbeherrschung (Zähigkeit) (12,I) mit einem Abzug von -6 misslingt und Valeria fängt an zu bluten. Die 3 Stacks Blutung verursachen am Ende jeder KR 6 SP. Hoffentlich schafft sie ihre nächste Probe oder kann einen Heiltrank trinken, bevor der Blutverlust zu einem ernsthaften Problem wird.

<a id="sec-rustungen"></a>

## Rüstungen

Rüstungsschutz (RS) verringert den Schaden entscheidend, wodurch ein Charakter seltener Wundschmerzeffekte erleidet und weniger LeP verliert. Dafür schränken Rüstungen die Beweglichkeit ein, was durch die Belastung (BE) dargestellt wird.

Jeder Held kann an jeder Trefferzone ein Rüstungsteil tragen. Rüstungen verfügen über unterschiedliche Eigenschaften, RS und BE-Werte. In der Regel haben Rüstungen mit höheren RS eine höhere BE. Meist folgt das Verhältnis von RS zu BE 2:1, man hat also meist doppelt so viel RS wie BE.

Der RS modifiziert bei einem Treffer den erlittenen Schaden.

Bei Angriffen gegen den ganzen Körper (z.B. Flächenschaden durch Feuer) wird der Durchschnittswert als RS verwendet, der sogenannte Flächenrüstungsschutz (FRS). Man teilt also den Gesamt-RS durch 6.

Wie oben erwähnt, schränkt eine Rüstung den Helden in seiner Beweglichkeit ein. Je mehr Rüstung ein Charakter trägt, desto weiter steigt die Belastung (BE) an. Jeder Punkt Belastung erschwert Kampfwürfe um -1. Wie oben erwähnt kann ein Held an jedem Körperteil ein anderes Rüstungsteil tragen, der BE wird daher immer aus dem BE aller Rüstungsteile durch 6 ermittelt.

Darüber hinaus sind Proben auf die Körperliche Fertigkeiten und GE um die doppelte Belastungserschwernis (-2 je BE) erschwert.

Durch die Vorteile [Belastungsgewöhnung I und II](07_vorteile/kampf_vorteile/KV_KO.md#kv-ko) können die Abzüge durch Belastung verringert werden. Der Kampfstil [Reiterkampf II](07_vorteile/kampstile/Reiterkampf.md#ks-reiterkampf) verringert die Belastung ebenfalls.

<a id="sec-rast"></a>

## Rast

Eine Rast kann fast immer stattfinden. Meistens sind dafür nur eine oder zwei Stunden nötig. Grundsätzlich ist die Rast Meisterentscheid, es sollte nach Gefahr im Gebiet, der Möglichkeit sich ausruhen zu können und der Zeit entschieden werden. Egal wie lang eine Rast auch ist, du regenerierst wie weiter unten angegeben.

Darüber hinaus kannst du pro Rast ein Rast-Talent einsetzen. Ein Rast-Talent ist zum Beispiel eine Probe auf Wundheilung, um die Wunden eines Kameraden zu versorgen, damit dieser mehr LeP regeneriert oder das Sammeln von Kräutern oder Material sowie das Brauen von Tränken oder Schmieden von Waffen. Wieder ist hier die Dauer der Rast nicht von Relevanz und jedes Talent kann grundsätzlich eingesetzt werden. Auch Zauber oder Liturgien können während einer Rast ausgeführt werden. Mehr zum Einsatz von Talenten bei Rast in [Kapitel 8](08_rast/08_Rast.md#ch-rast).

Es gibt Vorteile, die die Anzahl von Rast-Talenten erhöht wodurch du pro Rast mehr erledigen kannst. Eine Rast kann zum Beispiel auch zwischen zwei Abenteuern passiern.

<a id="sec-regeneration"></a>

### Regeneration

Pro Rast regeneriert ein Charakter LAW an LeP. Falls der Charakter AsP oder KaP besitzt, regeneriert er 1/8 AsP bzw. 1/10 KaP (dieser Wert kann durch Vorteile, Sonderfertigkeiten oder auf andere Weise erhöht werden).

<a id="sec-heilkunde"></a>

## Heilkunde

Ein erfahrener Heilkundiger kann lebensbedrohliche Situationen abwenden und die Regeneration deutlich beschleunigen. Mit erster Hilfe und etwas Verbandsmaterial kann ein Patient in kritischem Zustand stabilisiert werden. Beim Einsatz von Heilkunde im Kampf ist deine INI um -8 reduziert. Heilung erfordert eine (volle) Aktion Konzentration.
| **Effekt** | **Dauer** | **Schwierigkeit** | **Auswirkung** |
| --- | --- | --- | --- |
| **Blutung** | Stacks Blutung in Aktionen | 16 | stoppt Blutung |
| **Gift** | Stacks Gift in Aktionen | Giftstufe | stoppt Gift |
| **Krankheit** | Stacks Krankheit in Aktionen | Krankheitsstufe | erkennt Krankheit |

Darauf folgen heilungsfördernde Maßnahmen, wodurch der Patient während einer Rast zusätzlich LAW an LeP regeneriert. Eine solche Probe kannst du für einen Patienten nur einmal pro Rast versuchen und ein Patient kann nur von einer erfolgreichen Behandlung pro Rast profitieren. **Außerdem benötigst du heilende Salben oder ähnliche Hilfsmittel, Verbandsmaterial und sauberes Wasser**. Die Schwierigkeit der Probe beträgt 16 + den Betrag der aktuellen [Wundabzüge](05_Gesundheit.md#sec-wundabzuge) des Patienten. Bei misslungener Probe regeneriert der Patient auch bei einer Rast keine LeP (statt wie üblich LAW an LeP). Bei einem Patzer erhält er zusätzlich 2 Stacks Blutung. Bei einem Krit konntest du dich um einen zusätzlichen Kameraden kümmern und er profitiert ebenfalls von den heilungsfördernden Maßnahmen im selben Umfang.

| **Effekt** | **Dauer** | **Schwierigkeit** | **Auswirkung** |
| --- | --- | --- | --- |
| **alle** | Rast-Talent | 16+Wundabzüge | heilt LAW an LeP bei Rast |

<a id="sec-ubernaturlicheheilung"></a>

## Übernatürliche Heilung

Heiltränke, Balsam und Wundsegen - übernatürliche Heilung hat viele Gesichter. Trotzdem wirkt sie immer auf eine von zwei Arten: Entweder der heilende Effekt stärkt und beschleunigt die natürliche Regeneration und heilt direkt LeP, wie etwa der Zauber Ruhe Körper. Oder der Effekt greift von außen in den Körper ein, wie der Balsam. Ein solcher Effekt bringt eine gewisse Anzahl an LeP zurück.

<a id="sec-schadensquellen"></a>

## Schadensquellen

Hitze und Gifte sind nur einige Beispiele für die Gefahren, die einen Charakter erwarten. Viele dieser Schadensquellen wirken nicht sofort, sondern erst nach einer gewissen Verzögerung. Ein Beispiel dafür wäre die Inkubationszeit einer Krankheit. Sofort nach dem Ablauf der Verzögerung und dann in bestimmten Intervallen erleidet ein infizierter Charakter Schaden.

Da Kämpfe anstrengend für Körper und Geist sind, wirken Hitze, Kälte, Gifte und Krankheiten in dieser Sondersituation deutlich verheerender als außerhalb eines Kampfes. Daher werden Intervall, Dauer sowie Verzögerung jeweils für die Situation außerhalb eines Kampfes und im Kampf angegeben.

<a id="subsec-temperatur"></a>

### Hitze und Kälte

Hitze und Kälte sind unbarmherzige Feinde, die selbst zähe Charaktere in die Knie zwingen können. Welche Effekte aus hohen oder niedrigen Temperaturen resultieren, liegt im Ermessen des Spielleiters. Es geht zur Referenz immer um die gefühlte Temperatur, die durch Maßnahmen gesenkt (bspw. Wind) oder gehoben (bspw. Zelt) werden kann.

Mögliche Auswirkungen sind Erschwernisse auf Proben oder Schaden durch Stacks Brennen bzw. Erfrieren, die sich in regelmäßigen Intervallen bis maximal 5 Stacks anhäufen. Die Vorteile Resistenz Hitze und Resistenz Kälte halbieren die Erschwernisse bzw. verdoppeln das Intervall in denen sich die Stacks ansammeln.

<a id="subsec-giftekrankheiten"></a>

### Gifte & Krankheiten

Gifte und Krankheiten werden je nach der Art der Verabreichung bzw. Infektion in drei Kategorien eingeteilt: Einnahme- (E), Kontakt- (K) und Waffenübertragung (W). Einnahmeübertragung (E) wirkt immer nach einer gewissen Verzögerung, die dem Spielleiter überlassen ist und bspw. davon abhängt, wie das Gift eingenommen oder die Infektion geschehen ist. Waffenübertragungen (W) wirken, sobald durch einen giftigen Angriff Schaden angerichtet wurde. Daraufhin wird 1W6 gewürfelt. Bei einer 1 oder 6 bleibt der Krankheits- bzw. Gifteffekt auf der Waffe bestehen und kann bei weiteren Angriffen zum Tragen kommen. Andernfalls verschwindet der Effekt von der Waffe.

Mehr zum Herstellen von Giften findest du im Kapitel [Alchemy: Gifte und Krankheiten](08_rast/Alchymie.md#subsec-giftekrankheiten)

<a id="subsec-sturze"></a>

### Stürze

Stürze
Stürze richten 1W6 SP pro Schritt Höhe an; bei besonders harten oder weichen Böden sogar 1W6+1 bzw. nur 1W6-1 SP. Du kannst eine Athletik (Körperbeherrschung)-Probe gegen die Standardschwierigkeit + Höhe in Schritt] ablegen, um die effektive Höhe zu halbieren.
> Nach einem tollkühnen Akt auf dem 5 Schritt hohen Drahtseil fällt Harik dem Boden entgegen. Sein Spieler schafft die Athletik (Körperbeherrschung) gegen (12+5=19) und Harik landet zumindest auf den Beinen. Dennoch verursacht dieser Sturz bei ihm 3W6 Schaden (5/2 = 3 (aufgerundet)).

---

**Regelbuchnavigation:** ← [Fertigkeiten](04_Fertigkeiten/04_Fertigkeiten.md) · ↑ [Startseite](../index.md) · [Kampf](06_kampf/06_Kampf.md) →
