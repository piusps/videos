/**
 * InstantDM → Superkind-Warteliste (Google Sheet)
 *
 * Standalone Apps Script (script.google.com → Neues Projekt), NICHT im Sheet selbst,
 * damit es nicht mit einem bestehenden doPost der Website-Warteliste kollidiert.
 * Deploy: Bereitstellen → Neue Bereitstellung → Web-App, Ausführen als "Ich",
 * Zugriff "Jeder". InstantDM → API & MCP → Webhooks: URL = <exec-URL>?key=SECRET,
 * Events "question_answered" + "flow_completed". (Apps Script sieht keine Header,
 * deshalb Secret im Query statt X-Webhook-Signature.)
 *
 * - flow_completed  → eine Zeile im ersten Tab (Vorname, Nachname, Email, Telefonnummer,
 *                     Firma, Zeitpunkt, Sprache, Seite) – nur wenn Mail oder Nummer drin ist.
 * - question_answered → Tab "Instagram-Teilweise", eine Zeile pro Person, wird mit jeder
 *                     Antwort ergänzt. So sieht man auch Abbrecher (z. B. Mail ja, Nummer nein).
 * - alles           → Roh-Payload in Tab "Instagram-Raw" (Debug, Mapping prüfen).
 */

const SHEET_ID = '1x-rcr-GAVVxAA5pIkc-34kh3i-g6Oi-Cs2UlYzZ7sng';
const SECRET = 'HIER_EIN_LANGES_ZUFALLSWORT_EINTRAGEN';
const TZ = 'Europe/Berlin';
const PARTIAL_HEADER = ['Instagram', 'Name', 'Firma', 'Email', 'Telefonnummer', 'Automation', 'Zuletzt', 'Fertig'];

function doPost(e) {
  const params = (e && e.parameter) || {};
  if (params.key !== SECRET) return json({ ok: false, error: 'unauthorized' });

  let body = {};
  try {
    body = JSON.parse((e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json({ ok: false, error: 'bad json' });
  }

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const now = Utilities.formatDate(new Date(), TZ, 'dd.MM.yyyy HH:mm');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    logRaw(ss, now, body);
    const event = String(body.event || body.type || body.event_type || '').toLowerCase();
    const d = body.data || body.payload || body;

    if (event.indexOf('question_answered') >= 0 || (d.user_response !== undefined && d.question)) {
      const f = {};
      assign(f, d.question_type, d.custom_variable_name, d.question, d.user_response);
      upsertPartial(ss, now, d, f, false);
    } else if (event.indexOf('flow_completed') >= 0 || d.question_responses || d.response_variables) {
      const f = fromCompleted(d);
      upsertPartial(ss, now, d, f, true);
      if (f.email || f.phone) {
        const parts = (f.name || '').trim().split(/\s+/);
        const vorname = parts.shift() || '';
        const seite = 'instagram' + (d.flow_name ? '/' + d.flow_name : '') + (d.sender_username ? ' @' + d.sender_username : '');
        ss.getSheets()[0].appendRow([vorname, parts.join(' '), f.email || '', f.phone || '', f.company || '', now, 'de', seite]);
      }
    }
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}

// question_responses: [{question, question_type, custom_variable_name, user_response}, …]
// response_variables: {email: "...", phone: "...", …}
function fromCompleted(d) {
  const f = {};
  (d.question_responses || []).forEach(function (q) {
    assign(f, q.question_type, q.custom_variable_name, q.question, q.user_response);
  });
  const vars = d.response_variables || {};
  Object.keys(vars).forEach(function (k) { assign(f, '', k, k, vars[k]); });
  return f;
}

// Ordnet eine Antwort einem Feld zu: erst über den Fragetyp (email/phone/name),
// sonst über Variablenname oder Fragetext. Bereits gesetzte Felder bleiben.
function assign(f, type, varName, question, value) {
  if (value === undefined || value === null || typeof value === 'object') return;
  const v = String(value).trim();
  if (!v) return;
  const t = String(type || '').toLowerCase();
  const k = (String(varName || '') + ' ' + String(question || '')).toLowerCase();
  let field = '';
  if (t.indexOf('email') >= 0 || /e-?mail/.test(k)) field = 'email';
  else if (t.indexOf('phone') >= 0 || /(phone|telefon|nummer|handy|mobil)/.test(k)) field = 'phone';
  else if (/(company|firma|unternehmen|business)/.test(k)) field = 'company';
  else if (t.indexOf('name') >= 0 || /(name|heißt|heisst)/.test(k)) field = 'name';
  if (field && !f[field]) f[field] = v;
}

function upsertPartial(ss, now, d, f, done) {
  const sh = ss.getSheetByName('Instagram-Teilweise') || ss.insertSheet('Instagram-Teilweise');
  if (sh.getLastRow() === 0) sh.appendRow(PARTIAL_HEADER);
  const who = String(d.sender_username || d.sender_id || '');
  if (!who) return;
  const rows = sh.getDataRange().getValues();
  let r = -1;
  for (let i = 1; i < rows.length; i++) if (String(rows[i][0]) === who) r = i;
  const row = r > 0 ? rows[r] : [who, '', '', '', '', '', '', ''];
  if (f.name) row[1] = f.name;
  if (f.company) row[2] = f.company;
  if (f.email) row[3] = f.email;
  if (f.phone) row[4] = f.phone;
  if (d.flow_name) row[5] = d.flow_name;
  row[6] = now;
  if (done) row[7] = 'ja';
  if (r > 0) sh.getRange(r + 1, 1, 1, row.length).setValues([row]);
  else sh.appendRow(row);
}

function logRaw(ss, now, body) {
  const raw = ss.getSheetByName('Instagram-Raw') || ss.insertSheet('Instagram-Raw');
  if (raw.getLastRow() === 0) raw.appendRow(['Zeitpunkt', 'Payload']);
  raw.appendRow([now, JSON.stringify(body).slice(0, 45000)]);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Manueller Test im Editor: schreibt eine Testzeile (danach im Sheet wieder löschen).
function testDoPost() {
  doPost({
    parameter: { key: SECRET },
    postData: { contents: JSON.stringify({ event: 'flow_completed', data: {
      flow_name: 'TEST', sender_username: 'testaccount',
      question_responses: [
        { question: 'Wie heißt du?', question_type: 'name', user_response: 'Max Mustermann' },
        { question: 'Und wie heißt dein Unternehmen?', question_type: 'text', user_response: 'Muster GmbH' },
        { question: 'An welche Mail …', question_type: 'email', user_response: 'max@muster.de' },
        { question: 'Und deine Nummer …', question_type: 'phone', user_response: '+49 170 1234567' },
      ],
    } }) },
  });
}
