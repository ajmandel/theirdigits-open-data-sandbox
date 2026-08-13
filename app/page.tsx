"use client";

import { FormEvent, useMemo, useState } from "react";
import { dataSources, domains, messLabels } from "./data";

const starterIdea =
  "Could cell-tower coverage approximate the activity patterns we see in wearable data—and where would that comparison break down?";

const ideaStarters = [
  "Compare hospital quality with neighborhood conditions",
  "Find climate signals in airline delays",
  "Map biodiversity against urban growth",
];

export default function Home() {
  const [idea, setIdea] = useState(starterIdea);
  const [mappedIdea, setMappedIdea] = useState(starterIdea);
  const [showMap, setShowMap] = useState(true);
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<(typeof domains)[number]>("All");
  const [region, setRegion] = useState("All regions");
  const [license, setLicense] = useState("All licences");
  const [expanded, setExpanded] = useState(false);
  const [notebookReady, setNotebookReady] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return dataSources.filter((source) => {
      const matchesQuery =
        !needle ||
        [source.name, source.publisher, source.description, source.lesson, source.license]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      const matchesDomain = domain === "All" || source.domain === domain;
      const matchesRegion =
        region === "All regions" ||
        (region === "United States" && ["US", "US + Europe", "Global — filter US/EU"].includes(source.region)) ||
        (region === "Europe" && ["Europe", "US + Europe", "Global — filter US/EU"].includes(source.region));
      const matchesLicense = license === "All licences" || source.licenseClass === license;
      return matchesQuery && matchesDomain && matchesRegion && matchesLicense;
    });
  }, [query, domain, region, license]);

  const visibleSources = expanded ? filtered : filtered.slice(0, 12);

  function mapIdea(event: FormEvent) {
    event.preventDefault();
    if (!idea.trim()) return;
    setMappedIdea(idea.trim());
    setShowMap(true);
    setNotebookReady(false);
    window.setTimeout(() => {
      document.querySelector("#project-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  }

  function useStarter(nextIdea: string) {
    setIdea(nextIdea);
    setMappedIdea(nextIdea);
    setShowMap(true);
    setNotebookReady(false);
  }

  function downloadNotebook() {
    const notebook = {
      cells: [
        {
          cell_type: "markdown",
          metadata: {},
          source: [
            "# theirdigits exploration starter\n",
            `**Working question:** ${mappedIdea}\n\n`,
            "This scaffold is intentionally unfinished. Document every assumption, transformation, and license obligation as you work.\n",
          ],
        },
        {
          cell_type: "markdown",
          metadata: {},
          source: [
            "## Candidate ingredients\n",
            "- UCI Human Activity Recognition — CC BY 4.0\n",
            "- PAMAP2 — CC BY 4.0\n",
            "- OpenCellID — CC BY-SA 4.0\n",
            "- Census TIGER/Line — U.S. Public Domain\n",
          ],
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            "import pandas as pd\n",
            "import geopandas as gpd\n",
            "import matplotlib.pyplot as plt\n\n",
            "# TODO: retrieve data using the canonical source links.\n",
            "# TODO: record retrieval date, version, and license in a source manifest.\n",
          ],
        },
        {
          cell_type: "markdown",
          metadata: {},
          source: [
            "## Before joining anything\n",
            "1. Compare temporal coverage and sampling frequency.\n",
            "2. Confirm that geography is compatible at an aggregate level.\n",
            "3. Do not attempt to re-identify or match individual participants.\n",
            "4. Decide what mobility is a plausible proxy for—and what it is not.\n",
          ],
        },
      ],
      metadata: {
        kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
        language_info: { name: "python", version: "3" },
      },
      nbformat: 4,
      nbformat_minor: 5,
    };
    const blob = new Blob([JSON.stringify(notebook, null, 2)], { type: "application/x-ipynb+json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "theirdigits-exploration-starter.ipynb";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotebookReady(true);
  }

  return (
    <main id="top">
      <header className="site-header shell">
        <a className="brand" href="#top" aria-label="theirdigits home">
          <span className="brand-mark">td</span>
          <span>their<strong>digits</strong></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#sandbox">Sandbox</a>
          <a href="#data">Open data</a>
          <a href="#method">How it works</a>
        </nav>
        <a className="header-cta" href="#sandbox">Start an idea ↘</a>
      </header>

      <section className="hero shell" aria-labelledby="hero-title">
        <div className="eyebrow">Open data, ready for curious minds</div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title">
              Ask a better question of <span>open data.</span>
            </h1>
            <p>
              A playground for finding, combining, and learning from genuinely open datasets—without hiding the licences, mess, or limitations.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#sandbox">Explore an idea</a>
              <a className="button button-outline" href="#data">Browse {dataSources.length} sources ↘</a>
            </div>
          </div>
          <div className="orbit" aria-hidden="true">
            <div className="orbit-ring ring-one" />
            <div className="orbit-ring ring-two" />
            <div className="orbit-ring ring-three" />
            <span className="node node-one" />
            <span className="node node-two" />
            <span className="node node-three" />
            <div className="orbit-label label-one"><small>01</small> Ask</div>
            <div className="orbit-label label-two"><small>02</small> Combine</div>
            <div className="orbit-label label-three"><small>03</small> Learn</div>
          </div>
        </div>
      </section>

      <section className="premise">
        <div className="shell premise-grid">
          <div className="eyebrow">The premise</div>
          <p>Datasets are ingredients. <strong>Questions turn them into projects.</strong></p>
        </div>
      </section>

      <section className="sandbox-section shell" id="sandbox" aria-labelledby="sandbox-title">
        <div className="section-heading split-heading">
          <div>
            <div className="eyebrow">The idea sandbox</div>
            <h2 id="sandbox-title">Start with curiosity—not a dataset name.</h2>
          </div>
          <p>Describe the half-formed question. The sandbox maps useful data, plausible joins, hidden assumptions, and lessons worth learning.</p>
        </div>

        <form className="idea-composer" onSubmit={mapIdea}>
          <div className="composer-topline">
            <span className="ai-dot" aria-hidden="true" />
            <span>Brainstorm with the data guide</span>
            <span className="prototype-tag">Interactive prototype</span>
          </div>
          <label htmlFor="idea">What are you curious about?</label>
          <textarea
            id="idea"
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            rows={4}
          />
          <div className="composer-bottom">
            <div className="starter-row" aria-label="Example questions">
              {ideaStarters.map((starter) => (
                <button type="button" key={starter} onClick={() => useStarter(starter)}>
                  {starter}
                </button>
              ))}
            </div>
            <button className="button button-lime" type="submit">Map this idea <span>↗</span></button>
          </div>
        </form>

        {showMap && (
          <article className="project-map" id="project-map" aria-live="polite">
            <div className="map-rail">
              <span className="ai-monogram">td</span>
              <span className="rail-line" />
            </div>
            <div className="map-content">
              <div className="response-kicker">A first-pass project map</div>
              <h3>{mappedIdea}</h3>
              <p className="response-summary">
                This is best framed as an <strong>aggregate proxy comparison</strong>, not an attempt to match people across datasets. You can test where mobility infrastructure resembles wearable-derived activity—and where it fundamentally cannot.
              </p>
              <div className="map-grid">
                <div className="map-block">
                  <span>01 · Start here</span>
                  <a href="https://archive.ics.uci.edu/dataset/240/human+activity+recognition+using+smartphones" target="_blank" rel="noreferrer">
                    UCI phone activity <b>CC BY 4.0</b>
                  </a>
                  <a href="https://archive.ics.uci.edu/dataset/231/pamap2+physical+activity+monitoring" target="_blank" rel="noreferrer">
                    PAMAP2 wearables <b>CC BY 4.0</b>
                  </a>
                  <a href="https://opencellid.org/downloads" target="_blank" rel="noreferrer">
                    OpenCellID towers <b>CC BY-SA 4.0</b>
                  </a>
                </div>
                <div className="map-block">
                  <span>02 · Useful joins</span>
                  <p><b>Space:</b> aggregate both sources to a shared grid or census geography.</p>
                  <p><b>Time:</b> compare broad periods; sensor sampling frequencies are not equivalent.</p>
                  <p><b>Context:</b> add TIGER/Line or OpenStreetMap density and land use.</p>
                </div>
                <div className="map-block warning-block">
                  <span>03 · Lessons hiding inside</span>
                  <p>Mobility is not exercise. Coverage is not behavior. Contributors are not a representative population.</p>
                  <p>Share-alike terms may affect redistribution of a combined database.</p>
                </div>
              </div>
              <div className="map-actions">
                <button className="button button-dark" type="button" onClick={downloadNotebook}>
                  {notebookReady ? "Download again" : "Download starter notebook"} ↗
                </button>
                <span>{notebookReady ? "Jupyter scaffold downloaded." : "Includes source manifest, setup cells, and analysis prompts."}</span>
              </div>
            </div>
          </article>
        )}
      </section>

      <section className="data-section" id="data" aria-labelledby="data-title">
        <div className="shell">
          <div className="section-heading data-heading">
            <div className="eyebrow">The open-data shelf</div>
            <h2 id="data-title">Interesting ingredients. Honest labels.</h2>
            <p>Every source exposes its reuse terms up front. “Free to download” is not enough.</p>
          </div>

          <div className="filters" aria-label="Dataset filters">
            <label className="search-field">
              <span>Search</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="health, towers, climate, jobs…" />
            </label>
            <label>
              <span>Region</span>
              <select value={region} onChange={(event) => setRegion(event.target.value)}>
                <option>All regions</option>
                <option>United States</option>
                <option>Europe</option>
              </select>
            </label>
            <label>
              <span>Licence</span>
              <select value={license} onChange={(event) => setLicense(event.target.value)}>
                <option>All licences</option>
                <option>Public domain</option>
                <option>Attribution</option>
                <option>Share-alike</option>
                <option>Open-filtered</option>
              </select>
            </label>
          </div>

          <div className="domain-row" aria-label="Filter by subject">
            {domains.map((item) => (
              <button key={item} className={domain === item ? "active" : ""} onClick={() => setDomain(item)} type="button">
                {item}
              </button>
            ))}
          </div>

          <div className="results-line">
            <span>{filtered.length} open sources</span>
            <span>US + Europe · refreshed seed inventory</span>
          </div>

          {visibleSources.length ? (
            <div className="source-grid">
              {visibleSources.map((source, index) => (
                <article className={`source-card ${source.featured ? "featured" : ""}`} key={source.name}>
                  <div className="card-topline">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{source.domain}</span>
                    <span>{source.region}</span>
                  </div>
                  <h3>{source.name}</h3>
                  <p className="publisher">{source.publisher}</p>
                  <p className="source-description">{source.description}</p>
                  <div className="license-badge"><span>Licence</span>{source.license}</div>
                  <dl>
                    <div><dt>Access</dt><dd>{source.access}</dd></div>
                    <div><dt>Mess</dt><dd>{messLabels[source.mess]} · {source.mess}/4</dd></div>
                    <div><dt>Teaches</dt><dd>{source.lesson}</dd></div>
                  </dl>
                  <a className="card-link" href={source.url} target="_blank" rel="noreferrer" aria-label={`Open ${source.name}`}>
                    Explore source <span>↗</span>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">No sources match that combination yet. Try widening a filter.</div>
          )}

          {filtered.length > 12 && (
            <button className="show-more" type="button" onClick={() => setExpanded((value) => !value)}>
              {expanded ? "Show the short shelf" : `Show all ${filtered.length} sources`} <span>{expanded ? "↑" : "↓"}</span>
            </button>
          )}
        </div>
      </section>

      <section className="method-section shell" id="method" aria-labelledby="method-title">
        <div className="eyebrow">A method, not magic</div>
        <h2 id="method-title">The guide should make the work more thoughtful—not make the work disappear.</h2>
        <div className="method-grid">
          <article><span>01</span><h3>Frame</h3><p>Turn curiosity into a question that can actually be observed with available data.</p></article>
          <article><span>02</span><h3>Inspect</h3><p>Check units, populations, time, geography, provenance, and licences before joining.</p></article>
          <article><span>03</span><h3>Explore</h3><p>Generate a scaffold with retrieval, profiling, cleaning, and visualization prompts.</p></article>
          <article><span>04</span><h3>Reflect</h3><p>Document uncertainty, bias, ethical limits, failed assumptions, and better next questions.</p></article>
        </div>
      </section>

      <section className="closing-band">
        <div className="shell">
          <div className="eyebrow">Their data. Your questions.</div>
          <p>Openly licensed. <strong>Open to possibility.</strong></p>
          <a className="button button-dark" href="#sandbox">Start exploring ↗</a>
        </div>
      </section>

      <footer className="shell">
        <a className="brand" href="#top"><span className="brand-mark">td</span><span>their<strong>digits</strong></span></a>
        <p>An early concept for an AI-guided open-data sandbox.</p>
        <p>Licence labels are teaching aids, not legal advice. Verify the source record before reuse.</p>
      </footer>
    </main>
  );
}
