import { ContactForm } from "../components/ContactForm";
import { FrameworkVisuals } from "../components/FrameworkVisuals";
import { ScorecardDemo } from "../components/ScorecardDemo";

const stock = {
  hero: "https://images.unsplash.com/photo-1606836559739-7b1d9fbf8a6e?auto=format&fit=crop&w=2200&q=85",
  boardroom: "https://images.unsplash.com/photo-1572025442811-aa5146a780fb?auto=format&fit=crop&w=1400&q=85",
  workshop: "https://images.unsplash.com/photo-1591462391971-9ffc57b382b9?auto=format&fit=crop&w=1200&q=85",
  notebook: "https://images.unsplash.com/photo-1583162692081-64c75353a270?auto=format&fit=crop&w=1400&q=85",
  founder: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=85",
};

export default function HomePage() {
  return (
    <>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <figure className="hero__media"><img src={stock.hero} alt="Two people in conversation, silhouetted against a bright window" fetchPriority="high" /></figure>
          <div className="hero__veil" aria-hidden="true" />
          <div className="hero__grid">
            <p className="eyebrow"><span className="eyebrow__rule" />Engagement, engineered</p>
            <h1 className="hero__title" id="hero-title"><span className="l1">Your people are capable.</span><span className="l2"><em>Pergage helps keep them that way.</em></span></h1>
            <div className="glass hero__pane"><p>Most organisations maintain their processes. Fewer maintain their people. Pergage makes the conditions for capable work visible, then helps you improve them.</p><div className="hero__ctas"><a className="btn-gold" href="#contact"><span>Book a conversation</span><i aria-hidden="true">→</i></a><a className="btn-line" href="/scorecards">Take the team scorecard</a></div></div>
          </div>
          <a className="hero__scroll" href="#approach"><span>Scroll</span></a>
        </section>

        <section className="principle stone spot" id="approach" aria-labelledby="principle-title"><div className="principle__inner"><p className="kicker">The elephant in the room</p><h2 className="principle__quote" id="principle-title">Most organisations maintain their <em>processes</em>. Fewer maintain their people.</h2><div className="principle__cols"><p>Work gets inspected, serviced and improved before it fails. People are often left to cope with the conditions around them.</p><p>Pergage engineers the <em>conditions</em>, not the people — with teams, not to them — so capability can grow into trust, agency, ownership, performance and culture.</p></div></div></section>

        <section className="services" id="services" aria-labelledby="services-title"><header className="sec-head"><p className="kicker">Services</p><h2 id="services-title">Four ways in, <em>one engineering discipline.</em></h2></header><div className="bento">
          <article className="tile tile--a spot"><img src={stock.boardroom} alt="An empty meeting room with a long table and dark walls" loading="lazy" /><div className="tile__body"><span className="num">I</span><h3>Organisational assessment &amp; baseline measurement</h3><p>An honest picture of the conditions that support engagement, agency and capability, so later change can be measured against a real baseline.</p></div></article>
          <article className="tile tile--b spot"><span className="num">II</span><h3>Two private readiness scorecards</h3><p>A short starting point for leaders and for individuals. The current questions and results are examples while the final scorecards are reviewed.</p><a className="btn-ghost-gold" href="#scorecards">See the scorecards</a></article>
          <article className="tile tile--c spot"><img src={stock.workshop} alt="A hand placing sticky notes on a planning sheet during a workshop" loading="lazy" /><div className="tile__body"><span className="num">III</span><h3>Team diagnostics &amp; pilot programmes</h3><p>Focused work with one team first: find what gets in the way, test a change, and learn before scaling it.</p></div></article>
          <article className="tile tile--d spot"><div className="tile__split"><div><span className="num">IV</span><h3>Training &amp; continuous improvement</h3><p>Practical improvement skills, with ongoing measurement and review so gains are kept and teams can teach themselves.</p><ul className="chips" aria-label="Delivery formats"><li>In person</li><li>Live online</li><li>Self-paced</li></ul></div><img src={stock.hero} alt="A blurred figure moving behind frosted glass in a quiet office" loading="lazy" /></div></article>
        </div></section>

        <section className="method" id="method" aria-labelledby="method-title"><div className="method__media"><img src={stock.hero} alt="Two figures talking beside a tall, light-filled window" loading="lazy" /></div><div className="method__body"><p className="kicker">Method</p><h2 id="method-title">Evidence-led, practical, <em>collaborative.</em></h2><ol className="steps"><li className="step"><span className="step__n">01</span><div><h3>Listen</h3><p>Start with the people doing the work and what they experience every day.</p></div></li><li className="step"><span className="step__n">02</span><div><h3>Measure</h3><p>Turn what we hear into a baseline you can track, not a one-off opinion.</p></div></li><li className="step"><span className="step__n">03</span><div><h3>Co-design</h3><p>Shape changes with the team, because people sustain what they help create.</p></div></li><li className="step"><span className="step__n">04</span><div><h3>Improve &amp; review</h3><p>Test, measure again and adjust, so performance is maintained rather than rescued.</p></div></li></ol></div></section>

        <FrameworkVisuals />

        <section className="scorecards" id="scorecards" aria-labelledby="sc-title"><img className="scorecards__bg" src={stock.hero} alt="" loading="lazy" /><div className="scorecards__inner"><header className="sec-head sec-head--center"><p className="kicker">Private readiness scorecards</p><h2 id="sc-title">Two short reflections. <em>Start where you are.</em></h2><p className="lede">Try an interactive demo of each one. The questions and results are examples only; no answer is stored by this preview.</p></header><div className="sc-pair"><article className="sc glass spot"><img src={stock.notebook} alt="A hand writing notes in an open book, in black and white" loading="lazy" /><p className="sc__meta"><span>For MDs &amp; senior leaders</span><span>About 3 minutes</span></p><h3>Organisational Readiness</h3><p>Explore your organisation&apos;s strengths and gaps in the conditions that keep people engaged and capable.</p><p className="sc__how">Demo format: one statement per screen, five-point scale.</p><ScorecardDemo type="organisational" /><span className="tag">Demo · example questions</span></article><article className="sc sc--alt glass spot"><p className="sc__meta"><span>For individuals</span><span>About 3–5 minutes</span></p><h3>Individual Readiness</h3><p>A short reflection on your own working conditions: clarity, autonomy, support and growth.</p><p className="sc__how">Demo format: a slider for each statement, with a progress rail.</p><ScorecardDemo type="individual" /><span className="tag">Demo · example questions</span></article></div></div></section>

        <section className="founder" id="founder" aria-labelledby="founder-title"><div className="founder__text"><p className="kicker">Founder</p>{/* PROVISIONAL: Paul’s approved name, title and post-nominals remain subject to verification. */}<h2 id="founder-title">Founder profile</h2><p className="founder__role">Name to be confirmed</p><p>The approved biography, experience and official profile links will be added here once Paul verifies them. This preview does not invent credentials, clients or outcomes.</p><dl className="founder__facts"><div><dt>Status</dt><dd>Awaiting verified founder details</dd></div><div><dt>Image</dt><dd>Illustrative stock image, not a portrait of Paul</dd></div></dl></div><figure className="founder__media"><img src={stock.founder} alt="Illustrative stock photograph, not a portrait of Paul" loading="lazy" /><figcaption>Illustrative stock image</figcaption></figure></section>

        <section className="contact stone spot" id="contact" aria-labelledby="contact-title"><div className="contact__inner"><p className="kicker">Contact</p><h2 id="contact-title">Start with a <em>conversation.</em></h2><p className="contact-intro">Tell us a little about your organisation and what you are noticing. This private preview validates the flow without sending or storing your details.</p><div className="contact__actions"><a className="btn-gold" href="#contact-form"><span>Book a conversation</span><i aria-hidden="true">→</i></a><a className="btn-line" href="/scorecards">Take the team scorecard</a><a className="btn-line" href="#contact-form-founding-partner">Become a founding partner</a></div><ContactForm /></div></section>
      </main>
    </>
  );
}
