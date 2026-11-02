import { cycleStages, pyramidLayers, zones } from "../data/framework";

export function FrameworkVisuals() {
  return (
    <section className="framework-section shell" id="framework" aria-labelledby="framework-title">
      <div className="eyebrow">The Pergage framework</div>
      <div className="framework-heading">
        <div>
          <h2 id="framework-title">Teach the conditions. Leave the capability behind.</h2>
          <p>
            Pergage teaches and coaches teams, develops internal coaches and steps back when
            improvement belongs to the organisation.
          </p>
        </div>
        <div className="framework-note">A visual guide to the journey, not a score.</div>
      </div>

      <ol className="cycle-grid" aria-label="Teach and coach to culture cycle">
        {cycleStages.map((stage, index) => (
          <li className="cycle-step" key={stage}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage}</strong>
            {index < cycleStages.length - 1 ? <i aria-hidden="true">→</i> : <i aria-hidden="true">↺</i>}
          </li>
        ))}
      </ol>

      <div className="framework-grid">
        <section className="zones-panel" aria-labelledby="zones-title">
          <div className="eyebrow">Three zones</div>
          <h3 id="zones-title">Start where trust comes easiest.</h3>
          <div className="zones-grid">
            {zones.map((zone) => (
              <article className="zone-card" key={zone.number}>
                <span>{zone.number}</span>
                <h4>{zone.name}</h4>
                <p>{zone.description}</p>
              </article>
            ))}
          </div>
          <div className="trust-arrow" aria-label="Trust grows from zone one to zone three">
            Trust grows <span aria-hidden="true">→</span>
          </div>
        </section>

        <section className="pyramid-panel" aria-labelledby="pyramid-title">
          <div className="eyebrow">Performance pyramid</div>
          <h3 id="pyramid-title">Performance is load-bearing.</h3>
          <figure className="pyramid" aria-label="Performance pyramid">
            {pyramidLayers.map((layer, index) => (
              <div className={`pyramid-layer layer-${index + 1}`} key={layer.name}>
                <strong>{layer.name}</strong>
                <span>{layer.detail}</span>
              </div>
            ))}
          </figure>
          <p className="pyramid-note">Focus on the bottleneck. Work on one square, then choose the next.</p>
        </section>
      </div>
    </section>
  );
}
