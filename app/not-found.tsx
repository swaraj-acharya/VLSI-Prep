import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page narrow">
      <h1>Page not found</h1>
      <p className="muted">This page does not exist. The link may be from an older version of the curriculum.</p>
      <div className="row"><Link className="btn primary" href="/today">Go to today's plan</Link><Link className="btn" href="/topics">Browse topics</Link></div>
    </div>
  );
}
