const services = [
  ["01", "Assess", "Establish a clear baseline of the conditions that support capability and engagement."],
  ["02", "Act", "Work with teams to design practical improvements they have the agency to sustain."],
  ["03", "Improve", "Measure, review and refine — so performance is maintained, not rescued."],
];

export default function HomePage() {
  return (
    <main>
      <section className="hero shell">
        <div className="eyebrow">Pergage / Organisational capability</div>
        <h1>Your people are capable. <em>Pergage helps keep them that way.</em></h1>
        <p className="hero-copy">
          We apply engineering reliability methods to the conditions people work in,
          so performance and engagement are maintained, not rescued.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href="/scorecards">Explore the scorecards <span>↗</span></a>
          <a className="text-link" href="#contact">Book a conversation <span>→</span></a>
        </div>
        <div className="hero-mark" aria-hidden="true"><span>p</span><span>g</span></div>
      </section>

      <section id="approach" className="band band-ink">
        <div className="shell split">
          <div>
            <div className="eyebrow eyebrow-light">The Pergage approach</div>
            <h2>Pergage engineers the conditions, <em>not the people.</em></h2>
          </div>
          <div className="prose prose-light">
            <p>Reliable performance is not created by asking people to try harder. It is created by understanding the system around them and improving the conditions that make good work possible.</p>
            <p>That means practical measurement, shared authorship and a proactive approach to capability.</p>
          </div>
        </div>
      </section>

      <section id="services" className="shell section">
        <div className="eyebrow">What we do</div>
        <div className="section-heading"><h2>From baseline to <em>better.</em></h2><p>Support for UK SMEs and mid-sized organisations, including professional services, legal, finance, engineering and technical firms.</p></div>
        <div className="service-grid">
          {services.map(([number, title, copy]) => <article className="service-card" key={number}><div className="service-number">{number}</div><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
        <div className="service-list"><span>Organisational assessment</span><span>Team diagnostics</span><span>Training & coaching</span><span>Ongoing measurement</span></div>
      </section>

      <section className="scorecard-teaser shell">
        <div className="scorecard-copy"><div className="eyebrow">Start with a reflection</div><h2>See what your conditions are telling you.</h2><p>Two short scorecards help leaders and individuals understand what supports sustained performance — and where the gaps may be.</p><a className="button button-outline" href="/scorecards">Choose a scorecard <span>↗</span></a></div>
        <div className="scorecard-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><span>capability</span><span>agency</span><span>engagement</span></div>
      </section>

      <section id="contact" className="band band-sand">
        <div className="shell split contact-block">
          <div><div className="eyebrow">Make the next move</div><h2>Let’s talk about what would make a difference.</h2></div>
          <div className="prose"><p>Book a 30-minute conversation with Pergage. Calls are available Monday at 12:30, Tuesday at 16:30 and Thursday at 16:30, with at least 24 hours’ notice.</p><a className="button button-dark" href="mailto:engage@pergage.com?subject=Pergage%20conversation">Email to arrange a call <span>→</span></a></div>
        </div>
      </section>
    </main>
  );
}
