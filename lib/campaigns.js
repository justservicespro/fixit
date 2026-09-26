/**
 * FixIt Abuja — bi-weekly email campaign templates.
 *
 * Written in simple English on purpose — short sentences, everyday words.
 * Each campaign has a `subject` and `html` body. {{unsubscribe_url}} is
 * replaced automatically before sending — never remove it from a template.
 *
 * ROTATION: campaigns are sent in order, one every 14 days, and loop back
 * to the start after the last one. See api/send-bulk-email.js for the logic
 * that picks which one to send.
 */

const BRAND = {
  ink: '#171A21',
  amber: '#FF7A1A',
  teal: '#12A594',
  paper: '#F6F2E9',
};

const SITE_URL = 'https://fixit.justservices.pro';
const PHONE = '+234 807 992 6755';
const WHATSAPP = 'https://wa.me/2348079926755';

function wrap(title, bodyHtml) {
  return `
  <div style="background:${BRAND.paper}; padding:28px 0; font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #eee;">
      <div style="background:${BRAND.ink}; padding:20px 26px;">
        <span style="color:${BRAND.paper}; font-size:18px; font-weight:bold;">FixIt Abuja</span>
      </div>
      <div style="padding:26px 26px 10px; color:${BRAND.ink}; font-size:15px; line-height:1.6;">
        <h2 style="margin:0 0 14px; font-size:20px; color:${BRAND.ink};">${title}</h2>
        ${bodyHtml}
        <div style="margin-top:26px; text-align:center;">
          <a href="${WHATSAPP}" style="display:inline-block; background:${BRAND.amber}; color:#fff; text-decoration:none; font-weight:bold; padding:12px 26px; border-radius:6px;">Chat on WhatsApp</a>
        </div>
        <p style="margin-top:18px; font-size:13px; color:#666;">Or call us: ${PHONE}</p>
      </div>
      <div style="padding:18px 26px; border-top:1px solid #eee; font-size:11.5px; color:#999; text-align:center;">
        FixIt Abuja &middot; JustServicesPro Management and Consulting Ltd &middot; Abuja, FCT<br>
        <a href="${SITE_URL}/terms.html" style="color:#999;">Terms &amp; Conditions</a> &middot;
        <a href="{{unsubscribe_url}}" style="color:#999;">Unsubscribe</a>
      </div>
    </div>
  </div>`;
}

const CAMPAIGNS = [
  {
    id: 'welcome-overview',
    subject: 'FixIt Abuja — repairs and maintenance, one call away',
    html: wrap('We fix it. Today.', `
      <p>Hello,</p>
      <p>FixIt Abuja dispatches verified technicians with competence to attend to and provide repairs, maintenance and related services on-call at your home or place of business within Abuja.</p>
      <p>Here is what we handle:</p>
      <ul>
        <li>Generator repair and servicing</li>
        <li>Printer and photocopier repair</li>
        <li>Laptop and computer repair</li>
        <li>Phone and tablet repair</li>
        <li>Air conditioner (AC) repair</li>
        <li>Fridge and freezer repair</li>
        <li>Inverter and UPS repair</li>
        <li>CCTV installation and repair</li>
        <li>TV and home theatre repair</li>
        <li>Washing machine repair</li>
        <li>Electrical wiring</li>
      </ul>
      <p>Save our number. When something breaks down, message us — we will send a verified technician to you.</p>
    `),
  },
  {
    id: 'generator-dos-donts',
    subject: 'Dos and Don\u2019ts: Keep your generator running longer',
    html: wrap('Dos and Don\u2019ts: Generator Care', `
      <p>Your generator works hard. A few simple habits can help it last longer and break down less.</p>
      <p><b>Do:</b></p>
      <ul>
        <li>Check the engine oil level before every use</li>
        <li>Let the generator warm up for 2–3 minutes before you load it</li>
        <li>Service it every 100–150 hours of use, or every 3 months</li>
        <li>Keep it in a dry, well-ventilated place</li>
        <li>Turn it off and let it cool before adding fuel</li>
      </ul>
      <p><b>Don\u2019t:</b></p>
      <ul>
        <li>Don\u2019t run it inside a closed room — the fumes are dangerous</li>
        <li>Don\u2019t overload it beyond its rated capacity</li>
        <li>Don\u2019t ignore unusual noise, smoke, or smell — switch off and call a technician</li>
        <li>Don\u2019t use old or contaminated fuel</li>
      </ul>
      <p>Generator making noise, refusing to start, or using too much fuel? We will send a technician to check it.</p>
    `),
  },
  {
    id: 'ac-dos-donts',
    subject: 'Dos and Don\u2019ts: Get more cooling from your AC',
    html: wrap('Dos and Don\u2019ts: Air Conditioner Care', `
      <p>Abuja heat is no joke. A well-maintained AC cools faster and costs less to run.</p>
      <p><b>Do:</b></p>
      <ul>
        <li>Clean or change the filter every 4–6 weeks</li>
        <li>Service the unit at least twice a year</li>
        <li>Keep the outdoor unit free of dust, leaves, and blockages</li>
        <li>Set a reasonable temperature (24–26°C) instead of the coldest setting</li>
      </ul>
      <p><b>Don\u2019t:</b></p>
      <ul>
        <li>Don\u2019t ignore water leaking from the indoor unit — call for a check-up</li>
        <li>Don\u2019t block the vents with furniture or curtains</li>
        <li>Don\u2019t keep switching it on and off repeatedly — it strains the compressor</li>
        <li>Don\u2019t wait until it stops cooling completely before servicing it</li>
      </ul>
      <p>Weak cooling, strange noise, or a leak? Book a servicing before the fault gets bigger.</p>
    `),
  },
  {
    id: 'laptop-dos-donts',
    subject: 'Dos and Don\u2019ts: Protect your laptop and data',
    html: wrap('Dos and Don\u2019ts: Laptop &amp; Computer Care', `
      <p>Small habits protect your laptop from the faults we see most often.</p>
      <p><b>Do:</b></p>
      <ul>
        <li>Use a surge protector, especially with unstable power</li>
        <li>Keep the vents clear of dust for proper cooling</li>
        <li>Back up important files regularly — a cloud drive or external disk</li>
        <li>Shut down properly instead of just closing the lid every time</li>
      </ul>
      <p><b>Don\u2019t:</b></p>
      <ul>
        <li>Don\u2019t eat or drink right next to an open laptop</li>
        <li>Don\u2019t carry it around while it's still on and hot</li>
        <li>Don\u2019t ignore a swollen battery — stop using it and get it checked immediately</li>
        <li>Don\u2019t use unknown flash drives without scanning them first</li>
      </ul>
      <p>Slow system, cracked screen, or won't power on? Bring it in or book a home visit.</p>
    `),
  },
  {
    id: 'electrical-safety',
    subject: 'Dos and Don\u2019ts: Electrical safety at home and at work',
    html: wrap('Dos and Don\u2019ts: Electrical Wiring Safety', `
      <p>Faulty wiring is one of the most common causes of fire and equipment damage. Please take it seriously.</p>
      <p><b>Do:</b></p>
      <ul>
        <li>Use a licensed technician for any wiring work</li>
        <li>Replace worn or exposed wires immediately</li>
        <li>Install a good circuit breaker and use it</li>
        <li>Switch off appliances during a power surge or lightning</li>
      </ul>
      <p><b>Don\u2019t:</b></p>
      <ul>
        <li>Don\u2019t overload one socket with too many appliances</li>
        <li>Don\u2019t use wire joints wrapped only in tape as a permanent fix</li>
        <li>Don\u2019t ignore sparks, burning smell, or a hot socket — turn off power and call us</li>
        <li>Don\u2019t attempt major wiring yourself if you are not trained</li>
      </ul>
      <p>Need a wiring inspection or repair? Our technicians will check it and tell you plainly what needs fixing.</p>
    `),
  },
  {
    id: 'cctv-security',
    subject: 'Is your CCTV actually working when you need it?',
    html: wrap('CCTV &amp; Security: A Quick Check', `
      <p>Many people install CCTV once and never check it again — until something happens and the footage isn't there.</p>
      <p><b>Do:</b></p>
      <ul>
        <li>Check your camera footage is actually recording, not just showing a live view</li>
        <li>Clean the camera lens every few weeks — dust and cobwebs block the view</li>
        <li>Make sure your storage (DVR/NVR or cloud) has enough space and isn't overwriting too quickly</li>
        <li>Test your cameras at night — many faults only show up in low light</li>
      </ul>
      <p><b>Don\u2019t:</b></p>
      <ul>
        <li>Don\u2019t assume it's working just because the light is on</li>
        <li>Don\u2019t leave blind spots uncovered — entrances and gates matter most</li>
        <li>Don\u2019t delay a repair once you notice a camera is offline</li>
      </ul>
      <p>Want a free-of-charge check of your setup, or a new installation? Reach out — we cover homes and offices across Abuja FCT.</p>
    `),
  },
  {
    id: 'seasonal-reminder',
    subject: 'Before the weather changes — a quick maintenance reminder',
    html: wrap('A Reminder: Service Before It Breaks', `
      <p>Most repair calls we get are for things that could have been caught early with a simple service visit.</p>
      <p>A quick check now can save you a bigger bill — and a bigger headache — later:</p>
      <ul>
        <li>Generator — service before the next long outage</li>
        <li>AC — service before the heat peaks</li>
        <li>Inverter/UPS battery — check the health before an outage catches you off guard</li>
        <li>Wiring — inspect before the rains bring power surges</li>
      </ul>
      <p>Booking a service visit takes two minutes. Message us with what you have, and we'll dispatch a verified technician.</p>
    `),
  },
  {
    id: 'stay-connected',
    subject: 'Stay in the loop with FixIt Abuja',
    html: wrap('Don\u2019t Miss an Update', `
      <p>A few ways to stay connected with us between repairs:</p>
      <ul>
        <li>Save our number for same-day dispatch: ${PHONE}</li>
        <li>Follow our WhatsApp Channel for tips and updates</li>
        <li>Bookmark our site to book a technician anytime: ${SITE_URL}</li>
      </ul>
      <p>And a simple reminder: FixIt Abuja dispatches verified technicians with competence to attend to and provide repairs, maintenance and related services on-call at your home or place of business within Abuja. We're glad to be one call away whenever you need us.</p>
    `),
  },
];

module.exports = { CAMPAIGNS };

/**
 * Bi-weekly rotation: one campaign goes out every 14 days, looping back to
 * the start after the last one. EPOCH is a fixed reference Monday — the
 * exact date doesn't matter, it just anchors the 14-day cycle consistently
 * across every server invocation (no counter needs to be stored anywhere).
 */
const EPOCH = new Date('2026-01-05T00:00:00Z'); // a Monday
const CYCLE_DAYS = 14;

function daysSince(date) {
  return Math.floor((date.getTime() - EPOCH.getTime()) / 86400000);
}

/** Which campaign is "current" for the given date (defaults to now). */
function getCurrentCampaign(date) {
  const d = date || new Date();
  const days = Math.max(0, daysSince(d));
  const cycleIndex = Math.floor(days / CYCLE_DAYS) % CAMPAIGNS.length;
  return CAMPAIGNS[cycleIndex];
}

/** True only on the day a new 14-day cycle begins — this is what the cron job checks before sending. */
function isSendDay(date) {
  const d = date || new Date();
  const days = Math.max(0, daysSince(d));
  return days % CYCLE_DAYS === 0;
}

module.exports.getCurrentCampaign = getCurrentCampaign;
module.exports.isSendDay = isSendDay;
